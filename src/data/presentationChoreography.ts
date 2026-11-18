import { ConurbanoDuelMode } from '../three/benchmarkBuilders';
import { Edicion3SpiralVariant } from '../three/edicion3Builders';

export interface ChoreographyCue {
  /** Playback progress threshold [0..1] when this camera/focus cue activates */
  atProgress: number;
  /** Concise live focus label shown in the teleprompter during Auto-Present */
  focusBadge: string;
  /** Optional synchronized rank highlight (highlights 3D bar/pie slice + matching table row) */
  highlightRank?: number | null;
  /** Optional duel mode toggle for Benchmark Chapter 2 & Edicion 3 Slide 4 */
  duelMode?: ConurbanoDuelMode;
  /** Continuous First-Person POV climb range along a spiral staircase */
  povClimb?: {
    variant: Edicion3SpiralVariant;
    fromRank: number;
    toRank: number;
    startProgress: number;
    endProgress: number;
  };
  /** Target 3D camera position & lookAt coordinates (calibrated with headroom so #1 tall columns & labels never clip) */
  camera: {
    position: [number, number, number];
    target: [number, number, number];
  };
}

export const PRESENTATION_CHOREOGRAPHY: Record<string, ChoreographyCue[]> = {
  // =========================================================
  // REPORTE 1: LA SERENA DIGITAL 2026 · ECOSISTEMA (9 LÁMINAS)
  // =========================================================
  'ecosistema-0': [
    {
      atProgress: 0,
      focusBadge: 'Panorama del Ecosistema Regional',
      camera: { position: [0.45, 5.2, 12.6], target: [0.45, 2.15, 0] },
    },
    {
      atProgress: 0.24,
      focusBadge: '20 Cuentas Monitoreadas',
      camera: { position: [-2.75, 3.6, 6.8], target: [-2.95, 2.1, -1.35] },
    },
    {
      atProgress: 0.48,
      focusBadge: '3,13M Me Gusta · Top 5 Líderes',
      camera: { position: [-0.8, 3.8, 9.6], target: [-0.6, 2.05, 1.25] },
    },
    {
      atProgress: 0.7,
      focusBadge: 'Engagement Rate Promedio 1,06%',
      camera: { position: [0.45, 3.55, 6.4], target: [0.45, 2.05, -1.35] },
    },
    {
      atProgress: 0.85,
      focusBadge: 'Crecimiento +2,63% · 6,0 Posts/Día',
      camera: { position: [3.65, 3.55, 6.6], target: [3.85, 2.05, -1.35] },
    },
  ],

  'ecosistema-1': [
    {
      atProgress: 0,
      focusBadge: 'Distribución Regional de Alcance',
      camera: { position: [0.3, 5.1, 13.2], target: [0.3, 2.9, 0] },
    },
    {
      atProgress: 0.18,
      focusBadge: 'Mi Radio · 1,30M int. (36,3%)',
      camera: { position: [-3.1, 4.9, 10.6], target: [-3.34, 3.25, 0] },
    },
    {
      atProgress: 0.44,
      focusBadge: 'Diario El Día · 886k int. (24,7%)',
      camera: { position: [-1.4, 4.5, 9.6], target: [-1.52, 2.8, 0] },
    },
    {
      atProgress: 0.66,
      focusBadge: 'Guayacán CL (9,9%) · Top 61% Concentrado',
      camera: { position: [0.35, 4.2, 9.4], target: [0.3, 2.25, 0] },
    },
    {
      atProgress: 0.82,
      focusBadge: 'La Serena 4 (7,9%) · Infórmate Serena',
      camera: { position: [3.0, 4.1, 9.2], target: [3.0, 2.1, 0] },
    },
  ],

  'ecosistema-2': [
    {
      atProgress: 0,
      focusBadge: 'Seguidores vs. Tasa de Respuesta',
      camera: { position: [6.2, 5.7, 11.4], target: [0.2, 2.6, 0] },
    },
    {
      atProgress: 0.26,
      focusBadge: 'Audiencia: El Día 278k · Mi Radio 271k',
      camera: { position: [-1.8, 4.3, 9.4], target: [-2.55, 2.45, 1.4] },
    },
    {
      atProgress: 0.56,
      focusBadge: 'Papaya TV · 28% Engagement Líder',
      camera: { position: [-2.0, 4.8, 8.0], target: [-3.35, 3.05, -1.65] },
    },
    {
      atProgress: 0.8,
      focusBadge: 'Crecimiento Promedio +2,63%',
      camera: { position: [5.4, 3.5, 7.2], target: [4.8, 2.25, 0] },
    },
  ],

  'ecosistema-3': [
    {
      atProgress: 0,
      focusBadge: 'Tabla Auditada Top 20 Me Gusta',
      highlightRank: null,
      camera: { position: [2.85, 5.7, 12.4], target: [1.5, 2.6, 0] },
    },
    {
      atProgress: 0.25,
      focusBadge: '#1 Mi Radio · 1,20M Me Gusta',
      highlightRank: 1,
      camera: { position: [0.2, 4.8, 8.4], target: [-0.31, 2.95, -1.61] },
    },
    {
      atProgress: 0.4,
      focusBadge: '#2 Diario El Día · 798k Me Gusta',
      highlightRank: 2,
      camera: { position: [0.9, 4.6, 7.8], target: [0.32, 2.65, -2.38] },
    },
    {
      atProgress: 0.54,
      focusBadge: '#3 Guayacán CL · 261k Me Gusta',
      highlightRank: 3,
      camera: { position: [1.7, 4.4, 7.4], target: [1.11, 2.35, -2.92] },
    },
    {
      atProgress: 0.68,
      focusBadge: '#4 La Serena 4 · #5 Infórmate Serena',
      highlightRank: 4,
      camera: { position: [2.9, 4.2, 7.2], target: [2.3, 2.15, -3.2] },
    },
    {
      atProgress: 0.83,
      focusBadge: '#6 Papaya TV · Fidelidad Territorial',
      highlightRank: 6,
      camera: { position: [4.3, 4.1, 7.2], target: [3.74, 2.0, -3.05] },
    },
  ],

  'ecosistema-4': [
    {
      atProgress: 0,
      focusBadge: 'Agenda Temática e Hitos Virales',
      camera: { position: [0.8, 3.8, 9.6], target: [1.0, 2.1, 0] },
    },
    {
      atProgress: 0.26,
      focusBadge: '#afp (45%) · #tocopilla (23%) · #embalselapaloma (18%)',
      camera: { position: [1.7, 3.6, 7.2], target: [1.7, 2.55, 0] },
    },
    {
      atProgress: 0.62,
      focusBadge: 'Hito: Embalse La Paloma (78,7k int.)',
      camera: { position: [5.5, 3.8, 7.8], target: [4.69, 2.05, 1.27] },
    },
  ],

  'ecosistema-5': [
    {
      atProgress: 0,
      focusBadge: 'Radar de Tensión Ciudadana',
      camera: { position: [0.3, 3.6, 10.2], target: [0.3, 2.0, 0] },
    },
    {
      atProgress: 0.22,
      focusBadge: '21 Oct · 43% Pérdidas Multifondos',
      camera: { position: [-2.1, 4.0, 8.0], target: [-2.15, 2.75, 0] },
    },
    {
      atProgress: 0.44,
      focusBadge: '23 Oct · Pico 52% Crisis Urgencias',
      camera: { position: [-0.9, 4.4, 8.8], target: [-0.92, 3.1, 0] },
    },
    {
      atProgress: 0.66,
      focusBadge: '30–31 Oct · 36% Paro Ruta 5',
      camera: { position: [1.5, 3.7, 7.8], target: [1.52, 2.5, 0] },
    },
    {
      atProgress: 0.84,
      focusBadge: '9 Nov · 38% Cortes Internet y Salud',
      camera: { position: [3.9, 3.7, 7.8], target: [3.95, 2.55, 0] },
    },
  ],

  'ecosistema-6': [
    {
      atProgress: 0,
      focusBadge: 'Ingeniería de Formatos y Audiencia',
      camera: { position: [0.4, 4.7, 11.8], target: [0.4, 2.4, 0] },
    },
    {
      atProgress: 0.2,
      focusBadge: 'Volumen: 2.800 Imágenes vs. 1.800 Videos',
      camera: { position: [-1.8, 4.5, 9.2], target: [-2.0, 2.75, 0] },
    },
    {
      atProgress: 0.42,
      focusBadge: 'Reels · 1,36% Interacción (2,5x)',
      camera: { position: [-0.8, 4.4, 7.8], target: [-0.8, 2.75, -0.5] },
    },
    {
      atProgress: 0.68,
      focusBadge: 'Audiencia 35–54 años · 52% M / 48% H',
      camera: { position: [4.15, 3.3, 7.4], target: [4.15, 2.35, 0] },
    },
    {
      atProgress: 0.84,
      focusBadge: 'Recomendación: Reels + Ventana 21:00 hrs',
      camera: { position: [0.4, 4.6, 11.2], target: [0.4, 2.4, 0] },
    },
  ],

  'ecosistema-7': [
    {
      atProgress: 0,
      focusBadge: 'Auditoría de 22 Identidades Reales',
      highlightRank: null,
      camera: { position: [2.8, 5.6, 12.4], target: [1.55, 2.6, 0] },
    },
    {
      atProgress: 0.28,
      focusBadge: '#1 @miradiols · 1,2M Me Gusta',
      highlightRank: 1,
      camera: { position: [-0.5, 4.7, 8.4], target: [-1.05, 3.0, -0.95] },
    },
    {
      atProgress: 0.45,
      focusBadge: '#2 @eldia.cl · 798k Me Gusta',
      highlightRank: 2,
      camera: { position: [0.1, 4.5, 8.1], target: [-0.27, 2.8, -0.95] },
    },
    {
      atProgress: 0.6,
      focusBadge: 'Podio 72,7% · #3 @guayacancl',
      highlightRank: 3,
      camera: { position: [0.9, 4.4, 8.0], target: [0.51, 2.65, -0.95] },
    },
    {
      atProgress: 0.76,
      focusBadge: '#6 @papayatv_ls · 4,31% Eficiencia',
      highlightRank: 6,
      camera: { position: [3.1, 4.1, 7.6], target: [2.85, 2.3, -0.95] },
    },
  ],

  'ecosistema-8': [
    {
      atProgress: 0,
      focusBadge: 'Pastel 3D · 90,3% en 6 Actores',
      highlightRank: null,
      camera: { position: [2.3, 5.5, 8.6], target: [1.1, 0.8, 0] },
    },
    {
      atProgress: 0.26,
      focusBadge: 'Mi Radio · 38,6% Aprobación',
      highlightRank: 1,
      camera: { position: [1.6, 4.9, 7.2], target: [1.9, 1.15, -0.3] },
    },
    {
      atProgress: 0.46,
      focusBadge: 'Diario El Día · 25,6% Aprobación',
      highlightRank: 2,
      camera: { position: [3.6, 4.9, 7.2], target: [2.6, 1.15, 0.2] },
    },
    {
      atProgress: 0.62,
      focusBadge: 'Guayacán · La Serena 4 · Papaya TV',
      highlightRank: 3,
      camera: { position: [2.8, 5.1, 7.8], target: [2.2, 1.05, 0.3] },
    },
    {
      atProgress: 0.76,
      focusBadge: 'Transición → Benchmark 3D (28 Días)',
      highlightRank: null,
      camera: { position: [2.3, 6.0, 9.6], target: [1.4, 1.0, 0] },
    },
  ],

  // =========================================================
  // REPORTE 2: BENCHMARK 3D · 28 DÍAS (8 CAPÍTULOS)
  // =========================================================
  'benchmark-0': [
    {
      atProgress: 0,
      focusBadge: 'Telemetría Regional · 26 Cuentas',
      camera: { position: [1.3, 5.2, 12.2], target: [0.8, 2.3, 0] },
    },
    {
      atProgress: 0.28,
      focusBadge: 'Núcleo: 478,5k Interacciones · 1,97% ER',
      camera: { position: [1.3, 4.3, 8.6], target: [1.3, 2.45, 0] },
    },
    {
      atProgress: 0.56,
      focusBadge: '+3,09% Crecimiento · 2,7 Posts/Día',
      camera: { position: [2.6, 4.4, 9.2], target: [1.3, 2.5, 0] },
    },
    {
      atProgress: 0.72,
      focusBadge: 'La Serena 142k · Coquimbo 120k seg.',
      camera: { position: [-0.4, 4.7, 7.2], target: [-0.6, 2.85, -2.4] },
    },
  ],

  'benchmark-1': [
    {
      atProgress: 0,
      focusBadge: 'Dona 3D · Top 5 Acapara 50,1%',
      highlightRank: null,
      camera: { position: [2.1, 5.8, 8.8], target: [1.0, 0.95, 0] },
    },
    {
      atProgress: 0.28,
      focusBadge: '#1 @municipalidaddecoquimbo · 15,5%',
      highlightRank: 1,
      camera: { position: [3.2, 4.9, 7.2], target: [2.4, 1.1, -0.4] },
    },
    {
      atProgress: 0.46,
      focusBadge: '#2 @muni_laserena · 10,1%',
      highlightRank: 2,
      camera: { position: [2.1, 4.9, 7.2], target: [1.6, 1.1, -0.3] },
    },
    {
      atProgress: 0.62,
      focusBadge: '#3 @municipalidadillapel · 8,5%',
      highlightRank: 3,
      camera: { position: [1.2, 4.9, 7.3], target: [1.3, 1.05, 0.1] },
    },
    {
      atProgress: 0.74,
      focusBadge: '#4 @daniela.laserena · 8,1%',
      highlightRank: 4,
      camera: { position: [1.5, 5.0, 7.4], target: [1.6, 1.05, 0.3] },
    },
    {
      atProgress: 0.86,
      focusBadge: '#5 @muniovalle · 7,9%',
      highlightRank: 5,
      camera: { position: [2.5, 5.1, 7.6], target: [2.1, 1.05, 0.4] },
    },
  ],

  'benchmark-2': [
    {
      atProgress: 0,
      focusBadge: 'Duelo Conurbado · Métricas Totales',
      duelMode: 'totals',
      camera: { position: [0.5, 5.2, 12.2], target: [0.5, 2.3, 0] },
    },
    {
      atProgress: 0.18,
      focusBadge: 'Coquimbo 68,9k vs. La Serena 41,8k',
      duelMode: 'totals',
      camera: { position: [0.5, 4.8, 10.6], target: [0.5, 2.7, 0] },
    },
    {
      atProgress: 0.44,
      focusBadge: 'Cambio en vivo → Ratios de Eficiencia',
      duelMode: 'efficiency',
      camera: { position: [0.5, 4.8, 10.8], target: [0.5, 2.65, 0] },
    },
    {
      atProgress: 0.58,
      focusBadge: '@daniela.laserena · 913 Likes/Post',
      duelMode: 'efficiency',
      camera: { position: [-1.2, 4.6, 9.0], target: [-1.25, 2.55, 0] },
    },
    {
      atProgress: 0.76,
      focusBadge: '@manouchehri19 · 2.789 L/Post · 3,51% ER',
      duelMode: 'efficiency',
      camera: { position: [4.2, 4.7, 9.2], target: [4.25, 2.85, 0] },
    },
  ],

  'benchmark-3': [
    {
      atProgress: 0,
      focusBadge: 'Mapa 3D Crecimiento vs. Engagement',
      camera: { position: [2.4, 4.9, 11.5], target: [1.0, 2.35, 0] },
    },
    {
      atProgress: 0.18,
      focusBadge: '@alcaldeahumada · +2.100 seg (Cochiguaz)',
      camera: { position: [0.8, 4.9, 6.6], target: [0.6, 3.45, -1.4] },
    },
    {
      atProgress: 0.4,
      focusBadge: 'La Serena +1.750 (Av. del Mar)',
      camera: { position: [-1.5, 4.5, 7.2], target: [-1.6, 3.0, -0.5] },
    },
    {
      atProgress: 0.56,
      focusBadge: '@daniela.laserena · 9,12% ER',
      camera: { position: [-0.9, 4.4, 7.2], target: [-1.15, 2.85, -0.3] },
    },
    {
      atProgress: 0.74,
      focusBadge: 'Outliers: Monte Patria 50% · Illapel 52%',
      camera: { position: [4.6, 4.2, 7.4], target: [4.35, 2.4, -0.2] },
    },
  ],

  'benchmark-4': [
    {
      atProgress: 0,
      focusBadge: 'Formatos vs. Sentimiento (1.913 posts)',
      camera: { position: [0.2, 5.1, 12.6], target: [0.2, 2.35, 0] },
    },
    {
      atProgress: 0.2,
      focusBadge: 'Carruseles 49,4% vol. · 0,70% ER',
      camera: { position: [-2.9, 4.5, 8.6], target: [-2.9, 2.6, 0.3] },
    },
    {
      atProgress: 0.42,
      focusBadge: 'Videos y Reels · 2,08% ER (17 del Top 20)',
      camera: { position: [-4.5, 4.6, 8.0], target: [-4.55, 2.95, -0.6] },
    },
    {
      atProgress: 0.68,
      focusBadge: 'Sentimiento Positivo 75,4% (1.443)',
      camera: { position: [3.1, 4.7, 9.2], target: [3.0, 2.9, 0] },
    },
  ],

  'benchmark-5': [
    {
      atProgress: 0,
      focusBadge: 'Matriz Horaria 7 Días × 8 Bloques',
      camera: { position: [1.1, 6.2, 10.6], target: [0.3, 1.4, 0.1] },
    },
    {
      atProgress: 0.2,
      focusBadge: 'Saturación: Lun–Vie 12:00–18:00',
      camera: { position: [2.2, 5.5, 7.4], target: [1.8, 1.65, -1.2] },
    },
    {
      atProgress: 0.46,
      focusBadge: 'Ventana Óptima: Vie–Dom 21:00–00:00',
      camera: { position: [4.0, 4.9, 7.8], target: [2.4, 1.5, 1.3] },
    },
    {
      atProgress: 0.62,
      focusBadge: 'Pico Dominical · Domingo 09:00 hrs',
      camera: { position: [0.2, 4.8, 7.6], target: [-0.15, 1.45, 2.1] },
    },
    {
      atProgress: 0.76,
      focusBadge: 'Hoja de Ruta · 3 Acciones Directivas',
      camera: { position: [1.1, 6.4, 11.0], target: [0.3, 1.45, 0.1] },
    },
  ],

  'benchmark-6': [
    {
      atProgress: 0,
      focusBadge: 'Anfiteatro Regional · 18 Actores e Iconos',
      highlightRank: null,
      camera: { position: [2.6, 5.7, 13.8], target: [2.1, 2.3, 0] },
    },
    {
      atProgress: 0.2,
      focusBadge: '#1 Mi Radio · #2 Diario El Día',
      highlightRank: 1,
      camera: { position: [-1.4, 4.8, 9.2], target: [-1.2, 2.65, -1.1] },
    },
    {
      atProgress: 0.34,
      focusBadge: '#3 Guayacán · #4 La Serena 4 · #5 Papaya TV',
      highlightRank: 3,
      camera: { position: [1.4, 4.7, 8.6], target: [1.2, 2.55, -3.3] },
    },
    {
      atProgress: 0.48,
      focusBadge: '#7 Muni Coquimbo (Cruz) · #6 Muni La Serena (Faro)',
      highlightRank: 7,
      camera: { position: [4.6, 4.7, 8.6], target: [4.5, 2.55, -3.1] },
    },
    {
      atProgress: 0.64,
      focusBadge: '#8 Ali Manouchery · #9 Daniela Norambuena',
      highlightRank: 8,
      camera: { position: [6.4, 4.6, 8.6], target: [6.3, 2.45, -1.1] },
    },
    {
      atProgress: 0.78,
      focusBadge: '#11 Ovalle · #12 Illapel · #13 Monte Patria',
      highlightRank: 12,
      camera: { position: [1.3, 4.8, 8.8], target: [1.1, 2.25, -1.4] },
    },
    {
      atProgress: 0.88,
      focusBadge: '#16 Alcalde Ahumada · #17 Denis Cortés',
      highlightRank: 16,
      camera: { position: [4.4, 4.7, 8.6], target: [4.4, 2.3, -1.1] },
    },
  ],

  'benchmark-7': [
    {
      atProgress: 0,
      focusBadge: 'Síntesis Comparativa · Ambos Reportes',
      highlightRank: null,
      camera: { position: [0, 5.1, 11.8], target: [0, 2.45, 0] },
    },
    {
      atProgress: 0.22,
      focusBadge: 'Reporte 01 · 3,13M Likes · 1,06% ER',
      camera: { position: [-2.7, 4.5, 8.6], target: [-2.7, 2.6, 0] },
    },
    {
      atProgress: 0.48,
      focusBadge: 'Reporte 02 · 478,5k Int. · 1,97% ER',
      camera: { position: [2.7, 4.5, 8.6], target: [2.7, 2.6, 0] },
    },
    {
      atProgress: 0.76,
      focusBadge: 'Regla Unificada: Reels 3x + 21:00 hrs',
      camera: { position: [0, 4.7, 9.8], target: [0, 2.55, 0] },
    },
  ],

  // =========================================================
  // REPORTE 3: REPORTE DIGITAL NOVIEMBRE 2026 · EDICIÓN N° 3 (6 LÁMINAS)
  // =========================================================
  'edicion3-0': [
    {
      atProgress: 0,
      focusBadge: '13 Autoridades Regionales · 363 Piezas (28d)',
      highlightRank: null,
      camera: { position: [0.8, 5.4, 12.8], target: [0.4, 2.35, 0] },
    },
    {
      atProgress: 0.26,
      focusBadge: '676,6k Me Gusta · 43.431 Comentarios',
      highlightRank: null,
      camera: { position: [0.0, 4.5, 8.8], target: [0.0, 2.35, 0] },
    },
    {
      atProgress: 0.48,
      focusBadge: 'Top 3 (>83%): Tello · Manoucheri · Salinas',
      highlightRank: 1,
      camera: { position: [-1.4, 4.4, 7.6], target: [-1.1, 2.4, -2.5] },
    },
    {
      atProgress: 0.74,
      focusBadge: 'Sentimiento: 38,7% Neutral · 34,7% Pos · 26,6% Neg',
      highlightRank: null,
      camera: { position: [4.8, 3.6, 6.8], target: [5.2, 2.1, 0] },
    },
  ],

  'edicion3-1': [
    {
      atProgress: 0,
      focusBadge: 'Escalera Espiral · Inicio Ascenso Video POV',
      highlightRank: null,
      camera: { position: [0.2, 6.2, 30.2], target: [0.2, 4.25, 0.0] },
    },
    {
      atProgress: 0.09,
      focusBadge: 'POV 1ª Persona · Base de la Escalera (#13 → #9)',
      povClimb: {
        variant: 'podium',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.09,
        endProgress: 0.96,
      },
      camera: { position: [-6.4, 2.5, 3.0], target: [-5.9, 1.5, 1.0] },
    },
    {
      atProgress: 0.25,
      focusBadge: 'POV Escalando · #8 Matías Walker (42 Posts)',
      povClimb: {
        variant: 'podium',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.09,
        endProgress: 0.96,
      },
      camera: { position: [3.5, 5.2, -3.5], target: [3.1, 4.8, -2.5] },
    },
    {
      atProgress: 0.37,
      focusBadge: 'POV Escalando · #6 Sen. Daniel Núñez (60 Posts · 76% PPI)',
      povClimb: {
        variant: 'podium',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.09,
        endProgress: 0.96,
      },
      camera: { position: [6.8, 7.8, 1.8], target: [5.5, 7.2, 1.2] },
    },
    {
      atProgress: 0.51,
      focusBadge: 'POV Escalando · Conurbación (#5 Norambuena · #4 Manouchehri)',
      povClimb: {
        variant: 'podium',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.09,
        endProgress: 0.96,
      },
      camera: { position: [4.2, 9.2, 2.4], target: [3.2, 8.6, 2.1] },
    },
    {
      atProgress: 0.68,
      focusBadge: 'POV Escalando · #3 Bernardo Salinas (57% ER · 100% PPI)',
      povClimb: {
        variant: 'podium',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.09,
        endProgress: 0.96,
      },
      camera: { position: [-1.6, 10.6, 1.6], target: [-1.4, 9.8, 0.8] },
    },
    {
      atProgress: 0.79,
      focusBadge: 'POV Escalando · #2 Daniel Manoucheri (149k Seg · 212k Likes)',
      povClimb: {
        variant: 'podium',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.09,
        endProgress: 0.96,
      },
      camera: { position: [-0.8, 11.4, 3.0], target: [0.1, 10.8, 1.8] },
    },
    {
      atProgress: 0.89,
      focusBadge: 'POV Cima #1 · Dip. Carolina Tello (262k Likes · 17.9k Com.)',
      povClimb: {
        variant: 'podium',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.09,
        endProgress: 0.96,
      },
      camera: { position: [2.8, 12.6, 3.6], target: [3.4, 11.7, 2.0] },
    },
  ],

  'edicion3-2': [
    {
      atProgress: 0,
      focusBadge: 'Eficiencia Algorítmica PPI & Retorno Creativo',
      camera: { position: [0.3, 5.2, 12.6], target: [0.3, 2.5, 0] },
    },
    {
      atProgress: 0.2,
      focusBadge: 'Bernardo Salinas · 57% ER · 100% PPI (7.3k Seg)',
      camera: { position: [-4.2, 4.7, 7.6], target: [-4.4, 2.8, -0.35] },
    },
    {
      atProgress: 0.36,
      focusBadge: 'Eileen Patricia · 100% PPI · 14% ER (2.6k Seg)',
      camera: { position: [-2.8, 4.6, 7.6], target: [-3.0, 2.75, -0.35] },
    },
    {
      atProgress: 0.49,
      focusBadge: 'Manoucheri (85% PPI) vs. Carolina Tello (59% PPI)',
      camera: { position: [-0.9, 4.5, 8.2], target: [-0.95, 2.65, -0.35] },
    },
    {
      atProgress: 0.65,
      focusBadge: 'Videos/Reels · 74,7% vol. · 14% ER (10x Carrusel)',
      camera: { position: [1.8, 4.7, 8.0], target: [1.65, 2.65, 0.25] },
    },
    {
      atProgress: 0.82,
      focusBadge: 'Imágenes 3,06% · Carrusels 1,28% · Hashtags 256% ER',
      camera: { position: [3.2, 4.9, 9.2], target: [2.9, 2.95, -0.4] },
    },
  ],

  'edicion3-3': [
    {
      atProgress: 0,
      focusBadge: 'Duelo Municipal Conurbación · Volumen Total',
      duelMode: 'totals',
      camera: { position: [0, 5.0, 11.8], target: [0, 2.35, 0] },
    },
    {
      atProgress: 0.16,
      focusBadge: 'Daniela Norambuena · 34 Posts · 3.300 Comentarios',
      duelMode: 'totals',
      camera: { position: [-2.6, 4.5, 8.0], target: [-2.6, 2.5, 0] },
    },
    {
      atProgress: 0.35,
      focusBadge: 'Alí Manouchehri · 10 Posts · 34.200 Me Gusta',
      duelMode: 'totals',
      camera: { position: [2.6, 4.5, 8.0], target: [2.6, 2.5, 0] },
    },
    {
      atProgress: 0.52,
      focusBadge: 'Cambio en vivo → Ratios de Eficiencia (PPI vs ER)',
      duelMode: 'efficiency',
      camera: { position: [0, 4.8, 10.6], target: [0, 2.4, 0] },
    },
    {
      atProgress: 0.64,
      focusBadge: 'La Serena · 76% Rendimiento PPI por Constancia',
      duelMode: 'efficiency',
      camera: { position: [-2.6, 4.5, 8.0], target: [-2.6, 2.5, 0] },
    },
    {
      atProgress: 0.79,
      focusBadge: 'Coquimbo · 4,37% ER por Pieza vs 17% PPI',
      duelMode: 'efficiency',
      camera: { position: [2.6, 4.5, 8.0], target: [2.6, 2.5, 0] },
    },
  ],

  'edicion3-4': [
    {
      atProgress: 0,
      focusBadge: 'Tablero Consolidado · Escalera Espiral 13 Autoridades',
      highlightRank: null,
      camera: { position: [-2.4, 6.2, 31.4], target: [-1.6, 4.1, 0.0] },
    },
    {
      atProgress: 0.1,
      focusBadge: 'POV Escalando · Base (#13 Grohs · #12 Gahona · #11 Nati Castillo)',
      povClimb: {
        variant: 'ranking',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.1,
        endProgress: 0.94,
      },
      camera: { position: [-4.5, 2.5, 3.0], target: [-4.2, 1.5, 1.0] },
    },
    {
      atProgress: 0.34,
      focusBadge: 'POV Escalando · Bloque Medio (#10 Sulantay · #9 · #8 · #7 Eileen)',
      povClimb: {
        variant: 'ranking',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.1,
        endProgress: 0.94,
      },
      camera: { position: [5.0, 6.4, -2.5], target: [4.2, 6.0, -1.8] },
    },
    {
      atProgress: 0.6,
      focusBadge: 'POV Escalando · Tracción (#6 Núñez · #5 Norambuena · #4 Manouchehri)',
      povClimb: {
        variant: 'ranking',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.1,
        endProgress: 0.94,
      },
      camera: { position: [4.8, 9.4, 2.2], target: [4.0, 8.8, 1.8] },
    },
    {
      atProgress: 0.78,
      focusBadge: 'POV Cima · Podio Regional (#3 Salinas · #2 Manoucheri · #1 Tello)',
      povClimb: {
        variant: 'ranking',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.1,
        endProgress: 0.94,
      },
      camera: { position: [4.4, 12.8, 3.8], target: [4.5, 11.6, 1.9] },
    },
  ],

  // LÁMINA 06 (NUEVA DIAPOSITIVA FINAL): VIDEO POV 1ª PERSONA SUBIENDO #13 -> #1 COMPLETO
  'edicion3-5': [
    {
      atProgress: 0,
      focusBadge: 'POV 1ª Persona · Inicio en Base (#13 Erich Grohs · 981 Likes · 5% PPI)',
      povClimb: {
        variant: 'pov',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.02,
        endProgress: 0.96,
      },
      camera: { position: [-10.8, 3.8, 17.8], target: [0.0, 4.8, 0.0] },
    },
    {
      atProgress: 0.11,
      focusBadge: 'Peldaño #12 · Sen. Sergio Gahona (1,1k Likes · 0 Com.)',
      povClimb: {
        variant: 'pov',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.02,
        endProgress: 0.96,
      },
      camera: { position: [-8.0, 3.2, 4.0], target: [-6.5, 2.4, 2.8] },
    },
    {
      atProgress: 0.18,
      focusBadge: 'Peldaño #11 · Dip. Nati Castillo Rojas (11 Posts · 1,5k Likes)',
      povClimb: {
        variant: 'pov',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.02,
        endProgress: 0.96,
      },
      camera: { position: [-4.0, 4.0, 4.8], target: [-2.0, 3.3, 3.4] },
    },
    {
      atProgress: 0.25,
      focusBadge: 'Peldaño #10 · Dip. Marco A. Sulantay (291 Com. · Alto Debate)',
      povClimb: {
        variant: 'pov',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.02,
        endProgress: 0.96,
      },
      camera: { position: [1.0, 4.8, 4.8], target: [2.6, 4.1, 3.1] },
    },
    {
      atProgress: 0.32,
      focusBadge: 'Peldaño #09 · Dip. Nathalie Castillo (3,1k Likes · 2,94% ER)',
      povClimb: {
        variant: 'pov',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.02,
        endProgress: 0.96,
      },
      camera: { position: [6.0, 5.6, 3.0], target: [5.5, 5.0, 2.0] },
    },
    {
      atProgress: 0.4,
      focusBadge: 'Peldaño #08 · Sen. Matías Walker (42 Posts · 52% PPI)',
      povClimb: {
        variant: 'pov',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.02,
        endProgress: 0.96,
      },
      camera: { position: [7.5, 6.4, -0.8], target: [6.4, 5.8, -1.2] },
    },
    {
      atProgress: 0.47,
      focusBadge: 'Peldaño #07 · Dip. Eileen Patricia (100% PPI · 14% ER)',
      povClimb: {
        variant: 'pov',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.02,
        endProgress: 0.96,
      },
      camera: { position: [5.5, 7.4, -3.5], target: [3.2, 6.8, -2.8] },
    },
    {
      atProgress: 0.55,
      focusBadge: 'Peldaño #06 · Sen. Daniel Núñez (60 Posts · Ritmo Líder)',
      povClimb: {
        variant: 'pov',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.02,
        endProgress: 0.96,
      },
      camera: { position: [0.0, 8.2, -3.8], target: [-1.0, 7.6, -2.5] },
    },
    {
      atProgress: 0.63,
      focusBadge: 'Peldaño #05 · Alc. Daniela Norambuena (3,3k Com. · 76% PPI)',
      povClimb: {
        variant: 'pov',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.02,
        endProgress: 0.96,
      },
      camera: { position: [-5.0, 9.1, -2.5], target: [-4.6, 8.5, -1.2] },
    },
    {
      atProgress: 0.71,
      focusBadge: 'Peldaño #04 · Alc. Alí Manouchehri (4,37% ER · 34,2k Likes)',
      povClimb: {
        variant: 'pov',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.02,
        endProgress: 0.96,
      },
      camera: { position: [-6.0, 10.0, 1.0], target: [-4.5, 9.4, 1.5] },
    },
    {
      atProgress: 0.79,
      focusBadge: 'Podio #03 · Dip. Bernardo Salinas (57% ER Récord · 100% PPI)',
      povClimb: {
        variant: 'pov',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.02,
        endProgress: 0.96,
      },
      camera: { position: [-3.5, 11.0, 3.0], target: [-2.2, 10.3, 2.0] },
    },
    {
      atProgress: 0.87,
      focusBadge: 'Podio #02 · Dip. Daniel Manoucheri (149k Seg · 212k Likes)',
      povClimb: {
        variant: 'pov',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.02,
        endProgress: 0.96,
      },
      camera: { position: [-0.5, 11.9, 3.2], target: [0.2, 11.2, 2.1] },
    },
    {
      atProgress: 0.93,
      focusBadge: 'Cima #01 · Dip. Carolina Tello (262k Likes · 17,9k Com.)',
      povClimb: {
        variant: 'pov',
        fromRank: 13,
        toRank: 1,
        startProgress: 0.02,
        endProgress: 0.96,
      },
      camera: { position: [0.5, 12.8, 4.2], target: [0.2, 12.1, 2.1] },
    },
  ],
};

export function resolveActiveCue(
  slideKey: string,
  progress: number
): ChoreographyCue | null {
  const cues = PRESENTATION_CHOREOGRAPHY[slideKey];
  if (!cues || !cues.length) return null;
  let active = cues[0];
  for (let i = 1; i < cues.length; i++) {
    if (progress >= cues[i].atProgress) {
      active = cues[i];
    } else {
      break;
    }
  }
  return active;
}

export function resolvePovClimbState(
  cue: ChoreographyCue | null,
  audioProgress: number
): { variant: Edicion3SpiralVariant; progress: number; activeRank: number } | null {
  if (!cue?.povClimb) return null;
  const { variant, fromRank, toRank, startProgress, endProgress } = cue.povClimb;
  const span = Math.max(0.05, endProgress - startProgress);
  const rawU = (audioProgress - startProgress) / span;
  const u = Math.max(0, Math.min(1, rawU));
  const totalSteps = Math.abs(fromRank - toRank);
  const stepFloat = u * totalSteps;
  const activeRank =
    fromRank >= toRank
      ? Math.max(toRank, Math.min(fromRank, Math.round(fromRank - stepFloat)))
      : Math.min(toRank, Math.max(fromRank, Math.round(fromRank + stepFloat)));
  return { variant, progress: u, activeRank };
}
