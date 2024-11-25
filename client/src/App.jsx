import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import ActivityWall from "./components/ActivityWall";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
