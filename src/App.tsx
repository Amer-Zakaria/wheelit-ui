import React, { useState, useRef, useEffect } from "react";
import { Button, Input } from "@mui/material";
import { useToast } from "@chakra-ui/toast";
import { Plus, BadgeX  } from "lucide-react";

interface EntriesListProps {
  entries: string[];
  onRemove: (index: number) => void;
}

const EntriesList = ({ entries, onRemove }: EntriesListProps) => {
  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-secondary/10 p-2 rounded"
        >
          <span>{entry}</span>
          <Button
            variant="text"
            color="warning"
            onClick={() => onRemove(index)}
            className="h-8 w-8"
          >
            <BadgeX  className="h-6 w-6" />
          </Button>
        </div>
      ))}
    </div>
  );
};

const WheelGame = () => {
  const [entries, setEntries] = useState<string[]>([
    "Prize 1",
    "Prize 2",
    "Prize 3",
    "Prize 4",
    "Prize 5",
  ]);
  const [newEntry, setNewEntry] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const [rotation, setRotation] = useState(0); // Final rotation angle
  const [randomAngel, setRandomAngel] = useState(0); // Final rotation angle
  console.log("rotation: ", rotation);

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
    setNewEntry("");
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
    setIsSpinning(true);
    setWinner(null);
  };

  const handleSpinComplete = (winner: string) => {
    setIsSpinning(false);
    setWinner(winner);
    toast({
      title: "Winner!",
      description: winner,
    });
  };

  return (

    
    <div className="max-w-md mx-auto p-4 space-y-6 ">
        <div className="text-center animate-celebrate">
          <h2 className="text-2xl font-bold text-wheel-primary">Winner:</h2>
          <p className="text-xl">{winner ?? "NONE"}</p>
        </div>

        <Button
        onClick={handleSpinWheel}
        disabled={isSpinning}
        variant={isSpinning ? "outlined" : "contained"}
        className="w-full bg-wheel-primary hover:bg-wheel-primary/90 mb-10"
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel!"}
      </Button>

      <div className="relative aspect-square">
        <div
          ref={wheelRef}
          style={{
            overflow: "hidden",
          }}
        >
          <Wheel
            entries={entries}
            onSpinComplete={handleSpinComplete}
            spinning={isSpinning}
          />
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
        <Button onClick={handleAddEntry} variant="contained">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <EntriesList entries={entries} onRemove={handleRemoveEntry} />

    </div>
  );
};

export default WheelGame;

interface WheelProps {
  entries: string[];
  spinning: boolean;
  onSpinComplete: (winner: string) => void;
}

const Wheel: React.FC<WheelProps> = ({ entries, spinning, onSpinComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);
  const animationFrame = useRef<number>();

  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#D4A5A5",
    "#9B59B6",
    "#3498DB",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawWheel = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw segments
     entries.forEach((entry, index) => {
        const angle = (2 * Math.PI) / entries.length;
        const startAngle = index * angle + currentRotation.current;
        const endAngle = startAngle + angle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + angle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "16px Arial";
        ctx.fillText(truncateText(entry), radius - 20, 6);
        ctx.restore();
      });

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.stroke();

      // Draw pointer (arrow)
      const pointerX = centerX + radius; // Move pointer slightly inward
      const pointerWidth = 30;
      const pointerHeight = 40;
      // Draw arrow
      ctx.beginPath();
      ctx.moveTo(pointerX, centerY - pointerHeight / 2); // Top point
      ctx.lineTo(pointerX - pointerWidth, centerY); // Right point
      ctx.lineTo(pointerX, centerY + pointerHeight / 2); // Bottom point
      ctx.lineTo(pointerX + 8, centerY); // Back point to create arrow shape
      ctx.closePath();
      // Add a gradient fill to make it look more dimensional
      const gradient = ctx.createLinearGradient(
        pointerX - 10,
        centerY,
        pointerX + pointerWidth,
        centerY
      );
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(1, '#E0E0E0');

      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const animate = () => {
      const diff = targetRotation.current - currentRotation.current;
      if (Math.abs(diff) > 0.01) {
        currentRotation.current += diff * 0.05;
        drawWheel();
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        const winningIndex = Math.floor(
          ((-currentRotation.current % (2 * Math.PI)) / (2 * Math.PI)) *
            entries.length
        );
        onSpinComplete(entries[winningIndex]);
      }
    };

    if (spinning) {
      const extraSpins = 4 * 2 * Math.PI;
      const randomAngle = Math.random() * 2 * Math.PI;
      targetRotation.current =
        currentRotation.current - (extraSpins + randomAngle);
      animate();
    }

    drawWheel();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [entries, spinning, onSpinComplete]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="max-w-full h-auto"
    />
  );
};

const truncateText = (text: string, maxLength: number = 12) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
