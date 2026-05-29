export function TalentInfrastructure() {
  return (
    <section className="bg-[#040016] py-28">

      <div className="container mx-auto px-6">

        <h2 className="text-center text-6xl text-white font-bold">
          ORN-AI is building that
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            {" "}Talent Infrastructure.
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mt-20">

          <div className="rounded-[32px] p-10 bg-gradient-to-br from-[#2d2958] to-[#141d3b]">
            <h3 className="text-5xl text-violet-400 font-bold mb-8">
              Our Mission
            </h3>

            <ul className="space-y-5 text-white">
              <li>Workforce Readiness</li>
              <li>Industry Alignment</li>
              <li>Reliable Deployment</li>
            </ul>
          </div>

          <div className="rounded-[32px] p-10 bg-gradient-to-br from-[#2d2958] to-[#141d3b]">
            <h3 className="text-5xl text-violet-400 font-bold mb-8">
              Our Vision
            </h3>

            <ul className="space-y-5 text-white">
              <li>Verified Talent</li>
              <li>Continuous Conditioning</li>
              <li>Workforce Reliability</li>
            </ul>
          </div>

        </div>

      </div>

    </section>
  );
}