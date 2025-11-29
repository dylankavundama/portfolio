// ============================================
// INITIALISATION AU CHARGEMENT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    initProjectFilters();
    initTestimonials();
    initProjectReadMore(); // Initialiser les boutons "Lire plus/Lire moins"
    trackSiteVisit(); // Tracker les visites du site
});

// ============================================
// GESTION DU THÈME CLAIR/SOMBRE
// ============================================
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    if (!themeToggle || !themeIcon) return;
    
    // Charger le thème sauvegardé
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Toggle du thème
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        // Changer l'icône avec animation
        themeIcon.style.transform = 'rotate(360deg)';
        themeIcon.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            if (isDark) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            themeIcon.style.transform = 'rotate(0deg)';
        }, 250);
        
        // Sauvegarder le thème
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}


// ============================================
// GESTION DU MULTILINGUE
// ============================================
let currentLanguage = localStorage.getItem('language') || 'fr';

function initLanguage() {
    // Gestion du sélecteur de langue
    const langToggle = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    
    if (!langToggle || !langDropdown) return;
    
    // Toggle au clic sur le bouton
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const isActive = langDropdown.classList.contains('active');
        
        // Fermer tous les autres dropdowns
        document.querySelectorAll('.lang-dropdown.active').forEach(dropdown => {
            if (dropdown !== langDropdown) {
                dropdown.classList.remove('active');
            }
        });
        
        // Toggle le dropdown actuel
        langDropdown.classList.toggle('active', !isActive);
    });
    
    // Sélection d'une langue
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const lang = option.getAttribute('data-lang');
            if (lang && translations[lang]) {
                updateLanguage(lang);
                langDropdown.classList.remove('active');
            }
        });
    });
    
    // Fermer le dropdown en cliquant ailleurs
    document.addEventListener('click', (e) => {
        if (langToggle && langDropdown) {
            if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('active');
            }
        }
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && langDropdown.classList.contains('active')) {
            langDropdown.classList.remove('active');
        }
    });
    
    // Initialiser la langue au chargement
    updateLanguage(currentLanguage);
}

function updateLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
    
    // Mettre à jour le texte du bouton
    const currentLangSpan = document.getElementById('current-lang');
    if (currentLangSpan) {
        currentLangSpan.textContent = lang.toUpperCase();
    }
    
    // Traduire tous les éléments
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let translation = translations[lang];
        
        for (const k of keys) {
            translation = translation?.[k];
        }
        
        if (translation) {
            if (element.tagName === 'INPUT' && element.hasAttribute('data-i18n-placeholder')) {
                element.placeholder = translation;
            } else {
                // Préserver les icônes et autres éléments HTML
                const textContent = element.textContent.trim();
                const hasIcon = element.querySelector('i, span');
                if (hasIcon) {
                    const icon = element.querySelector('i');
                    const span = element.querySelector('span');
                    if (span && span.textContent.trim() === textContent.split(' ').slice(-1)[0]) {
                        span.textContent = translation.split(' ').slice(-1)[0];
                    } else {
                        element.innerHTML = translation + (icon ? ' ' + icon.outerHTML : '');
                    }
                } else {
                    element.textContent = translation;
                }
            }
        }
    });
    
    // Déclencher l'événement de changement de langue
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}


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

// Fonction debounce pour optimiser les performances
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

if (header) {
    const handleScroll = debounce(() => {
        const currentScroll = window.pageYOffset;
        
        // Ajouter une ombre au header quand on scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            header.style.transition = 'box-shadow 0.3s ease';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    }, 10);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

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
// ANIMATIONS AU SCROLL (Intersection Observer) - OPTIMISÉ
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

// Observer uniquement les sections principales (pas chaque carte individuellement)
const sectionsToAnimate = document.querySelectorAll(
    '.section-title, .about-content, .about-section, .skills-section, .projects-section, .testimonials-section, .youtube-section'
);

sectionsToAnimate.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    observer.observe(el);
});

// Observer les cartes de compétences et technologies (moins nombreuses)
const skillCards = document.querySelectorAll('.skill-card, .tech-item');
skillCards.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    observer.observe(el);
});

// Observer la section projets en une seule fois (plus performant)
const projectsSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const projectCards = entry.target.querySelectorAll('.project-card:not(.hidden)');
            projectCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 50); // Délai réduit pour plus de fluidité
            });
            projectsSectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '100px' });

// Observer la section testimonials pour animer les cartes
const testimonialsSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const testimonialCards = entry.target.querySelectorAll('.testimonial-card');
            testimonialCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 100); // Délai pour animation séquentielle
            });
            testimonialsSectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '100px' });

const testimonialsSection = document.querySelector('.testimonials-section');
if (testimonialsSection) {
    testimonialsSectionObserver.observe(testimonialsSection);
}

const projectsSection = document.querySelector('.projects-section');
if (projectsSection) {
    projectsSectionObserver.observe(projectsSection);
}

// Fallback : S'assurer que tout est visible après le chargement
window.addEventListener('load', () => {
    setTimeout(() => {
        // Forcer l'affichage de tous les éléments
        document.querySelectorAll('.section-title, .skill-card, .project-card, .testimonial-card, .tech-item, .about-content, .youtube-section, .youtube-intro, .video-container, .youtube-cta').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.display = '';
        });
        
        // S'assurer que toutes les sections sont visibles
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.display = 'block';
            section.style.visibility = 'visible';
        });
    }, 100);
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
// ANIMATION DES CARTES DE PROJETS AU HOVER - OPTIMISÉ
// ============================================
// Utiliser la délégation d'événements pour de meilleures performances
const projectsGrid = document.getElementById('projects-grid');
if (projectsGrid) {
    projectsGrid.addEventListener('mouseenter', function(e) {
        const card = e.target.closest('.project-card');
        if (card && !card.classList.contains('hidden')) {
            card.style.willChange = 'transform, box-shadow';
        }
    }, true);
    
    projectsGrid.addEventListener('mouseleave', function(e) {
        const card = e.target.closest('.project-card');
        if (card) {
            card.style.willChange = 'auto';
        }
    }, true);
}

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
// ANIMATION STAGGER POUR LES PROJETS - SUPPRIMÉ
// ============================================
// Supprimé pour améliorer les performances - les animations sont gérées par l'observer

// ============================================
// ANIMATION STAGGER POUR LES TECHNOLOGIES
// ============================================
const techItems = document.querySelectorAll('.tech-item');
techItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.05}s`;
});

// ============================================
// PARALLAX EFFECT POUR LA SECTION HERO - OPTIMISÉ
// ============================================
let ticking = false;
const heroSection = document.querySelector('.hero-section');

function updateParallax() {
    if (!heroSection) return;
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
        heroSection.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroSection.style.opacity = Math.max(0.5, 1 - (scrolled / window.innerHeight) * 0.3);
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}, { passive: true });

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

// ============================================
// FILTRES ET RECHERCHE DE PROJETS
// ============================================
function initProjectFilters() {
    const projectCards = document.querySelectorAll('.project-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('project-search');
    const projectsGrid = document.getElementById('projects-grid');
    const projectsCountText = document.getElementById('projects-count-text');
    
    // Vérifier que les éléments existent
    if (!projectCards.length || !filterButtons.length || !searchInput || !projectsGrid || !projectsCountText) {
        console.warn('Éléments de filtrage non trouvés');
        return;
    }
    
    let currentFilter = 'all';
    let currentSearch = '';
    
    // Fonction pour filtrer et rechercher les projets
    function filterProjects() {
        let visibleCount = 0;
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category') || '';
            const searchText = (card.getAttribute('data-search') || '').toLowerCase();
            const cardTitle = (card.querySelector('h3')?.textContent || '').toLowerCase();
            const cardDescription = (card.querySelector('p')?.textContent || '').toLowerCase();
            
            // Vérifier le filtre de catégorie
            const matchesFilter = currentFilter === 'all' || 
                                category.toLowerCase().includes(currentFilter.toLowerCase());
            
            // Vérifier la recherche
            const matchesSearch = currentSearch === '' ||
                                searchText.includes(currentSearch.toLowerCase()) ||
                                cardTitle.includes(currentSearch.toLowerCase()) ||
                                cardDescription.includes(currentSearch.toLowerCase());
            
            if (matchesFilter && matchesSearch) {
                card.style.display = '';
                card.classList.remove('hidden');
                visibleCount++;
                // Ré-animer les cartes visibles avec requestAnimationFrame
                if (!card.classList.contains('animate-in')) {
                    requestAnimationFrame(() => {
                        card.classList.add('animate-in');
                    });
                }
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
                card.classList.remove('animate-in');
            }
        });
        
        // Mettre à jour le compteur
        if (projectsCountText) {
            projectsCountText.textContent = visibleCount;
        }
        
        // Afficher message si aucun résultat
        if (visibleCount === 0) {
            projectsGrid.classList.add('no-results');
        } else {
            projectsGrid.classList.remove('no-results');
        }
    }
    
    // S'assurer que le bouton "Tous" est actif par défaut
    const allButton = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === 'all');
    if (allButton && !allButton.classList.contains('active')) {
        allButton.classList.add('active');
    }
    
    // Gestion des filtres
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            button.classList.add('active');
            
            // Mettre à jour le filtre actif
            const filterValue = button.getAttribute('data-filter');
            currentFilter = filterValue || 'all';
            
            // Filtrer les projets
            filterProjects();
        });
    });
    
    // Gestion de la recherche avec debounce optimisé
    let searchTimeout;
    let rafId;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        if (rafId) cancelAnimationFrame(rafId);
        
        searchTimeout = setTimeout(() => {
            currentSearch = e.target.value.trim();
            rafId = requestAnimationFrame(() => {
                filterProjects();
            });
        }, 200); // Délai réduit pour plus de réactivité
    });
    
    // Recherche en temps réel (optionnel, commenté pour performance)
    // searchInput.addEventListener('input', (e) => {
    //     currentSearch = e.target.value.trim();
    //     filterProjects();
    // });
    
    // Effacer la recherche avec Escape
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            currentSearch = '';
            filterProjects();
        }
    });
    
    // Initialiser le compteur au chargement
    if (projectCards.length > 0 && projectsCountText) {
        projectsCountText.textContent = projectCards.length;
    }
    
    // Initialiser l'affichage
    filterProjects();
}

// ============================================
// MENU BURGER MOBILE
// ============================================
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navLinks = document.getElementById('nav-links');

if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fermer le menu quand on clique sur un lien
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// GESTION DES AVIS CLIENTS
// ============================================
function initTestimonials() {
    const testimonialForm = document.getElementById('testimonial-form');
    const testimonialsGrid = document.getElementById('testimonials-grid');
    
    if (!testimonialForm || !testimonialsGrid) return;
    
    // Charger les avis au démarrage
    loadTestimonials();
    
    // Gérer la soumission du formulaire
    testimonialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitTestimonial();
    });
}

// Charger les avis depuis l'API Supabase
async function loadTestimonials() {
    const testimonialsGrid = document.getElementById('testimonials-grid');
    if (!testimonialsGrid) return;
    
    try {
        // Afficher un loader
        testimonialsGrid.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin"></i> Chargement...</div>';
        
        const response = await fetch('/api/testimonials');
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des témoignages');
        }
        
        const testimonials = await response.json();
        
        // Garder uniquement l'avis exemple (celui avec data-testimonial-id="example")
        const exampleCard = testimonialsGrid.querySelector('[data-testimonial-id="example"]');
        const exampleHTML = exampleCard ? exampleCard.outerHTML : '';
        
        // Vider la grille
        testimonialsGrid.innerHTML = '';
        
        // Réinsérer l'avis exemple s'il existe
        if (exampleHTML) {
            testimonialsGrid.insertAdjacentHTML('beforeend', exampleHTML);
        }
        
        // Ajouter les témoignages depuis l'API
        testimonials.forEach((testimonial, index) => {
            const card = createTestimonialCard(testimonial, testimonial.id || `api-${index}`);
            testimonialsGrid.appendChild(card);
        });
        
        // Animer les nouvelles cartes
        setTimeout(() => {
            testimonialsGrid.querySelectorAll('.testimonial-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 100);
            });
        }, 100);
    } catch (error) {
        console.error('Erreur lors du chargement des témoignages:', error);
        testimonialsGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">Erreur lors du chargement des témoignages.</div>';
    }
}

// Créer une carte d'avis
function createTestimonialCard(testimonial, id) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.setAttribute('data-testimonial-id', id);
    
    // Générer les étoiles selon la note
    const stars = Array.from({ length: 5 }, (_, i) => {
        const isFilled = i < testimonial.rating;
        return `<i class="fas fa-star" style="color: ${isFilled ? '#ffc107' : '#ddd'};"></i>`;
    }).join('');
    
    // Récupérer l'initiale du nom pour l'avatar
    const initial = testimonial.name.charAt(0).toUpperCase();
    
    card.innerHTML = `
        <div class="testimonial-header">
            <div class="testimonial-avatar" style="font-size: 1.2em; font-weight: bold;">
                ${initial}
            </div>
            <div class="testimonial-info">
                <h4>${escapeHtml(testimonial.name)}</h4>
                ${testimonial.role ? `<p class="testimonial-role">${escapeHtml(testimonial.role)}</p>` : ''}
            </div>
        </div>
        <div class="testimonial-rating">
            ${stars}
        </div>
        <p class="testimonial-text">
            "${escapeHtml(testimonial.text)}"
        </p>
        <div class="testimonial-share-buttons">
            <button class="share-btn" onclick="shareTestimonial('${id}', 'facebook')" title="Partager sur Facebook" aria-label="Partager sur Facebook">
                <i class="fab fa-facebook-f"></i>
            </button>
            <button class="share-btn" onclick="shareTestimonial('${id}', 'twitter')" title="Partager sur Twitter" aria-label="Partager sur Twitter">
                <i class="fab fa-twitter"></i>
            </button>
            <button class="share-btn" onclick="shareTestimonial('${id}', 'linkedin')" title="Partager sur LinkedIn" aria-label="Partager sur LinkedIn">
                <i class="fab fa-linkedin-in"></i>
            </button>
            <button class="share-btn" onclick="shareTestimonial('${id}', 'whatsapp')" title="Partager sur WhatsApp" aria-label="Partager sur WhatsApp">
                <i class="fab fa-whatsapp"></i>
            </button>
            <button class="share-btn" onclick="shareTestimonial('${id}', 'copy')" title="Copier le lien" aria-label="Copier le lien">
                <i class="fas fa-link"></i>
            </button>
        </div>
    `;
    
    return card;
}

// Soumettre un nouvel avis
async function submitTestimonial() {
    const form = document.getElementById('testimonial-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const role = formData.get('role').trim();
    const rating = parseInt(formData.get('rating'));
    const text = formData.get('text').trim();
    
    // Validation
    if (!name || !rating || !text) {
        showTestimonialMessage('error', translations[currentLanguage].testimonials.errorMessage);
        return;
    }
    
    try {
        // Envoyer le témoignage à l'API
        const response = await fetch('/api/testimonials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                role: role || null,
                rating,
                text
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de l\'envoi du témoignage');
        }
        
        // Réinitialiser le formulaire
        form.reset();
        
        // Afficher le message de succès
        showTestimonialMessage('success', 'Merci ! Votre témoignage a été soumis et sera publié après modération.');
        
        // Note : On ne recharge pas les témoignages car le nouveau n'est pas encore approuvé
        // Scroll vers les avis
        setTimeout(() => {
            document.getElementById('avis')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    } catch (error) {
        console.error('Erreur:', error);
        showTestimonialMessage('error', error.message || translations[currentLanguage].testimonials.errorMessage);
    }
}

// Afficher un message de succès/erreur
function showTestimonialMessage(type, message) {
    // Supprimer les messages existants
    const existingMessages = document.querySelectorAll('.testimonial-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Créer le nouveau message
    const messageDiv = document.createElement('div');
    messageDiv.className = `testimonial-message ${type}`;
    messageDiv.textContent = message;
    
    // Insérer le message dans le formulaire
    const form = document.getElementById('testimonial-form');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Fonction pour échapper le HTML (sécurité)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// TRACKING DES VISITES DU SITE
// ============================================
const SITE_VISITS_KEY = 'site_visits';
const SITE_VISITORS_KEY = 'site_visitors';
const LAST_VISIT_KEY = 'last_visit_date';

// Tracker une visite du site
async function trackSiteVisit() {
    // Ne tracker que sur la page index.html
    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
        return;
    }

    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    // Générer ou récupérer un ID de visiteur unique
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
        visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitor_id', visitorId);
    }
    
    // Envoyer la visite à l'API (en arrière-plan, ne pas bloquer)
    try {
        await fetch('/api/stats/visit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: today,
                page: window.location.pathname,
                visitorId: visitorId
            })
        });
    } catch (error) {
        // Erreur silencieuse - ne pas bloquer l'expérience utilisateur
        console.error('Erreur lors de l\'enregistrement de la visite:', error);
    }
    
    // Garder aussi un cache local pour l'affichage immédiat (fallback)
    const totalVisits = parseInt(localStorage.getItem('site_total_visits') || '0') + 1;
    localStorage.setItem('site_total_visits', totalVisits.toString());
    
    let visits = JSON.parse(localStorage.getItem(SITE_VISITS_KEY) || '{}');
    if (!visits[today]) {
        visits[today] = 0;
    }
    visits[today]++;
    localStorage.setItem(SITE_VISITS_KEY, JSON.stringify(visits));
}

// ============================================
// GESTION DU CLIC SUR L'IMAGE DU PROJET
// ============================================
function initProjectReadMore() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const projectImage = card.querySelector('.project-image-placeholder');
        
        if (!projectImage) return;
        
        // Rendre l'image cliquable
        projectImage.style.cursor = 'pointer';
        projectImage.setAttribute('role', 'button');
        projectImage.setAttribute('tabindex', '0');
        
        // Mettre à jour l'aria-label selon la langue
        const updateAriaLabel = () => {
            const currentLang = localStorage.getItem('language') || 'fr';
            const translations = window.translations || {};
            if (translations[currentLang] && translations[currentLang].projects) {
                projectImage.setAttribute('aria-label', translations[currentLang].projects.readMore || 'Voir les détails du projet');
            } else {
                projectImage.setAttribute('aria-label', 'Voir les détails du projet');
            }
        };
        updateAriaLabel();
        
        // Écouter les changements de langue
        window.addEventListener('languageChanged', updateAriaLabel);
        
        // Gérer le clic sur l'image - Ouvrir le modal
        const openModal = (e) => {
            e.preventDefault();
            e.stopPropagation();
            openProjectModal(card);
        };
        
        projectImage.addEventListener('click', openModal);
        
        // Gérer la touche Enter pour l'accessibilité
        projectImage.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(e);
            }
        });
    });
}

// ============================================
// GESTION DU MODAL DE PROJET
// ============================================
function openProjectModal(projectCard) {
    const modal = document.getElementById('project-modal');
    const modalOverlay = document.getElementById('project-modal-overlay');
    const modalClose = document.getElementById('project-modal-close');
    const modalImage = document.getElementById('project-modal-image');
    const modalBadge = document.getElementById('project-modal-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalTags = document.getElementById('project-modal-tags');
    const modalDescription = document.getElementById('project-modal-description');
    const modalLink = document.getElementById('project-modal-link');
    
    if (!modal) return;
    
    // Récupérer les informations du projet
    const projectImage = projectCard.querySelector('.project-image-placeholder');
    const projectBadgeElement = projectCard.querySelector('.project-badge');
    const projectTitle = projectCard.querySelector('h3');
    const projectTags = projectCard.querySelector('.tags');
    const projectDescription = projectCard.querySelector('.project-description-wrapper p');
    // Chercher le lien dans project-actions ou directement dans la carte
    const projectLink = projectCard.querySelector('.project-actions a') || 
                        projectCard.querySelector('.btn-project') ||
                        projectCard.querySelector('a.btn');
    
    // Remplir le modal avec les données
    if (projectImage) {
        const bgImage = window.getComputedStyle(projectImage).backgroundImage;
        modalImage.style.backgroundImage = bgImage;
    }
    
    if (projectBadgeElement) {
        modalBadge.innerHTML = projectBadgeElement.innerHTML;
        modalBadge.style.display = 'flex';
    } else {
        modalBadge.style.display = 'none';
    }
    
    if (projectTitle) {
        modalTitle.textContent = projectTitle.textContent;
    }
    
    if (projectTags) {
        modalTags.innerHTML = projectTags.innerHTML;
    }
    
    if (projectDescription) {
        modalDescription.textContent = projectDescription.textContent;
    }
    
    if (projectLink && projectLink.href && projectLink.href !== '#' && projectLink.href !== window.location.href + '#') {
        // Mettre à jour le href du lien
        modalLink.href = projectLink.href;
        modalLink.style.display = 'inline-flex';
        modalLink.style.pointerEvents = 'auto';
        modalLink.style.cursor = 'pointer';
        
        // Mettre à jour le texte du lien selon la langue
        const currentLang = localStorage.getItem('language') || 'fr';
        const translations = window.translations || {};
        if (translations[currentLang] && translations[currentLang].projects) {
            const linkSpan = modalLink.querySelector('span');
            if (linkSpan) {
                linkSpan.textContent = translations[currentLang].projects.voirProjet || 'Voir le projet';
            }
        }
        
        // Nettoyer les anciens event listeners en clonant le lien
        const newLink = modalLink.cloneNode(true);
        modalLink.parentNode.replaceChild(newLink, modalLink);
        
        // Récupérer la nouvelle référence du lien
        const updatedModalLink = document.getElementById('project-modal-link');
        
        // Réappliquer les styles et attributs
        if (updatedModalLink) {
            updatedModalLink.href = projectLink.href;
            updatedModalLink.style.display = 'inline-flex';
            updatedModalLink.style.pointerEvents = 'auto';
            updatedModalLink.style.cursor = 'pointer';
            
            // S'assurer que le clic sur le lien fonctionne
            updatedModalLink.addEventListener('click', function(e) {
                e.stopPropagation(); // Empêcher la propagation vers le modalContent et l'overlay
                // Le lien fonctionnera normalement (navigation vers l'URL)
            });
        }
    } else {
        modalLink.href = '#';
        modalLink.style.display = 'none';
    }
    
    // Afficher le modal
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Fermer le modal au clic sur l'overlay (une seule fois)
    const overlayClickHandler = (e) => {
        // Ne fermer que si on clique directement sur l'overlay, pas sur le contenu
        if (e.target === modalOverlay) {
            closeProjectModal();
            modalOverlay.removeEventListener('click', overlayClickHandler);
        }
    };
    modalOverlay.addEventListener('click', overlayClickHandler);
    
    // Empêcher la fermeture quand on clique sur le contenu du modal (mais pas sur les liens)
    const modalContent = document.querySelector('.project-modal-content');
    if (modalContent) {
        // Utiliser once: true pour éviter les doublons, ou vérifier si le listener existe déjà
        const handleContentClick = (e) => {
            // Ne pas bloquer les clics sur les liens ou les boutons
            if (e.target.tagName === 'A' || e.target.closest('a') || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return; // Laisser le lien/bouton fonctionner normalement
            }
            e.stopPropagation();
        };
        
        // Retirer l'ancien listener s'il existe
        modalContent.removeEventListener('click', handleContentClick);
        // Ajouter le nouveau listener
        modalContent.addEventListener('click', handleContentClick);
    }
    
    // Fermer le modal au clic sur le bouton de fermeture (une seule fois)
    const closeClickHandler = () => {
        closeProjectModal();
        modalClose.removeEventListener('click', closeClickHandler);
    };
    modalClose.addEventListener('click', closeClickHandler);
    
    // Fermer le modal avec la touche Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeProjectModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    
    if (!modal) return;
    
    // Masquer le modal
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Fonction pour partager un témoignage
async function shareTestimonial(testimonialId, platform) {
    try {
        // Récupérer tous les témoignages
        const response = await fetch('/api/testimonials');
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des témoignages');
        }
        
        const testimonials = await response.json();
        const testimonial = testimonials.find(t => t.id === testimonialId);
        
        if (!testimonial) {
            showShareNotification('Témoignage introuvable', 'error');
            return;
        }
        
        // Créer l'URL de partage pointant vers la section des témoignages
        const shareUrl = `${window.location.origin}${window.location.pathname}#avis`;
        const url = encodeURIComponent(shareUrl);
        const name = encodeURIComponent(testimonial.name);
        const text = encodeURIComponent(`"${testimonial.text}" - ${testimonial.name}${testimonial.role ? ` (${testimonial.role})` : ''}`);
        const title = encodeURIComponent(`Avis de ${testimonial.name} - Dylan Dev 243`);
        
        let shareLink = '';
        
        switch(platform) {
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
                window.open(shareLink, '_blank', 'width=600,height=400');
                break;
                
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                window.open(shareLink, '_blank', 'width=600,height=400');
                break;
                
            case 'linkedin':
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                window.open(shareLink, '_blank', 'width=600,height=400');
                break;
                
            case 'whatsapp':
                shareLink = `https://wa.me/?text=${title}%20${text}%20${url}`;
                window.open(shareLink, '_blank');
                break;
                
            case 'copy':
                // Copier le lien dans le presse-papiers
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareUrl).then(() => {
                        showShareNotification('Lien copié dans le presse-papiers !');
                    }).catch(() => {
                        fallbackCopyTextToClipboard(shareUrl);
                    });
                } else {
                    fallbackCopyTextToClipboard(shareUrl);
                }
                break;
        }
    } catch (error) {
        console.error('Erreur lors du partage:', error);
        showShareNotification('Erreur lors du partage', 'error');
    }
}

// Fonction de fallback pour copier le texte
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showShareNotification('Lien copié dans le presse-papiers !');
    } catch (err) {
        console.error('Erreur lors de la copie:', err);
        showShareNotification('Erreur lors de la copie du lien', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Afficher une notification de partage
function showShareNotification(message, type = 'success') {
    // Vérifier si une notification existe déjà
    const existingNotification = document.querySelector('.share-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'share-notification';
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideInUp 0.3s ease-out;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

