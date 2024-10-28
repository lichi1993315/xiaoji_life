export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velX: number;
  velY: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.velX = 0;
    this.velY = 0;
    this.color = '#FFFFFF';
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw cat body
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw ears
    ctx.beginPath();
    ctx.moveTo(this.x + 5, this.y);
    ctx.lineTo(this.x + 15, this.y - 10);
    ctx.lineTo(this.x + 25, this.y);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(this.x + 25, this.y);
    ctx.lineTo(this.x + 35, this.y - 10);
    ctx.lineTo(this.x + 45, this.y);
    ctx.fill();
    
    // Draw eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(this.x + 15, this.y + 15, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(this.x + 35, this.y + 15, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw nose
    ctx.fillStyle = '#FFC0CB';
    ctx.beginPath();
    ctx.moveTo(this.x + 25, this.y + 20);
    ctx.lineTo(this.x + 20, this.y + 25);
    ctx.lineTo(this.x + 30, this.y + 25);
    ctx.fill();
    
    // Draw whiskers
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    
    // Left whiskers
    ctx.beginPath();
    ctx.moveTo(this.x + 15, this.y + 25);
    ctx.lineTo(this.x, this.y + 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x + 15, this.y + 25);
    ctx.lineTo(this.x, this.y + 25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x + 15, this.y + 25);
    ctx.lineTo(this.x, this.y + 30);
    ctx.stroke();
    
    // Right whiskers
    ctx.beginPath();
    ctx.moveTo(this.x + 35, this.y + 25);
    ctx.lineTo(this.x + 50, this.y + 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x + 35, this.y + 25);
    ctx.lineTo(this.x + 50, this.y + 25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x + 35, this.y + 25);
    ctx.lineTo(this.x + 50, this.y + 30);
    ctx.stroke();
  }

  checkCollision(object: { x: number; y: number; width: number; height: number }) {
    return (
      this.x < object.x + object.width &&
      this.x + this.width > object.x &&
      this.y + this.height > object.y &&
      this.y < object.y + object.height
    );
  }
}