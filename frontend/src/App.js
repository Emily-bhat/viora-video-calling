import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import Meeting from "./pages/meeting";
import Dashboard from './pages/dashboard';
import Guest from "./pages/guest";

function App() {
  return (
    

    <Router>

        <Routes>

            <Route path='/' element={<LandingPage />} />
            <Route path='/auth' element={<Authentication />} />
            <Route path="/meeting/:meetingCode" element={<Meeting />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/guest" element={<Guest />} />
        </Routes>

    </Router>
    
  );
}

export default App;
