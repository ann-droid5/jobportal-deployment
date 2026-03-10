import HomeCarousel from '../components/HomeCarousel'
import LogoStrip from '../components/LogoStrip';
import HomeJobSection from "../components/HomeJobSection";
import HomeCoursesSection from "../components/HomeCoursesSection";
import Footer from "../components/Footer";

import EmployerBanner from '../components/EmployerBanner';

function Home() {
  return (
    <div>
      <HomeCarousel />
      <LogoStrip />
      <HomeJobSection />
      <EmployerBanner />
      <HomeCoursesSection />
      <Footer />

    </div>
  )
}

export default Home
