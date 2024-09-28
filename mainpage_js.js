const container = document.querySelector(".container");
const containerCarrossel = container.querySelector(".container-carrossel");
const carrossel = container.querySelector(".carrossel");
const carrosselItems = carrossel.querySelectorAll(".carrossel-item");

let isMouseDown = false;
let currentMousePos = 0;
let lastMousePos = 0;
let lastMoveTo = 0;
let moveTo = 0;

// 회전 관련 변수 설정
let currentDegree = 0;
const rotateAmount = 0.3; // 천천히 회전하도록 값 조정 (값이 작을수록 느림)

// 자동 회전 함수
const autoRotate = () => {
  currentDegree -= rotateAmount; // 천천히 회전
  carrossel.style.transform = `rotateY(${currentDegree}deg)`; // 회전 적용
  requestAnimationFrame(autoRotate); // 다음 프레임에 계속 회전
};

// 최초 실행 시 계속 회전
autoRotate();

const createCarrossel = () => {
  const carrosselProps = onResize();
  const length = carrosselItems.length; // 아이템 개수
  const degrees = 360 / length; // 각 아이템의 회전 각도
  const gap = 20; // 아이템 간의 간격
  const tz = distanceZ(carrosselProps.w, length, gap);

  container.style.width = tz * 2 + gap * length + "px";
  container.style.height = calculateHeight(tz) + "px";

  carrosselItems.forEach((item, i) => {
    const degreesByItem = degrees * i + "deg";
    item.style.setProperty("--rotatey", degreesByItem);
    item.style.setProperty("--tz", tz + "px");

    // 각 아이템 클릭 시 특정 링크로 이동
    item.addEventListener("click", () => {
      const link = item.getAttribute("data-link"); // 아이템에 설정된 링크 가져오기
      if (link) {
        window.location.href = link; // 클릭 시 링크로 이동
      }
    });
  });
};

const lerp = (a, b, n) => n * (a - b) + b;

const distanceZ = (widthElement, length, gap) => {
  return widthElement / 2 / Math.tan(Math.PI / length) + gap;
};

const calculateHeight = (z) => {
  const t = Math.atan((90 * Math.PI) / 180 / 2);
  return t * 2 * z;
};

const calculateFov = (carrosselProps) => {
  const perspective = window
    .getComputedStyle(containerCarrossel)
    .perspective.split("px")[0];
  const length =
    Math.sqrt(carrosselProps.w * carrosselProps.w) +
    Math.sqrt(carrosselProps.h * carrosselProps.h);
  return (2 * Math.atan(length / (2 * perspective))) * (180 / Math.PI);
};

const getPosX = (x) => {
  currentMousePos = x;
  moveTo = currentMousePos < lastMousePos ? moveTo - 2 : moveTo + 2;
  lastMousePos = currentMousePos;
};

const update = () => {
  lastMoveTo = lerp(moveTo, lastMoveTo, 0.05);
  carrossel.style.setProperty("--rotatey", lastMoveTo + "deg");
  requestAnimationFrame(update);
};

const onResize = () => {
  const boundingCarrossel = containerCarrossel.getBoundingClientRect();
  return { w: boundingCarrossel.width, h: boundingCarrossel.height };
};

const initEvents = () => {
  carrossel.addEventListener("mousedown", () => {
    isMouseDown = true;
    carrossel.style.cursor = "grabbing";
  });

  carrossel.addEventListener("mouseup", () => {
    isMouseDown = false;
    carrossel.style.cursor = "grab";
  });

  container.addEventListener("mouseleave", () => (isMouseDown = false));

  carrossel.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
      getPosX(e.clientX);
    }
  });

  window.addEventListener("resize", createCarrossel);

  update();
  createCarrossel();
};

initEvents();
