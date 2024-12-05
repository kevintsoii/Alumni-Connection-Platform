import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import userIcon from "/users.svg";

function Connections() {
  const token = localStorage.getItem("token");
  const [connections, setConnections] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch("http://localhost:8000/connections/", {
          method: "GET",
          headers: { Authorization: `${token}` },
        });

        const data = await response.json();
        console.log("API Response:", data);

        setConnections(data.connections || []);
      } catch (error) {
        console.error("Error fetching connections:", error);
        setError(error.message);
      }
    };

    fetchConnections();
  }, [token]);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="container bg-white rounded-lg shadow-md p-6 space-y-6 max-w-4xl w-full">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl md:text-3xl font-bold pr-2 text-center">
            Your Connections
          </h1>
          <img
            src={userIcon}
            alt="User Icon"
            className="w-6 h-6 md:w-8 md:h-8"
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {connections.length === 0 ? (
          <div className="text-center">
            <p>You have no connections!</p>
            <p>
              Visit the{" "}
              <Link to="/alumni" className="text-blue-500 hover:underline">
                Alumni Wall
              </Link>{" "}
              to connect with alumni.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <ul className="flex flex-col space-y-4 w-1/2">
              {connections.map((connection) => (
                <Link
                  key={connection.userID}
                  className="bg-gray-100 shadow rounded p-4 text-center hover:bg-gray-200 duration-300 "
                  to={`/profile/${connection.userID}`}
                >
                  <div className="text-lg font-semibold">
                    {connection.first} {connection.last}
                  </div>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Connections;
