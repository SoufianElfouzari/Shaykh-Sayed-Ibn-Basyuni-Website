import Footer from "../common/Footer/Footer";
import Header from "../common/Header/Header";
import ArticlesHero from "./components/ArticlesHero/ArticlesHero";
import ArticlesOverview from "./components/ArticlesOverview/ArticlesOverview";

function Articles() {
  return (
    <div className="articles">
        <Header />

        <main>
          <ArticlesHero />
          <ArticlesOverview />
        </main>

        <Footer />
    </div>
  );
}

export default Articles;