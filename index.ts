class Puyo {
  color: string;
  x: number;
  y: number;
  isFixed: boolean;

  constructor(color: string, x: number, y: number) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.isFixed = false;
  }

  drop() {
    this.y += 1;
  }

  draw(ctx: CanvasRenderingContext2D, blockSize: number) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.x * blockSize + blockSize / 2, // x of center
      this.y * blockSize + blockSize / 2, // y of center
      (blockSize / 2) * 0.9, // radius of circle (smaller than block)
      0, // draw from 0 rad
      Math.PI * 2 // draw to 2PI rad (360 degree)
    );
    ctx.closePath();
    ctx.fill();
  }
}

class ActivePuyoPair {
  puyo1: Puyo; // 親ぷよ
  puyo2: Puyo; // 子ぷよ

  constructor(puyo1: Puyo, puyo2: Puyo) {
    this.puyo1 = puyo1;
    this.puyo2 = puyo2;
  }

  drop() {
    this.puyo1.drop();
    this.puyo2.drop();
  }

  draw(ctx: CanvasRenderingContext2D, blockSize: number) {
    this.puyo1.draw(ctx, blockSize);
    this.puyo2.draw(ctx, blockSize);
  }

  moveHorizontal(direction: number) {
    this.puyo1.x += direction;
    this.puyo2.x += direction;
  }

  rotateRight() {
    const dx = this.puyo2.x - this.puyo1.x;
    const dy = this.puyo2.y - this.puyo1.y;
    this.puyo2.x = this.puyo1.x - dy;
    this.puyo2.y = this.puyo1.y + dx;
    if (!this.isPositionValid(this.puyo2.x, this.puyo2.y)) {
      // 元に戻す
      this.puyo2.x = this.puyo1.x + dy;
      this.puyo2.y = this.puyo1.y - dx;
    }
  }

  rotateLeft() {
    const dx = this.puyo2.x - this.puyo1.x;
    const dy = this.puyo2.y - this.puyo1.y;
    this.puyo2.x = this.puyo1.x + dy;
    this.puyo2.y = this.puyo1.y - dx;
    if (!this.isPositionValid(this.puyo2.x, this.puyo2.y)) {
      // 元に戻す
      this.puyo2.x = this.puyo1.x - dy;
      this.puyo2.y = this.puyo1.y + dx;
    }
  }

  isPositionValid(x: number, y: number): boolean {
    if (x < 0 || x >= fieldWidth || y >= fieldHeight) {
      return false; // out of bounds
    }
    if (y < 0) {
      return true; // 上部は許容
    }
    if (fieldState[y][x] !== 0) {
      return false; // 既に存在する
    }
    return true;
  }
}

function generatePuyo(): Puyo {
  const color = generateRandomColor();
  return new Puyo(color, 0, 0); // 初期位置を設定
}

function generatePuyoPair(): ActivePuyoPair {
  const puyo1 = new Puyo(generateRandomColor(), 2, 0);
  const puyo2 = new Puyo(generateRandomColor(), 2, 1);
  return new ActivePuyoPair(puyo1, puyo2);
}

function generateNewPuyoPair() {
  currentPuyoPair = generatePuyoPair();
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const fieldWidth = 6;
const fieldHeight = 12;
const blockSize = 30;
//change size of canvas to fit the field
canvas.width = fieldWidth * blockSize;
canvas.height = fieldHeight * blockSize;

let currentPuyoPair: ActivePuyoPair | null = null;

const fieldState: number[][] = []; //state of field
for (let y = 0; y < fieldHeight; y++) {
  fieldState[y] = [];
  for (let x = 0; x < fieldWidth; x++) {
    fieldState[y][x] = 0;
  }
}

function drawField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas
  //draw grid lines

  ctx.strokeStyle = "lightgray";
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= fieldWidth; x++) {
    ctx.beginPath();
    ctx.moveTo(x * blockSize, 0);
    ctx.lineTo(x * blockSize, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= fieldHeight; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * blockSize);
    ctx.lineTo(canvas.width, y * blockSize);
    ctx.stroke();
  }

  // Ensure currentPuyoPair is generated
  if (!currentPuyoPair) {
    generateNewPuyoPair();
  }

  // Draw puyoPair in operation
  currentPuyoPair!.draw(ctx, blockSize);
}

generateNewPuyoPair();
drawField();
document.addEventListener("keydown", handleKeyDown);

//ランダムな色を生成する関数を作成
function generateRandomColor(): string {
  const colors = ["red", "blue", "green", "yellow", "purple"];
  const randomIndex = Math.floor(Math.random() * colors.length); //0 <= x < colors.length までの数値を小数点切り捨てする
  return colors[randomIndex];
}

function handleKeyDown(event: KeyboardEvent) {
  if (!currentPuyoPair) return;
  switch (event.key) {
    case "ArrowLeft":
      currentPuyoPair.moveHorizontal(-1);
      break;
    case "ArrowRight":
      currentPuyoPair.moveHorizontal(1);
      break;
    case "ArrowDown":
      currentPuyoPair.drop();
      break;
    case "c":
      currentPuyoPair.rotateRight();
      break;
    case "x":
      currentPuyoPair.rotateLeft();
      break;
  }
  console.log("keyDown(" + event.key + ")");
  console.log(
    "ActivePuyoPair(x1, y1, x2, y2):",
    currentPuyoPair.puyo1.x,
    currentPuyoPair.puyo1.y,
    currentPuyoPair.puyo2.x,
    currentPuyoPair.puyo2.y
  );
  drawField();
}
