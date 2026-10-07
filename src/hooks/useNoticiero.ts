import { useState, useCallback } from 'react';
import { useFamilyStore } from '../store/useFamilyStore';
import { fetchWeeklyNewsBulletin } from '../services/geminiService';

export interface NoticieroData {
  title: string;
  paragraphs: string[];
  source: string;
}

/**
 * Hook para generar el Noticiero Semanal de Radio Familiar (Gemini Prompt #2)
 */
export function useNoticiero() {
  const posts = useFamilyStore((state) => state.posts);
  const events = useFamilyStore((state) => state.events);
  const [data, setData] = useState<NoticieroData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const generateNoticiero = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchWeeklyNewsBulletin(posts, events);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [posts, events]);

  /**
   * Lee en voz alta el noticiero usando la Web Speech API con tono cálido
   */
  const speakNoticiero = useCallback(() => {
    if (!data || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const fullText = `${data.title}. ${data.paragraphs.join(' ')}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95; // Cadencia relajada de locutor
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  }, [data, isPlayingAudio]);

  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, []);

  return {
    data,
    isLoading,
    isPlayingAudio,
    generateNoticiero,
    speakNoticiero,
    stopAudio,
  };
}
