// Dateiname: loadFooter.js

document.addEventListener('DOMContentLoaded', function() {
    // 1. Platzhalter-Element finden, in das der Footer geladen werden soll
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (!footerPlaceholder) {
        console.error('Das Platzhalter-Element mit der ID "footer-placeholder" wurde nicht gefunden.');
        return;
    }

    // 2. Die externe HTML-Datei asynchron laden
    fetch('../footer/footer.html')
        .then(response => {
            // Sicherstellen, dass die Datei erfolgreich geladen wurde (Status 200)
            if (!response.ok) {
                throw new Error(`Konnte Footer-Inhalt nicht laden. Status: ${response.status}`);
            }
            return response.text(); // Inhalt als reinen Text lesen
        })
        .then(htmlContent => {
            // 3. Den geladenen HTML-Inhalt in den Platzhalter einfügen
            footerPlaceholder.innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Fehler beim Laden des Footers:', error);
            footerPlaceholder.innerHTML = '<p>Ein Fehler ist beim Laden des Footers aufgetreten.</p>';
        });
});