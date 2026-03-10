import React from 'react';
import banner22 from '../assets/banner22.png'
const Welcomecard = () => {
    return <div>
        <div className="card" style="width: 18rem;">
            <img src={banner22} className="card-img-top" alt="..." />

            <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
        </div>

    </div>;
}

Welcomecard.propTypes = propTypes;
Welcomecard.defaultProps = defaultProps;
// #endregion

export default Welcomecard;