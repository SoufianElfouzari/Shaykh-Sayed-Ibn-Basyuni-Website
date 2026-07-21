import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";

function Home() {
  return (
    <div className="home">
        <Header />

        <main>
            <Hero />
        </main>
    </div>
  );
}

export default Home;