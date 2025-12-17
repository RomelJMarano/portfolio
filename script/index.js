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
