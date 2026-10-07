import { useState, useCallback } from 'react';
import { useFamilyStore } from '../store/useFamilyStore';
import { fetchDailyChallengeQuestion } from '../services/geminiService';

/**
 * Hook para la Pregunta del Día Familiar con IA (Gemini Prompt #3)
 */
export function useDailyChallenge() {
  const challenge = useFamilyStore((state) => state.dailyChallenge);
  const updateQuestion = useFamilyStore((state) => state.updateDailyChallengeQuestion);
  const submitAnswer = useFamilyStore((state) => state.addChallengeAnswer);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewQuestion = useCallback(async () => {
    setIsGenerating(true);
    try {
      const res = await fetchDailyChallengeQuestion([challenge.pregunta]);
      updateQuestion(res.question, res.category);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [challenge.pregunta, updateQuestion]);

  return {
    challenge,
    isGenerating,
    generateNewQuestion,
    submitAnswer,
  };
}
