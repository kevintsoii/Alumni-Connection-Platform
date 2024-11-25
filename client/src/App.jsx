import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import ActivityWall from "./components/ActivityWall";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/posts" element={<ActivityWall />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
