import banner1 from '../assets/banner1.png'
import banner21 from '../assets/banner21.png'
import banner22 from '../assets/banner22.png'

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
            src={banner21}
            className="d-block w-100"
            alt="Slide 2"
          />
        </div>

        <div className="carousel-item">
          <img
            src={banner22}
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
