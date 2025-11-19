import React, { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';

interface AnalysisInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export const AnalysisInput: React.FC<AnalysisInputProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  const loadExample = () => {
    const example = `Cliente: Hola, necesitamos crear una aplicación tipo Uber pero para paseadores de perros.
PM: Entendido. ¿Qué funcionalidades clave necesitan para la primera versión?
Cliente: Bueno, necesitamos que los usuarios puedan registrarse, ver paseadores cercanos en un mapa y reservar un paseo. También necesitamos pagos integrados con tarjeta.
PM: ¿Y para los paseadores?
Cliente: Ellos necesitan un perfil donde subir fotos, establecer sus tarifas y ver sus ganancias. Ah, y un sistema de chat para hablar con los dueños.
PM: ¿Plataformas?
Cliente: Inicialmente solo web y Android. iOS lo dejamos para después. Tenemos un presupuesto de unos 15.000 dólares y lo necesitamos en 3 meses.`;
    setText(example);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-100 rounded-lg">
          <FileText className="w-6 h-6 text-brand-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Transcripción de Reunión</h2>
          <p className="text-sm text-gray-500">Pega aquí el texto de tu reunión para generar el alcance.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none text-gray-700 leading-relaxed"
            placeholder="Pega la transcripción aquí... (Ej: 'El cliente necesita una e-commerce para venta de zapatos...')"
            disabled={isLoading}
          />
          {text.length === 0 && (
            <button
              type="button"
              onClick={loadExample}
              className="absolute top-4 right-4 text-xs text-brand-600 hover:text-brand-700 font-medium bg-brand-50 px-3 py-1 rounded-full transition-colors"
            >
              Cargar Ejemplo
            </button>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all
              ${isLoading || !text.trim() 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'}
            `}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analizar Proyecto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};