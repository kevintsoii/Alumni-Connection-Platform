import React from 'react';
import profilePic from '../assets/profile-pic.png';

function UserProfile() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-24 bg-gray-300"></div>
      <div className="p-4">
        <img src={profilePic} alt="User" className="w-24 h-24 rounded-full border-4 border-white -mt-12 mb-4" />
        <h2 className="text-xl font-bold">John Doe</h2>
        <p className="text-gray-600">Student at San Jose State University</p>
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Profile views</span>
            <span className="font-medium">127</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-500">Post impressions</span>
            <span className="font-medium">1,024</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

