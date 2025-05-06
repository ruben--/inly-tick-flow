
import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const frequencyPointsRef = useRef<FrequencyPoint[]>([]);
  
  interface FrequencyPoint {
    x: number;
    y: number;
    amplitude: number;
    frequency: number;
    phase: number;
    speed: number;
    color: string;
    // Add movement properties
    velocityX: number;
    velocityY: number;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get context
    const context = canvas.getContext('2d');
    if (!context) return;
    contextRef.current = context;
    
    // Set canvas to full window size
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initFrequencyPoints();
      }
    };
    
    // Initialize frequency points
    const initFrequencyPoints = () => {
      const pointCount = 8; // Number of frequency wave sources
      frequencyPointsRef.current = [];
      
      for (let i = 0; i < pointCount; i++) {
        frequencyPointsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          amplitude: Math.random() * 30 + 20,
          frequency: Math.random() * 0.02 + 0.01,
          phase: Math.random() * Math.PI * 2,
          speed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
          // Klein Blue (RGB approximation: 0, 47, 167) with varying opacity
          color: `rgba(0, 47, 167, ${0.2 + Math.random() * 0.3})`,
          // Add random velocities for movement
          velocityX: (Math.random() - 0.5) * 0.5,
          velocityY: (Math.random() - 0.5) * 0.5
        });
      }
    };
    
    // Draw a single frequency wave
    const drawFrequencyWave = (point: FrequencyPoint, time: number) => {
      if (!contextRef.current || !canvas) return;
      
      const ctx = contextRef.current;
      const { width, height } = canvas;
      
      ctx.beginPath();
      ctx.strokeStyle = point.color;
      ctx.lineWidth = 1.5;
      
      // Updated phase based on time
      const currentPhase = point.phase + time * point.speed;
      
      // Draw a complete wave across the canvas
      const segmentCount = Math.floor(width / 2);
      const segmentSize = width / segmentCount;
      
      for (let i = 0; i <= segmentCount; i++) {
        const x = i * segmentSize;
        const distanceFromCenter = Math.sqrt(
          Math.pow(x - point.x, 2) + Math.pow(height/2 - point.y, 2)
        );
        
        // Wave height based on distance, frequency, and phase
        const waveHeight = Math.sin(distanceFromCenter * point.frequency + currentPhase) * point.amplitude;
        const y = height/2 + waveHeight;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    };
    
    // Update frequency point positions
    const updateFrequencyPoints = () => {
      if (!canvas) return;
      
      const { width, height } = canvas;
      const padding = 50; // Padding from edges
      
      frequencyPointsRef.current.forEach(point => {
        // Update position with velocity
        point.x += point.velocityX;
        point.y += point.velocityY;
        
        // Bounce off edges with padding
        if (point.x < padding || point.x > width - padding) {
          point.velocityX *= -1;
          point.x = Math.max(padding, Math.min(width - padding, point.x));
        }
        
        if (point.y < padding || point.y > height - padding) {
          point.velocityY *= -1;
          point.y = Math.max(padding, Math.min(height - padding, point.y));
        }
        
        // Occasionally change velocity slightly for more organic movement
        if (Math.random() < 0.01) {
          point.velocityX += (Math.random() - 0.5) * 0.1;
          point.velocityY += (Math.random() - 0.5) * 0.1;
          
          // Limit velocity to prevent too fast movement
          const maxVelocity = 0.8;
          const velocityMagnitude = Math.sqrt(point.velocityX * point.velocityX + point.velocityY * point.velocityY);
          
          if (velocityMagnitude > maxVelocity) {
            point.velocityX = (point.velocityX / velocityMagnitude) * maxVelocity;
            point.velocityY = (point.velocityY / velocityMagnitude) * maxVelocity;
          }
        }
      });
    };
    
    // Animation function
    const animate = () => {
      if (!contextRef.current || !canvas) return;
      
      const ctx = contextRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get current time for phase calculation
      const time = performance.now() * 0.001;
      
      // Update positions of frequency points
      updateFrequencyPoints();
      
      // Draw each frequency wave
      frequencyPointsRef.current.forEach(point => {
        drawFrequencyWave(point, time);
      });
      
      // Draw connection lines between points that are close
      ctx.lineWidth = 0.5;
      for (let i = 0; i < frequencyPointsRef.current.length; i++) {
        const pointA = frequencyPointsRef.current[i];
        
        for (let j = i + 1; j < frequencyPointsRef.current.length; j++) {
          const pointB = frequencyPointsRef.current[j];
          const distance = Math.sqrt(
            Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
          );
          
          if (distance < canvas.width * 0.4) {
            ctx.beginPath();
            ctx.moveTo(pointA.x, pointA.y);
            ctx.lineTo(pointB.x, pointB.y);
            // Use Klein Blue for connection lines too with distance-based opacity
            const opacity = 0.15 - (distance / (canvas.width * 0.4)) * 0.15;
            ctx.strokeStyle = `rgba(0, 47, 167, ${opacity})`;
            ctx.stroke();
          }
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Set up and start animation
    handleResize();
    window.addEventListener('resize', handleResize);
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default AnimatedBackground;
