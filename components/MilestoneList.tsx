import React, { useState } from 'react';
import { Milestone } from '../types';
import { Calendar, CheckCircle2, Copy, Check } from 'lucide-react';

interface MilestoneListProps {
  milestones: Milestone[];
}

export const MilestoneList: React.FC<MilestoneListProps> = ({ milestones }) => {
  const [copied, setCopied] = useState(false);

  // Sort by week just in case
  const sortedMilestones = [...milestones].sort((a, b) => a.weekEstimate - b.weekEstimate);

  const handleCopy = () => {
    const lines = ['PLAN DE HITOS', ''];
    sortedMilestones.forEach(m => {
      lines.push(`Semana ${m.weekEstimate}: ${m.title}`);
      lines.push(`${m.description}`);
      lines.push('');
    });
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Action Bar */}
      <div className="flex justify-end mb-6">
        <button 
          onClick={handleCopy}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copiado' : 'Copiar Hitos'}
        </button>
      </div>

      <div className="relative border-l-2 border-brand-200 ml-4 space-y-12 py-4">
        {sortedMilestones.map((milestone, index) => (
          <div key={index} className="relative pl-8">
            {/* Connector Circle */}
            <div className="absolute -left-[9px] top-0 bg-white p-1 rounded-full border-2 border-brand-200">
              <div className="bg-brand-500 w-2.5 h-2.5 rounded-full" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-600" />
                  {milestone.title}
                </h3>
                <div className="flex items-center text-sm font-medium text-brand-700 bg-brand-50 px-3 py-1 rounded-full w-fit">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Semana {milestone.weekEstimate}
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {milestone.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};