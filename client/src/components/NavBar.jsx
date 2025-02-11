import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/spartan-logo.png";

function NavBar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [localStorage.getItem("token")]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("permission_level");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="bg-blue-300 border-b border-gray-300 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0" active={location.pathname === "/"}>
              <img src={logo} alt="Spartan Outreach Logo" className="h-8 w-8" />
            </NavLink>
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/posts" active={location.pathname === "/posts"}>
                Activity Wall
              </NavLink>
              <NavLink to="/jobs" active={location.pathname === "/jobs"}>
                Jobs
              </NavLink>
              <NavLink to="/events" active={location.pathname === "/events"}>
                Events
              </NavLink>
              <NavLink
                to="/fundraisers"
                active={location.pathname === "/fundraisers"}
              >
                Fundraisers
              </NavLink>
              <NavLink to="/alumni" active={location.pathname === "/alumni"}>
                Alumni
              </NavLink>
              <NavLink to="/connections" active={location.pathname ==="/connections"}>My Connections</NavLink>
            </div>
          </div>

          <div className="ml-auto">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className={`px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900`}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className={`px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children, active }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        active
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
    </Link>
  );
}

export default NavBar;
