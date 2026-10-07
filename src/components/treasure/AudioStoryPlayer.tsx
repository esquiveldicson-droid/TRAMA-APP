import React, { useState, useEffect } from 'react';
import { AudioStory } from '../../types/family';
import { useFamilyStore } from '../../store/useFamilyStore';
import { Avatar } from '../common/Avatar';
import { Play, Pause, RotateCcw, Volume2, Sparkles } from 'lucide-react';

interface Props {
  story: AudioStory;
}

export const AudioStoryPlayer: React.FC<Props> = ({ story }) => {
  const users = useFamilyStore((state) => state.users);
  const narrator = users.find((u) => u.id === story.narrador_id);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            return 0;
          }
          return prev + 1.5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(story.transcripcion_ia);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
      };
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReset = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-[#EFE7DA] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#E07A5F]/15 flex items-center justify-center text-[#E07A5F] shrink-0">
          <Volume2 className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold text-[#E07A5F] uppercase tracking-wider block">
            Historia Sonora Familiar
          </span>
          <h3 className="font-['Playfair_Display'] font-bold text-sm text-[#2C2724] truncate">
            {story.titulo}
          </h3>
          <p className="text-[11px] text-stone-500">
            Narrado por {narrator?.nombre || 'Mamá'}
          </p>
        </div>
      </div>

      {/* Scrubber & Controls */}
      <div className="space-y-2">
        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#E07A5F] h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="w-10 h-10 rounded-full bg-[#E07A5F] hover:bg-[#C9654C] text-white flex items-center justify-center shadow-md shadow-[#E07A5F]/20 active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 text-stone-400 hover:text-stone-600 rounded-lg"
              title="Reiniciar audio"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-stone-400 font-medium">
            {Math.floor((story.duracion_segundos * (progress / 100)) / 60)}:
            {String(Math.floor((story.duracion_segundos * (progress / 100)) % 60)).padStart(2, '0')} / {Math.floor(story.duracion_segundos / 60)}:
            {String(story.duracion_segundos % 60).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* AI Transcription Card */}
      <div className="p-3.5 bg-[#FAF6F0] rounded-2xl border border-[#EFE7DA] space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#819B84] uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-[#819B84]" />
          <span>Transcripción Generada por IA</span>
        </div>
        <p className="text-xs text-[#2C2724] leading-relaxed italic">
          "{story.transcripcion_ia}"
        </p>
      </div>
    </div>
  );
};
