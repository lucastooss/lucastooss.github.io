document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.intro-container');
    if (!preloader) return;

    // Sobald die Animation des Ladebalkens (1.5s) fast fertig ist
    setTimeout(() => {
        // Wir prüfen, ob wir auf der Startseite sind
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            // Sofortige Weiterleitung, bevor das Bild ausgeblendet wird
            window.location.href = 'home/';
        } else {
            // Normales Ausblenden auf anderen Seiten
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 1600); // 1.5s Animation + 100ms Puffer
});