import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, Mic, Trophy, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TriviaGameScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const opponent = location.state?.opponent || { name: 'Sarah', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' };
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({ me: 0, opponent: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [opponentThinking, setOpponentThinking] = useState(false);

  const questions = [
    {
      q: `What is ${opponent.name}'s favorite comfort food?`,
      options: ["Sushi", "Mac & Cheese", "Pizza", "Tacos"],
      correct: 1
    },
    {
      q: "Where did we go for our last road trip?",
      options: ["Upstate NY", "The Beach", "Vegas", "Camping"],
      correct: 0
    },
    {
      q: "Which movie can she watch on repeat?",
      options: ["Inception", "Mean Girls", "Titanic", "Interstellar"],
      correct: 3
    }
  ];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // Prevent double click
    
    setSelectedAnswer(index);
    const correct = index === questions[currentQuestion].correct;
    setIsAnswerCorrect(correct);
    
    if (correct) {
        setScore(prev => ({ ...prev, me: prev.me + 100 }));
    }

    // Simulate opponent answering
    setOpponentThinking(true);
    setTimeout(() => {
        setOpponentThinking(false);
        // Opponent gets it right 80% of time
        if (Math.random() > 0.2) {
             setScore(prev => ({ ...prev, opponent: prev.opponent + 100 }));
        }
        
        // Next question delay
        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                setSelectedAnswer(null);
                setIsAnswerCorrect(null);
            } else {
                setShowResult(true);
            }
        }, 1500);
    }, 1000);
  };

  if (showResult) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-6 bg-black relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
               <div className="text-center mb-8">
                   <div className="w-32 h-32 bg-gradient-to-tr from-relink-purple to-relink-neon rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(168,85,247,0.5)]">
                       <Trophy className="w-16 h-16 text-white" />
                   </div>
                   <h1 className="text-4xl font-black text-white mb-2">Game Over!</h1>
                   <div className="flex items-center justify-center space-x-8 mt-6">
                       <div className="text-center">
                           <p className="text-slate-400 text-xs font-bold uppercase">You</p>
                           <p className="text-3xl font-black text-white">{score.me}</p>
                       </div>
                       <div className="text-center">
                           <p className="text-slate-400 text-xs font-bold uppercase">{opponent.name}</p>
                           <p className="text-3xl font-black text-white">{score.opponent}</p>
                       </div>
                   </div>
               </div>
               <button 
                  onClick={() => navigate('/home')}
                  className="w-full max-w-xs bg-white text-black font-black text-lg py-4 rounded-2xl hover:scale-105 transition-transform"
               >
                  Back to Home
               </button>
          </div>
      )
  }

  return (
    <div className="h-full flex flex-col bg-slate-950 relative overflow-hidden">
      {/* Top Bar: Back + Opponent Info */}
      <div className="p-6 flex justify-between items-center z-20">
         <div className="flex items-center space-x-2">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full text-white border border-white/10 hover:bg-white/10 active:scale-95 transition-all">
                <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 bg-black/40 p-2 pr-4 rounded-full border border-white/5 backdrop-blur-md">
                <div className="relative">
                    <img src={opponent.avatarUrl} className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" />
                    <div className="absolute -bottom-1 -right-1 bg-relink-neon w-4 h-4 rounded-full border-2 border-black flex items-center justify-center">
                        <Mic className="w-2 h-2 text-black" />
                    </div>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Opponent</p>
                    <p className="text-sm font-black text-white">{opponent.name}</p>
                </div>
                {opponentThinking && <span className="text-xs text-relink-neon animate-pulse">Thinking...</span>}
            </div>
         </div>
         
         <div className="bg-relink-purple/20 border border-relink-purple/30 px-4 py-2 rounded-xl">
             <span className="font-black text-relink-purple">{score.me} pts</span>
         </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 px-6 flex flex-col justify-center relative z-10">
         
         {/* Question Card */}
         <motion.div 
            key={currentQuestion}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
         >
             <span className="text-relink-neon font-bold text-xs uppercase tracking-widest mb-2 block">Question {currentQuestion + 1} of {questions.length}</span>
             <h2 className="text-3xl font-black text-white leading-tight">
                {questions[currentQuestion].q}
             </h2>
         </motion.div>

         {/* Options Grid */}
         <div className="grid grid-cols-1 gap-3">
            {questions[currentQuestion].options.map((opt, i) => {
                let btnClass = "bg-white/5 border-white/10 hover:bg-white/10";
                if (selectedAnswer === i) {
                    btnClass = isAnswerCorrect 
                        ? "bg-relink-neon text-black border-relink-neon" 
                        : "bg-red-500 text-white border-red-500";
                }

                return (
                    <motion.button
                        key={i}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(i)}
                        disabled={selectedAnswer !== null}
                        className={`p-5 rounded-2xl border text-left text-lg font-bold transition-all flex justify-between items-center ${btnClass} ${selectedAnswer !== null && selectedAnswer !== i ? 'opacity-50' : ''}`}
                    >
                        <span>{opt}</span>
                        {selectedAnswer === i && (
                            isAnswerCorrect ? <CheckCircle className="w-6 h-6" /> : <X className="w-6 h-6" />
                        )}
                    </motion.button>
                )
            })}
         </div>

      </div>

      {/* Bottom Bar: Exit */}
      <div className="p-6">
          <button onClick={() => navigate(-1)} className="w-full py-4 text-slate-500 font-bold hover:text-white transition-colors">
              Quit Game
          </button>
      </div>

    </div>
  );
};

export default TriviaGameScreen;