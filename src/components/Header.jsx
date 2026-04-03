import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";


function Header({ onMenuClick }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="menu-icon" onClick={onMenuClick}>
          ☰
        </div>
        <div className="logo">PathFinder</div>
      </div>

      <div className="header-right">
        <div className="header-actions">
  <ThemeToggle />
</div>

        <Link to="/login" className="nav-link">
          Login
        </Link>
        <Link to="/register" className="nav-link register-btn">
          Register
        </Link>
      </div>
    </header>
  );
}

export default Header;
