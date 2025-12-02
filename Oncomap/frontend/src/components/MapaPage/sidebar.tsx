import { NavLink } from 'react-router-dom';
import '../../style/Sidebar.css'; 

const HomeButton = () => {
  return (
    
    <NavLink to="/" className="home-button-link" aria-label="Ir para a página inicial">
      <span className="home-icon">⌂</span> 
    </NavLink>
  );
};

export default HomeButton;