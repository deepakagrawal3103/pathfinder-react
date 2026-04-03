import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    education: "",
    location: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userProfile", JSON.stringify(data.user));
      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtext">
          Start building your personalized career roadmap
        </p>

        {error && (
          <p className="auth-error">
            <span>⚠️</span> {error}
          </p>
        )}

        <form onSubmit={handleRegister}>
          <label>Full Name</label>
          <input
            name="name"
            placeholder="Adarsh Jaiswal"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Education</label>
          <input
            name="education"
            placeholder="B.Tech CSE"
            value={form.education}
            onChange={handleChange}
          />

          <label>Location</label>
          <input
            name="location"
            placeholder="India"
            value={form.location}
            onChange={handleChange}
          />

          <button 
            className={`cta-button full ${isLoading ? "loading" : ""}`} 
            disabled={isLoading}
          >
            {isLoading ? (
              <><span className="spinner"></span> Registering...</>
            ) : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
