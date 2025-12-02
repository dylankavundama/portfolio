// ============================================
// GESTION DE LA SECTION BLOG
// Utilise Supabase via les API routes Vercel
// ============================================

const API_BASE_URL = '/api/blog';

// Charger et afficher les articles sur la page principale
document.addEventListener('DOMContentLoaded', () => {
    console.log('blog.js chargé, démarrage du chargement des articles...');
    loadBlogArticles();
});

// Fallback si DOMContentLoaded a déjà été déclenché
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlogArticles);
} else {
    // DOM déjà chargé
    console.log('DOM déjà chargé, chargement immédiat des articles...');
    loadBlogArticles();
}

async function loadBlogArticles() {
    const blogGrid = document.getElementById('blog-grid');
    const blogEmpty = document.getElementById('blog-empty');

    if (!blogGrid) return;

    try {
        // Afficher un loader
        blogGrid.innerHTML = '<div style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin"></i> Chargement...</div>';
        if (blogEmpty) blogEmpty.style.display = 'none';

        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
            console.error('Erreur API blog:', errorData);
            throw new Error(errorData.error || `Erreur ${response.status} lors du chargement des articles`);
        }

        const articles = await response.json();
        console.log('Articles reçus:', articles);
        console.log('Nombre d\'articles:', articles ? articles.length : 0);

        if (!articles || articles.length === 0) {
            console.log('Aucun article trouvé, affichage du message vide');
            blogGrid.style.display = 'none';
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

        if (blogEmpty) blogEmpty.style.display = 'none';
        blogGrid.style.display = 'grid';

        console.log('Affichage de', articles.length, 'article(s)');

        // Limiter à 3 articles sur la page d'accueil (pour l'aperçu)
        const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
        const articlesToShow = isIndexPage ? articles.slice(0, 3) : articles;

        // Les articles sont déjà triés par date (plus récents en premier) depuis l'API
        const articlesHTML = articlesToShow.map(article => {
            const views = article.views || 0;
            // S'assurer que tous les champs nécessaires existent
            if (!article.id || !article.title || !article.description || !article.image) {
                console.warn('Article incomplet:', article);
                return ''; // Ignorer les articles incomplets
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
        }).filter(html => html !== '').join(''); // Filtrer les articles incomplets
        
        console.log('HTML généré, longueur:', articlesHTML.length);
        blogGrid.innerHTML = articlesHTML;

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
        
        // Afficher un message d'erreur
        blogGrid.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px; color: #e74c3c;"></i>
                <h3 style="margin-bottom: 10px;">Erreur de chargement</h3>
                <p style="color: #666;">${error.message}</p>
                <p style="color: #999; font-size: 14px; margin-top: 10px;">Vérifiez la console pour plus de détails.</p>
            </div>
        `;
        if (blogEmpty) blogEmpty.style.display = 'none';
    }
}

// Fonction pour récupérer les articles depuis l'API
async function getBlogArticles() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des articles');
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
        return [];
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    try {
        // Gérer le format de date YYYY-MM-DD ou ISO
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Si la date n'est pas valide, retourner la date brute
            return dateString;
        }
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Erreur formatDate:', error, dateString);
        return dateString; // Retourner la date brute en cas d'erreur
    }
}

// Les vues sont maintenant gérées directement par l'API Supabase
// Plus besoin de localStorage pour les vues

// Fonction de partage d'article
async function shareArticle(articleId, platform) {
    try {
        const articles = await getBlogArticles();
        const article = articles.find(a => a.id === articleId);
        
        if (!article) return;
    
        // Utiliser le lien de l'article s'il existe, sinon l'URL de la page de détail
        const shareUrl = article.link || `${window.location.origin}/blog-detail.html?id=${articleId}`;
        const url = encodeURIComponent(shareUrl);
        const title = encodeURIComponent(article.title);
        const description = encodeURIComponent((article.description || article.title).substring(0, 200));
        const image = encodeURIComponent(article.image || '');
    
        let shareLink = '';
    
        switch(platform) {
            case 'facebook':
                // Facebook utilise les meta tags Open Graph de la page de destination
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                window.open(shareLink, '_blank', 'width=600,height=400');
                break;
                
            case 'twitter':
                // Twitter avec titre et description
                shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${title}%20-%20${description}`;
                window.open(shareLink, '_blank', 'width=600,height=400');
                break;
                
            case 'linkedin':
                // LinkedIn utilise les meta tags Open Graph de la page de destination
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                window.open(shareLink, '_blank', 'width=600,height=400');
                break;
                
            case 'whatsapp':
                // WhatsApp avec titre, description et URL
                const whatsappText = `${title}%0A%0A${description}%0A%0A${url}`;
                shareLink = `https://wa.me/?text=${whatsappText}`;
                window.open(shareLink, '_blank');
                break;
                
            case 'copy':
                // Copier le lien dans le presse-papiers avec titre et description
                const copyText = `${article.title}\n\n${article.description || ''}\n\n${shareUrl}`;
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(copyText).then(() => {
                        showShareNotification('Lien copié dans le presse-papiers !');
                    }).catch(() => {
                        fallbackCopyTextToClipboard(copyText);
                    });
                } else {
                    fallbackCopyTextToClipboard(copyText);
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

