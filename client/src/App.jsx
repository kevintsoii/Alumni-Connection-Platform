import React from 'react';
import NavBar from './components/NavBar';
import ActivityWall from './components/ActivityWall';
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <HomePage /> */}
      {/* <LoginPage /> */}
      <SignupPage />
    </div>
  );
}

export default App;

