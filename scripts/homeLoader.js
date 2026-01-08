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
            
            // Wir greifen uns alles, was im Body der home.html steht
            const newContent = doc.body.innerHTML;

            if (newContent) {
                contentPlaceholder.innerHTML = newContent;
            }
        })
        .catch(error => {
            console.error('Fehler beim Laden:', error);
            contentPlaceholder.innerHTML = '<p style="padding:100px; text-align:center;">Inhalt konnte nicht geladen werden.</p>';
        });
});