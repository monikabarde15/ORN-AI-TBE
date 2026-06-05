
import ScienceProgramsD from './ScienceProgramsD';
import { Shell } from "@/components/layout/Shell";

import HeroBanner from './components/Banner';

const SciencePrograms = () => (
   <Shell>
  <div style={{ minHeight: '100vh', background: '#140f1c' }}>
      <HeroBanner
        title="Science Programs"
        subtitle="Your subtitle or description goes here"
        ctaText="Sign up"
        ctaHref="/signup"
        image="https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/668baff40b223db5311c7fda_network-connections.png"
        height="h-96"
        />
    <ScienceProgramsD />
   
  </div>
   </Shell>
);
export default SciencePrograms;
