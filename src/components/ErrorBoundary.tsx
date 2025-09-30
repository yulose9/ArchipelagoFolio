'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error boundary component for graceful error handling
 * Specifically designed to handle Mapbox and animation failures
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // Replace with your error reporting service
    console.log('Reporting error to monitoring service:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-6">
          <motion.div
            className="max-w-lg w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <svg
                className="w-10 h-10 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.201 2.5 1.732 2.5z"
                />
              </svg>
            </motion.div>

            <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
            
            <p className="text-slate-300 mb-6">
              We encountered an unexpected error while loading the portfolio. 
              This might be due to a network issue or browser compatibility.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-slate-400 hover:text-white">
                  Error Details (Development)
                </summary>
                <div className="mt-4 p-4 bg-black/30 rounded-lg text-xs font-mono overflow-auto max-h-40">
                  <p className="text-red-400 mb-2">{this.state.error.message}</p>
                  <pre className="text-slate-300 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={this.handleRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
              
              <motion.button
                onClick={this.handleReload}
                className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reload Page
              </motion.button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-slate-400">
                If the problem persists, please try:
              </p>
              <ul className="text-sm text-slate-300 mt-2 space-y-1">
                <li>• Refreshing your browser</li>
                <li>• Checking your internet connection</li>
                <li>• Updating your browser to the latest version</li>
                <li>• Disabling browser extensions</li>
              </ul>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Mapbox-specific error boundary
 * Provides fallback static content when 3D map fails to load
 */
export function MapboxErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
          {/* Static Philippines outline as fallback */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-32 h-32 mx-auto mb-6 relative">
                {/* Simplified Philippines map outline */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-white/60"
                  fill="currentColor"
                >
                  <path d="M25 20 Q30 15 35 20 L40 25 Q45 20 50 25 L55 30 Q60 25 65 35 L70 45 Q65 50 60 55 L55 65 Q50 70 45 65 L40 60 Q35 65 30 60 L25 50 Q20 45 20 35 Q20 25 25 20 Z" />
                  <circle cx="70" cy="40" r="8" />
                  <circle cx="30" cy="75" r="6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Map Unavailable</h2>
              <p className="text-slate-300 mb-4 max-w-md">
                The interactive 3D map couldn't load, but you can still explore the portfolio content below.
              </p>
              <motion.button
                onClick={() => window.location.reload()}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Retry Map Loading
              </motion.button>
            </motion.div>
          </div>

          {/* Background pattern as fallback */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/5 to-transparent transform skew-y-12"></div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;