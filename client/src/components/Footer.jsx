import { APP_NAME } from '../config/appConstants';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold">{APP_NAME}</span>
            <p className="text-sm text-neutral-400 mt-1">Healthcare, when every second matters.</p>
          </div>
          <div className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
