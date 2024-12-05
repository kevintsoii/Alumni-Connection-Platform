import { useState } from "react";
import { Navigate } from "react-router-dom";

const SignupPage = () => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    major: "",
    degreeType: "BS", // Default to Bachelors
    gradMonth: "January", // Default to January
    gradYear: currentYear.toString(), // Default to current year
    userType: "Student", // Default to Student
  });
  const monthMapping = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const [signUp, setSignUp] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      email,
      password,
      firstName,
      lastName,
      major,
      degreeType,
      gradMonth,
      gradYear,
    } = formData;

    if (!email || !password || !firstName || !lastName || !gradYear) {
      setError("Please fill in all the required fields.");
      return;
    }
    // API call to create a new user
    try {
      const response = await fetch("http://localhost:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          first: firstName,
          last: lastName,
          major: major,
          degree: degreeType,
          gradYear: parseInt(gradYear),
          gradMonth: monthMapping[gradMonth],
        }),
      });

      const data = await response.json();

      if (data.token) {
        setError("");
        localStorage.setItem("token", data.token);
        localStorage.setItem("permission_level", data.permission_level);
        setSignUp(true);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  if (signUp) {
    return <Navigate to="/alumni" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Generate graduation years dynamically
  const gradYears = Array.from(
    { length: 2030 - 1980 + 1 },
    (_, index) => 1980 + index
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Sign Up
          </h2>

          {/* Error message */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* First Name */}
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Major */}
            <div className="mb-4">
              <label htmlFor="major" className="block text-gray-700">
                Major
              </label>
              <input
                type="text"
                id="major"
                name="major"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your major"
                value={formData.major}
                onChange={handleChange}
              />
            </div>

            {/* Degree Type */}
            <div className="mb-4">
              <label htmlFor="degreeType" className="block text-gray-700">
                Degree Type
              </label>
              <select
                id="degreeType"
                name="degreeType"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.degreeType}
                onChange={handleChange}
                required
              >
                <option value="Bachelors">BS</option>
                <option value="Masters">MS</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            {/* Graduation Month */}
            <div className="mb-4">
              <label htmlFor="gradMonth" className="block text-gray-700">
                Graduation Month
              </label>
              <select
                id="gradMonth"
                name="gradMonth"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.gradMonth}
                onChange={handleChange}
                required
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* Graduation Year */}
            <div className="mb-4">
              <label htmlFor="gradYear" className="block text-gray-700">
                Graduation Year
              </label>
              <select
                id="gradYear"
                name="gradYear"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.gradYear}
                onChange={handleChange}
                required
              >
                {gradYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* User Type */}
            <div className="mb-6">
              <label htmlFor="userType" className="block text-gray-700">
                User Type
              </label>
              <select
                id="userType"
                name="userType"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.userType}
                onChange={handleChange}
                required
              >
                <option value="Student">Student</option>
                <option value="Alumni" disabled={true}>
                  Alumni
                </option>
                <option value="Staff" disabled={true}>
                  Professor
                </option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
