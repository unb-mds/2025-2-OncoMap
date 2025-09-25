import '../style/HomePage.css';
import Navbar from '../components/HomePage/navbar';

const HomePage= () => {
    return (
        <div>
            <Navbar />
            <section id="inicio">
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At corrupti exercitationem commodi ex! Rem harum error voluptatibus porro soluta quisquam itaque atque hic esse! Dicta assumenda distinctio iste laborum eos.</p>
            </section>
            <section id="sobre">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi aut praesentium veritatis tempore dignissimos! Voluptatem blanditiis nostrum dignissimos ab esse ratione minima voluptate minus tenetur facilis! Fuga nisi fugit eius?</p>
            </section>
            <section id="quem-somos">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi aut praesentium veritatis tempore dignissimos! Voluptatem blanditiis nostrum dignissimos ab esse ratione minima voluptate minus tenetur facilis! Fuga nisi fugit eius?</p>
            </section>
        </div>
    )
}

export default HomePage