import React, { useState } from "react";

function JobsPage() {
  const [userType, setUserType] = useState("staff");
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Software Engineer",
      URL: "https://techcorp.com/job1",
      description:
        "We are looking for a passionate Software Engineer to join our team.",
    },
    {
      id: 2,
      title: "Project Manager",
      URL: "https://bizcorp.com/job2",
      description:
        "Experienced Project Manager needed for overseeing key client projects.",
    },
    {
      id: 3,
      title: "Data Analyst",
      URL: "https://datacorp.com/job3",
      description:
        "Seeking a skilled Data Analyst to work with large datasets and derive insights.",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [newJob, setNewJob] = useState({
    title: "",
    URL: "",
    description: "",
  });

  const handleCreateJob = () => {
    if (
      newJob.title.trim() !== "" &&
      newJob.URL.trim() !== "" &&
      newJob.description.trim() !== ""
    ) {
      const newEntry = {
        ...newJob,
        id: jobs.length + 1,
      };
      setJobs([newEntry, ...jobs]);
      setNewJob({
        title: "",
        URL: "",
        description: "",
      });
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            onChange={(e) => setNewJob({ ...newJob, URL: e.target.value })}
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
        {filteredJobs.map((job) => (
          <div
            key={job.id}
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
