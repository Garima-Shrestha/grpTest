import React from 'react';
import '../css/landingstyle.css';

function About(){
       const brands = [
            { logo: "../assests/brand1.png"},
            { logo: "../assests/brand2.png" },
            { logo: "../assests/brand3.png" },
            { logo: "../assests/brand4.png" },
            { logo: "../assests/brand5.png" },
            { logo: "../assests/brand6.png" },
            { logo: "../assests/brand7.png" },
            { logo: "../assests/brand8.png" },
            { logo: "../assests/brand9.png" },
            { logo: "../assests/brand10.png" },
            { logo: "../assests/brand11.png" },
            { logo: "../assests/brand12.png" },
            { logo: "../assests/brand13.png" },
            { logo: "../assests/brand14.png" },
            { logo: "../assests/brand15.png" },
            { logo: "../assests/brand16.png" },
            { logo: "../assests/brand17.png" },

          ];
    return(
        <section>
                        <section className='double'  id="about">
                        <section className="About" >
                            <div className='about-left'>
                                <h1 className='fade-in'>Who Are We?</h1>
                                <span className='fade-in'>
                                    At KaryaYojana, we bridge the gap between talented job seekers and their dream opportunities.
                                    As a dynamic job portal, we are committed to empowering individuals by connecting them with top 
                                    employers across various industries. Our platform is designed to make job searching 
                                    <span id="spanhighlight"> effortless,
                                    efficient, and impactful,</span> ensuring that every candidate finds a role where they can thrive.
                                    Driven by innovation and a passion for progress, KaryaYojana also supports businesses in 
                                    discovering the right talent to fuel their success. We believe in building meaningful 
                                    connections that transform careers and organizations alike.
                                    Join us on a journey to unlock potential and create opportunities, one job at a time.
                                </span>
                            </div>
                            <div className='ImageSec'>
                                <div className="about-right ">
                                    <div className="aboutimage">
                                        <img
                                            src="../assests/about.png"
                                            alt="About-Us"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                            <section className='ScrollView' id="#collab">
                                <div className="Collab" >
                                    <h1 className='Collabh1'>Our Partners</h1>
                                    <p>साझेदारी र समजदारी</p>
                                </div>
                            <div className="horizontal-scroll-container">
                             <div className="horizontal-scroll">
                                  {brands.map((brand, index) => (
                                     <div className="brand-item" key={index}>
                        <img src={brand.logo} alt={brand.name} loading="lazy" />
                        <p>{brand.name}</p>
                    </div>
                    ))}
                </div>
                </div>
                            </section>
                        </section>
                    </section>
    );
}
export default About;