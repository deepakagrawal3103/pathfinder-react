import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Discover Your Path.<br />
            Unlock Your Future.
          </h1>

          <button
            className="cta-button"
            onClick={() => navigate("/career-quiz")}
          >
            Take Career Quiz
          </button>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-us-section">
        <div className="about-us-content">
          <h2>About Us</h2>
          <h3 className="highlight">Your AI-Powered Career Roadmap</h3>

          <p>
            We are an AI-powered career guidance system designed to help students
            identify the right career paths based on personality, interests, and
            academic preferences.
          </p>

          <p>
            Our platform bridges the gap between students and institutions by
            providing clear guidance on careers, courses, and skill requirements.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;
