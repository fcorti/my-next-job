import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SkillsPage from './pages/SkillsPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import PipelinePage from './pages/PipelinePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/pipeline" element={<PipelinePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
