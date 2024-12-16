const Loader = ({ size = "default", className = "" }) => {
  const SIZES = {
    default: "w-6 h-6",
    sm: "w-5 h-5",
    lg: "w-8 h-8",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${SIZES[size]} border-[3px] border-gray-300 border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;
