document.addEventListener('DOMContentLoaded', (event) => {
    
    const preloader = document.querySelector('.intro-container');
    const body = document.body;
    
    if (!preloader) return; 

    const animationDuration = 1000; 
    const delayBeforeFade = 500; 
    
    setTimeout(() => {
        preloader.style.opacity = '0';
        
        setTimeout(() => {
            preloader.style.display = 'none';
            
            body.style.overflow = 'auto';
            
        }, 500); 

    }, animationDuration + delayBeforeFade); 
});