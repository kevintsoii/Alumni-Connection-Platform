import React, { useState, useEffect } from "react";

function JobsPage() {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("permission_level");

  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newJob, setNewJob] = useState({
    title: "",
    url: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [wallError, setWallError] = useState("");

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8000/jobs/", {
          method: "GET",
          headers: { Authorization: `${token}` },
        });

        const data = await response.json();

        console.log(data);
        if (data.error) {
          setWallError(data.error);
          if (data.error === "Invalid token") {
            setWallError("You must be logged in.");
          }
        } else {
          setJobs(data.jobs);
        }
      } catch (error) {
        console.error("Error fetching jobs data:", error);
      }
    };
    fetchJobs();
  }, []);

  const handleCreateJob = async () => {
    if (
      newJob.title.trim() !== "" &&
      newJob.url.trim() !== "" &&
      newJob.description.trim() !== ""
    ) {
      try {
        const response = await fetch("http://localhost:8000/jobs/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(newJob),
        });

        const data = await response.json();

        if (data.message) {
          window.location.reload();
        } else if (data.error) {
          setError(data.error);
        }
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError("All fields must be filled out!");
    }
  };

  function renderNewJobForm() {
    if (userType == "staff") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Job Title"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Job URL"
            value={newJob.URL}
            onChange={(e) => setNewJob({ ...newJob, url: e.target.value })}
            className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Job Description"
            value={newJob.description}
            onChange={(e) =>
              setNewJob({ ...newJob, description: e.target.value })
            }
            className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateJob}
            className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600"
          >
            Add Job
          </button>

          {error && <p className="text-red-500 text-center my-4">{error}</p>}
        </div>
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Jobs</h1>

        {renderNewJobForm()}

        <div className="bg-[#fbfbf9] rounded-lg shadow-md p-4">
          <input
            type="text"
            placeholder="Search by Job Title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {wallError && (
          <p className="text-red-500 text-center my-4">{wallError}</p>
        )}

        {filteredJobs.map((job) => (
          <div
            key={job.jobID}
            className="bg-[#fbfbf9] rounded-lg shadow-md p-4 mt-4"
          >
            <h3 className="font-semibold text-xl">{job.title}</h3>
            <a
              href={job.URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {job.URL}
            </a>
            <p className="text-gray-500 mt-2">{job.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobsPage;
