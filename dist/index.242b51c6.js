const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const fieldWidth = 6;
const fieldHeight = 12;
const blockSize = 30;
//change size of canvas to fit the field
canvas.width = fieldWidth * blockSize;
canvas.height = fieldHeight * blockSize;
let currentPuyoPair = null;
let currentX = 0;
let currentY = 0;
const fieldState = []; //state of field
for(let y = 0; y < fieldHeight; y++){
    fieldState[y] = [];
    for(let x = 0; x < fieldWidth; x++)fieldState[y][x] = 0;
}
function drawField() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas
    //draw grid lines
    ctx.strokeStyle = "lightgray";
    ctx.lineWidth = 0.5;
    for(let x = 0; x <= fieldWidth; x++){
        ctx.beginPath();
        ctx.moveTo(x * blockSize, 0);
        ctx.lineTo(x * blockSize, canvas.height);
        ctx.stroke();
    }
    for(let y = 0; y <= fieldHeight; y++){
        ctx.beginPath();
        ctx.moveTo(0, y * blockSize);
        ctx.lineTo(canvas.width, y * blockSize);
        ctx.stroke();
    }
    // generate puyoPair
    const puyoPair = generatePuyoPair();
    //draw puyoPair in operation
    if (currentPuyoPair) drawPuyoPair(puyoPair, currentX, currentY);
}
generateNewPuyoPair();
drawField();
document.addEventListener("keydown", handleKeyDown);
//ランダムな色を生成する関数を作成
function generateRandomColor() {
    const colors = [
        "red",
        "blue",
        "green",
        "yellow",
        "purple"
    ];
    const randomIndex = Math.floor(Math.random() * colors.length); //0 <= x < colors.length までの数値を小数点切り捨てする
    return colors[randomIndex];
}
function generatePuyo() {
    const color = generateRandomColor();
    return {
        color
    };
}
function generatePuyoPair() {
    const puyo1 = generatePuyo(); // 1st puyo
    const puyo2 = generatePuyo(); //2nd puyo
    return {
        puyo1: puyo1,
        puyo2: puyo2
    };
}
function generateNewPuyoPair() {
    currentPuyoPair = generatePuyoPair();
    currentX = 1;
    currentY = 0;
}
function drawPuyoPair(puyoPair, startX, startY) {
    drawPuyo(puyoPair.puyo1, startX, startY);
    drawPuyo(puyoPair.puyo2, startX, startY + 1);
}
for(let i = 0; i < 10; i++)console.log(i + 1, "\u756A\u76EE\u306E\u8272:", generatePuyo());
function drawPuyo(puyo, x, y) {
    if (!ctx) return; // ctxがnullの場合は処理中断
    ctx.fillStyle = puyo.color;
    ctx.beginPath();
    ctx.arc(x * blockSize + blockSize / 2, y * blockSize + blockSize / 2, blockSize / 2 * 0.9, 0, Math.PI * 2 //draw to 2PI rad (360 degree)
    );
    ctx.closePath();
    ctx.fill();
}
function handleKeyDown(event) {
    switch(event.key){
        case "ArrowLeft":
            movePuyoHorizontal(-1);
            break;
        case "ArrawRight":
            movePuyoHorizontal(1);
            break;
        case "ArrowDown":
            movePuyoVertical();
            break;
        case "c":
            rotatePuyoRight();
            break;
        case "x":
            rotatePuyoLeft();
            break;
    }
    drawField();
}
function isPositionValid(x, y) {
    if (x < 0 || x >= fieldWidth || y >= fieldHeight) return false; //out of bounds
    if (y < 0) return true; //
    if (fieldState[y][x] !== 0) return false; // already exists
    return true;
}
function movePuyoHorizontal(direction) {
    if (!currentPuyoPair) return;
    const nextX1 = currentX + direction;
    const nextX2 = currentX + direction;
}
function movePuyoVertical() {
    throw new Error("Function not implemented.");
}
function rotatePuyoRight() {
    throw new Error("Function not implemented.");
}
function rotatePuyoLeft() {
    throw new Error("Function not implemented.");
}

//# sourceMappingURL=index.242b51c6.js.map
