// ============================================
// GESTION DES ARTICLES DE BLOG
// ============================================

// Clé pour le localStorage
const STORAGE_KEY = 'blog_articles';

// Initialiser la date par défaut à aujourd'hui
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('blog-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // Compteur de caractères
    const descriptionTextarea = document.getElementById('blog-description');
    const charCount = document.getElementById('char-count');
    
    if (descriptionTextarea && charCount) {
        descriptionTextarea.addEventListener('input', () => {
            const count = descriptionTextarea.value.length;
            charCount.textContent = `${count} / 500 caractères`;
            
            if (count > 450) {
                charCount.style.color = '#e74c3c';
            } else if (count > 400) {
                charCount.style.color = '#f39c12';
            } else {
                charCount.style.color = 'var(--primary-color, #3c94e7)';
            }
        });
    }

    // Charger les articles existants
    loadArticles();

    // Gestion du formulaire
    const form = document.getElementById('blog-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Bouton de réinitialisation
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const dateInput = document.getElementById('blog-date');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.value = today;
            }
        });
    }

    // Bouton supprimer tout
    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', confirmClearAll);
    }
});

// Récupérer les articles depuis le localStorage
function getArticles() {
    const articles = localStorage.getItem(STORAGE_KEY);
    return articles ? JSON.parse(articles) : [];
}

// Sauvegarder les articles dans le localStorage
function saveArticles(articles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

// Gérer la soumission du formulaire
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const article = {
        id: Date.now().toString(),
        image: formData.get('image'),
        title: formData.get('title'),
        description: formData.get('description'),
        link: formData.get('link'),
        date: formData.get('date'),
        createdAt: new Date().toISOString()
    };

    // Valider l'URL de l'image
    if (!isValidUrl(article.image)) {
        alert('Veuillez entrer une URL d\'image valide');
        return;
    }

    // Valider l'URL du lien
    if (!isValidUrl(article.link)) {
        alert('Veuillez entrer une URL valide pour le lien');
        return;
    }

    // Récupérer les articles existants
    const articles = getArticles();
    
    // Ajouter le nouvel article
    articles.unshift(article); // Ajouter au début
    
    // Sauvegarder
    saveArticles(articles);
    
    // Recharger l'affichage
    loadArticles();
    
    // Réinitialiser le formulaire
    e.target.reset();
    const dateInput = document.getElementById('blog-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
    
    // Réinitialiser le compteur
    const charCount = document.getElementById('char-count');
    if (charCount) {
        charCount.textContent = '0 / 500 caractères';
        charCount.style.color = 'var(--primary-color, #3c94e7)';
    }

    // Message de succès
    showNotification('Article ajouté avec succès !', 'success');
}

// Charger et afficher les articles
function loadArticles() {
    const articles = getArticles();
    const articlesList = document.getElementById('articles-list');
    const articlesCount = document.getElementById('articles-count');

    if (articlesCount) {
        articlesCount.textContent = articles.length;
    }

    if (!articlesList) return;

    if (articles.length === 0) {
        articlesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Aucun article pour le moment.</p>';
        return;
    }

    articlesList.innerHTML = articles.map(article => `
        <div class="article-item" data-id="${article.id}">
            <div class="article-item-header">
                <img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}" class="article-item-image" onerror="this.src='https://via.placeholder.com/300x200?text=Image+non+disponible'">
                <div class="article-item-info">
                    <div class="article-item-title">${escapeHtml(article.title)}</div>
                    <div class="article-item-description">${escapeHtml(article.description)}</div>
                    <div class="article-item-meta">
                        <span><i class="fas fa-calendar"></i> ${formatDate(article.date)}</span>
                        <a href="${escapeHtml(article.link)}" target="_blank" class="article-item-link">
                            <i class="fas fa-external-link-alt"></i> Voir l'article
                        </a>
                    </div>
                </div>
            </div>
            <div class="article-item-actions">
                <button class="btn btn-edit" onclick="editArticle('${article.id}')">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn btn-delete" onclick="deleteArticle('${article.id}')">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        </div>
    `).join('');
}

// Supprimer un article
function deleteArticle(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
        return;
    }

    const articles = getArticles();
    const filtered = articles.filter(article => article.id !== id);
    saveArticles(filtered);
    loadArticles();
    showNotification('Article supprimé avec succès !', 'success');
}

// Modifier un article
function editArticle(id) {
    const articles = getArticles();
    const article = articles.find(a => a.id === id);
    
    if (!article) return;

    // Remplir le formulaire avec les données de l'article
    document.getElementById('blog-image').value = article.image;
    document.getElementById('blog-title').value = article.title;
    document.getElementById('blog-description').value = article.description;
    document.getElementById('blog-link').value = article.link;
    document.getElementById('blog-date').value = article.date;

    // Mettre à jour le compteur
    const charCount = document.getElementById('char-count');
    if (charCount) {
        const count = article.description.length;
        charCount.textContent = `${count} / 500 caractères`;
    }

    // Supprimer l'ancien article
    deleteArticle(id);

    // Scroller vers le formulaire
    document.querySelector('.admin-form-section').scrollIntoView({ behavior: 'smooth' });
    
    showNotification('Article chargé pour modification. Modifiez et enregistrez.', 'info');
}

// Confirmer la suppression de tous les articles
function confirmClearAll() {
    const articles = getArticles();
    if (articles.length === 0) {
        alert('Aucun article à supprimer.');
        return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer tous les ${articles.length} articles ? Cette action est irréversible.`)) {
        localStorage.removeItem(STORAGE_KEY);
        loadArticles();
        showNotification('Tous les articles ont été supprimés.', 'success');
    }
}

// Valider une URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Échapper le HTML pour éviter les injections XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Formater la date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Afficher une notification
function showNotification(message, type = 'success') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Ajouter les animations CSS si elles n'existent pas
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

