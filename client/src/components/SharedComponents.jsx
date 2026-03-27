export const PageHeader = ({ title, description }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
    {description && <p className="mt-2 text-lg text-neutral-600">{description}</p>}
  </div>
);

export const SectionContainer = ({ children, className = '' }) => (
  <section className={`py-12 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
);

export const StatusBadge = ({ status, type = 'default' }) => {
  const types = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    default: 'bg-neutral-100 text-neutral-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${types[type] || types.default}`}>
      {status}
    </span>
  );
};

export const EmergencyAlertBanner = ({ message }) => (
  <div className="bg-emergency-50 border-l-4 border-emergency-500 p-4 mb-6">
    <div className="flex">
      <div className="ml-3">
        <p className="text-sm text-emergency-600 font-medium">
          {message || 'Emergency guidelines active.'}
        </p>
      </div>
    </div>
  </div>
);
