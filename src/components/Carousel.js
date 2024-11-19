// src/components/Carousel.js
import React, { useState } from 'react';
import '../css/style.css'; // Import CSS
import '../css/Carousel.css';

const Carousel = () => {
  // useState init at 0 and setCurrentSlide to update the variable
  const [currentSlide, setCurrentSlide] = useState(0);

  // an array containing text+image
  const slides = [
    {
      imgSrc: '/images/imageHome.png',
      title: 'Créer des leçons pour vos élèves',
      description: 'Créez et organisez facilement des leçons adaptées pour accompagner vos élèves dans leur apprentissage.',
      link : "/lessons/add",
    },
    {
      imgSrc: '/images/imageQuiz.png',
      title: 'Ajouter des Quiz interactifs',
      description: 'Évaluez les connaissances de vos élèves en créant des quiz interactifs et adaptés à leur niveau.',
      link : "/quizz/add",
    },
  ];

  function changeSlide(direction) {
    setCurrentSlide((currentSlide + direction + slides.length) % slides.length); // + slides.length to manage negative indices
  }

  return (
    <section className="carousel">
      <div className="carousel-container">
        {slides.map((slide, index) => (
          <div key={index} className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}>
            <img src={slide.imgSrc} alt={slide.title} />
            <div className="carousel-text" onClick={() => window.location.href = slide.link}>
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-btn left" onClick={() => changeSlide(-1)}>&#10094;</button>
      <button className="carousel-btn right" onClick={() => changeSlide(1)}>&#10095;</button>
    </section>
  );
};

export default Carousel;
