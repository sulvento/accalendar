// This is a button component that we will use globally
import React from 'react';

const baseStyles = "px-4 py-2 rounded font-medium transition duration-200 focus:outline-none";

const variants = {
    Enter: "bg-yellow-600 text-white hover:bg-gray-700",
    
};

function Button({
  children,
  onClick,
  type = "button",
  variant = "Enter",
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;