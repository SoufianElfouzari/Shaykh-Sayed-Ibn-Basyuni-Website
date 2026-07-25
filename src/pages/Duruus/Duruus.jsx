import Footer from "../common/Footer/Footer";
import Header from "../common/Header/Header";
import LessonSchedule from "../common/LessonSchedule/LessonSchedule";
import OfficialChannels from "../common/OfficialChannels/OfficialChannels";
import ArchiveIntroduction from "./ArchiveIntroduction/ArchiveIntroduction";
import DuruusHero from "./DuruusHero/DuruusHero";
import LatestRecordings from "./DuruusArchive/DuruusArchive";
import NoticesBanner from "./NoticesBanner/NoticesBanner";
import DuruusArchive from "./DuruusArchive/DuruusArchive";

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
        </main>

        <Footer />
    </div>
  );
}

export default Duruus;