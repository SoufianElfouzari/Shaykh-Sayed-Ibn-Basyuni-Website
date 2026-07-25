import AboutShaykh from "./components/AboutShaykh/AboutShaykh";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import LatestArticles from "./components/LatestArticles/LatestArticles";
import LessonSchedule from "./components/LessonSchedule/LessonSchedule";

function Home() {
  return (
    <div className="home">
        <Header />

        <main>
            <Hero />
            <AboutShaykh />
            <LatestArticles />
            <LessonSchedule />
        </main>
    </div>
  );
}

export default Home;