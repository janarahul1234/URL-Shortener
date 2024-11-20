import React from "react";

const Button = ({ label = "", disabled, onClick = () => {} }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="px-6 py-3 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
    >
      {label}
    </button>
  );
};

export default Button;
