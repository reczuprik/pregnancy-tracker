// src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Error Boundary Class Component (required by React)
class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Default Error Fallback Component
const DefaultErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
  return (
    <div className="error-boundary">
      <div className="error-boundary-content">
        <div className="error-boundary-icon">⚠️</div>
        <h2 className="error-boundary-title">Something went wrong</h2>
        <p className="error-boundary-message">
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="error-boundary-details">
            <summary>Error Details (Development Only)</summary>
            <pre>{error.stack}</pre>
          </details>
        )}
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

// Wrapper with hooks support
const ErrorBoundary: React.FC<Props> = (props) => {
  return <ErrorBoundaryClass {...props} />;
};

export default ErrorBoundary;
