document.addEventListener('DOMContentLoaded', function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    fetch('../header/header.html')
        .then(response => response.text())
        .then(htmlContent => {
            headerPlaceholder.innerHTML = htmlContent;

            const header = headerPlaceholder.querySelector('.main-header');
            const menuBtn = document.getElementById('mobile-menu-btn');
            const navMenu = document.getElementById('nav-menu');
            const body = document.body;

            // Scroll-Funktion: Klasse hinzufügen/entfernen
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

            if (menuBtn && navMenu) {
                menuBtn.addEventListener('click', function() {
                    navMenu.classList.toggle('is-active');
                    body.classList.toggle('menu-open');
                });

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