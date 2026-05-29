import { Shield, Code2, Globe } from "lucide-react";

const courses = [
  {
    icon: Shield,
    title: "Cyber Security",
  },
  {
    icon: Code2,
    title: "Software Engineering",
  },
  {
    icon: Globe,
    title: "Full Stack Development",
  },
];

export function CourseGrid() {
  return (
    <section className="pb-24">

      <div className="container mx-auto px-6">

        <div className="grid lg:grid-cols-3 gap-8">

          {courses.map((course) => {
            const Icon = course.icon;

            return (
              <div
                key={course.title}
                className="bg-[#0a0223] text-white rounded-[28px] p-8"
              >
                <Icon
                  size={50}
                  className="text-violet-400 mb-8"
                />

                <h3 className="text-3xl font-bold">
                  {course.title}
                </h3>

                <button className="mt-8 bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 rounded-xl">
                  Explore Lab
                </button>
              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}