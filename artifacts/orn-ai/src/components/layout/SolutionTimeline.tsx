import {
  Search,
  Brain,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export function SolutionTimeline() {
  const items = [
    {
      no: "01",
      title: "Assess",
      icon: Search,
    },
    {
      no: "02",
      title: "Score",
      icon: Brain,
    },
    {
      no: "03",
      title: "Upskill",
      icon: GraduationCap,
    },
    {
      no: "04",
      title: "Prepare",
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-28">

      <div className="container mx-auto px-6">

        <h2 className="text-center text-6xl font-bold">
          Recruiter-ready talent pipelines.
        </h2>

        <div className="grid lg:grid-cols-4 gap-8 mt-20">

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.no}
                className="bg-[#17142f] rounded-[32px] p-10 text-white relative"
              >
                <span className="absolute top-5 right-5">
                  {item.no}
                </span>

                <Icon size={50} />

                <h3 className="text-3xl font-bold mt-8">
                  {item.title}
                </h3>
              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}