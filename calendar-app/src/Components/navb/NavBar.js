import React from 'react';
import { useNavigate } from "react-router-dom"


function NavBar({
  logo = "Accalendar",
  src,
  alt = "logo",
  size = "w-16 h-16", // default size
  border = "border-2 border-gray-300",
  className = "",
}) {
// className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"
  const navigate = useNavigate();
  return (
    <nav className={`w-full bg-gray-900 text-white ${className}`}>
      <div className="max-w-7xl mx-auto w-full px-6 py-4 flex items-center justify-between">
        
        {/* LEFT GROUP */}
        <div className="flex items-center gap-3">
          <div className={`${size} ${border} rounded-full overflow-hidden flex items-center justify-center bg-black`}>
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-xl font-semibold cursor-pointer">
            {logo}
          </div>
        </div>

        {/* RIGHT GROUP */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/about")}
            className="px-4 py-2 rounded-md border border-gray-600 transition duration-200 hover:bg-yellow-500 hover:text-black"
          >
            About
          </button>

          <button
            onClick={() => navigate("/login")}
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