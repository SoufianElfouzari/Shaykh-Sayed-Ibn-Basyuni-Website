import ContactForm from "../Home/common/ContactForm/ContactForm";
import Footer from "../Home/common/Footer/Footer";
import Header from "../Home/common/Header/Header";
import LessonSchedule from "../Home/common/LessonSchedule/LessonSchedule";
import OfficialChannels from "../Home/common/OfficialChannels/OfficialChannels";
import ShaykhHero from "./components/ShaykhHero/ShaykhHero";
import ShortBiography from "./components/ShortBiography/ShortBiography";

function Shaykh() {
  return (
    <div className="shaykh">
        <Header />

        <main>
            <ShaykhHero />
            <ShortBiography />
            <LessonSchedule />
            <OfficialChannels />
            <ContactForm />
        </main>

        <Footer />
    </div>
  );
}

export default Shaykh;