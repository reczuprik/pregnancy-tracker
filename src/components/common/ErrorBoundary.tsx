// src/components/common/ErrorBoundary.tsx - Enhanced Error Boundary
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId: string;
  errorInfo?: ErrorInfo;
}

// Error Boundary Class Component (required by React)
class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      errorId: this.generateErrorId() 
    };
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;
    
    if (hasError && prevProps.children !== this.props.children && resetOnPropsChange) {
      this.resetErrorBoundary();
    }
    
    if (hasError && resetKeys) {
      const prevResetKeys = prevProps.resetKeys || [];
      const hasResetKeyChanged = resetKeys.some((key, index) => 
        key !== prevResetKeys[index]
      );
      
      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorId: this.generateErrorId()
    });
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { level = 'component' } = this.props;
    
    // Enhanced error logging
    const errorDetails = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo,
      level,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    };

    console.error('Error caught by boundary:', errorDetails);
    
    // Store error info in state for better fallback UI
    this.setState({ errorInfo });
    
    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(errorDetails);
    }
    
    this.props.onError?.(error, errorInfo);
  }

  private reportError(errorDetails: any) {
    // Integration point for error reporting services like Sentry
    // For now, we'll store in localStorage for debugging
    try {
      const existingErrors = JSON.parse(
        localStorage.getItem('pregnancy-tracker-errors') || '[]'
      );
      existingErrors.push(errorDetails);
      localStorage.setItem(
        'pregnancy-tracker-errors', 
        JSON.stringify(existingErrors.slice(-10)) // Keep last 10 errors
      );
    } catch (e) {
      console.error('Failed to store error details:', e);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <DefaultErrorFallback 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          level={this.props.level}
          onReset={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

// Default Error Fallback Component
interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
  level?: 'page' | 'section' | 'component';
  onReset?: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  errorInfo, 
  errorId, 
  level = 'component',
  onReset 
}) => {
  const { t } = useTranslation();
  
  const getErrorMessage = () => {
    switch (level) {
      case 'page':
        return t('error.pageLevel', 'This page encountered an error. Please try refreshing.');
      case 'section':
        return t('error.sectionLevel', 'This section encountered an error. You can try refreshing or continue using other parts of the app.');
      default:
        return t('error.componentLevel', 'A component encountered an error, but you can continue using the app.');
    }
  };
  return (
    <div className={`error-boundary error-boundary--${level}`}>
      <div className="error-boundary-content">
        <div className="error-boundary-icon">
          {level === 'page' ? '🚨' : level === 'section' ? '⚠️' : '😔'}
        </div>
        <h2 className="error-boundary-title">
          {t('error.title', 'Something went wrong')}
        </h2>
        <p className="error-boundary-message">
          {getErrorMessage()}
        </p>
        
        <div className="error-boundary-actions">
          {onReset && level !== 'page' && (
            <button 
              onClick={onReset}
              className="btn btn-secondary"
            >
              {t('error.tryAgain', 'Try Again')}
            </button>
          )}
          
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            {t('error.refresh', 'Refresh Page')}
          </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="error-boundary-details">
            <summary>Error Details (Development Only)</summary>
            <div className="error-boundary-debug">
              <p><strong>Error ID:</strong> {errorId}</p>
              <p><strong>Error:</strong> {error?.name}: {error?.message}</p>
              {error?.stack && (
                <pre className="error-boundary-stack">{error.stack}</pre>
              )}
              {errorInfo?.componentStack && (
                <pre className="error-boundary-component-stack">
                  {errorInfo.componentStack}
                </pre>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

// Wrapper with hooks support
const ErrorBoundary: React.FC<Props> = (props) => {
  return <ErrorBoundaryClass {...props} />;
};

export default ErrorBoundary;
