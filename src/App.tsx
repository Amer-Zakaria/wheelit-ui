import React, { useState, useRef } from 'react';
import { Button, Input} from "@mui/material";
import {useToast} from "@chakra-ui/toast"
import { Plus, X } from "lucide-react";

interface EntriesListProps {
	entries: string[];
	onRemove: (index: number) => void;
  }

const EntriesList = ({ entries, onRemove }: EntriesListProps) => {
	return (
	  <div className="space-y-2">
		{entries.map((entry, index) => (
		  <div key={index} className="flex justify-between items-center bg-secondary/10 p-2 rounded">
			<span>{entry}</span>
			<Button
			  variant="contained"
			  onClick={() => onRemove(index)}
			  className="h-8 w-8"
			>
			  <X className="h-4 w-4" />
			</Button>
		  </div>
		))}
	  </div>
	);
  };


  interface WheelSectionProps {
	entry: string;
	index: number;
	total: number;
  }
  
  const WheelSection = ({ entry, index, total }: WheelSectionProps) => {
	const getWheelSectionStyles = () => {
	  const rotation = (360 / total) * index;
	  const skew = total === 2 ? 0 : (90 - (360 / total));
	  
	  return {
		transform: total === 2 
		  ? `rotate(${rotation}deg)` 
		  : `rotate(${rotation}deg) skew(${skew}deg)`,
		width: total === 2 ? '100%' : '50%',
		height: total === 2 ? '50%' : '50%',
		transformOrigin: 'bottom right',
		position: 'absolute' as const,
		overflow: 'hidden',
	  };
	};
  
	const getTextStyles = () => {
	  const rotation = (360 / total) * index;
	  const skew = total === 2 ? 0 : (90 - (360 / total));
	  const baseStyles = {
      transform: `rotate(${-rotation - skew}deg)`,
      width: total > 8 ? '120px' : '150px',
      fontSize: total > 8 ? '0.75rem' : 
          total > 4 ? '0.875rem' : '1rem',
      left: '50%',
      position: 'absolute' as const,
	  };
  
	  // if (total <= 2) {
		// baseStyles.transform = `rotate(${-rotation}deg) translateY(-100%)`;
	  // } else if (total === 3) {
		// baseStyles.transform = `rotate(${-rotation - skew}deg) translateY(-90%)`;
	  // } else if (total <= 4) {
		// baseStyles.transform = `rotate(${-rotation - skew}deg) translateY(-120%)`;
	  // } else if (total <= 8) {
		// baseStyles.transform = `rotate(${-rotation - skew}deg) translateY(-75%)`;
	  // } else {
    //   baseStyles.transform = `rotate(${-rotation - skew}deg) translateY(-50%)`;
	  // }
    
    baseStyles.transform = `rotate(${-rotation - skew}deg) translateY(-50%)`;

	  return baseStyles;
	};
 
  const wheelColors = [
    'bg-blue-600',    // 1st section
    'bg-red-600',     // 2nd section
    'bg-green-600',   // 3rd section
    'bg-yellow-600',  // 4th section
    'bg-purple-600',  // 5th section
    'bg-orange-600',  // 6th section
    'bg-pink-600',    // 7th section
    'bg-teal-600',    // 8th section
    'bg-indigo-600',  // 9th section
    'bg-lime-600',    // 10th section
    'bg-cyan-600',    // 11th section
    'bg-rose-600',    // 12th section
  ];

	return (
	  <div
		className="absolute origin-bottom-right -translate-y-1/2"
		style={getWheelSectionStyles()}
	  >
		<div
		  className={`w-full h-full ${
			  wheelColors[index]
		  }`}
      style={{display: "flex", justifyContent: "center", alignItems: "center"}}
		>
		  <span
			className="absolute text-white font-bold whitespace-nowrap overflow-hidden text-ellipsis px-2"
			style={getTextStyles()}
		  >
			  {entry}
		  </span>
		</div>
	  </div>
	);
  };
  

const WheelGame = () => {
  const [entries, setEntries] = useState<string[]>(['Prize 1', 'Prize 2', 'Prize 3', 'Prize 4']);
  const [newEntry, setNewEntry] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const [rotation, setRotation] = useState(0); // Final rotation angle
  const [randomAngel, setRandomAngel] = useState(0); // Final rotation angle
console.log("rotation: ", rotation)

  const handleAddEntry = () => {
    if (!newEntry.trim()) {
      toast({
        title: "Error",
        description: "Please enter a value",
        variant: "destructive",
      });
      return;
    }
    setEntries([...entries, newEntry.trim()]);
    setNewEntry('');
  };

  const handleRemoveEntry = (index: number) => {
    if (entries.length <= 2) {
      toast({
        title: "Error",
        description: "Minimum 2 entries required",
        variant: "destructive",
      });
      return;
    }
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;
    
    const randomAngle = 360 + Math.floor(Math.random() * 3240); // Random spin
    const finalAngle = (randomAngle) % 360; // Ensure it wraps around (0-360 degrees)
    
    setRandomAngel(randomAngle)
    
    setIsSpinning(true);
    setWinner(null);
    
    const randomDegree = Math.floor(Math.random() * 360) + 1440;
    if (wheelRef.current) {
      // wheelRef.current.style.setProperty('--spin-degree', `${randomDegree}deg`);
    }
    
    setTimeout(() => {
      setRotation(finalAngle);

      const winningIndex = Math.floor(((rotation % 360) / 360) * entries.length);
      const winner = entries[entries.length - 1 - winningIndex];
      setWinner(winner);
      setIsSpinning(false);
      
      toast({
        title: "Winner!",
        description: "winner",
      });
    }, 4000);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <div className="relative aspect-square">
        <div
          ref={wheelRef}
          className={`relative w-full h-full rounded-full ${
            isSpinning ? 'animate-spin-wheel' : ''
          }`}
          style={{
            overflow: 'hidden', 
            "--rotation-angle": `${randomAngel}deg`, // Full spin + randomness
            "--rotation": `${rotation}deg`, // Full spin + randomness
            transform: `rotate(${rotation}deg)`,
            
          }}
        >
          {entries.map((entry, index) => (
            <WheelSection
              key={index}
              entry={entry}
              index={index}
              total={entries.length}
            />
          ))}
        </div>
        <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-wheel-accent transform rotate-45" />
      </div>

      <div className="flex gap-2">
        <Input
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Add new entry"
          className="flex-1"
        />
        <Button onClick={handleAddEntry}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <EntriesList 
        entries={entries}
        onRemove={handleRemoveEntry}
      />

      <Button
        onClick={handleSpinWheel}
        disabled={isSpinning}
        className="w-full bg-wheel-primary hover:bg-wheel-primary/90"
      >
        {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
      </Button>

      {winner && (
        <div className="text-center animate-celebrate">
          <h2 className="text-2xl font-bold text-wheel-primary">Winner:</h2>
          <p className="text-xl">{winner}</p>
        </div>
      )}
    </div>
  );
};

export default WheelGame;
