let box = document.getElementsByClassName('main-container')[0];
let find = document.getElementById('find');
let findBG = document.getElementById('find-background');
let audioStart = document.getElementById('start');
let audioWin = document.getElementById('win');

let boxW = box.clientWidth;
let boxH = box.clientHeight;
let findW = find.clientWidth;
let findH = find.clientHeight;

// let fx = Math.random() * (boxW - findW); 
// let fy = Math.random() * (boxH - findH);

let fx = 105;
let fy = 475;

function getFindCenter() {
  return [
    fx + (findW / 2),
    fy + (findH / 2)
  ];
}

function getBoxCenter() {
  return [
    boxW / 2,
    boxH / 2
  ];
}

let animationID;
let startAnimation = () => {
  find.removeEventListener('click', startAnimation);
  find.style.border = "solid red 3px";
  findBG.style.display = "block";
  audioStart.autoplay = true;
  animationID = requestAnimationFrame(infiniteLoop);
  setTimeout(makeStopPossible, 2000);
};
find.addEventListener('click', startAnimation);

let makeStopPossible = () => {
  find.addEventListener('click', e => {
    cancelAnimationFrame(animationID);
    audioWin.autoplay = true;
  })
}

let mouseX = 0, mouseY = 0;

box.addEventListener('mousemove', e => {
  mouseX = e.layerX;
  mouseY = e.layerY;
})

let MAX_VELOCITY = 20;
let A = -18.0000818328;
let B = 100.1939716044;
let VELOCITY_MULTIPLIER_ERROR = 0.25;
function getVelocityMultiplier(r) {
  if (r <= findW / 2)
    return MAX_VELOCITY;
  let velocityMultiplier = A * Math.log(r) + B;
  return velocityMultiplier * (Math.random()*VELOCITY_MULTIPLIER_ERROR*2 + 1 - VELOCITY_MULTIPLIER_ERROR);
}

let VECTOR_DIRECTION_ERROR = 0.3;
function getMouseFindVector() {
  let [cx, cy] = getFindCenter();
  let dx = cx - mouseX;
  let dy = cy - mouseY;
  let r = Math.sqrt(dx*dx + dy*dy);
  let nvx = (dx / r) + VECTOR_DIRECTION_ERROR*(Math.random()*2 - 1);
  let nvy = (dy / r) + VECTOR_DIRECTION_ERROR*(Math.random()*2 - 1);
  let vm = getVelocityMultiplier(r);
  let rvx = nvx * vm;
  let rvy = nvy * vm;
  return [rvx, rvy];
}

let GRAVITY_A = 0.3;
function getBoxCenterVector() {
  let [cx, cy] = getFindCenter();
  let [bx, by] = getBoxCenter();
  let dx = bx - cx;
  let dy = by - cy;
  let r = Math.sqrt(dx*dx + dy*dy);
  let nvx = (dx / r);
  let nvy = (dy / r);
  let vm = r**GRAVITY_A;
  let rvx = nvx * vm;
  let rvy = nvy * vm;
  return [rvx, rvy];
}

function infiniteLoop() {
  let [rvx, rvy] = getMouseFindVector();
  fx += rvx;
  fy += rvy;
  let [bvx, bvy] = getBoxCenterVector();
  fx += bvx;
  fy += bvy;
  find.style.left = `${fx}px`;
  find.style.top = `${fy}px`;
  animationID = requestAnimationFrame(infiniteLoop);
}

let inputs = document.querySelectorAll('input');
let defaultValues = [MAX_VELOCITY, VELOCITY_MULTIPLIER_ERROR, A, B, VECTOR_DIRECTION_ERROR, GRAVITY_A];
inputs.forEach((input, i) => {
  input.value = defaultValues[i];
  input.addEventListener('change', e => {
    let value = Number(e.target.value);
    switch (e.target.name) {
      case "mv":
        MAX_VELOCITY = value;
        break;
      case "vme":
        VELOCITY_MULTIPLIER_ERROR = value;
        break;
      case "A":
        A = value;
        break;
      case "B":
        B = value;
        break;
      case "vde":
        VECTOR_DIRECTION_ERROR = value;
        break;
      case "gvA":
        GRAVITY_A = value;
        break;
      default:
        break;
    }
  });
});