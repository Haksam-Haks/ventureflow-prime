import { AlertTriangle, RefreshCcw, LifeBuoy, Home } from "lucide-react";
import React, { Component, ErrorInfo } from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // You could also log this to an error tracking service
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
    window.location.reload(); // Full page refresh for complete reset
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
              {/* Header with decorative image */}
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-center">
                <div className="h-32 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-24 h-24 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <div className="p-8 sm:p-10">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-inner border-2 border-red-100">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-800 mb-3">
                    Oops! Something went wrong
                  </h1>
                  
                  <p className="text-lg text-gray-600 mb-6">
                    We apologize for the inconvenience. Our team has been notified.
                  </p>

                  {this.state.error && (
                    <div className="mt-4 mb-6 w-full p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm font-mono text-blue-800">
                        Error: {this.state.error.message}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 w-full mt-6">
                    <button
                      onClick={this.handleReset}
                      className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                    >
                      <RefreshCcw className="w-5 h-5 mr-2" />
                      Try Again
                    </button>
                    
                    <a
                      href="/"
                      className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-200 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all"
                    >
                      <Home className="w-5 h-5 mr-2" />
                      Go Home
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Footer with support option */}
              <div className="px-8 py-5 bg-blue-50 border-t border-blue-100 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-blue-800 mb-2 sm:mb-0">
                  Need more help? Contact our support team
                </p>
                <a 
                  href="mailto:support@example.com" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <LifeBuoy className="w-4 h-4 mr-2" />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}