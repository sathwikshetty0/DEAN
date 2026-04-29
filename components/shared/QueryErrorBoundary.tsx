'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class QueryErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-12 bg-red-500/5 border border-red-500/10 rounded-[2.5rem] text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
          <p className="text-sm text-white/40 mb-8 max-w-xs mx-auto">
            The system encountered an unexpected error. This has been logged and we're looking into it.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white hover:bg-white/10 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
