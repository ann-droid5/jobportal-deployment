import banner1 from '../assets/banner1.png'
import banner2 from '../assets/banner2.png'
import banner3 from '../assets/banner3.png'

function HomeCarousel() {
  return (
    <div
      id="homeCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">

        <div className="carousel-item active">
          <img
            src={banner1}
            className="d-block w-100"
            alt="Slide 1"
          />
        </div>

        <div className="carousel-item">
          <img
            src={banner2}
            className="d-block w-100"
            alt="Slide 2"
          />
        </div>

        <div className="carousel-item">
          <img
            src={banner3}
            className="d-block w-100"
            alt="Slide 3"
          />
        </div>

      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#homeCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#homeCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  )
}

export default HomeCarousel
