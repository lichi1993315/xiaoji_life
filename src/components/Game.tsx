import React, { useEffect, useRef, useState } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { Player } from '../game/Player';
import { Platform } from '../game/Platform';
import { Enemy } from '../game/Enemy';
import { MovingPlatform } from '../game/MovingPlatform';
import { Flag } from '../game/Flag';
import { Trophy, Skull } from 'lucide-react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 5;
const LEVEL_WIDTH = 3000;
const DEATH_HEIGHT = CANVAS_HEIGHT + 200;

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameWon, setGameWon] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const cameraOffset = useRef(0);
  
  const resetGame = () => {
    player.current = new Player(100, 300);
    cameraOffset.current = 0;
    setGameWon(false);
    setIsDead(false);
  };

  const handleDeath = () => {
    setIsDead(true);
  };

  const player = useRef(new Player(100, 300));
  const flag = useRef(new Flag(LEVEL_WIDTH - 100, CANVAS_HEIGHT - 240));
  
  const platforms = useRef([
    new Platform(0, 500, 300, 40),
    new Platform(400, 400, 200, 40),
    new Platform(700, 300, 200, 40),
    new Platform(1000, 400, 300, 40),
    new Platform(1400, 500, 200, 40),
    new Platform(1700, 400, 250, 40),
    new Platform(2000, 300, 200, 40),
    new Platform(2300, 400, 300, 40),
    new Platform(2700, 500, 400, 40),
  ]);

  const movingPlatforms = useRef([
    new MovingPlatform(350, 200, 100, 20, 150),
    new MovingPlatform(900, 250, 100, 20, 100),
    new MovingPlatform(1600, 200, 100, 20, 120),
    new MovingPlatform(2200, 200, 100, 20, 150),
  ]);

  const enemies = useRef([
    new Enemy(500, 360, 150),
    new Enemy(1100, 360, 200),
    new Enemy(1800, 360, 150),
    new Enemy(2400, 360, 200),
  ]);

  const keys = useRef({
    left: false,
    right: false,
    up: false,
  });

  const gameLoop = (ctx: CanvasRenderingContext2D) => {
    if (gameWon || isDead) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Update camera position
    if (player.current.x > CANVAS_WIDTH / 3) {
      cameraOffset.current = Math.min(
        player.current.x - CANVAS_WIDTH / 3,
        LEVEL_WIDTH - CANVAS_WIDTH
      );
    }

    // Update player position
    if (keys.current.left) player.current.velX = -MOVE_SPEED;
    if (keys.current.right) player.current.velX = MOVE_SPEED;
    if (!keys.current.left && !keys.current.right) player.current.velX *= 0.8;

    // Apply gravity
    player.current.velY += GRAVITY;

    // Update position
    player.current.x += player.current.velX;
    player.current.y += player.current.velY;

    // Check if player fell out of the world
    if (player.current.y > DEATH_HEIGHT) {
      handleDeath();
      return;
    }

    // Update moving platforms and enemies
    movingPlatforms.current.forEach(platform => platform.update());
    enemies.current.forEach(enemy => enemy.update());

    // Check platform collisions
    let onGround = false;
    [...platforms.current, ...movingPlatforms.current].forEach(platform => {
      if (player.current.checkCollision(platform)) {
        onGround = true;
        player.current.y = platform.y - player.current.height;
        player.current.velY = 0;
      }
    });

    // Check enemy collisions
    enemies.current.forEach(enemy => {
      if (player.current.checkCollision(enemy)) {
        handleDeath();
        return;
      }
    });

    // Check flag collision (win condition)
    if (player.current.checkCollision(flag.current)) {
      setGameWon(true);
    }

    // Allow jumping only when on ground
    if (keys.current.up && onGround) {
      player.current.velY = JUMP_FORCE;
    }

    // Keep player in bounds
    if (player.current.x < 0) player.current.x = 0;
    if (player.current.x > LEVEL_WIDTH - player.current.width) {
      player.current.x = LEVEL_WIDTH - player.current.width;
    }

    // Save context state
    ctx.save();
    
    // Apply camera transform
    ctx.translate(-cameraOffset.current, 0);

    // Draw background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(cameraOffset.current, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw clouds (parallax effect)
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < LEVEL_WIDTH; i += 300) {
      const offsetX = (i + (cameraOffset.current * 0.5) % 300);
      ctx.beginPath();
      ctx.arc(offsetX, 100, 30, 0, Math.PI * 2);
      ctx.arc(offsetX + 20, 100, 30, 0, Math.PI * 2);
      ctx.arc(offsetX + 40, 100, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw platforms
    platforms.current.forEach(platform => platform.draw(ctx));

    // Draw moving platforms
    movingPlatforms.current.forEach(platform => platform.draw(ctx));

    // Draw enemies
    enemies.current.forEach(enemy => enemy.draw(ctx));

    // Draw flag
    flag.current.draw(ctx);

    // Draw player
    player.current.draw(ctx);

    // Restore context state
    ctx.restore();
  };

  useGameLoop(canvasRef, gameLoop);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key === 'ArrowRight') keys.current.right = true;
      if (e.key === 'ArrowUp') keys.current.up = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key === 'ArrowRight') keys.current.right = false;
      if (e.key === 'ArrowUp') keys.current.up = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-3xl font-bold text-white mb-4">小吉历险记</h1>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-4 border-gray-700 rounded-lg shadow-lg"
        />
        {!gameWon && !isDead && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
            使用方向键移动和跳跃
          </div>
        )}
        {gameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-white mb-2">恭喜通关！</h2>
              <p className="text-xl text-yellow-400 mb-6">小吉成功完成冒险！</p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                再玩一次
              </button>
            </div>
          </div>
        )}
        {isDead && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <div className="text-center">
              <Skull className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-white mb-2">游戏结束</h2>
              <p className="text-xl text-red-400 mb-6">小吉遇到了困难！要再试一次吗？</p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-400 transition-colors"
              >
                重新开始
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}