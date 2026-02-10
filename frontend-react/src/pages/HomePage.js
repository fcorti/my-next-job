import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-content">
          <h1>Welcome to My Next Job</h1>
          <p className="subtitle">Your journey to your next opportunity</p>

          <div className="process-explanation">
            <p>Follow these three steps in sequence to manage your career journey:</p>

            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Skills & Experience</h3>
                <p>Document and showcase your professional skills, qualifications, and work experience.</p>
                <Link to="/skills" className="step-link">Get Started</Link>
              </div>

              <div className="step-arrow">→</div>

              <div className="step">
                <div className="step-number">2</div>
                <h3>Find Opportunities</h3>
                <p>Search and discover job opportunities that align with your skills and career goals.</p>
                <Link to="/opportunities" className="step-link">Explore</Link>
              </div>

              <div className="step-arrow">→</div>

              <div className="step">
                <div className="step-number">3</div>
                <h3>Manage Pipeline</h3>
                <p>Track and manage your application pipeline. Keep notes on your progress with each opportunity.</p>
                <Link to="/pipeline" className="step-link">Manage</Link>
              </div>
            </div>
          </div>

          <div className="info-box">
            <h4>How it works</h4>
            <ul>
              <li><strong>Step 1:</strong> Build your professional profile with your skills and experience</li>
              <li><strong>Step 2:</strong> Discover job opportunities that match your profile</li>
              <li><strong>Step 3:</strong> Maintain and track your applications in one place</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
