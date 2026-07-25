import AboutShaykh from "./components/AboutShaykh/AboutShaykh";
import Footer from "../common/Footer/Footer";
import Header from "../common/Header/Header";
import Hero from "./components/Hero/Hero";
import LatestArticles from "./components/LatestArticles/LatestArticles";
import LessonSchedule from "../common/LessonSchedule/LessonSchedule";
import OfficialChannels from "../common/OfficialChannels/OfficialChannels";

function Home() {
  return (
    <div className="home">
        <Header />

        <main>
            <Hero />
            <AboutShaykh />
            <LatestArticles />
            <OfficialChannels />
            <LessonSchedule />
        </main>

        <Footer />
    </div>
  );
}

export default Home;