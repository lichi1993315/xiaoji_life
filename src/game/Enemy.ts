export class Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  startX: number;
  range: number;
  direction: number;

  constructor(x: number, y: number, range: number = 100) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.speed = 2;
    this.startX = x;
    this.range = range;
    this.direction = 1;
  }

  update() {
    this.x += this.speed * this.direction;
    
    if (this.x > this.startX + this.range) {
      this.direction = -1;
    } else if (this.x < this.startX) {
      this.direction = 1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw enemy body
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x + 5, this.y + 8, 6, 6);
    ctx.fillRect(this.x + 18, this.y + 8, 6, 6);
    
    // Draw angry eyebrows
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(this.x + 4, this.y + 6);
    ctx.lineTo(this.x + 12, this.y + 10);
    ctx.lineTo(this.x + 4, this.y + 10);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(this.x + 26, this.y + 6);
    ctx.lineTo(this.x + 18, this.y + 10);
    ctx.lineTo(this.x + 26, this.y + 10);
    ctx.fill();
  }
}