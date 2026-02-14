import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Phone, Gamepad2, UserPlus, Users, X } from 'lucide-react';

interface RadialMenuProps {
  onAction: (action: string) => void;
}

const RadialMenu: React.FC<RadialMenuProps> = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const menuItems = [
    { id: 'call', icon: Phone, label: 'Call', color: 'bg-relink-neon text-black', delay: 0 },
    { id: 'game', icon: Gamepad2, label: 'Game', color: 'bg-relink-hot text-white', delay: 0.05 },
    { id: 'add', icon: UserPlus, label: 'Add', color: 'bg-relink-blue text-white', delay: 0.1 },
    { id: 'group', icon: Users, label: 'Circle', color: 'bg-relink-purple text-white', delay: 0.15 },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center">
      
      {/* Dim Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleOpen}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      <div className="relative z-40">
        <AnimatePresence>
          {isOpen && menuItems.map((item, index) => {
            // Calculate position for radial spread (semi-circle top)
            const angle = 180 + (index * (180 / (menuItems.length - 1))); // Spread across top semi-circle
            const radius = 100; // Distance from center
            // Simple hardcoded positions for 4 items to look nice
            const positions = [
              { x: -80, y: -60 },
              { x: -30, y: -100 },
              { x: 30, y: -100 },
              { x: 80, y: -60 }
            ];
            
            return (
              <motion.button
                key={item.id}
                initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  x: positions[index].x, 
                  y: positions[index].y, 
                  opacity: 1 
                }}
                exit={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: item.delay }}
                onClick={() => {
                  onAction(item.id);
                  toggleOpen();
                }}
                className={`absolute top-0 left-0 w-14 h-14 rounded-full ${item.color} shadow-lg flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Main Trigger Button */}
        <motion.button
          onClick={toggleOpen}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: isOpen ? 45 : 0 }}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.4)] border-4 border-black z-50 transition-colors ${isOpen ? 'bg-slate-800 text-white' : 'bg-relink-neon text-black'}`}
        >
          <Plus className="w-8 h-8" strokeWidth={3} />
        </motion.button>
      </div>
    </div>
  );
};

export default RadialMenu;