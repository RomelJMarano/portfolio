const cursor = document.querySelector(".cursor");
const cursorGlow = document.querySelector(".cursor-glow");
document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
  cursorGlow.style.left = e.clientX - 125 + "px";
  cursorGlow.style.top = e.clientY - 125 + "px";
});
document
  .querySelectorAll(
    "a, button, .skill-chip, .timeline-content, .experience-card, .contact-item"
  )
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "scale(2.5)";
      cursor.style.borderWidth = "1px";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "scale(1)";
      cursor.style.borderWidth = "2px";
    });
  });
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);
const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, index * 200);
      }
    });
  },
  { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
);
document.querySelectorAll(".timeline-content").forEach((el) => {
  timelineObserver.observe(el);
});
document.querySelectorAll(".timeline-dot").forEach((el) => {
  timelineObserver.observe(el);
});
document
  .querySelectorAll(".experience-card, .skills-category, .contact-item")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "all 0.8s ease";
    observer.observe(el);
  });
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", newTheme);
  const btn = document.querySelector(".theme-toggle");
  btn.textContent = newTheme === "dark" ? "☀️" : "🌙";
}
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector(".submit-btn");
  const formData = new FormData(form);
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  fetch("send_email.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showModal("success", "Message Sent!", data.message);
        form.reset();
      } else {
        showModal("error", "Error", data.message);
      }
    })
    .catch((error) => {
      showModal(
        "error",
        "Error",
        "Failed to send message. Please try again or contact me directly via email."
      );
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    });
}
function showModal(type, title, message) {
  const modal = document.getElementById("modal");
  const modalIcon = document.getElementById("modalIcon");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  modalIcon.textContent = type === "success" ? "✓" : "✕";
  modalIcon.className = `modal-icon ${type}`;
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.classList.add("active");
}
function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("active");
}
document.getElementById("modal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});
document.querySelectorAll(".skill-chip").forEach((chip, i) => {
  chip.style.animationDelay = `${i * 0.05}s`;
});

// Add this to your existing index.js file

// Drawing Canvas Setup
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Drawing variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;
const lines = [];
const maxLines = 50; // Maximum number of lines to keep

// Get accent color from CSS variable
function getAccentColor() {
  const theme = document.body.getAttribute("data-theme");
  return theme === "light" ? "#0066ff" : "#00ff88";
}

// Drawing function
function draw(e) {
  if (!isDrawing) return;

  const x = e.clientX;
  const y = e.clientY;

  // Draw line
  ctx.strokeStyle = getAccentColor();
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowBlur = 10;
  ctx.shadowColor = getAccentColor();

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  // Store line data
  lines.push({
    x1: lastX,
    y1: lastY,
    x2: x,
    y2: y,
    color: getAccentColor(),
    opacity: 1,
    time: Date.now(),
  });

  // Remove old lines if too many
  if (lines.length > maxLines) {
    lines.shift();
  }

  lastX = x;
  lastY = y;
}

// Event listeners for drawing
document.addEventListener("mousedown", (e) => {
  isDrawing = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

document.addEventListener("mousemove", draw);

document.addEventListener("mouseup", () => {
  isDrawing = false;
});

document.addEventListener("mouseout", () => {
  isDrawing = false;
});

// Fade out animation
function fadeLines() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const currentTime = Date.now();

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    const age = currentTime - line.time;
    const fadeTime = 2000; // 2 seconds to fade

    if (age > fadeTime) {
      lines.splice(i, 1);
      continue;
    }

    line.opacity = 1 - age / fadeTime;

    ctx.strokeStyle = line.color;
    ctx.globalAlpha = line.opacity;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowBlur = 10;
    ctx.shadowColor = line.color;

    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(fadeLines);
}

// Start fade animation
fadeLines();

// Clear canvas when theme changes
const originalToggleTheme = window.toggleTheme;
window.toggleTheme = function () {
  originalToggleTheme();
  lines.length = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// Touch support for mobile
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  isDrawing = true;
  const touch = e.touches[0];
  lastX = touch.clientX;
  lastY = touch.clientY;
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!isDrawing) return;

  const touch = e.touches[0];
  const x = touch.clientX;
  const y = touch.clientY;

  ctx.strokeStyle = getAccentColor();
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowBlur = 10;
  ctx.shadowColor = getAccentColor();

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  lines.push({
    x1: lastX,
    y1: lastY,
    x2: x,
    y2: y,
    color: getAccentColor(),
    opacity: 1,
    time: Date.now(),
  });

  if (lines.length > maxLines) {
    lines.shift();
  }

  lastX = x;
  lastY = y;
});

canvas.addEventListener("touchend", () => {
  isDrawing = false;
});

console.log("✨ Drawing effect loaded! Hold left click and drag to draw!");
