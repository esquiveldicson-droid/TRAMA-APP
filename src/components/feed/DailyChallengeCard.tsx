import React, { useState } from 'react';
import { useFamilyStore } from '../../store/useFamilyStore';
import { useDailyChallenge } from '../../hooks/useDailyChallenge';
import { Avatar } from '../common/Avatar';
import { Sparkles, MessageSquareHeart, RefreshCw, Send } from 'lucide-react';

export const DailyChallengeCard: React.FC = () => {
  const users = useFamilyStore((state) => state.users);
  const currentUser = useFamilyStore((state) => state.currentUser);
  const { challenge, isGenerating, generateNewQuestion, submitAnswer } = useDailyChallenge();

  const [answerText, setAnswerText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const myAnswer = challenge.respuestas.find((r) => r.user_id === currentUser?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    submitAnswer(answerText.trim());
    setAnswerText('');
    setIsExpanded(true);
  };

  return (
    <div className="bg-gradient-to-br from-[#FAF0E6] via-[#FFFDF9] to-[#F4ECE1] dark:from-[#2A231E] dark:via-[#201D1A] dark:to-[#28221D] rounded-2xl p-4 sm:p-5 border border-[#E07A5F]/25 dark:border-[#E07A5F]/40 shadow-sm mb-4 relative overflow-hidden">
      {/* Decorative Warm Sparkle Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#E07A5F]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--theme-primary)] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 animate-spin [animation-duration:8s]" />
          <span>Pregunta Nostálgica del Día</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#E07A5F]/15 text-[var(--theme-primary)] rounded-full">
            {challenge.categoria}
          </span>
          <button
            onClick={generateNewQuestion}
            disabled={isGenerating}
            className="p-1 text-stone-400 hover:text-[var(--theme-primary)] rounded-lg transition-transform active:rotate-180 disabled:opacity-50"
            title="Generar nueva pregunta con IA"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Question */}
      <p className="font-['Playfair_Display'] text-base sm:text-lg font-bold text-[var(--text-primary)] leading-snug mb-3.5">
        "{challenge.pregunta}"
      </p>

      {/* Replies Count & Toggle */}
      <div className="flex items-center justify-between text-xs text-[#2C2724]/70 mb-3">
        <span className="font-medium">
          {challenge.respuestas.length} de 5 integrantes han respondido
        </span>
        {challenge.respuestas.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-[#E07A5F] hover:underline"
          >
            {isExpanded ? 'Ocultar respuestas' : 'Ver respuestas'}
          </button>
        )}
      </div>

      {/* Answers list */}
      {isExpanded && challenge.respuestas.length > 0 && (
        <div className="space-y-2.5 pt-2 mb-3 border-t border-[#EFE7DA]/70">
          {challenge.respuestas.map((resp) => {
            const author = users.find((u) => u.id === resp.user_id);
            return (
              <div
                key={resp.id}
                className="flex items-start gap-2.5 bg-white/70 p-2.5 rounded-xl border border-[#EFE7DA]/60"
              >
                <Avatar user={author} size="sm" />
                <div className="flex-1 text-xs">
                  <span className="font-bold text-[#2C2724] mr-1.5">
                    {author?.nombre || 'Familiar'}:
                  </span>
                  <span className="text-[#2C2724]/90 italic">
                    "{resp.respuesta}"
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Answer Form */}
      {myAnswer ? (
        <div className="bg-[#819B84]/15 border border-[#819B84]/30 rounded-xl p-2.5 flex items-center justify-between text-xs text-[#647C66]">
          <span className="font-medium">
            ✓ Ya respondiste: "{myAnswer.respuesta.slice(0, 45)}..."
          </span>
          <button
            onClick={() => {
              setAnswerText(myAnswer.respuesta);
              setIsExpanded(true);
            }}
            className="font-bold underline text-[11px]"
          >
            Editar
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Escribe tu recuerdo o respuesta..."
            className="flex-1 px-3.5 py-2 text-xs bg-white rounded-xl border border-[#EFE7DA] focus:outline-none focus:border-[#E07A5F]"
          />
          <button
            type="submit"
            disabled={!answerText.trim()}
            className="px-3.5 py-2 bg-[#E07A5F] hover:bg-[#C9654C] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95"
          >
            <Send className="w-3 h-3" />
            <span>Enviar</span>
          </button>
        </form>
      )}
    </div>
  );
};
