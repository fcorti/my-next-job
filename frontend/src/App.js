import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SkillsPage from './pages/SkillsPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import PipelinePage from './pages/PipelinePage';

function App() {
  return (
    <Router>
      <Box minH="100vh" bg="linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/pipeline" element={<PipelinePage />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
