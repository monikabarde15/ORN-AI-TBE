import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is ORN-AI?",
    a: "ORN-AI is an advanced AI learning and talent infrastructure platform.",
  },
  {
    q: "Who can benefit from ORN-AI's programs?",
    a: "Students, professionals, and organizations can benefit from our programs.",
  },
  {
    q: "What makes ORN-AI different from other platforms?",
    a: "We combine practical learning, AI mentorship, and placement support.",
  },
  {
    q: "Does ORN-AI provide hands-on training?",
    a: "Yes. All programs include practical projects and assignments.",
  },
  {
    q: "Do you offer a job guarantee?",
    a: "We provide placement assistance but cannot guarantee employment.",
  },
  {
    q: "How do your placement services work?",
    a: "Resume reviews, mock interviews and hiring partner opportunities.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-[#F7F7F7] py-32">
      <div className="w-[96%] mx-auto">
        {/* Title */}
       <div className="text-center mb-20">
  <h2
    className="
      text-[72px]
      md:text-[78px]
      font-bold
      text-[#5E4EF2]
      leading-none
      tracking-[-2px]
    "
  >
    Frequently Asked Questions
  </h2>

  <p className="mt-6 text-[18px] text-[#374151]">
    Everything you need to know before getting started.
  </p>
</div>

        {/* FAQ */}
        <Accordion
          type="single"
          collapsible
          className="space-y-5"
        >
          {faqs.map((item, index) => (
           <AccordionItem
  key={index}
  value={`item-${index}`}
  className="
    overflow-hidden
    rounded-[18px]
    border
    border-[#D7DCE3]
    bg-[#F1F2F5]
    transition-all
    duration-300
    hover:border-[#C4B5FD]
  "
>
             <AccordionTrigger
  className="
    px-7
    py-4
    text-[16px]
    font-normal
    text-[#111827]
    hover:no-underline
    [&>svg]:text-[#6B7280]
    [&>svg]:h-5
    [&>svg]:w-5
    transition-all
    duration-300
  "
>
                {index + 1}. {item.q}
              </AccordionTrigger>

             <AccordionContent
  className="
    px-7
    pb-6
    text-[16px]
    leading-8
    text-[#4B5563]
    animate-accordion-down
  "
>
  {item.a}
</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}