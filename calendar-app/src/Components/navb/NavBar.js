import React from 'react';

function NavBar({
  logo = "Accalendar",
  onAboutClick,
  onLoginClick,
  className = "",
}) {
  return (
    <nav className={`w-full bg-gray-900 text-white ${className}`}>
      <div className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="text-xl font-semibold cursor-pointer">
          {typeof logo === "string" ? logo : logo}
        </div>

        {/* Right: Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={onAboutClick}
            className="px-4 py-2 rounded-md border border-gray-600 transition duration-200 hover:bg-yellow-500 hover:text-black"
          >
            About
          </button>

          <button
            onClick={onLoginClick}
            className="px-4 py-2 rounded-md border border-gray-600 transition duration-200 hover:bg-yellow-500 hover:text-black"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;