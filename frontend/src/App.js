import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SkillsPage from './pages/skills/SkillsPage';
import AddJobRolePage from './pages/skills/AddJobRolePage';
import ModifyJobRolePage from './pages/skills/ModifyJobRolePage';
import OpportunitiesPage from './pages/opportunities/OpportunitiesPage';
import AddOpportunityPage from './pages/opportunities/AddOpportunityPage';
import WatchlistPage from './pages/opportunities/WatchlistPage';
import AddCareerPagePage from './pages/opportunities/AddCareerPagePage';
import ModifyCareerPagePage from './pages/opportunities/ModifyCareerPagePage';
import PipelinePage from './pages/pipeline/PipelinePage';
import SearchSessionsPage from './pages/opportunities/SearchSessionsPage';

function App() {
  return (
    <Router>
      <Box minH="100vh" bg="linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/skills/new" element={<AddJobRolePage />} />
          <Route path="/skills/:roleId/modify" element={<ModifyJobRolePage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/opportunities/new" element={<AddOpportunityPage />} />
          <Route path="/opportunities/watchlist" element={<WatchlistPage />} />
          <Route path="/opportunities/watchlist/add" element={<AddCareerPagePage />} />
          <Route path="/opportunities/watchlist/modify/:url" element={<ModifyCareerPagePage />} />
          <Route path="/opportunities/search-sessions" element={<SearchSessionsPage />} />
          <Route path="/pipeline" element={<PipelinePage />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
