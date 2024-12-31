import MOVIE_DATA from '@/app/constant/MovieData';
import { useState, useEffect, useRef } from 'react';

interface MovieTitle {
	x: number;
	y: number;
	scale: number;
	alpha: number;
	speed: number;
	title: string;
	year: string;
	draw: (ctx: CanvasRenderingContext2D) => void;
	update: () => void;
  }
  
  class FloatingTitle implements MovieTitle {
	x: number = 0;
	y: number = 0;
	scale: number = 1;
	alpha: number = 0;
	speed: number = 0;
	title: string;
	year: string;
	private canvas: HTMLCanvasElement;
	private targetAlpha: number;
	private glowIntensity: number;
  
	constructor(canvas: HTMLCanvasElement) {
	  this.canvas = canvas;
	  const randomMovie = MOVIE_DATA[Math.floor(Math.random() * MOVIE_DATA.length)];
	  this.title = randomMovie.title;
	  this.year = randomMovie.year;
	  this.targetAlpha = Math.random() * 0.3 + 0.4;
	  this.glowIntensity = Math.random() * 0.5 + 0.5;
	  this.initializePosition();
	}
  
	private initializePosition(): void {
	  this.x = Math.random() * this.canvas.width;
	  this.y = this.canvas.height + 50;
	  this.scale = Math.random() * 0.4 + 0.6;
	  this.alpha = 0;
	  this.speed = Math.random() * 0.6 + 0.5;
	}
  
	reset(): void {
	  this.initializePosition();
	}
  
	draw(ctx: CanvasRenderingContext2D): void {
	  ctx.save();
	  ctx.translate(this.x, this.y);
	  ctx.scale(this.scale, this.scale);
  
	  // Draw glow effect
	  ctx.shadowColor = 'rgba(255, 165, 0, 0.5)';
	  ctx.shadowBlur = 20 * this.glowIntensity;
	  
	  // Draw year
	  ctx.font = 'italic 14px "Inter", sans-serif';
	  ctx.fillStyle = `rgba(255, 165, 0, ${this.alpha * 0.7})`;
	  ctx.textAlign = 'center';
	  ctx.fillText(this.year, 0, 20);
  
	  // Draw main title
	  ctx.font = 'bold 24px "Inter", sans-serif';
	  ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
	  
	  // Draw text stroke for better visibility
	  ctx.strokeStyle = `rgba(0, 0, 0, ${this.alpha * 0.3})`;
	  ctx.lineWidth = 3;
	  ctx.strokeText(this.title, 0, 0);
	  ctx.fillText(this.title, 0, 0);
  
	  ctx.restore();
	}
  
	update(): void {
	  // Smooth vertical movement
	  this.y -= this.speed;
	  
	  // Gentle horizontal sway
	  this.x += Math.sin(this.y * 0.01) * 0.3;
	  
	  // Fade in/out effect
	  if (this.y > this.canvas.height - 200) {
		this.alpha += (this.targetAlpha - this.alpha) * 0.1;
	  } else if (this.y < 200) {
		this.alpha *= 0.95;
	  }
  
	  // Update glow effect
	  this.glowIntensity = 0.5 + Math.sin(Date.now() * 0.002) * 0.3;
  
	  // Reset when out of view
	  if (this.y < -50 || this.alpha < 0.01) {
		this.reset();
	  }
	}
  }
  
  const MovieTitlesBackground: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
	useEffect(() => {
	  const canvas = canvasRef.current;
	  if (!canvas) return;
  
	  const ctx = canvas.getContext('2d');
	  if (!ctx) return;
  
	  let animationFrameId: number;
  
	  const resizeCanvas = (): void => {
		if (!canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	  };
  
	  resizeCanvas();
	  window.addEventListener('resize', resizeCanvas);
  
	  // Create floating titles
	  const titles: MovieTitle[] = Array.from(
		{ length: 15 },
		() => new FloatingTitle(canvas)
	  );
  
	  // Stagger initial positions
	  titles.forEach((title, index) => {
		title.y = canvas.height * (index / titles.length);
	  });
  
	  const animate = (): void => {
		if (!ctx || !canvas) return;
  
		// Clear with fade effect
		ctx.fillStyle = 'rgba(17, 24, 39, 0.2)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
  
		// Draw overlay gradient
		const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
		gradient.addColorStop(0, 'rgba(17, 24, 39, 1)');
		gradient.addColorStop(0.2, 'rgba(17, 24, 39, 0)');
		gradient.addColorStop(0.8, 'rgba(17, 24, 39, 0)');
		gradient.addColorStop(1, 'rgba(17, 24, 39, 1)');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
  
		// Update and draw titles
		titles.forEach(title => {
		  title.update();
		  title.draw(ctx);
		});
  
		animationFrameId = requestAnimationFrame(animate);
	  };
  
	  animate();
  
	  return () => {
		window.removeEventListener('resize', resizeCanvas);
		cancelAnimationFrame(animationFrameId);
	  };
	}, []);
  
	return (
	  <canvas
		ref={canvasRef}
		className="fixed inset-0 pointer-events-none"
	  />
	);
  };


export default MovieTitlesBackground;