/**
 * Servicio de llamadas al backend de Gemini y utilidades de seguridad / compresión
 */

import { FamilyPost, FamilyEvent } from '../types/family';

const NETWORK_TIMEOUT_MS = 15000;

/**
 * Realiza un fetch con timeout estricto de 15 segundos
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('La llamada a la red excedió el tiempo límite de 15 segundos.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Sanitiza inputs de texto para evitar inyecciones HTML
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Optimiza y comprime una imagen en el cliente antes de subirla (Max 10MB)
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<string> {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('El archivo excede el tamaño máximo permitido de 10MB.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(img.src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('No se pudo procesar la imagen seleccionada.'));
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
  });
}

/**
 * Prompt #1: Búsqueda Semántica de Posts
 */
export async function searchPostsSemantically(
  query: string,
  posts: FamilyPost[]
): Promise<{ matchedPostId: string | null; explanation: string; source: string }> {
  try {
    const res = await fetchWithTimeout('/api/gemini/search', {
      method: 'POST',
      body: JSON.stringify({ query, posts }),
    });
    if (!res.ok) throw new Error('Error al conectar con el servicio de búsqueda.');
    return await res.json();
  } catch (err: any) {
    console.warn('[Gemini Search Fallback]:', err.message);
    const lower = query.toLowerCase();
    const found = posts.find((p) => p.contenido.toLowerCase().includes(lower));
    return {
      matchedPostId: found ? found.id : null,
      explanation: found
        ? `Coincidencia local: "${found.contenido.slice(0, 40)}..."`
        : 'No se encontraron recuerdos con ese término.',
      source: 'offline-fallback',
    };
  }
}

/**
 * Prompt #2: Noticiero Semanal Familiar
 */
export async function fetchWeeklyNewsBulletin(
  posts: FamilyPost[],
  events: FamilyEvent[]
): Promise<{ title: string; paragraphs: string[]; source: string }> {
  try {
    const res = await fetchWithTimeout('/api/gemini/noticiero', {
      method: 'POST',
      body: JSON.stringify({ posts, events }),
    });
    if (!res.ok) throw new Error('Error al generar el noticiero');
    return await res.json();
  } catch (err: any) {
    console.warn('[Gemini Noticiero Fallback]:', err.message);
    return {
      title: '🎙️ El Noticiero Dominical de los Recuerdos',
      paragraphs: [
        '¡Muy buenas tardes, familia querida! Esta semana la casa estuvo llena de vida, con aromas de sobremesa y anécdotas inolvidables.',
        'Entre los platos de Doña Carmen, las ocurrencias de Lucas y Mateo, y los proyectos de Roberto y Valentina, la armonía familiar se mantiene firme.',
        '¡El domingo que viene nos encontramos todos alrededor del fuego!',
      ],
      source: 'offline-fallback',
    };
  }
}

/**
 * Prompt #3: Pregunta del Día (Daily Challenge)
 */
export async function fetchDailyChallengeQuestion(
  history: string[] = []
): Promise<{ question: string; category: string; source: string }> {
  try {
    const res = await fetchWithTimeout('/api/gemini/daily-challenge', {
      method: 'POST',
      body: JSON.stringify({ history }),
    });
    if (!res.ok) throw new Error('Error al generar pregunta del día');
    return await res.json();
  } catch (err: any) {
    console.warn('[Gemini Challenge Fallback]:', err.message);
    return {
      question: '¿Cuál es el recuerdo de vacaciones familiares que más te hace sonreír cuando lo piensas?',
      category: 'Nostalgia',
      source: 'offline-fallback',
    };
  }
}

/**
 * Prompt #4: Detector de Eventos en Texto
 */
export async function detectEventInText(
  text: string
): Promise<{
  hasEvent: boolean;
  event?: {
    titulo: string;
    fecha_estimada: string;
    ubicacion?: string;
    intencion_verdadera?: string;
  };
  source: string;
}> {
  try {
    const res = await fetchWithTimeout('/api/gemini/detect-event', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('Error en detector');
    return await res.json();
  } catch (err: any) {
    console.warn('[Gemini Event Detector Fallback]:', err.message);
    const lower = text.toLowerCase();
    const hasIntent =
      lower.includes('asado') ||
      lower.includes('almuerzo') ||
      lower.includes('cena') ||
      lower.includes('domingo');

    if (hasIntent) {
      return {
        hasEvent: true,
        event: {
          titulo: 'Reunión familiar planeada',
          fecha_estimada: 'Próximo domingo',
          ubicacion: 'Casa de los papás',
          intencion_verdadera: 'Reunirse a compartir una comida',
        },
        source: 'offline-fallback',
      };
    }
    return { hasEvent: false, source: 'offline-fallback' };
  }
}
