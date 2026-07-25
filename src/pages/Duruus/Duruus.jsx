import Footer from "../common/Footer/Footer";
import Header from "../common/Header/Header";
import LessonSchedule from "../common/LessonSchedule/LessonSchedule";
import OfficialChannels from "../common/OfficialChannels/OfficialChannels";
import ArchiveIntroduction from "./components/ArchiveIntroduction/ArchiveIntroduction";
import DuruusHero from "./components/DuruusHero/DuruusHero";
import LatestRecordings from "./components/DuruusArchive/DuruusArchive";
import NoticesBanner from "./components/NoticesBanner/NoticesBanner";
import DuruusArchive from "./components/DuruusArchive/DuruusArchive";
import ContactForm from "../common/ContactForm/ContactForm";

function Duruus() {
  return (
    <div className="duruus">
        <Header />

        <main>
            <DuruusHero />
            <NoticesBanner />
            <LessonSchedule />
            <ArchiveIntroduction />
            <DuruusArchive />
            <OfficialChannels />
            <ContactForm />
        </main>

        <Footer />
    </div>
  );
}

export default Duruus;