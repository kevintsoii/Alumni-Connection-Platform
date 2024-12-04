import React, { useState, useEffect } from "react";

function AlumniWall() {
  const userType = localStorage.getItem("permission_level");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await fetch("http://localhost:8000/alumni/", {
          method: "GET",
          headers: { Authorization: `${token}` },
        });
        const data = await response.json();
        console.log("Protected data:", data);

        setAlumni(data.alumni);
      } catch (error) {
        console.error("Error fetching protected data:", error);
      }
    };
    fetchProtectedData();
  }, []);

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
    contacts: [],
  });

  const handleAddAlumni = async () => {
    if (
      newAlumni.firstName.trim() !== "" &&
      newAlumni.lastName.trim() !== "" &&
      newAlumni.gradYear.trim() !== "" &&
      newAlumni.major.trim() !== "" &&
      newAlumni.company.trim() !== "" &&
      newAlumni.industry.trim() !== ""
    ) {
      try {
        // Prepare the data to be sent to the server
        const newEntry = {
          company: newAlumni.company,
          industry: newAlumni.industry,
          contacts: newAlumni.contacts,
        };

        // Send the POST request to your API
        const response = await fetch("http://localhost:8000/alumni/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`, // Include the token if required by the API
          },
          body: JSON.stringify(newEntry), // Convert the object to JSON
        });

        // Handle the response
        if (response.ok) {
          const addedAlumni = await response.json(); // Parse the returned data
          console.log("Alumni successfully added:", addedAlumni);

          // Update the local alumni list with the new entry
          setAlumni([addedAlumni, ...alumni]);

          // Clear the form
          setNewAlumni({
            company: "",
            industry: "",
            contacts: [],
          });
        } else {
          console.error("Failed to add alumni:", response.statusText);
        }
      } catch (error) {
        console.error("Error while adding alumni:", error);
      }
    } else {
      console.error("All fields must be filled out!");
    }
  };

  const filteredAlumni = alumni.filter(
    (alum) =>
      (searchQuery.gradYear === "" ||
        alum.gradYear === parseInt(searchQuery.gradYear)) &&
      (searchQuery.major === "" ||
        alum.major.toLowerCase().includes(searchQuery.major.toLowerCase())) &&
      (searchQuery.company === "" ||
        alum.company
          .toLowerCase()
          .includes(searchQuery.company.toLowerCase())) &&
      (searchQuery.industry === "" ||
        alum.industry
          .toLowerCase()
          .includes(searchQuery.industry.toLowerCase()))
  );

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
              placeholder="Contacts"
              value={newAlumni.contacts}
              onChange={(e) =>
                setNewAlumni({ ...newAlumni, industry: e.target.value })
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
            className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <input
            type="text"
            placeholder="Search by Major"
            value={searchQuery.major}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, major: e.target.value })
            }
            className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <input
            type="text"
            placeholder="Search by Company"
            value={searchQuery.company}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, company: e.target.value })
            }
            className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <input
            type="text"
            placeholder="Search by Industry"
            value={searchQuery.industry}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, industry: e.target.value })
            }
            className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {filteredAlumni.map((alum) => (
          <div
            key={alum.id}
            className="bg-[#fbfbf9] rounded-lg shadow-md p-4 mt-4"
          >
            <h3 className="font-semibold text-xl">
              {alum.first} {alum.last}
            </h3>
            <p className="text-gray-500">Graduation Year: {alum.gradYear}</p>
            <p className="text-gray-500">Major: {alum.major}</p>
            <p className="text-gray-500">Company: {alum.company}</p>
            <p className="text-gray-500">Industry: {alum.industry}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlumniWall;
