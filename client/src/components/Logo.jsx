import React from "react";

const Logo = ({ className = "" }) => {
  return (
    <span className={`text-gray-900 font-medium text-xl ${className}`}>
      URL Shortener
    </span>
  );
};

export default Logo;
