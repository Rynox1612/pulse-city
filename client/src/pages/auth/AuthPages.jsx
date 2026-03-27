import { PageHeader, SectionContainer } from '../../components/SharedComponents';

export const LoginPage = () => (
  <SectionContainer className="max-w-md mx-auto">
    <PageHeader title="User Login" description="Sign in to your health profile." />
    <div className="bg-white p-6 shadow-sm rounded-lg border border-neutral-200">Auth Form Placeholder</div>
  </SectionContainer>
);

export const RegisterPage = () => (
  <SectionContainer className="max-w-md mx-auto">
    <PageHeader title="Sign Up" description="Create a Pulse City account." />
    <div className="bg-white p-6 shadow-sm rounded-lg border border-neutral-200">Registration Form Placeholder</div>
  </SectionContainer>
);

export const AdminLoginPage = () => (
  <SectionContainer className="max-w-md mx-auto">
    <PageHeader title="Admin Login" description="Secured portal for hospital administrators." />
    <div className="bg-white p-6 shadow-sm rounded-lg border border-neutral-200 border-t-4 border-t-primary-600">Admin Form Placeholder</div>
  </SectionContainer>
);
