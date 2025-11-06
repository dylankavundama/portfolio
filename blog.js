// ============================================
// GESTION DE LA SECTION BLOG
// ============================================

const STORAGE_KEY = 'blog_articles';

// Charger et afficher les articles sur la page principale
document.addEventListener('DOMContentLoaded', () => {
    loadBlogArticles();
});

function loadBlogArticles() {
    const articles = getBlogArticles();
    const blogGrid = document.getElementById('blog-grid');
    const blogEmpty = document.getElementById('blog-empty');

    if (!blogGrid) return;

    if (articles.length === 0) {
        if (blogGrid) blogGrid.style.display = 'none';
        if (blogEmpty) blogEmpty.style.display = 'block';
        return;
    }

    if (blogEmpty) blogEmpty.style.display = 'none';
    if (blogGrid) blogGrid.style.display = 'grid';

    // Trier les articles par date (plus récents en premier)
    const sortedArticles = articles.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    blogGrid.innerHTML = sortedArticles.map(article => `
        <article class="blog-card" data-id="${article.id}">
            <div class="blog-card-image">
                <img src="${escapeHtml(article.image)}" 
                     alt="${escapeHtml(article.title)}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x250?text=Image+non+disponible'">
                <div class="blog-card-overlay">
                    <a href="${escapeHtml(article.link)}" target="_blank" class="blog-card-link">
                        <i class="fas fa-external-link-alt"></i> Lire l'article
                    </a>
                </div>
            </div>
            <div class="blog-card-content">
                <div class="blog-card-date">
                    <i class="fas fa-calendar"></i> ${formatDate(article.date)}
                </div>
                <h3 class="blog-card-title">${escapeHtml(article.title)}</h3>
                <p class="blog-card-description">${escapeHtml(article.description)}</p>
                <div class="blog-card-footer">
                    <a href="${escapeHtml(article.link)}" target="_blank" class="blog-card-read-more">
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
    `).join('');

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
}

function getBlogArticles() {
    const articles = localStorage.getItem(STORAGE_KEY);
    return articles ? JSON.parse(articles) : [];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Fonction de partage d'article
function shareArticle(articleId, platform) {
    const articles = getBlogArticles();
    const article = articles.find(a => a.id === articleId);
    
    if (!article) return;
    
    const url = encodeURIComponent(article.link);
    const title = encodeURIComponent(article.title);
    const description = encodeURIComponent(article.description);
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
            
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
            
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
            
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            window.open(shareUrl, '_blank');
            break;
            
        case 'copy':
            // Copier le lien dans le presse-papiers
            if (navigator.clipboard) {
                navigator.clipboard.writeText(article.link).then(() => {
                    showShareNotification('Lien copié dans le presse-papiers !');
                }).catch(() => {
                    fallbackCopyTextToClipboard(article.link);
                });
            } else {
                fallbackCopyTextToClipboard(article.link);
            }
            break;
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

// Ajouter les animations CSS si elles n'existent pas
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

