document.addEventListener('DOMContentLoaded', function() {
    const contentPlaceholder = document.getElementById('content-placeholder');
    if (!contentPlaceholder) return;

    fetch('../home/home.html')
        .then(response => {
            if (!response.ok) throw new Error('Home-Inhalt konnte nicht geladen werden.');
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.body.innerHTML;

            if (newContent) {
                contentPlaceholder.innerHTML = newContent;

                // --- NEU: Prüfen ob zum Bereich gescrollt werden soll ---
                if (window.location.hash === '#ueber-uns') {
                    // Kurze Verzögerung, damit das Bild/Layout fertig gerendert ist
                    setTimeout(() => {
                        const target = document.getElementById('ueber-uns');
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 100);
                }
            }
        })
        .catch(error => {
            console.error('Fehler beim Laden:', error);
        });
});