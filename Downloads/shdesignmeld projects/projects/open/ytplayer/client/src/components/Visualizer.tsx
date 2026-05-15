import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

const Visualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying } = usePlayerStore();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    const bars = 20;
    const barWidth = 4;
    const gap = 2;
    const values = Array(bars).fill(0).map(() => Math.random() * 20 + 5);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < bars; i++) {
        const x = i * (barWidth + gap);
        
        // Simulating beat-reactive movement if playing
        if (isPlaying) {
          values[i] += (Math.random() - 0.5) * 5;
          values[i] = Math.max(5, Math.min(30, values[i]));
        } else {
          values[i] *= 0.9; // Fade out
        }
        
        const height = values[i];
        
        // Gradient for premium look
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#1DB954'); // Spotify Green
        gradient.addColorStop(1, '#1aa34a');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - height, barWidth, height, 2);
        ctx.fill();
      }
      
      animationId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      width={120} 
      height={40} 
      className="opacity-80"
    />
  );
};

export default Visualizer;
