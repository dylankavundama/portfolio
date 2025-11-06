// ============================================
// ANIMATIONS ET INTERACTIONS
// ============================================

// Smooth scroll pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// HEADER ANIMATION AU SCROLL
// ============================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Ajouter une ombre au header quand on scroll
    if (currentScroll > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        header.style.transition = 'box-shadow 0.3s ease';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// BACK TO TOP BUTTON
// ============================================
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.transform = 'translateY(0) scale(1)';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.transform = 'translateY(20px) scale(0.8)';
        setTimeout(() => {
            if (window.pageYOffset <= 300) {
                backToTopBtn.style.display = 'none';
            }
        }, 300);
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// ANIMATIONS AU SCROLL (Intersection Observer)
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer les éléments à animer
const elementsToAnimate = document.querySelectorAll(
    '.skill-card, .project-card, .tech-item, .section-title, .about-content, .hero-content > *'
);

elementsToAnimate.forEach(el => {
    el.classList.add('fade-in-up');
    observer.observe(el);
});

// ============================================
// ANIMATION HERO SECTION
// ============================================
window.addEventListener('load', () => {
    const textContent = document.querySelector('.text-content');
    const imageContent = document.querySelector('.image-content');
    
    if (textContent) {
        textContent.style.animation = 'fadeInLeft 1s ease-out';
    }
    if (imageContent) {
        imageContent.style.animation = 'fadeInRight 1s ease-out 0.3s';
        imageContent.style.opacity = '0';
        setTimeout(() => {
            imageContent.style.opacity = '1';
        }, 300);
    }
});

// ============================================
// ANIMATION DES CARTES DE PROJETS AU HOVER
// ============================================
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        this.style.boxShadow = '0 10px 30px rgba(60, 148, 231, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
    });
});

// ============================================
// ANIMATION DES CARTES DE COMPÉTENCES
// ============================================
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        this.style.boxShadow = '0 8px 25px rgba(60, 148, 231, 0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.05)';
    });
});

// ============================================
// ANIMATION DES TECHNOLOGIES
// ============================================
document.querySelectorAll('.tech-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// ============================================
// ANIMATION DES BOUTONS
// ============================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.2s ease';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    btn.addEventListener('click', function(e) {
        // Effet de ripple
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ============================================
// ANIMATION DU LOGO
// ============================================
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    logo.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// ============================================
// ANIMATION STAGGER POUR LES PROJETS
// ============================================
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// ============================================
// ANIMATION STAGGER POUR LES TECHNOLOGIES
// ============================================
const techItems = document.querySelectorAll('.tech-item');
techItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.05}s`;
});

// ============================================
// PARALLAX EFFECT POUR LA SECTION HERO
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && scrolled < window.innerHeight) {
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroSection.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

// ============================================
// ANIMATION DU TEXTE TYPOGRAPHIQUE
// ============================================
const heroTitle = document.querySelector('.hero-content h1');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.innerHTML = '';
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${index * 0.05}s`;
        span.classList.add('letter-animate');
        heroTitle.appendChild(span);
    });
}

// ============================================
// ANIMATION DES LIENS DE NAVIGATION
// ============================================
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.transition = 'transform 0.2s ease';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// LAZY LOADING POUR LES IMAGES
// ============================================
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('fade-in');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ============================================
// ANIMATION DE LA SECTION YOUTUBE
// ============================================
const youtubeSection = document.querySelector('.youtube-section');
if (youtubeSection) {
    const youtubeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Animer les éléments enfants avec délai
                const intro = entry.target.querySelector('.youtube-intro');
                const video = entry.target.querySelector('.video-container');
                const cta = entry.target.querySelector('.youtube-cta');
                
                if (intro) {
                    setTimeout(() => intro.classList.add('animate-in'), 200);
                }
                if (video) {
                    setTimeout(() => video.classList.add('animate-in'), 400);
                }
                if (cta) {
                    setTimeout(() => cta.classList.add('animate-in'), 600);
                }
            }
        });
    }, { threshold: 0.2 });
    
    youtubeObserver.observe(youtubeSection);
}

// ============================================
// PERFORMANCE: Debounce pour le scroll
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Appliquer debounce aux événements de scroll
const handleScroll = debounce(() => {
    // Code de scroll optimisé
}, 10);

window.addEventListener('scroll', handleScroll, { passive: true });

