// ============================================
// GESTION DE LA PAGE BLOG DÉDIÉE
// Utilise Supabase via les API routes Vercel
// ============================================

const API_BASE_URL = '/api/blog';

// Fonction d'initialisation
function initBlogPage() {
    console.log('blog-page.js chargé, démarrage du chargement des articles...');
    initTheme();
    initLanguage();
    initMobileMenu();
    initBackToTop();
    // Délai pour s'assurer que le DOM est complètement prêt
    setTimeout(() => {
        loadBlogArticles();
    }, 100);
}

// Initialisation au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogPage);
} else {
    // DOM déjà chargé
    console.log('DOM déjà chargé, chargement immédiat des articles...');
    initBlogPage();
}

// ============================================
// GESTION DU THÈME
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
        
        // Changer l'icône
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
        
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// ============================================
// GESTION DU MULTILINGUE
// ============================================
let currentLanguage = localStorage.getItem('language') || 'fr';

function initLanguage() {
    const langToggle = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangSpan = document.getElementById('current-lang');
    
    if (!langToggle || !langDropdown) return;
    
    // Afficher la langue actuelle
    if (currentLangSpan) {
        currentLangSpan.textContent = currentLanguage.toUpperCase();
    }
    
    // Toggle au clic
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        langDropdown.classList.toggle('active');
    });
    
    // Fermer au clic extérieur
    document.addEventListener('click', (e) => {
        if (!langDropdown.contains(e.target) && !langToggle.contains(e.target)) {
            langDropdown.classList.remove('active');
        }
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
    
    // Appliquer la langue au chargement
    updateLanguage(currentLanguage);
}

function updateLanguage(lang) {
    if (!translations[lang]) return;
    
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Mettre à jour le span de langue
    const currentLangSpan = document.getElementById('current-lang');
    if (currentLangSpan) {
        currentLangSpan.textContent = lang.toUpperCase();
    }
    
    // Mettre à jour tous les textes
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
                element.textContent = translation;
            }
        }
    });
}

// ============================================
// MENU MOBILE
// ============================================
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (!mobileMenuToggle || !navLinks) return;
    
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
    
    // Fermer le menu au clic sur un lien
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
}

// ============================================
// BACK TO TOP
// ============================================
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
            backToTopBtn.style.opacity = '1';
        } else {
            backToTopBtn.style.opacity = '0';
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
}

// ============================================
// CHARGEMENT DES ARTICLES
// ============================================
async function loadBlogArticles() {
    const blogGrid = document.getElementById('blog-grid');
    const blogEmpty = document.getElementById('blog-empty');
    const blogLoader = document.getElementById('blog-loader');

    if (!blogGrid) {
        console.error('Élément blog-grid non trouvé dans le DOM');
        return;
    }

    console.log('Début du chargement des articles...');

    try {
        // Afficher le loader
        if (blogLoader) {
            blogLoader.classList.add('active');
        }
        if (blogGrid) {
            blogGrid.style.display = 'none';
        }
        if (blogEmpty) {
            blogEmpty.style.display = 'none';
        }

        console.log('Tentative de récupération des articles depuis:', API_BASE_URL);
        const response = await fetch(API_BASE_URL);
        
        console.log('Réponse reçue, status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
            console.error('Erreur API blog:', errorData);
            throw new Error(errorData.error || `Erreur ${response.status} lors du chargement des articles`);
        }

        const articles = await response.json();
        console.log('Articles reçus:', articles);
        console.log('Nombre d\'articles:', articles ? articles.length : 0);

        // Cacher le loader dès que les articles sont reçus
        if (blogLoader) {
            blogLoader.classList.remove('active');
            blogLoader.style.display = 'none';
        }

        if (!articles || articles.length === 0) {
            console.log('Aucun article trouvé, affichage du message vide');
            if (blogGrid) {
                blogGrid.style.display = 'none';
            }
            if (blogEmpty) {
                blogEmpty.style.display = 'flex';
                blogEmpty.style.flexDirection = 'column';
                blogEmpty.style.alignItems = 'center';
                blogEmpty.style.justifyContent = 'center';
                blogEmpty.style.padding = '60px 20px';
                blogEmpty.style.textAlign = 'center';
            }
            return;
        }

        // Afficher la grille et cacher le message vide
        if (blogEmpty) {
            blogEmpty.style.display = 'none';
        }
        if (blogGrid) {
            blogGrid.style.display = 'grid';
        }

        console.log('Affichage de', articles.length, 'article(s)');

        // Générer le HTML des articles
        const articlesHTML = articles.map(article => {
            const views = article.views || 0;
            
            // Validation
            if (!article.id || !article.title || !article.description || !article.image) {
                console.warn('Article incomplet:', article);
                return '';
            }
            
            return `
            <article class="blog-card" data-id="${article.id}">
                <div class="blog-card-image">
                    <img src="${escapeHtml(article.image)}" 
                         alt="${escapeHtml(article.title)}" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x250?text=Image+non+disponible'">
                    <div class="blog-card-overlay">
                        <a href="blog-detail.html?id=${article.id}" class="blog-card-link">
                            <i class="fas fa-eye"></i> Voir les détails
                        </a>
                    </div>
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <div class="blog-card-date">
                            <i class="fas fa-calendar"></i> ${formatDate(article.date)}
                        </div>
                        <div class="blog-card-views">
                            <i class="fas fa-eye"></i> ${views} ${views === 1 ? 'vue' : 'vues'}
                        </div>
                    </div>
                    <h3 class="blog-card-title">${escapeHtml(article.title)}</h3>
                    <p class="blog-card-description">${escapeHtml(article.description)}</p>
                    <div class="blog-card-footer">
                        <a href="blog-detail.html?id=${article.id}" class="blog-card-read-more">
                            Lire la suite <i class="fas fa-arrow-right"></i>
                        </a>
                        <div class="blog-share-buttons">
                            <button class="share-btn" onclick="shareArticle('${article.id}', 'facebook')" title="Partager sur Facebook" aria-label="Partager sur Facebook">
                                <i class="fab fa-facebook-f"></i>
                            </button>
                            <button class="share-btn" onclick="shareArticle('${article.id}', 'twitter')" title="Partager sur Twitter" aria-label="Partager sur Twitter">
                                <i class="fab fa-twitter"></i>
                            </button>
                            <button class="share-btn" onclick="shareArticle('${article.id}', 'linkedin')" title="Partager sur LinkedIn" aria-label="Partager sur LinkedIn">
                                <i class="fab fa-linkedin-in"></i>
                            </button>
                            <button class="share-btn" onclick="shareArticle('${article.id}', 'whatsapp')" title="Partager sur WhatsApp" aria-label="Partager sur WhatsApp">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                            <button class="share-btn" onclick="shareArticle('${article.id}', 'copy')" title="Copier le lien" aria-label="Copier le lien">
                                <i class="fas fa-link"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
            `;
        }).filter(html => html !== '').join('');
        
        console.log('HTML généré, longueur:', articlesHTML.length);
        
        if (blogGrid && articlesHTML) {
            blogGrid.innerHTML = articlesHTML;
            // S'assurer que la grille est visible
            blogGrid.style.display = 'grid';
            console.log('Articles affichés dans la grille');
        } else {
            console.error('Impossible d\'afficher les articles: blogGrid ou articlesHTML manquant', {
                blogGrid: !!blogGrid,
                articlesHTML: !!articlesHTML,
                articlesHTMLLength: articlesHTML ? articlesHTML.length : 0
            });
        }

        // Animer les cartes au scroll
        const blogCards = document.querySelectorAll('.blog-card');
        const blogObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 100);
                    blogObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });

        blogCards.forEach(card => {
            blogObserver.observe(card);
        });

    } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
        
        // Cacher le loader
        if (blogLoader) {
            blogLoader.classList.remove('active');
            blogLoader.style.display = 'none';
        }
        
        // Afficher un message d'erreur
        if (blogGrid) {
            blogGrid.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #e74c3c; grid-column: 1 / -1;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px; color: #e74c3c;"></i>
                    <h3 style="margin-bottom: 10px;">Erreur de chargement</h3>
                    <p style="color: #666; margin-bottom: 10px;">${escapeHtml(error.message)}</p>
                    <p style="color: #999; font-size: 14px; margin-top: 10px;">Vérifiez la console pour plus de détails.</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: var(--primary-color, #3c94e7); color: white; border: none; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-redo"></i> Réessayer
                    </button>
                </div>
            `;
            blogGrid.style.display = 'grid';
        }
        if (blogEmpty) blogEmpty.style.display = 'none';
    }
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Erreur formatDate:', error, dateString);
        return dateString;
    }
}

// Fonction de partage d'article
async function shareArticle(articleId, platform) {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) return;
        
        const articles = await response.json();
        const article = articles.find(a => a.id === articleId);
        
        if (!article) return;
    
        const shareUrl = article.link || `${window.location.origin}/blog-detail.html?id=${articleId}`;
        const url = encodeURIComponent(shareUrl);
        const title = encodeURIComponent(article.title);
        const description = encodeURIComponent(article.description);
    
        let shareLink = '';
    
        switch(platform) {
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                window.open(shareLink, '_blank', 'width=600,height=400');
                break;
                
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                window.open(shareLink, '_blank', 'width=600,height=400');
                break;
                
            case 'linkedin':
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                window.open(shareLink, '_blank', 'width=600,height=400');
                break;
                
            case 'whatsapp':
                shareLink = `https://wa.me/?text=${title}%20${url}`;
                window.open(shareLink, '_blank');
                break;
                
            case 'copy':
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

function showShareNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `share-notification share-notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Ajouter les animations CSS
const shareStyle = document.createElement('style');
shareStyle.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
`;
if (!document.querySelector('style[data-share-animations]')) {
    shareStyle.setAttribute('data-share-animations', 'true');
    document.head.appendChild(shareStyle);
}

