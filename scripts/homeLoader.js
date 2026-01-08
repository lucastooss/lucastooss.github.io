// Dateiname: homeLoader.js
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
            
            // Sucht gezielt nach der hero-section
            const newContent = doc.querySelector('.hero-section');

            if (newContent) {
                contentPlaceholder.innerHTML = newContent.outerHTML;
            } else {
                // Fallback, falls die Struktur anders ist
                contentPlaceholder.innerHTML = html;
            }
        })
        .catch(error => {
            console.error('Fehler beim Laden:', error);
            contentPlaceholder.innerHTML = '<p style="padding:100px; text-align:center;">Inhalt wird geladen...</p>';
        });
});