document.addEventListener('DOMContentLoaded', function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    fetch('../header/header.html')
        .then(response => response.text())
        .then(htmlContent => {
            headerPlaceholder.innerHTML = htmlContent;

            const menuBtn = document.getElementById('mobile-menu-btn');
            const navMenu = document.getElementById('nav-menu');
            const body = document.body;

            if (menuBtn && navMenu) {
                menuBtn.addEventListener('click', function() {
                    navMenu.classList.toggle('is-active');
                    
                    // Verhindert das Scrollen des Hintergrunds
                    body.classList.toggle('menu-open');
                });

                // Schließt das Menü, wenn ein Link geklickt wird
                const links = navMenu.querySelectorAll('a');
                links.forEach(link => {
                    link.addEventListener('click', () => {
                        navMenu.classList.remove('is-active');
                        body.classList.remove('menu-open');
                    });
                });
            }
        })
        .catch(error => console.error('Fehler beim Laden des Headers:', error));
});