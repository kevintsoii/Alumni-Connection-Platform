import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import ActivityWall from "./pages/ActivityWall";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import JobsPage from "./pages/Jobs";
import EventsPage from "./pages/Events";
import FundraisersPage from "./pages/Fundraisers";
import Profile from "./pages/Profile";
import AlumnisPage from "./pages/Alumnis";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts" element={<ActivityWall />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/fundraisers" element={<FundraisersPage />} />
            <Route path="/profile/:userID" element={<Profile />} />
            <Route path="/alumni" element={<AlumnisPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
