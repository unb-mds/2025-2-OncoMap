import Navbar from '../components/HomePage/navbar';
import Hero from '../components/HomePage/hero'
import Footer from '../components/Geral/footer'; 
import '../style/HomePage.css'; 
import SobreProjeto from '../components/HomePage/SobreProjeto';
import Equipe from '../components/HomePage/Equipe'
import Fonte from '../components/HomePage/Fonte'

const HomePage = () => {
  return (
    <div className="homepage">
      <Navbar />
      <Hero />

      <main className="main-content-card">
        <SobreProjeto />
        <Fonte />
        <Equipe/>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;