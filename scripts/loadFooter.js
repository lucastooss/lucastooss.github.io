document.addEventListener('DOMContentLoaded', function() {
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (!footerPlaceholder) {
        console.error('Das Platzhalter-Element mit der ID "footer-placeholder" wurde nicht gefunden.');
        return;
    }

    fetch('../footer/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Konnte Footer-Inhalt nicht laden. Status: ${response.status}`);
            }
            return response.text(); 
        })
        .then(htmlContent => {
            footerPlaceholder.innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Fehler beim Laden des Footers:', error);
            footerPlaceholder.innerHTML = '<p>Ein Fehler ist beim Laden des Footers aufgetreten.</p>';
        });
});