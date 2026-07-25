import ContactForm from "../common/ContactForm/ContactForm";
import Footer from "../common/Footer/Footer";
import Header from "../common/Header/Header";

function Contact() {
  return (
    <div className="contact">
        <Header />

        <main>
           <ContactForm /> 
        </main>

        <Footer />
    </div>
  );
}

export default Contact;