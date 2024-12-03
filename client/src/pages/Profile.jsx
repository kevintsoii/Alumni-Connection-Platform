import { useEffect, useState } from "react";

function Profile() {
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJwZXJtaXNzaW9uX2xldmVsIjoic3R1ZGVudCIsImlhdCI6MTczMzI2NjQ3Nn0.L0KfBw6T2jcR0hzm4hro0SamqkY3AQO2ynegbCf42WE";

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await fetch("http://localhost:8000/alumni/", {
          method: "GET",
          mode: "no-cors",
          headers: { Authorization: `${token}` },
          credentials: "include", // Include cookies in the request
        });
        const data = await response.json();
        console.log("Protected data:", data);
      } catch (error) {
        console.error("Error fetching protected data:", error);
      }
    };
    fetchProtectedData();
  }, []);

  const [name, setName] = useState("Kevin Tsoi");

  const [gradDate, setGradDate] = useState("2005");
  const [major, setMajor] = useState("Computer Science");
  const [degree, setDegree] = useState("B.S.");
  const [company, setCompany] = useState("IBM");

  const [title, setTitle] = useState("Professor");
  const [department, setDepartment] = useState("Departent of Computer Sciece");

  const [isPending, setIsPending] = useState(false);

  const connectWith = () => {
    setIsPending(!isPending);
  };

  return (
    <div className=" ">
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
          <p className="font-extrabold text-3xl tracking-tighter"> {name}</p>

          <p className="text-lg font-semibold">{company}</p>
          <p className="text-sm text-gray-400">{`${degree} ${major} • Graduated ${gradDate}`}</p>
        </div>

        {/* importing the svgs is not working */}
        <button
          className={`flex items-center justify-center w-28 h-8 rounded-2xl space-x-2  ${
            isPending
              ? "bg-whitesmoke border-2 border-primary text-primary font-bold hover:bg-gray-200"
              : "bg-primary text-white font-bold  hover:bg-blue-800  "
          }`}
          onClick={connectWith}
        >
          {isPending ? (
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
          ) : (
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
          )}
        </button>
      </div>
    </div>
  );
}

export default Profile;
