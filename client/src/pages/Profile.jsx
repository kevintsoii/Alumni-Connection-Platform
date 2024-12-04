import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Profile() {
  const { userID } = useParams();

  const token = localStorage.getItem("token");

  const [profileData, setProfileData] = useState({});
  const name = profileData?.first + " " + profileData?.last;
  const [connectionStatus, setConnectionStatus] = useState("");

  useEffect(() => {
    const fetchProtectedData = async () => {
      console.log(userID);
      try {
        const response = await fetch(`http://localhost:8000/users/${userID}`, {
          method: "GET",
          headers: { Authorization: `${token}` },
        });
        const data = await response.json();
        console.log("Protected data:", data);
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching protected data:", error);
      }
    };
    fetchProtectedData();
  }, []);

  useEffect(() => {
    const getConnectionStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/connections/${userID}/`,
          {
            method: "GET",
            headers: { Authorization: `${token}` },
          }
        );
        const data = await response.json();
        setConnectionStatus(data.status);

        console.log("Connection data:", data);
      } catch (error) {
        console.error("Error connecting with user:", error);
      }
    };
    getConnectionStatus();
  }, []);

  const connectWith = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/connections/${userID}/`,
        {
          method: "POST",
          headers: { Authorization: `${token}` },
          body: JSON.stringify("sent"),
        }
      );
      const data = await response.json();
      console.log("Connection data:", data);

      if (data.error) {
        setConnectionStatus(data.error);
      }

      window.location.reload();
    } catch (error) {
      console.error("Error connecting with user:", error);
    }
  };

  function renderConnectButton() {
    if (connectionStatus === "not connected") {
      return (
        <button
          className="flex items-center justify-center w-28 h-8 rounded-2xl space-x-2 
         bg-primary text-white font-bold  hover:bg-blue-800"
          onClick={connectWith}
        >
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-user-round-plus"
            >
              <path d="M2 21a8 8 0 0 1 13.292-6" />
              <circle cx="10" cy="8" r="5" />
              <path d="M19 16v6" />
              <path d="M22 19h-6" />
            </svg>
            <span>Connect</span>
          </>
        </button>
      );
    }
    if (connectionStatus === "sent") {
      return (
        <button
          className="flex items-center justify-center w-28 h-8 rounded-2xl space-x-2
    
           bg-whitesmoke border-2 border-primary text-primary font-bold hover:bg-gray-200"
        >
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-clock"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Pending</span>
          </>
        </button>
      );
    }
    if (connectionStatus === "received") {
      return (
        <button
          className="flex items-center justify-center w-40 h-8 rounded-2xl space-x-2 
       bg-primary text-white font-bold  hover:bg-blue-800"
          onClick={connectWith}
        >
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-user-round-check"
            >
              <path d="M2 21a8 8 0 0 1 13.292-6" />
              <circle cx="10" cy="8" r="5" />
              <path d="m16 19 2 2 4-4" />
            </svg>
            <span>Connect Back </span>
          </>
        </button>
      );
    }

    if (connectionStatus === "connected") {
      return (
        <button
          className="flex items-center justify-center w-36 h-8 rounded-2xl space-x-2
  
         bg-whitesmoke border-2 border-primary text-primary font-bold hover:bg-gray-200"
        >
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-users"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Connected</span>
          </>
        </button>
      );
    }
  }

  return (
    <div>
      <div className="rounded-lg max-w-3xl bg-white"></div>
      <div className="relative rounded-lg max-w-7xl mx-auto grid p-16 gap-16 bg-white">
        <div className="absolute inset-0 z-0 w-full h-40 rounded-t-lg bg-gradient-to-r from-[#2D2790] via-[#090979] to-[#00B6DB]"></div>

        <div className="relative z-10 top-8 rounded-full border-white border-4 bg-gray-200 w-32 h-32">
          <img
            src="/profilepic.png"
            alt="Profile"
            className="w-full h-full rounded-full object-fit"
          />
        </div>

        <div>
          <p className="font-extrabold text-3xl tracking-tighter">{name}</p>

          <p className="text-lg font-semibold">{profileData?.company}</p>
          <p className="text-sm text-gray-400">{`${profileData?.degree} ${profileData?.major} • Graduated ${profileData?.gradMonth}-${profileData?.gradYear}`}</p>
        </div>

        {/* render connect button */}
        {renderConnectButton()}
      </div>
    </div>
  );
}

export default Profile;
