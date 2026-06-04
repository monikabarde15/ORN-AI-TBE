
import Datascience from './Datascience';
import HeroBanner from './components/Banner';
import { Shell } from "@/components/layout/Shell";

const Data = () => (
  <Shell>
  <div style={{ minHeight: '100vh', background: '#140f1c' }}>
      <HeroBanner
            title="Data science and A.I"
            subtitle="Your subtitle or description goes here"
            ctaText="Sign up"
            ctaHref="/signup"
            image="https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/668baff40b223db5311c7fda_network-connections.png"
            height="h-96"
            />
    <Datascience />
    
  </div>
  </Shell>
);
export default Data ;
