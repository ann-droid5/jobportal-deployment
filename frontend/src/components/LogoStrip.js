import React from 'react';
import './LogoStrip.css';

const companies = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Coco Cola', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg' },
    { name: 'HCL', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/HCL_Technologies_logo.svg' },
    { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
    { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg' },
    { name: 'Wipro', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg' },
    { name: 'TCS', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Tata_Consultancy_Services_old_logo.svg' }
];

const LogoStrip = () => {
    return (
        <div className="logo-strip-container">
            <div className="container d-flex align-items-center h-100">
                <div className="stat-box">
                    <div className="stat-number">10K+</div>
                    <div className="stat-label">Openings daily</div>
                </div>

                <div className="separator"></div>

                <div className="marquee-wrapper">
                    <div className="marquee-content">
                        {/* Double the list for seamless scrolling */}
                        {[...companies, ...companies].map((company, index) => (
                            <div key={index} className="company-logo-item">
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="company-logo-img"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoStrip;
