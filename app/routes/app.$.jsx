import { Link, useLocation } from "react-router";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f2f4] p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              className="w-10 h-10 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Page not found
          </h1>

          {/* Body Text */}
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            The page <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-mono text-xs mx-1 border border-gray-200">{location.pathname}</code> could not be found. It might have been removed or doesn't exist.
          </p>

          {/* Action Button */}
          <Link 
            to="/app" 
            className="w-full bg-[#1a1a1a] hover:bg-[#303030] text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 text-sm no-underline"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-4 h-4"
            >
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        {/* Footer Link */}
        <div className="mt-6 text-center">
          <a href="#" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
            Help Center
          </a>
          <span className="mx-2 text-gray-300">•</span>
          <a href="#" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
