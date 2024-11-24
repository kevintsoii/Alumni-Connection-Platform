import React from 'react';
import NavBar from './components/NavBar';
import ActivityWall from './components/ActivityWall';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <ActivityWall />
      </main>
    </div>
  );
}

export default App;

