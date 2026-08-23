import { Link } from "react-router-dom";

import Header from "../common/Header/Header";
import Footer from "../common/Footer/Footer";

import "./NotFound.css";

function NotFound() {
  return (
    <>
      <Header />

      <main className="sib-not-found">
        <div className="sib-not-found-container">
          <p className="sib-not-found-code" aria-hidden="true">
            404
          </p>

          <p className="sib-not-found-label">
            Seite nicht gefunden
          </p>

          <h1 className="sib-not-found-title">
            Diese Seite ist nicht verfügbar.
          </h1>

          <p className="sib-not-found-description">
            Die aufgerufene Adresse ist möglicherweise nicht
            korrekt oder die gesuchte Seite wurde entfernt.
          </p>

          <div className="sib-not-found-actions">
            <Link
              to="/"
              className="sib-not-found-primary-link"
            >
              Zur Startseite
            </Link>

            <Link
              to="/durous"
              className="sib-not-found-secondary-link"
            >
              Durous ansehen
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default NotFound;