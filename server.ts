import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser with 10MB limit for image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper to get Gemini client safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

const FAMILY_CONTEXT = `
Eres el Asistente Familiar de "Familia Hub", una red social privada exclusiva para una familia unida de 5 integrantes:
- Papá: Roberto ("El Asador Mayor", amante del asado y las anécdotas de juventud)
- Mamá: Carmen ("La Reina del Hogar", cocinera estrella, amorosa y detallista)
- Hijo Mayor: Lucas ("El Músico / Ingeniero", reflexivo y bromista)
- Hija del Medio: Valentina ("La Viajera / Artista", creativa y espontánea)
- Hijo Menor: Mateo ("El Gamer / El Deportista", divertido, enérgico y consentido)

Tu tono siempre debe ser cálido, nostálgico, respetuoso, cariñoso y con chispa familiar latinoamericana.
`;

// ==========================================
// API ROUTE 1: Búsqueda Semántica de Posts
// ==========================================
app.post('/api/gemini/search', async (req: Request, res: Response) => {
  const { query, posts } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Falta la consulta de búsqueda' });
  }

  const ai = getGeminiClient();
  if (!ai || !Array.isArray(posts) || posts.length === 0) {
    // Fallback search: simple case-insensitive text match
    const lower = String(query).toLowerCase();
    const matched = (posts || []).find(
      (p: any) =>
        (p.contenido && p.contenido.toLowerCase().includes(lower)) ||
        (p.categoria && p.categoria.toLowerCase().includes(lower))
    );
    return res.json({
      matchedPostId: matched ? matched.id : null,
      explanation: matched
        ? `Encontrado por coincidencia en el texto: "${matched.contenido.slice(0, 50)}..."`
        : 'No encontramos publicaciones relacionadas directamente con tu búsqueda.',
      source: 'local-fallback',
    });
  }

  try {
    const compactPosts = posts.map((p: any) => ({
      id: p.id,
      autor: p.autor_nombre || p.autor_id,
      contenido: p.contenido,
      categoria: p.categoria,
      fecha: p.fecha,
    }));

    const prompt = `
${FAMILY_CONTEXT}

Eres un buscador semántico inteligente para el álbum familiar.
Dada esta consulta del usuario y este listado JSON de posts familiares:
Consulta: "${query}"

Posts familiares:
${JSON.stringify(compactPosts)}

Devuelve ÚNICAMENTE un objeto JSON válido (sin markdown ni comillas triples) con este formato:
{
  "matchedPostId": "string con el id del post más relevante, o null si ninguno tiene relación",
  "explanation": "breve frase explicando cariñosamente por qué coincide con el recuerdo familiar"
}
Ignora faltas de ortografía del usuario. Si no hay relación clara, matchedPostId debe ser null.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({
      matchedPostId: parsed.matchedPostId || null,
      explanation: parsed.explanation || 'Búsqueda completada.',
      source: 'gemini',
    });
  } catch (error: any) {
    console.error('Error en búsqueda semántica Gemini:', error);
    // Robust fallback
    const lower = String(query).toLowerCase();
    const matched = (posts || []).find((p: any) =>
      p.contenido?.toLowerCase().includes(lower)
    );
    return res.json({
      matchedPostId: matched ? matched.id : null,
      explanation: 'Búsqueda realizada con motor local.',
      source: 'local-fallback',
    });
  }
});

// ==========================================
// API ROUTE 2: Noticiero Semanal Familiar
// ==========================================
app.post('/api/gemini/noticiero', async (req: Request, res: Response) => {
  const { posts, events } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      title: '🎙️ El Noticiero Dominical de los Recuerdos',
      paragraphs: [
        '¡Muy buenas tardes, queridos oyentes de la sintonía hogareña! Esta semana la casa estuvo llena de vida, con aromas de sobremesa y anécdotas inolvidables.',
        'Entre los platos de Doña Carmen, las ocurrencias de Lucas y Mateo, y los proyectos de Roberto y Valentina, la armonía familiar se mantiene más fuerte que nunca.',
        'Cerramos esta emisión recordándoles: ¡el domingo que viene no se olviden de llamar a mamá y coordinar el próximo asado en familia!',
      ],
      source: 'local-fallback',
    });
  }

  try {
    const prompt = `
${FAMILY_CONTEXT}

Crea un resumen divertido y nostálgico de 3 párrafos como un locutor de radio de época familiar ("Radio Familia Hub"), usando los posts y eventos recientes de la familia.
Menciona los apodos cariñosos de los integrantes (Papá Roberto, Mamá Carmen, Lucas, Valentina, Mateo).

Posts recientes:
${JSON.stringify((posts || []).slice(0, 10))}

Eventos planeados:
${JSON.stringify(events || [])}

Devuelve ÚNICAMENTE un JSON válido con este formato:
{
  "title": "Titular divertido del noticiero dominical",
  "paragraphs": [
    "Párrafo 1 (apertura como locutor con chispa)",
    "Párrafo 2 (anécdotas, comida y momentos destacados de la semana)",
    "Párrafo 3 (cierre cálido y recordatorio para el próximo encuentro)"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      title: parsed.title || '🎙️ Noticiero Familiar de la Semana',
      paragraphs: parsed.paragraphs || [
        '¡Otra hermosa semana compartida en Familia Hub!',
      ],
      source: 'gemini',
    });
  } catch (error) {
    console.error('Error en noticiero semanal:', error);
    return res.json({
      title: '🎙️ La Crónica Semanal de Nuestra Familia',
      paragraphs: [
        '¡Bienvenidos al resumen semanal de la familia! Una semana llena de pequeños grandes instantes que merecen guardarse en el corazón.',
        'Las risas en la mesa y los mensajes cotidianos son el verdadero tesoro de nuestro hogar.',
        '¡Que comience una nueva semana llena de alegrías y unión!',
      ],
      source: 'local-fallback',
    });
  }
});

// ==========================================
// API ROUTE 3: Pregunta del Día (Daily Challenge)
// ==========================================
app.post('/api/gemini/daily-challenge', async (req: Request, res: Response) => {
  const { history } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    const fallbacks = [
      '¿Cuál es el recuerdo de vacaciones familiares que más te hace sonreír cuando lo piensas?',
      'Si tuvieras que elegir una sola comida de Mamá Carmen para comer el resto de tu vida, ¿cuál sería?',
      '¿Qué lección o frase de Papá Roberto te acompaña siempre en momentos difíciles?',
      '¿Cuál fue la travesura de la infancia que pensaban que nadie descubriría?',
      '¿Qué tradición familiar te gustaría que nunca se perdiera?',
    ];
    const question = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return res.json({
      question,
      category: 'Nostalgia',
      source: 'local-fallback',
    });
  }

  try {
    const prompt = `
${FAMILY_CONTEXT}

Genera una pregunta nostálgica, cálida y profunda para que respondan los 5 familiares adultos (Papá, Mamá y los 3 hijos ya crecidos).
Debe invitar a compartir anécdotas, gratitud o recuerdos de la infancia y la mesa familiar.

Preguntas ya hechas para no repetir:
${JSON.stringify(history || [])}

Devuelve ÚNICAMENTE un JSON con:
{
  "question": "texto de la pregunta cariñosa",
  "category": "Infancia | Comida Familiar | Recuerdos | Gratitud | Risas"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      question: parsed.question || '¿Cuál es tu recuerdo familiar más preciado?',
      category: parsed.category || 'Recuerdos',
      source: 'gemini',
    });
  } catch (error) {
    console.error('Error en daily challenge:', error);
    return res.json({
      question: '¿Qué momento vivido juntos este último año te dio más felicidad?',
      category: 'Gratitud',
      source: 'local-fallback',
    });
  }
});

// ==========================================
// API ROUTE 4: Detector de Eventos en Texto
// ==========================================
app.post('/api/gemini/detect-event', async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) {
    return res.json({ hasEvent: false });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // Simple regex detector for words like "asado", "domingo", "cumple", "reunión"
    const lower = text.toLowerCase();
    const hasIntent =
      lower.includes('asado') ||
      lower.includes('almuerzo') ||
      lower.includes('cena') ||
      lower.includes('reunión') ||
      lower.includes('domingo') ||
      lower.includes('sábado');

    if (hasIntent) {
      return res.json({
        hasEvent: true,
        event: {
          titulo: 'Reunión familiar planeada',
          fecha_estimada: 'Próximo fin de semana',
          ubicacion: 'Casa de los papás',
          intencion_verdadera: 'Juntarse a comer y compartir',
        },
        source: 'local-fallback',
      });
    }
    return res.json({ hasEvent: false });
  }

  try {
    const prompt = `
${FAMILY_CONTEXT}

Analiza este texto escrito por un miembro de la familia:
"${text}"

Determina si hay intención de planear un evento, visita, comida, asado o reunión familiar.
Devuelve ÚNICAMENTE un objeto JSON válido con este formato:
{
  "hasEvent": true o false,
  "event": {
    "titulo": "título corto sugerido para el evento (ej. Asado del Domingo)",
    "fecha_estimada": "fecha o texto estimado mencionado, ej. Domingo 14:00 o Próximo fin de semana",
    "ubicacion": "lugar sugerido (ej. Casa de Mamá y Papá)",
    "intencion_verdadera": "resumen de lo que quieren hacer"
  }
}
Si NO hay intención de planear un evento, hasEvent debe ser false y event puede ser null.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      hasEvent: Boolean(parsed.hasEvent),
      event: parsed.event || null,
      source: 'gemini',
    });
  } catch (error) {
    console.error('Error en detección de eventos:', error);
    return res.json({ hasEvent: false, source: 'local-fallback' });
  }
});

// ==========================================
// Frontend Serving (Dev with Vite or Production)
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Familia Hub] Servidor iniciado en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error fatal al iniciar servidor:', err);
});
