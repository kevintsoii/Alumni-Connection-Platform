import React, { useState } from "react";
import { render } from "react-dom";

function AlumniWall() {
  const [userType, setUserType] = useState("alumni");
  const [alumni, setAlumni] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      gradYear: 2020,
      major: "Computer Science",
      company: "Tech Corp",
      industry: "Technology",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      gradYear: 2019,
      major: "Business Administration",
      company: "Finance Co",
      industry: "Finance",
    },
    {
      id: 3,
      firstName: "Mike",
      lastName: "Johnson",
      gradYear: 2021,
      major: "Mechanical Engineering",
      company: "AutoWorks",
      industry: "Automotive",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState({
    gradYear: "",
    major: "",
    company: "",
    industry: "",
  });

  const [newAlumni, setNewAlumni] = useState({
    firstName: "",
    lastName: "",
    gradYear: "",
    major: "",
    company: "",
    industry: "",
  });

  const handleAddAlumni = () => {
    if (
      newAlumni.firstName.trim() !== "" &&
      newAlumni.lastName.trim() !== "" &&
      newAlumni.gradYear.trim() !== "" &&
      newAlumni.major.trim() !== "" &&
      newAlumni.company.trim() !== "" &&
      newAlumni.industry.trim() !== ""
    ) {
      const newEntry = {
        ...newAlumni,
        id: alumni.length + 1,
      };
      setAlumni([newEntry, ...alumni]);
      setNewAlumni({
        firstName: "",
        lastName: "",
        gradYear: "",
        major: "",
        company: "",
        industry: "",
      });
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
    if (userType === "staff" || "alumni") {
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="First Name"
              value={newAlumni.firstName}
              onChange={(e) =>
                setNewAlumni({ ...newAlumni, firstName: e.target.value })
              }
              className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newAlumni.lastName}
              onChange={(e) =>
                setNewAlumni({ ...newAlumni, lastName: e.target.value })
              }
              className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Grad Year"
              value={newAlumni.gradYear}
              onChange={(e) =>
                setNewAlumni({ ...newAlumni, gradYear: e.target.value })
              }
              className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Major"
              value={newAlumni.major}
              onChange={(e) =>
                setNewAlumni({ ...newAlumni, major: e.target.value })
              }
              className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

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
              {alum.firstName} {alum.lastName}
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
