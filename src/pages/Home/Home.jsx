import AboutShaykh from "./components/AboutShaykh/AboutShaykh";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";

function Home() {
  return (
    <div className="home">
        <Header />

        <main>
            <Hero />
            <AboutShaykh />
        </main>
    </div>
  );
}

export default Home;