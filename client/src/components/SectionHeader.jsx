const SectionHeader = ({ title, children }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-gray-900 text-[2rem]">{title}</h1>
      {children}
    </div>
  );
};

export default SectionHeader;
