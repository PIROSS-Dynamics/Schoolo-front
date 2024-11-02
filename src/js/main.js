let currentSlide = 0;

//modifie l'index de la slide qu'on voit à l'écran
function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');

    // Supprimer la classe 'active' de la slide actuelle
    slides[currentSlide].classList.remove('active');

    // Calculer l'index de la nouvelle slide
    currentSlide = (currentSlide + direction + slides.length) % slides.length;

    // Ajouter la classe 'active' à la nouvelle slide
    slides[currentSlide].classList.add('active');
}

// Ajouter les événements de survol pour les boutons du carrousel
const carouselBtns = document.querySelectorAll('.carousel-btn');
carouselBtns.forEach(btn => {
    btn.addEventListener('mouseover', () => {
        btn.style.opacity = '1';
    });
    btn.addEventListener('mouseout', () => {
        btn.style.opacity = '0.5';
    });
});
