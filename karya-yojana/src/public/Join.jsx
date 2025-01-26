import React from 'react';
import '../css/landingstyle.css';
function JoinUs() {
    return (
        <section className="Joinus" id="plans">
            <div className="image-container">
                <img
                    src="../assests/join.png"
                    alt="About-Us"
                    className="full-width-image"
                    loading="lazy"
                />
                <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=prazolkhadka67@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                <button className="on-image-button">
                        Send us a mail!
                </button>
                </a>
                <a href="#" className='top-link'>
                <div className="back-top">
                 <img src="../assests/top.svg"></img>
                 </div>
                 </a>
            </div>
        </section>
    );
}

export default JoinUs;
