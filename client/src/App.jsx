import React from 'react';
import NavBar from './components/NavBar';
import ActivityWall from './components/ActivityWall';
import Home from './pages/Home'
import Login from './pages/Login';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Home /> */}
      <Login />
    </div>
  );
}

export default App;

