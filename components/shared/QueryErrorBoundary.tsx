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
          <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3 tracking-tight">System Interrupted</h3>
          <p className="text-[13px] text-white/50 mb-10 max-w-sm mx-auto leading-relaxed font-medium">
            The D-EAN protocol encountered a runtime exception. Resilience protocols are active, but this component requires a restart.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-white hover:bg-white/10 transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" /> RESTART COMPONENT
            </button>
            <a
              href="/"
              className="flex items-center justify-center px-8 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm font-black text-red-500 hover:bg-red-500/20 transition-all active:scale-95"
            >
              RETURN HOME
            </a>
          </div>

        </div>
      );
    }

    return this.props.children;
  }
}
