// ===== SCROLL REVEAL =====

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));
} else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add("visible"));
}

// ===== PARTICLES BACKGROUND (hero) =====

const canvas = document.getElementById('particles');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];

    function createParticles() {
        for (let i = 0; i < 70; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.8 + 0.5,
                tiltAngle: Math.random() * Math.PI * 2,
                tiltAngleIncrement: Math.random() * 0.03 + 0.01,
                opacity: Math.random() * 0.4 + 0.15
            });
        }
    }
    createParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.tiltAngle += particle.tiltAngleIncrement;
            particle.y += (Math.cos(particle.tiltAngle) + 2 + particle.r / 2) / 2;
            particle.x += Math.sin(particle.tiltAngle) * 0.6;

            if (particle.y > canvas.height) {
                particle.y = -10;
                particle.x = Math.random() * canvas.width;
            }

            ctx.globalAlpha = particle.opacity;
            ctx.fillStyle = 'rgba(240, 169, 59, 1)'; // amber/gold to match theme
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// ===== SKILLS STAR BACKGROUND =====

const skillsCanvas = document.getElementById("skillsCanvas");

if (skillsCanvas) {
    const skillsCtx = skillsCanvas.getContext("2d");

    function resizeSkillsCanvas() {
        skillsCanvas.width = skillsCanvas.offsetWidth;
        skillsCanvas.height = skillsCanvas.offsetHeight;
    }
    resizeSkillsCanvas();
    window.addEventListener("resize", resizeSkillsCanvas);

    const stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * skillsCanvas.width,
            y: Math.random() * skillsCanvas.height,
            r: Math.random() * 1.6,
            opacity: Math.random(),
            speed: Math.random() * 0.015
        });
    }

    function animateStars() {
        skillsCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);
        stars.forEach(star => {
            star.opacity += star.speed;
            if (star.opacity >= 1 || star.opacity <= 0) star.speed *= -1;
            skillsCtx.beginPath();
            skillsCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            skillsCtx.fillStyle = `rgba(240,169,59,${star.opacity * 0.7})`;
            skillsCtx.fill();
        });
        requestAnimationFrame(animateStars);
    }
    animateStars();
}

// ===== NAVBAR SCROLL EFFECT =====

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// ===== NAV SCROLLSPY (keep the active link in sync while scrolling) =====

const navAnchors = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
const spySections = navAnchors
    .map(link => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);

function updateActiveNavLink() {
    if (!spySections.length) return;

    const navHeight = navbar ? navbar.offsetHeight : 0;
    const scrollPos = window.scrollY + navHeight + 60;
    const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;

    let currentSection = spySections[0];

    if (atBottom) {
        currentSection = spySections[spySections.length - 1];
    } else {
        spySections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                currentSection = section;
            }
        });
    }

    navAnchors.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSection.id}`);
    });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
window.addEventListener('resize', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);
updateActiveNavLink();

// ===== CONTACT: COPY EMAIL =====

function copyEmail(element) {
    const email = 'mtimalsina90@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        const copiedMsg = element.querySelector('.copied-msg');
        if (copiedMsg) {
            copiedMsg.classList.add('show');
            setTimeout(() => copiedMsg.classList.remove('show'), 2000);
        }
    });
}

// ===== CONTACT: SEND MESSAGE (opens Gmail / default mail client via mailto) =====

function sendMessage() {
    const name = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const message = document.getElementById('c-msg').value.trim();
    const formNote = document.getElementById('form-note');

    if (!name || !email || !message) {
        formNote.textContent = 'Please fill all fields';
        formNote.style.color = '#ef4444';
        return;
    }

    const recipient = 'mtimalsina90@gmail.com';
    const subject = `Portfolio Contact from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Opens the user's default mail client (Gmail if it's set as default,
    // or the Gmail web compose window if they're signed in and it's the
    // registered mailto handler in their browser).
    window.location.href = mailtoLink;

    formNote.textContent = 'Opening your email app to send the message...';
    formNote.style.color = '#3ddc84';

    setTimeout(() => {
        document.getElementById('c-name').value = '';
        document.getElementById('c-email').value = '';
        document.getElementById('c-msg').value = '';
        formNote.textContent = '';
    }, 3000);
}

// ===== RESUME: VIEW CV (inline PDF viewer) =====

const viewCvBtn = document.getElementById('viewCvBtn');
const closeCvBtn = document.getElementById('closeCvBtn');
const cvViewer = document.getElementById('cvViewer');
const cvFrame = document.getElementById('cvFrame');

function openCvViewer() {
    if (!cvViewer || !cvFrame) return;
    if (!cvFrame.getAttribute('src')) {
        cvFrame.setAttribute('src', cvFrame.getAttribute('data-src'));
    }
    cvViewer.classList.add('open');
    cvViewer.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
        cvViewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
}

function closeCvViewer() {
    if (!cvViewer) return;
    cvViewer.classList.remove('open');
    cvViewer.setAttribute('aria-hidden', 'true');
}

if (viewCvBtn) viewCvBtn.addEventListener('click', openCvViewer);
if (closeCvBtn) closeCvBtn.addEventListener('click', closeCvViewer);

// ===== FOOTER YEAR =====

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
