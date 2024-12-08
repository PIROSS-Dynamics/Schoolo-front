import React, { useState, useEffect } from 'react';
import '../css/style.css';
import '../css/Carousel.css';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      imgSrc: '/images/imageHome.png',
      title: 'Créer des leçons pour vos élèves',
      description: 'Créez et organisez facilement des leçons adaptées pour accompagner vos élèves dans leur apprentissage.',
      link: "/lessons/add",
    },
    {
      imgSrc: '/images/imageQuiz.png',
      title: 'Ajouter des Quiz interactifs',
      description: 'Évaluez les connaissances de vos élèves en créant des quiz interactifs et adaptés à leur niveau.',
      link: "/quizz/add",
    },
    {
      imgSrc: '/images/class.jpg',
      title: 'Lier vos élèves à vos activités',
      description: 'Ajoutez vos élèves à vos cours, quizz, devoirs et toutes autres activités possible sur Scool',
      link: "/",
    },
  ];

  // Changer de diapositive
  function changeSlide(direction) {
    setCurrentSlide((currentSlide + direction + slides.length) % slides.length);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      changeSlide(1); 
    }, 10000); // 10000ms = 10 secondes

    // Cleanup de l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
    // eslint-disable-next-line 
  }, [currentSlide]);

  return (
    <section className="carousel">
      <div
        className="carousel-track"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`, // Décalage basé sur la diapositive active
          transition: 'transform 0.5s ease-in-out', // Transition fluide
        }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide">
            <img src={slide.imgSrc} alt={slide.title} />
            <div className="carousel-text" onClick={() => (window.location.href = slide.link)}>
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-btn left" onClick={() => changeSlide(-1)}>
        &#10094;
      </button>
      <button className="carousel-btn right" onClick={() => changeSlide(1)}>
        &#10095;
      </button>
    </section>
  );
};

export default Carousel;
