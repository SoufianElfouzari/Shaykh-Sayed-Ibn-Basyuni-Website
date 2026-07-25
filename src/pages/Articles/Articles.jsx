import Footer from "../common/Footer/Footer";
import Header from "../common/Header/Header";
import ArticlesHero from "./components/ArticlesHero/ArticlesHero";

function Articles() {
  return (
    <div className="articles">
        <Header />

        <main>
          <ArticlesHero />
        </main>

        <Footer />
    </div>
  );
}

export default Articles;