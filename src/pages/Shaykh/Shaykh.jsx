import ContactForm from "../common/ContactForm/ContactForm";
import Footer from "../common/Footer/Footer";
import Header from "../common/Header/Header";
import LessonSchedule from "../common/LessonSchedule/LessonSchedule";
import OfficialChannels from "../common/OfficialChannels/OfficialChannels";
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