import { PageHeader, SectionContainer } from '../../components/SharedComponents';

export const AboutPage = () => (
  <SectionContainer>
    <PageHeader title="About Pulse City" description="Connecting communities to emergency care rapidly." />
    <p>Pulse City is an urban healthcare initiative designed for maximum efficiency.</p>
  </SectionContainer>
);

export const HospitalsPage = () => (
  <SectionContainer>
    <PageHeader title="All Hospitals" description="Search and filter nearby medical centers." />
    <p>Filtering and map integration coming soon.</p>
  </SectionContainer>
);

export const EmergencyMapPage = () => (
  <SectionContainer>
    <PageHeader title="Emergency Locator Map" description="Find immediate care and check distance." />
    <div className="h-64 bg-neutral-200 mt-4 rounded-xl flex-center text-neutral-500 font-bold">Map Placeholder</div>
  </SectionContainer>
);

export const AIAssistantPage = () => (
  <SectionContainer>
    <PageHeader title="AI Symptom Assistant" description="First-level health guidance only." />
    <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md font-medium text-sm mb-6 border border-yellow-200">
      Disclaimer: This does not replace real medical professionals. If critical, call emergency services immediately.
    </div>
    <p>Chat interface placeholder.</p>
  </SectionContainer>
);

export const ContactPage = () => (
  <SectionContainer>
    <PageHeader title="Contact Us" description="Reach out to the Pulse City administration team." />
    <p>Contact forms and directory placeholder.</p>
  </SectionContainer>
);
