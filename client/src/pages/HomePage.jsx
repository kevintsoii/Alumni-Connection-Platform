import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen">
      <main className="flex flex-col space-y-6 items-center pt-44 pb-10">
        <h1 className="text-7xl font-bold text-amber-400 text-center">
          Spartans
          <span className="text-transparent bg-gradient-to-br from-blue-600 to-blue-100 bg-clip-text">
            {" "}
            help{" "}
          </span>
          Spartans
        </h1>
        <div className="text-2xl text-center font-medium text-gray-500">
          Changing the world together, one
          <span className="text-3xl font-bold text-amber-400"> Spartan </span>
          at a time.
        </div>
        <Link to="/alumni">
          <button className="text-xl bg-blue-600 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-full duration-500">
            Get Started
          </button>
        </Link>
      </main>
    </div>
  );
}

export default Home;
