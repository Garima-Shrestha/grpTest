import React, { Suspense, useEffect, useState } from 'react';
import '../css/landingstyle.css';

// Lazy load About and Plans components
const About = React.lazy(() => import('./About.jsx'));
const JoinUs = React.lazy(() => import('./Join.jsx'));

const images = [
    '/assests/work!.png',
    '/assests/find.png',
    '/assests/search.png',
];

function LandingBody() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visibleElements, setVisibleElements] = useState({
        heading: false,
        span: false,
        paragraph: false,
        slideshow: false,
        downscrolllink:false,
    });
    const [showAboutSection, setShowAboutSection] = useState(false);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        const headerHeight = document.querySelector('.head')?.offsetHeight || 70; // Get header height dynamically
        const offset = headerHeight + 20; // Add 20px extra offset
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - offset, // Scroll to position minus offset
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        }, 7000);
        return () => clearInterval(slideInterval);
    }, []);

    useEffect(() => {
        const timers = [];
        timers.push(setTimeout(() => setVisibleElements((prev) => ({ ...prev, heading: true })), 500));
        timers.push(setTimeout(() => setVisibleElements((prev) => ({ ...prev, span: true })), 650));
        timers.push(setTimeout(() => setVisibleElements((prev) => ({ ...prev, paragraph: true })), 750));
        timers.push(setTimeout(() => setVisibleElements((prev) => ({ ...prev, slideshow: true })), 860));
        timers.push(setTimeout(() => setVisibleElements((prev) => ({ ...prev, downscrolllink: true })), 880));

        // Delay showing the About Section
        timers.push(setTimeout(() => setShowAboutSection(true), 2000)); // Adjust the delay here (e.g., 2000ms)

        return () => timers.forEach(timer => clearTimeout(timer));
    }, []);
    return (
        <section className="Landing-body">
            <div className='Supreme'>
                <div className='main' id="main">
                    <section className="content-1">
                        <div className="content-1-left">
                            <h1 className={visibleElements.heading ? 'fade-in' : 'hidden'}>
                                KaryaYojana<span id="com">.com</span>
                            </h1>
                            <span id="spanSoch" className={visibleElements.span ? 'fade-in' : 'hidden'}>
                                साेच. <span id="apply">प्रयास</span>. परिवर्तन.
                            </span>
                            <p className={visibleElements.paragraph ? 'fade-in' : 'hidden'}>
                                Opportunities don’t just happen.
                                With the right guidance,
                                <br />
                                <span id="quote">you’re one step closer to the career </span>
                                 you’ve always wanted.
                            </p>
                            <a href="#" onClick={() => scrollToSection('about')} className={visibleElements.downscrolllink ? 'fade-in' : 'hidden'}>
                                <div className="downn">
                                    <img 
                                        src="/assests/down.svg" 
                                        alt="Bouncing SVG" 
                                        className="bouncing-svg"
                                    />
                                    <span>Scroll Down!</span>
                                </div>
                            </a>
                        </div>
                    </section>

                    <section className="content-2">
                        <div className="content-2-right">
                            {visibleElements.slideshow && (
                                <div className="slideshow fade-in-slow">
                                    {images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Slide ${index + 1}`}
                                            className={`${index === currentSlide ? 'active' : 'inactive'}`}
                                            loading="lazy"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* About Section - Conditionally Rendered with Lazy Loading */}
                {showAboutSection && (
                    <Suspense fallback={<div>Loading About...</div>}>
                        <About />
                    </Suspense>
                )}

               
                {showAboutSection && (
                    <Suspense fallback={<div>Loading Plans...</div>}>
                        <JoinUs />
                    </Suspense>
                )}
            </div>
        </section>
    );
}

export default LandingBody;
