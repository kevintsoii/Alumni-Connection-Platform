import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AlumniWall() {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("permission_level");

  const [error, setError] = useState("");
  const [wallError, setWallError] = useState("");

  const [alumni, setAlumni] = useState([]);

  const [searchQuery, setSearchQuery] = useState({
    gradYear: "",
    major: "",
    company: "",
    industry: "",
  });

  const [newAlumni, setNewAlumni] = useState({
    company: "",
    industry: "",
    contacts: "",
  });

  const fetchAlumni = async () => {
    try {
      const queryParams = new URLSearchParams();

      if (searchQuery.gradYear)
        queryParams.append("gradYear", searchQuery.gradYear);
      if (searchQuery.major) queryParams.append("major", searchQuery.major);
      if (searchQuery.company)
        queryParams.append("company", searchQuery.company);
      if (searchQuery.industry)
        queryParams.append("industry", searchQuery.industry);

      const url = `http://localhost:8000/alumni/?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `${token}` },
      });

      const data = await response.json();

      console.log(data);
      if (data.error) {
        setWallError(data.error);
        if (data.error == "Invalid token") {
          setWallError("You must be logged in.");
        }
      } else {
        setAlumni(data.alumni);
      }
    } catch (error) {
      console.error("Error fetching protected data:", error);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleAddAlumni = async () => {
    if (newAlumni.company.trim() == "" || newAlumni.industry.trim() == "") {
      setError("All fields must be filled out!");
      return;
    }

    try {
      const contactsArray = newAlumni.contacts
        .split(",")
        .map((contact) => contact.trim());

      const newEntry = {
        company: newAlumni.company,
        industry: newAlumni.industry,
        contacts: contactsArray,
      };

      const response = await fetch("http://localhost:8000/alumni/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(newEntry),
      });

      const data = await response.json();

      if (data.message) {
        window.location.reload();
      } else if (data.error) {
        setError("You have already been added to the Alumni Wall!");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  function renderNewAlumniForm() {
    if (userType === "staff" || userType === "alumni") {
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Company"
              value={newAlumni.company}
              onChange={(e) =>
                setNewAlumni({ ...newAlumni, company: e.target.value })
              }
              className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Industry"
              value={newAlumni.industry}
              onChange={(e) =>
                setNewAlumni({ ...newAlumni, industry: e.target.value })
              }
              className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Contacts (csv)"
              value={newAlumni.contacts}
              onChange={(e) =>
                setNewAlumni({ ...newAlumni, contacts: e.target.value })
              }
              className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleAddAlumni}
              className=" bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600"
            >
              Add Yourself
            </button>
          </div>

          {error && <p className="text-red-500 text-center my-4">{error}</p>}
          <hr className="border-1 p-2"></hr>
        </>
      );
    }
  }

  return (
    <div className="space-y-4 ">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Alumni Wall</h1>

        {renderNewAlumniForm()}

        <div className="bg-[#fbfbf9] rounded-lg shadow-md p-4">
          <input
            type="text"
            placeholder="Search by Grad Year"
            value={searchQuery.gradYear}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, gradYear: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchAlumni();
              }
            }}
            className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <input
            type="text"
            placeholder="Search by Major"
            value={searchQuery.major}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, major: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchAlumni();
              }
            }}
            className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <input
            type="text"
            placeholder="Search by Company"
            value={searchQuery.company}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, company: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchAlumni();
              }
            }}
            className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <input
            type="text"
            placeholder="Search by Industry"
            value={searchQuery.industry}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, industry: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchAlumni();
              }
            }}
            className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            className="my-3 py-1 px-2 bg-blue-300 rounded-xl"
            onClick={() => {
              fetchAlumni();
            }}
          >
            Search
          </button>
        </div>

        <hr className="border-1 p-2 text-black mt-8"></hr>

        {wallError && (
          <p className="text-red-500 text-center my-4">{wallError}</p>
        )}

        {alumni.map((alum) => (
          <div
            key={alum.userID}
            className="bg-[#fbfbf9] rounded-lg shadow-md p-4 mt-4 hover:shadow-xl hover:scale-[101%] transition duration-500 "
          >
            <Link to={`/profile/${alum.userID}`}>
              <h3 className="font-semibold text-xl hover:underline">
                {alum.first} {alum.last}
              </h3>
            </Link>
            <p className="text-gray-500">Graduation Year: {alum.gradYear}</p>
            {alum.major && <p className="text-gray-500">Major: {alum.major}</p>}
            <p className="text-gray-500">Company: {alum.company}</p>
            <p className="text-gray-500">Industry: {alum.industry}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlumniWall;
