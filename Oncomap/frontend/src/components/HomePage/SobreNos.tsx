import '../../style/SobreNos.css';


const teamMembers = [
  { name: 'Felipe Henriques', role: 'Líder Técnico', img: 'https://placehold.co/150x150/0d4b55/FFF?text=FH' },
  { name: 'Arthur Sampaio', role: 'Arquiteto Backend', img: 'https://i.imgur.com/eBOUX2i.png' },
  { name: 'João Pedro', role: 'Desenvolvedor Backend', img: 'https://placehold.co/150x150/0d4b55/FFF?text=JP' },
  { name: 'Samara Albuquerque', role: 'Desenvolvedora Frontend', img: 'https://placehold.co/150x150/0d4b55/FFF?text=SA' },
  { name: 'Felipe Henriques', role: 'Líder Técnico', img: 'https://placehold.co/150x150/0d4b55/FFF?text=FH' },
  { name: 'Felipe Henriques', role: 'Líder Técnico', img: 'https://placehold.co/150x150/0d4b55/FFF?text=FH' },
];

const TeamMemberCard = ({ name, role, img }: { name: string, role: string, img: string }) => (
  <div className="team-card">
    <img src={img} alt={name} className="team-photo" />
    <h3 className="team-name">{name}</h3>
    <p className="team-role">{role}</p>
    <button className="contact-button">Contato</button>
  </div>
);

const Team = () => {
  return (
    <section id="equipe" className="container">
      <h2>Equipe</h2>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={index} {...member} />
        ))}
      </div>
    </section>
  );
};
export default Team;