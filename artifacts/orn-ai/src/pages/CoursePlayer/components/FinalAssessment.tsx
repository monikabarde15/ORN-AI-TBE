const FinalAssessment = () => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <h1 className="text-3xl font-bold">
        Final Assessment
      </h1>

      <p className="mt-4 text-gray-600">
        Congratulations!
        Complete this final test
        to finish the course.
      </p>

      <button
  className="
    mt-6
    rounded-lg
    bg-[#0B1F4D]
    border
    border-cyan-500/40
    px-6
    py-3
    text-white
    font-semibold
    shadow-md
    transition-all
    duration-300
    hover:bg-[#102B6A]
    hover:border-cyan-400
  "
>
  Start Assessment
</button>
    </div>
  );
};

export default FinalAssessment;