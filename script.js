const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');
const themeToggle = document.getElementById('themeToggle');
const loadingScreen = document.getElementById('loadingScreen');
const year = document.getElementById('year');
const typingText = document.getElementById('typingText');

const phrases = [
    'AI & ML Enthusiast',
    'Data Science Explorer',
    'Full Stack Developer'
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

const typeText = () => {
    const current = phrases[phraseIndex];

    if (!typingText) return;

    typingText.textContent = deleting
        ? current.slice(0, charIndex--)
        : current.slice(0, charIndex++);

    if (!deleting && charIndex === current.length + 1) {
        deleting = true;
        setTimeout(typeText, 1200);
        return;
    }

    if (deleting && charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    setTimeout(typeText, deleting ? 70 : 100);
};

const setActiveLink = () => {
    let current = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
};

const updateProgress = () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const percent = height > 0 ? (scrollTop / height) * 100 : 0;
    progressBar.style.width = `${percent}%`;
    backToTop.style.display = scrollTop > 400 ? 'grid' : 'none';
};

const animateCounters = () => {
    const counters = document.querySelectorAll('.counter');
    counters.forEach((counter) => {
        const target = Number(counter.dataset.target);
        const duration = 1400;
        const startTime = performance.now();

        const step = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            counter.textContent = Math.floor(progress * target);
            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    });
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect();
        }
    });
}, { threshold: 0.5 });

const achievementsSection = document.getElementById('achievements');
if (achievementsSection) observer.observe(achievementsSection);

window.addEventListener('scroll', () => {
    setActiveLink();
    updateProgress();
});

window.addEventListener('load', () => {
    setActiveLink();
    updateProgress();
    typeText();
    setTimeout(() => loadingScreen.classList.add('hidden'), 500);
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

themeToggle.addEventListener('click', () => {
    const isLight = document.body.dataset.theme === 'light';
    document.body.dataset.theme = isLight ? '' : 'light';
    themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
});

year.textContent = new Date().getFullYear();
