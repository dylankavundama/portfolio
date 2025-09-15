document.addEventListener('DOMContentLoaded', function() {
    const appsContainer = document.getElementById('apps-container');
    const appDetailsModal = new bootstrap.Modal(document.getElementById('appDetailsModal'));
    const modalTitle = document.getElementById('appDetailsModalLabel');
    const modalDescription = document.getElementById('app-description');
    const modalCarouselInner = document.querySelector('#app-carousel .carousel-inner');
    const modalDownloadLink = document.getElementById('app-download-link');

    // Fonction pour créer une carte d'application
    function createAppCard(appId, app) {
        return `
            <div class="col mb-5">
                <div class="card h-140">
                    <img class="card-img-top" src="${app.images[0]}" alt="Logo de l'application ${app.title}" />
                    <div class="card-body p-9">
                        <div class="text-center">
                            <h5 class="fw-bolder">${app.title}</h5>
                        </div>
                    </div>
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        <div class="text-center">
                            <a class="btn btn-outline-dark mt-auto app-details-btn" href="#${appId}" data-bs-toggle="modal" data-bs-target="#appDetailsModal">voir plus</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Fonction pour mettre à jour la modale avec les détails de l'application
    function updateModal(app) {
        modalTitle.textContent = app.title;
        modalDescription.textContent = app.description;
        modalDownloadLink.href = app.downloadLink;

        modalCarouselInner.innerHTML = '';
        app.images.forEach((imgSrc, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            if (index === 0) {
                carouselItem.classList.add('active');
            }
            const img = document.createElement('img');
            img.src = imgSrc;
            img.classList.add('d-block', 'w-100');
            img.alt = `Capture d'écran de l'application ${app.title} - ${index + 1}`;
            carouselItem.appendChild(img);
            modalCarouselInner.appendChild(carouselItem);
        });

        appDetailsModal.show();
    }

    // Charger les données depuis le fichier JSON
    fetch('data/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de chargement du fichier data.json');
            }
            return response.json();
        })
        .then(data => {
            const appData = data.apps;

            // Générer et afficher les cartes d'applications
            let appCardsHTML = '';
            for (const appId in appData) {
                if (Object.hasOwnProperty.call(appData, appId)) {
                    appCardsHTML += createAppCard(appId, appData[appId]);
                }
            }
            appsContainer.innerHTML = appCardsHTML;

            // Une fois les cartes créées, ajouter les écouteurs d'événements
            const appDetailButtons = document.querySelectorAll('.app-details-btn');
            appDetailButtons.forEach(button => {
                button.addEventListener('click', function(event) {
                    const appId = event.currentTarget.getAttribute('href').substring(1);
                    const app = appData[appId];
                    if (app) {
                        updateModal(app);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Il y a eu un problème avec l\'opération fetch:', error);
            alert('Impossible de charger les données des applications. Veuillez vérifier le chemin du fichier.');
        });
});

document.addEventListener('DOMContentLoaded', function() {
    // ... (votre code JavaScript existant pour les cartes d'applications) ...

    // Fonction pour mettre à jour l'année dans le pied de page
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        const currentYear = new Date().getFullYear();
        currentYearSpan.textContent = currentYear;
    }
});