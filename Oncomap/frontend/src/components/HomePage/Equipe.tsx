import { FaGithub } from 'react-icons/fa';
import '../../style/Equipe.css';


const teamMembers = [
  { 
    name: 'Felype Carrijo', 
    role: 'Desenvolvedor', 
    img: 'https://avatars.githubusercontent.com/u/168106790?v=4', 
    githubUrl: 'https://github.com/Flyxs' 
  },
  { 
    name: 'Artur Galdino', 
    role: 'Desenvolvedor', 
    img: 'https://avatars.githubusercontent.com/u/187340217?v=4', 
    githubUrl: 'https://github.com/ArturFGaldino' 
  },
  { 
    name: 'João Pedro', 
    role: 'Desenvolvedor', 
    img: 'https://avatars.githubusercontent.com/u/178330046?v=4', 
    githubUrl: 'https://github.com/joaoPedro-201' 
  },
  { 
    name: 'Gabriel Alexandroni', 
    role: 'Desenvolvedor', 
    img: 'https://avatars.githubusercontent.com/u/170197026?v=4', 
    githubUrl: 'https://github.com/Alexandroni07' 
  },
  { 
    name: 'Luiz Henrique', 
    role: 'Desenvolvedor', 
    img: 'https://avatars.githubusercontent.com/u/212640680?v=4',
    githubUrl: 'https://github.com/Luizz97' 
  },
  { 
    name: 'Giovani Coelho', 
    role: 'Desenvolvedor', 
    img: 'https://avatars.githubusercontent.com/u/176083022?v=4',
    githubUrl: 'https://github.com/Gotc2607' 
  },
];


const CardsEquipe = ({ name, role, img, githubUrl }: typeof teamMembers[0]) => (
  <div className="team-card">
    <div className="team-image-container">
      <img src={img} alt={`Foto de ${name}`} />
    </div>
    <div className="team-info">
      <h3 className="team-name">{name}</h3>
      <p className="team-role">{role}</p>
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="github-button">
        <FaGithub style={{ marginRight: '5px' }} />
        GitHub
      </a>
    </div>
  </div>
);


const Equipe = () => {
  return (
    <section id="quem-somos" className="container">
      <h2 className="team-section-title">Equipe</h2>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <CardsEquipe key={index} {...member} />
        ))}
      </div>
    </section>
  );
};

export default Equipe;