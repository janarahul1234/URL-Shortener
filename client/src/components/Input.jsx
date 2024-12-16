const Input = ({
  name = "",
  type = "text",
  label = "",
  message = "",
  autoComplete = "off",
  register,
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm mb-1.5">
        {label}
      </label>

      <input
        id={name}
        type={type}
        autoComplete={autoComplete}
        {...register}
        className={`block w-full text-gray-900 px-4 py-2.5 border rounded-lg transition duration-300 ring-offset-2 focus:outline-none focus:ring-2 ${
          !!message
            ? "border-red-400 focus:ring-red-300"
            : "border-gray-200 hover:border-gray-400 focus:ring-gray-400"
        }`}
      />

      {!!message && <p className="text-red-500 text-xs mt-3">{message}</p>}
    </div>
  );
};

export default Input;
