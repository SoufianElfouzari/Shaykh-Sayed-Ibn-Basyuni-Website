import ContactForm from "../common/ContactForm/ContactForm";
import Footer from "../common/Footer/Footer";
import Header from "../common/Header/Header";
import OfficialChannels from "../common/OfficialChannels/OfficialChannels";
import ArticlesHero from "./components/ArticlesHero/ArticlesHero";
import ArticlesOverview from "./components/ArticlesOverview/ArticlesOverview";

function Articles() {
  return (
    <div className="articles">
        <Header />

        <main>
          <ArticlesHero />
          <ArticlesOverview />
          <OfficialChannels />
          <ContactForm />
        </main>

        <Footer />
    </div>
  );
}

export default Articles;