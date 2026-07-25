import AboutShaykh from "./components/AboutShaykh/AboutShaykh";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import LatestArticles from "./components/LatestArticles/LatestArticles";
import LessonSchedule from "./components/LessonSchedule/LessonSchedule";
import OfficialChannels from "./components/OfficialChannels/OfficialChannels";

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
            <Footer />
        </main>
    </div>
  );
}

export default Home;