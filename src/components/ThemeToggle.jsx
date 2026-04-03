import { useEffect, useState } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: "0.4rem 0.8rem",
        borderRadius: "6px",
        border: "1px solid var(--border-color)",
        background: "var(--card-bg)",
        color: "var(--text-color)",
        cursor: "pointer"
      }}
    >
      {theme === "light" ? "🌙 Dark" : "🌞 Light"}
    </button>
  );
}

export default ThemeToggle;
