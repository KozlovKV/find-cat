let container = document.getElementsByClassName('main-container')[0];
let find = document.getElementById('find');

let boxW = container.clientWidth;
let boxH = container.clientHeight;
let findW = find.clientWidth;
let findH = find.clientHeight;

// let fx = Math.random() * (boxW - findW); 
// let fy = Math.random() * (boxH - findH);

let fx = 0;
let fy = 0;

find.style.left = 0 + 'px';
find.style.top = 0 + 'px';

function getFindCenter() {
  return [
    fx + (findW / 2),
    fy + (findH / 2)
  ];
}

let animationID;
let startAnimation = () => {
  find.removeEventListener('click', startAnimation);
  animationID = requestAnimationFrame(infiniteLoop);
  setTimeout(makeStopPossible, 2000);
};
find.addEventListener('click', startAnimation);

let makeStopPossible = () => {
  find.addEventListener('click', e => {
    cancelAnimationFrame(animationID);
  })
}

let mouseX = 0, mouseY = 0;

container.addEventListener('mousemove', e => {
  mouseX = e.layerX;
  mouseY = e.layerY;
})

let MAX_VELOCITY = 40;
let A = -18.0000818328;
let B = 120.1939716044;
let VELOCITY_MULTIPLIER_ERROR = 0.25;
function getVelocityMultiplier(r) {
  if (r <= findW / 2)
    return MAX_VELOCITY;
  let velocityMultiplier = A * Math.log(r) + B;
  return velocityMultiplier * (Math.random()*VELOCITY_MULTIPLIER_ERROR*2 + 1 - VELOCITY_MULTIPLIER_ERROR);
}

let VECTOR_DIRECTION_ERROR = 0.3;
function getVector() {
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

function infiniteLoop() {
  let [rvx, rvy] = getVector();
  fx += rvx;
  if (fx < 0)
    fx = 0;
  if (fx > boxW - findW)
    fx = boxW - findW;
  fy += rvy;
  if (fy < 0)
    fy = 0;
  if (fy > boxH - findH)
    fy = boxH - findH;
  find.style.left = `${fx}px`;
  find.style.top = `${fy}px`;
  animationID = requestAnimationFrame(infiniteLoop);
}

let inputs = document.querySelectorAll('input');
let defaultValues = [MAX_VELOCITY, VELOCITY_MULTIPLIER_ERROR, A, B, VECTOR_DIRECTION_ERROR];
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
      default:
        break;
    }
  });
});