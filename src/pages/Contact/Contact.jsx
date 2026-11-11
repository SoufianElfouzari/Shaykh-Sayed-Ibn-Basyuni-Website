import ExploreContent from "../common/ExploreContent/ExploreContent";
import ContactForm from "../common/ContactForm/ContactForm";
import Footer from "../common/Footer/Footer";
import Header from "../common/Header/Header";

function Contact() {
  return (
    <div className="contact">
        <Header />

        <main>
           <ExploreContent page="contact" />
          <ContactForm headingLevel={1} /> 
        </main>

        <Footer />
    </div>
  );
}

export default Contact;