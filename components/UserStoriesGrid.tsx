import React, { useState } from 'react';
import { UserStory } from '../types';
import { User, Target, Gift, AlertCircle, Copy, Check } from 'lucide-react';

interface UserStoriesGridProps {
  stories: UserStory[];
}

export const UserStoriesGrid: React.FC<UserStoriesGridProps> = ({ stories }) => {
  const [copied, setCopied] = useState(false);

  const getPriorityColor = (priority: string) => {
    const p = priority.toLowerCase();
    if (p.includes('alta') || p.includes('high')) return 'bg-red-100 text-red-800 border-red-200';
    if (p.includes('media') || p.includes('medium')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const handleCopy = () => {
    const lines = ['HISTORIAS DE USUARIO', ''];
    stories.forEach(s => {
      lines.push(`[Prioridad: ${s.priority}]`);
      lines.push(`Como ${s.role}, quiero ${s.action}, para ${s.benefit}.`);
      lines.push('');
    });
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Action Bar */}
      <div className="flex justify-end mb-6">
        <button 
          onClick={handleCopy}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copiado' : 'Copiar Historias'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getPriorityColor(story.priority)}`}>
                {story.priority}
              </span>
            </div>

            <div className="space-y-4 flex-grow">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Como</p>
                <p className="text-gray-900 font-medium">{story.role}</p>
              </div>
              
              <div className="relative pl-4 border-l-2 border-brand-200">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Quiero</p>
                <p className="text-gray-900">{story.action}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mt-2">
                <div className="flex items-start gap-2">
                  <Gift className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Para</p>
                    <p className="text-gray-700 text-sm">{story.benefit}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};