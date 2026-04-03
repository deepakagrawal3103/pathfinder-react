import { Link } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  return (
    <nav className={`side-menu ${isOpen ? "active" : ""}`}>
      <Link to="/" className="menu-item" onClick={onClose}>
        Home
      </Link>

      <Link to="/dashboard" className="menu-item" onClick={onClose}>
        Dashboard
      </Link>

      <Link to="/courses" className="menu-item" onClick={onClose}>
        Courses
      </Link>

      <Link to="/institutions" className="menu-item" onClick={onClose}>
        Institutions
      </Link>

      <Link to="/resources" className="menu-item" onClick={onClose}>
        Free Resources
      </Link>
    </nav>
  );
}

export default Sidebar;
