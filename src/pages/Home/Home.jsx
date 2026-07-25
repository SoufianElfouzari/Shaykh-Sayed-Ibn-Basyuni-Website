import AboutShaykh from "./components/AboutShaykh/AboutShaykh";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import LatestArticles from "./components/LatestArticles/LatestArticles";

function Home() {
  return (
    <div className="home">
        <Header />

        <main>
            <Hero />
            <AboutShaykh />
            <LatestArticles />
        </main>
    </div>
  );
}

export default Home;