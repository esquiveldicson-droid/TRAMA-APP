import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[FamiliaHub ErrorBoundary]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[280px] p-6 flex flex-col items-center justify-center text-center bg-[#FAF6F0] rounded-2xl border border-[#E07A5F]/20 m-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#E07A5F]/15 flex items-center justify-center text-[#E07A5F] mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#2C2724] mb-2 font-['Playfair_Display']">
            Un pequeño tropiezo en el camino
          </h3>
          <p className="text-sm text-[#2C2724]/70 max-w-sm mb-5">
            Ocurrió un detalle inesperado al cargar esta parte, pero la familia sigue intacta.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E07A5F] hover:bg-[#C9654C] text-white font-medium rounded-xl shadow-sm transition-transform active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
