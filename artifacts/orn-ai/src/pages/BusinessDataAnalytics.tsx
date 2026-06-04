
import BusinessDataAnalyticsD from './BusinessDataAnalyticsD';
import HeroBanner from './components/Banner';
import { Shell } from "@/components/layout/Shell";


const BusinessDataAnalytics = () => (
  <Shell>
  <div style={{ minHeight: '100vh', background: '#140f1c' }}>
    <HeroBanner
    title="Business & Data Analytics"
    subtitle="Your subtitle or description goes here"
    ctaText="Sign up"
    ctaHref="/signup"
    image="https://cdn.prod.website-files.com/66446d71a3755a2d4e53fe14/668baff40b223db5311c7fda_network-connections.png"
    height="h-96"
    />
    <BusinessDataAnalyticsD />
  </div>
  </Shell>
);
export default BusinessDataAnalytics;
