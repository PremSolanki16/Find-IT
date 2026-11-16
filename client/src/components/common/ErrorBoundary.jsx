
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error);
    console.error('Error Details:', errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen w-full items-center justify-center bg-[var(--color-bg-page)] px-4 py-8">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--color-border-medium)] bg-[var(--color-bg-card)] p-6 text-center shadow-xl sm:p-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl text-red-500">
              !
            </div>

            <h1 className="mb-3 text-xl font-bold text-[var(--color-text-heading)] sm:text-2xl">
              Something Went Wrong
            </h1>

            <p className="mb-8 text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
              An unexpected error occurred while displaying this page.
              You can try again or reload the application.
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={this.handleRetry}
                className="min-h-11 rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-primary-contrast)] transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="min-h-11 rounded-lg border border-[var(--color-border-medium)] bg-[var(--color-bg-subtle)] px-6 py-3 text-sm font-semibold text-[var(--color-text-main)] transition-colors hover:opacity-80"
              >
                Reload Application
              </button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
