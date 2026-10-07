import { useState, useCallback } from 'react';
import { useFamilyStore } from '../store/useFamilyStore';
import { searchPostsSemantically } from '../services/geminiService';
import { FamilyPost } from '../types/family';

export interface SearchResult {
  post: FamilyPost | null;
  explanation: string;
  source: string;
}

/**
 * Hook para Búsqueda Semántica de recuerdos con IA (Gemini Prompt #1)
 */
export function useGeminiSearch() {
  const posts = useFamilyStore((state) => state.posts);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setResult(null);
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const response = await searchPostsSemantically(query, posts);
        const matched = response.matchedPostId
          ? posts.find((p) => p.id === response.matchedPostId) || null
          : null;

        setResult({
          post: matched,
          explanation: response.explanation,
          source: response.source,
        });
      } catch (err: any) {
        setError(err.message || 'Error al realizar la búsqueda.');
      } finally {
        setIsLoading(false);
      }
    },
    [posts]
  );

  const clearSearch = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    search,
    clearSearch,
    result,
    isLoading,
    error,
  };
}
