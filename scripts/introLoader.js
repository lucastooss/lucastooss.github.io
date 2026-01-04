document.addEventListener('DOMContentLoaded', (event) => {
    
    const preloader = document.querySelector('.intro-container');
    const body = document.body;
    
    if (!preloader) return; // Verhindert Fehler, falls Element nicht existiert

    const animationDuration = 1000; 
    const delayBeforeFade = 500; 
    
    setTimeout(() => {
        // Startet das sanfte Ausblenden
        preloader.style.opacity = '0';
        
        setTimeout(() => {
            // Entfernt das Intro komplett aus dem Layout
            preloader.style.display = 'none';
            
            // Erlaube wieder das Scrollen
            body.style.overflow = 'auto';
            
            // Die fehlerhafte Zeile mit "intro-placeholder" wurde entfernt.
        }, 500); 

    }, animationDuration + delayBeforeFade); 
});