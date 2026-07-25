import Footer from "../Home/common/Footer/Footer";
import Header from "../Home/common/Header/Header";
import LessonSchedule from "../Home/common/LessonSchedule/LessonSchedule";
import OfficialChannels from "../Home/common/OfficialChannels/OfficialChannels";
import DuruusHero from "./DuruusHero/DuruusHero";
import NoticesBanner from "./NoticesBanner/NoticesBanner";

function Duruus() {
  return (
    <div className="duruus">
        <Header />

        <main>
            <DuruusHero />
            <NoticesBanner />
            <LessonSchedule />
            <OfficialChannels />
        </main>

        <Footer />
    </div>
  );
}

export default Duruus;