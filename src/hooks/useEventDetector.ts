import { useState, useCallback } from 'react';
import { detectEventInText } from '../services/geminiService';

export interface DetectedEventInfo {
  titulo: string;
  fecha_estimada: string;
  ubicacion?: string;
  intencion_verdadera?: string;
}

/**
 * Hook para detectar planes y fechas en texto y sugerir agendamiento (Gemini Prompt #4)
 */
export function useEventDetector() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedEvent, setDetectedEvent] = useState<DetectedEventInfo | null>(null);

  const analyzeText = useCallback(async (text: string) => {
    if (!text || text.length < 10) {
      setDetectedEvent(null);
      return;
    }
    setIsDetecting(true);
    try {
      const res = await detectEventInText(text);
      if (res.hasEvent && res.event) {
        setDetectedEvent(res.event);
      } else {
        setDetectedEvent(null);
      }
    } catch {
      setDetectedEvent(null);
    } finally {
      setIsDetecting(false);
    }
  }, []);

  const clearDetection = useCallback(() => {
    setDetectedEvent(null);
  }, []);

  return {
    isDetecting,
    detectedEvent,
    analyzeText,
    clearDetection,
  };
}
