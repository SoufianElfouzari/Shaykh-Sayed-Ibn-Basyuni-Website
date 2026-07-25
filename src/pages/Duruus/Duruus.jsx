import Footer from "../Home/common/Footer/Footer";
import Header from "../Home/common/Header/Header";
import LessonSchedule from "../Home/common/LessonSchedule/LessonSchedule";
import DuruusHero from "./DuruusHero/DuruusHero";

function Duruus() {
  return (
    <div className="duruus">
        <Header />

        <main>
            <DuruusHero />
            <LessonSchedule />
        </main>

        <Footer />
    </div>
  );
}

export default Duruus;