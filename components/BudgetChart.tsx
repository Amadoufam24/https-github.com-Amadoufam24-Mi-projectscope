import React, { useState } from 'react';
import { BudgetLineItem } from '../types';
import { Printer, FileText, Copy, Check } from 'lucide-react';

interface BudgetChartProps {
  budget: BudgetLineItem[];
  projectName?: string;
}

export const BudgetChart: React.FC<BudgetChartProps> = ({ budget, projectName }) => {
  const [copied, setCopied] = useState(false);
  const totalCost = budget.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalHours = budget.reduce((sum, item) => sum + item.estimatedHours, 0);

  // Group items by category for the document view
  const itemsByCategory = budget.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, BudgetLineItem[]>);

  const handleCopy = () => {
    const lines = [
      `PROYECTO: ${projectName || 'Sin Título'}`,
      `FECHA: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      '',
      'RESUMEN:',
      `Inversión Estimada: $${totalCost.toLocaleString()} USD`,
      `Tiempo Estimado: ${totalHours} horas`,
      '',
      'DESGLOSE DETALLADO:',
    ];

    Object.entries(itemsByCategory).forEach(([category, items]: [string, BudgetLineItem[]]) => {
      lines.push(`\n## ${category.toUpperCase()}`);
      items.forEach(item => {
        lines.push(`- ${item.item}: $${item.estimatedCost.toLocaleString()} (${item.estimatedHours}h)`);
      });
    });

    lines.push('');
    lines.push('TÉRMINOS Y CONDICIONES:');
    lines.push('1. Cotización válida por 15 días.');
    lines.push('2. Forma de pago: 50% inicio, 50% entrega.');
    lines.push('3. Funcionalidades no listadas se cotizan aparte.');

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Action Bar */}
      <div className="flex justify-end gap-3 mb-6 print:hidden">
        <button 
          onClick={handleCopy}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copiado' : 'Copiar Texto'}
        </button>
        <button 
          onClick={() => window.print()}
          className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Imprimir PDF
        </button>
      </div>

      {/* Document Container - A4-ish look */}
      <div className="bg-white shadow-xl rounded-sm p-8 md:p-16 min-h-[1000px] print:shadow-none print:p-0 print:w-full text-gray-900">
        
        {/* Document Header */}
        <header className="border-b-2 border-gray-900 pb-8 mb-10 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-brand-700 mb-3">
              <div className="p-1.5 bg-brand-100 rounded">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-bold tracking-widest text-xs uppercase">Propuesta de Proyecto</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{projectName || 'Proyecto Sin Título'}</h1>
            <p className="text-gray-500 font-medium">Estimación de Costos y Alcance</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Fecha de Emisión</p>
            <p className="font-medium text-gray-900">
              {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        {/* Executive Summary Box */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 mb-12 flex flex-col md:flex-row justify-between items-center gap-8 print:bg-white print:border-gray-300">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-1">Inversión Estimada</p>
            <p className="text-4xl font-bold text-gray-900 tracking-tight">
              ${totalCost.toLocaleString('es-ES', { minimumFractionDigits: 0 })}
              <span className="text-lg text-gray-400 font-normal ml-1">USD</span>
            </p>
          </div>
          
          <div className="h-12 w-px bg-gray-300 hidden md:block"></div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-1">Plazo de Ejecución</p>
            <p className="text-3xl font-bold text-gray-900">
              {totalHours} <span className="text-lg font-medium text-gray-500">horas</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">aprox. {Math.ceil(totalHours / 40)} semanas</p>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-3 mb-6">Desglose Detallado</h2>
          
          <div className="space-y-8">
            {Object.entries(itemsByCategory).map(([category, items]: [string, BudgetLineItem[]]) => (
              <div key={category} className="break-inside-avoid">
                <h3 className="text-brand-700 font-bold text-lg mb-4 flex items-center gap-2">
                  {category}
                </h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 text-xs font-bold text-gray-400 uppercase tracking-wider w-2/3">Concepto</th>
                      <th className="py-2 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Horas</th>
                      <th className="py-2 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 text-gray-700 font-medium pr-4">{item.item}</td>
                        <td className="py-3 text-gray-500 text-right font-mono">{item.estimatedHours}</td>
                        <td className="py-3 text-gray-900 text-right font-mono font-medium">${item.estimatedCost.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50/50 print:bg-transparent">
                      <td className="py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide pt-3">Total {category}</td>
                      <td className="py-2 text-right font-mono text-gray-600 pt-3 border-t border-gray-200">
                        {items.reduce((sum, i) => sum + i.estimatedHours, 0)}
                      </td>
                      <td className="py-2 text-right font-mono font-bold text-gray-900 pt-3 border-t border-gray-200">
                        ${items.reduce((sum, i) => sum + i.estimatedCost, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>

        {/* Terms and Footer */}
        <div className="text-sm text-gray-500 leading-relaxed border-t border-gray-200 pt-8 break-inside-avoid">
          <h4 className="font-bold text-gray-900 mb-2">Términos y Condiciones</h4>
          <p className="mb-2">1. Esta cotización es válida por 15 días a partir de la fecha de emisión.</p>
          <p className="mb-2">2. El pago se realizará: 50% al inicio del proyecto y 50% contra entrega final.</p>
          <p>3. Cualquier funcionalidad no listada explícitamente en este documento será considerada fuera del alcance y cotizada por separado.</p>
          
          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
            Generado automáticamente por ProjectScope AI
          </div>
        </div>

      </div>
    </div>
  );
};