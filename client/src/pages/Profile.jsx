import React from "react";

function Profile() {
  return (
    <div className=" ">
      <div className="rounded-lg max-w-3xl bg-white"></div>
      <div className="relative rounded-lg max-w-7xl mx-auto grid p-16 gap-16 bg-white ">
        <div className="absolute inset-0 z-0 w-full h-40 rounded-t-lg bg-gray-300"></div>

        <div className="relative z-10 top-8 rounded-full border-white border-4 bg-gray-200 w-32 h-32">
          <img
            src="/profilepic.png"
            alt="Profile"
            className="w-full h-full rounded-full object-fit"
          />
        </div>

        <div>
          <p className="font-extrabold text-3xl tracking-tighter"> Name</p>
          <p className="text-lg">Bio</p>
          <p className="text-sm text-gray-400">Location</p>
        </div>

        <button className="w-24 h-8 rounded-2xl bg-blue-500">Connect</button>
      </div>
    </div>
  );
}

export default Profile;
