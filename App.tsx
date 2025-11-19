import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { AnalysisInput } from './components/AnalysisInput';
import { BudgetChart } from './components/BudgetChart';
import { MilestoneList } from './components/MilestoneList';
import { UserStoriesGrid } from './components/UserStoriesGrid';
import { analyzeTranscript } from './services/gemini';
import { AnalysisResult, AnalysisStatus } from './types';
import { DollarSign, Flag, Users, ArrowLeft, Copy, Check } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'budget' | 'milestones' | 'stories'>('budget');
  const [summaryCopied, setSummaryCopied] = useState(false);

  const handleAnalyze = async (text: string) => {
    setStatus(AnalysisStatus.ANALYZING);
    try {
      const data = await analyzeTranscript(text);
      setResult(data);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const reset = () => {
    setStatus(AnalysisStatus.IDLE);
    setResult(null);
    setActiveTab('budget');
    setSummaryCopied(false);
  };

  const handleCopySummary = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.summary);
    setSummaryCopied(true);
    setTimeout(() => setSummaryCopied(false), 2000);
  };

  return (
    <Layout>
      {status === AnalysisStatus.IDLE && (
        <div className="space-y-8 animate-fade-in">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              De Transcripción a <span className="text-brand-600">Plan de Proyecto</span>
            </h2>
            <p className="text-lg text-gray-600">
              Pega la transcripción de tu reunión y deja que la IA genere el presupuesto, hitos y historias de usuario automáticamente.
            </p>
          </div>
          <AnalysisInput onAnalyze={handleAnalyze} isLoading={false} />
        </div>
      )}

      {status === AnalysisStatus.ANALYZING && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Analizando conversación...</h3>
          <p className="text-gray-500">Identificando requerimientos y estimando esfuerzos.</p>
        </div>
      )}

      {status === AnalysisStatus.ERROR && (
        <div className="text-center py-12">
          <div className="bg-red-50 text-red-700 p-6 rounded-xl inline-block mb-6 max-w-lg">
            <h3 className="font-bold text-lg mb-2">Ocurrió un error</h3>
            <p>No pudimos procesar la transcripción. Por favor verifica tu API Key e intenta nuevamente con un texto más claro.</p>
          </div>
          <div>
            <button onClick={reset} className="text-brand-600 hover:text-brand-800 font-medium">
              Intentar de nuevo
            </button>
          </div>
        </div>
      )}

      {status === AnalysisStatus.SUCCESS && result && (
        <div className="space-y-8">
          <div className="flex items-center justify-between print:hidden">
             <button 
              onClick={reset}
              className="flex items-center gap-2 text-gray-500 hover:text-brand-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Nuevo Análisis
            </button>
            <h2 className="text-2xl font-bold text-gray-900 text-right flex-1 ml-4 truncate">{result.projectName}</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:hidden relative group">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Resumen Ejecutivo</h3>
              <button 
                onClick={handleCopySummary}
                className="text-gray-400 hover:text-brand-600 transition-colors p-1 rounded-md hover:bg-brand-50 flex items-center gap-1 text-xs font-medium"
                title="Copiar resumen"
              >
                {summaryCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-700 leading-relaxed">{result.summary}</p>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 print:hidden">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('budget')}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                  ${activeTab === 'budget'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <DollarSign className="w-4 h-4" />
                Presupuesto Detallado
              </button>
              <button
                onClick={() => setActiveTab('milestones')}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                  ${activeTab === 'milestones'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <Flag className="w-4 h-4" />
                Hitos del Proyecto
              </button>
              <button
                onClick={() => setActiveTab('stories')}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                  ${activeTab === 'stories'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <Users className="w-4 h-4" />
                Historias de Usuario
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'budget' && (
              <div className="animate-fade-in">
                <BudgetChart budget={result.budget} projectName={result.projectName} />
              </div>
            )}
            {activeTab === 'milestones' && (
              <div className="animate-fade-in">
                <MilestoneList milestones={result.milestones} />
              </div>
            )}
            {activeTab === 'stories' && (
              <div className="animate-fade-in">
                <UserStoriesGrid stories={result.userStories} />
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;