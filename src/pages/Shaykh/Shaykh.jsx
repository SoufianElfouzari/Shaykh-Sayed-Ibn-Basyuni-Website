import Footer from "../Home/components/Footer/Footer";
import Header from "../Home/components/Header/Header";
import ShaykhHero from "./components/ShaykhHero/ShaykhHero";

function Shaykh() {
  return (
    <div className="shaykh">
        <Header />

        <main>
            <ShaykhHero />
        </main>

        <Footer />
    </div>
  );
}

export default Shaykh;