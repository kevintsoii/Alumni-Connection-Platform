import React from 'react';
import logo from '../assets/spartan-logo.png';
import profilePic from '../assets/profile-pic.png';

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Spartan Outreach Logo" className="h-10 mr-4" />
        </div>
        <div className="flex space-x-4">
          <a href="#jobs" className="text-white font-bold">Jobs</a>
          <a href="#events" className="text-white font-bold">Events</a>
          <a href="#fundraisers" className="text-white font-bold">Fundraisers</a>
        </div>
        <div>
          <img src={profilePic} alt="Profile" className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

