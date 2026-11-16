import { Link } from "react-router-dom";
import ExploreContent from "../common/ExploreContent/ExploreContent";
import ContactForm from "../common/ContactForm/ContactForm";
import DuruusArchive from "../Duruus/components/DuruusArchive/DuruusArchive";
import AboutShaykh from "./components/AboutShaykh/AboutShaykh";
import Footer from "../common/Footer/Footer";
import Header from "../common/Header/Header";
import Hero from "./components/Hero/Hero";
import LatestArticles from "./components/LatestArticles/LatestArticles";
import LessonSchedule from "../common/LessonSchedule/LessonSchedule";
import "./HomeLanding.css";

function Home() {
  return (
    <div className="home">
      <Header />
      <main>
        <Hero />
        <DuruusArchive />
        <section className="sib-home-fatwa" aria-labelledby="sib-home-fatwa-title">
          <div>
            <p className="sib-home-fatwa-kicker">Islamische Fragen</p>
            <h2 id="sib-home-fatwa-title">Du hast eine Frage zum Islam?</h2>
            <p>Ob Fragen zum Gebet, Fasten, zur Glaubenslehre oder zu anderen Angelegenheiten: Reiche deine Frage über das Formular ein. Eine persönliche Antwort kann nicht garantiert werden.</p>
          </div>
          <Link to="/kontakt?anliegen=fatwa#kontaktformular">Fatwa anfragen <span aria-hidden="true">↗</span></Link>
        </section>
        <LatestArticles />
        <ExploreContent page="home" />
        <AboutShaykh />
        <LessonSchedule />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
