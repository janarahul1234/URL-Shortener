import React from "react";

const Input = ({
  id = "",
  label = "",
  placeholder = "",
  type = "text",
  errorMessage,
  register,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-gray-500">
        {label}
      </label>

      <input
        {...register(id)}
        type={type}
        placeholder={placeholder}
        id={id}
        className={`block w-full bg-white text-gray-700 px-5 py-2.5 mt-2 placeholder-gray-400/70 rounded-lg border focus:outline-none focus:ring focus:ring-opacity-40 ${
          errorMessage
            ? "border-red-400 focus:border-red-400 focus:ring-red-300"
            : "border-gray-200 focus:border-blue-400 focus:ring-blue-300"
        }`}
      />

      {errorMessage && (
        <p className="mt-2 text-xs text-red-400">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;
