const canvas = document.getElementById("matrix-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const chars =
  "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];
for (let i = 0; i < columns; i++) {
  drops[i] = Math.random() * -100;
}

function drawMatrix() {
  ctx.fillStyle = "rgba(10, 10, 15, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00f5d4";
  ctx.font = fontSize + "px monospace";
  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrix, 35);
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
const vizCanvas = document.getElementById("algoViz");
const vizCtx = vizCanvas.getContext("2d");

function resizeVizCanvas() {
  const container = document.getElementById("vizContainer");
  vizCanvas.width = container.clientWidth;
  vizCanvas.height = container.clientHeight;
}
resizeVizCanvas();
window.addEventListener("resize", resizeVizCanvas);

function drawVisualization(step, total, currentResult, n) {
  vizCtx.fillStyle = "#12121a";
  vizCtx.fillRect(0, 0, vizCanvas.width, vizCanvas.height);
  const centerX = vizCanvas.width / 2;
  const centerY = vizCanvas.height / 2;
  const radius = Math.min(vizCanvas.width, vizCanvas.height) * 0.25;
  vizCtx.strokeStyle = "rgba(0, 245, 212, 0.2)";
  vizCtx.lineWidth = 1;
  for (let i = 0; i <= total; i++) {
    const angle = (i / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    if (i <= step) {
      vizCtx.beginPath();
      vizCtx.arc(x, y, 8, 0, Math.PI * 2);
      vizCtx.fillStyle = i === step ? "#ff006e" : "#00f5d4";
      vizCtx.fill();
      vizCtx.shadowBlur = 15;
      vizCtx.shadowColor = i === step ? "#ff006e" : "#00f5d4";
      vizCtx.stroke();
      vizCtx.shadowBlur = 0;
      vizCtx.fillStyle = "#e0e0e0";
      vizCtx.font = "12px Fira Code";
      vizCtx.textAlign = "center";
      vizCtx.fillText(i.toString(), x, y + 25);
    } else {
      vizCtx.beginPath();
      vizCtx.arc(x, y, 4, 0, Math.PI * 2);
      vizCtx.fillStyle = "rgba(0, 245, 212, 0.2)";
      vizCtx.fill();
    }
    if (i > 0 && i <= step) {
      const prevAngle =
        ((i - 1) / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
      const prevX = centerX + Math.cos(prevAngle) * radius;
      const prevY = centerY + Math.sin(prevAngle) * radius;
      vizCtx.beginPath();
      vizCtx.moveTo(prevX, prevY);
      vizCtx.lineTo(x, y);
      vizCtx.strokeStyle = "#00f5d4";
      vizCtx.lineWidth = 2;
      vizCtx.stroke();
    }
  }
  vizCtx.fillStyle = "#00f5d4";
  vizCtx.font = 'bold 16px "Space Grotesk"';
  vizCtx.textAlign = "center";
  vizCtx.fillText(`i = ${step}`, centerX, centerY - 40);
  vizCtx.fillText(`result = ${currentResult}`, centerX, centerY + 50);
  const progress = total > 0 ? step / total : 0;
  vizCtx.strokeStyle = "rgba(255, 0, 110, 0.3)";
  vizCtx.lineWidth = 4;
  vizCtx.beginPath();
  vizCtx.arc(
    centerX,
    centerY,
    radius + 30,
    -Math.PI / 2,
    -Math.PI / 2 + Math.PI * 2 * progress
  );
  vizCtx.stroke();
}

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function countTrailingZeros(n) {
  let count = 0;
  for (let i = 5; Math.floor(n / i) >= 1; i *= 5) {
    count += Math.floor(n / i);
  }
  return count;
}
let animationId;

function animateCalculation(n) {
  let step = 0;
  let result = 1;
  const total = n;
  const stepCounter = document.getElementById("stepCounter");
  if (animationId) cancelAnimationFrame(animationId);

  function stepAnimation() {
    if (step <= total) {
      if (step >= 2) {
        result *= step;
      } else if (step === 0 || step === 1) {
        result = 1;
      }
      drawVisualization(step, total, result, n);
      stepCounter.textContent = `Step: ${step}/${total}`;
      step++;
      animationId = setTimeout(() => requestAnimationFrame(stepAnimation), 500);
    } else {
      document.getElementById(
        "resultValue"
      ).textContent = result.toLocaleString("fullwide", {
        useGrouping: true
      });
      document.getElementById(
        "digitCount"
      ).textContent = result.toString().length;
      document.getElementById("trailingZeros").textContent = countTrailingZeros(
        n
      );
    }
  }
  stepAnimation();
}

function calculateFactorial() {
  const input = document.getElementById("numberInput");
  const resultValue = document.getElementById("resultValue");
  const loadingBar = document.getElementById("loadingBar");
  const loadingProgress = document.getElementById("loadingProgress");
  const n = parseInt(input.value);
  if (isNaN(n) || n < 0) {
    resultValue.textContent = "Error: Invalid input";
    resultValue.style.color = "var(--accent-magenta)";
    return;
  }
  if (n > 170) {
    resultValue.textContent = "Error: Input too large";
    resultValue.style.color = "var(--accent-magenta)";
    return;
  }
  loadingBar.classList.add("active");
  loadingProgress.style.width = "0%";
  const startTime = performance.now();
  setTimeout(() => {
    loadingProgress.style.width = "30%";
  }, 50);
  setTimeout(() => {
    loadingProgress.style.width = "60%";
  }, 150);
  setTimeout(() => {
    loadingProgress.style.width = "100%";
    setTimeout(() => {
      loadingBar.classList.remove("active");
      const endTime = performance.now();
      document.getElementById("computationTime").textContent =
        (endTime - startTime).toFixed(3) + "ms";
      resultValue.style.color = "var(--accent-cyan)";
      animateCalculation(n);
    }, 300);
  }, 200);
}
document
  .getElementById("numberInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      calculateFactorial();
    }
  });
window.addEventListener("load", () => {
  resizeVizCanvas();
  drawVisualization(0, 5, 1, 5);
  setTimeout(calculateFactorial, 500);
});
document.addEventListener("mousemove", (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  document.body.style.background = `
               radial-gradient(
                   circle at ${x * 100}% ${y * 100}%, 
                   rgba(0, 245, 212, 0.03) 0%, 
                   transparent 50%
               ),
               var(--bg-primary)
           `;
});
