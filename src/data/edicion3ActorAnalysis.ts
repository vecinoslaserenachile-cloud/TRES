import { EDICION3_AUTHORITIES, Edicion3Authority } from './edicion3Data';

export type SentimentPolarity = 'positivo' | 'neutral' | 'negativo';

export type EngagementTierId = 'muy-alto' | 'alto' | 'medio' | 'bajo';

export interface EngagementTierMeta {
  id: EngagementTierId;
  label: string;
  rangeLabel: string;
  minEr: number;
  maxEr: number;
  accentColor: string;
}

export const ENGAGEMENT_TIERS: EngagementTierMeta[] = [
  {
    id: 'muy-alto',
    label: 'Muy Alto',
    rangeLabel: '≥ 10% ER',
    minEr: 10,
    maxEr: Infinity,
    accentColor: '#F59E0B',
  },
  {
    id: 'alto',
    label: 'Alto',
    rangeLabel: '3,0% – 9,9% ER',
    minEr: 3,
    maxEr: 9.999,
    accentColor: '#00F0FF',
  },
  {
    id: 'medio',
    label: 'Medio',
    rangeLabel: '1,5% – 2,99% ER',
    minEr: 1.5,
    maxEr: 2.999,
    accentColor: '#10B981',
  },
  {
    id: 'bajo',
    label: 'Bajo',
    rangeLabel: '< 1,5% ER',
    minEr: 0,
    maxEr: 1.499,
    accentColor: '#94A3B8',
  },
];

export interface SentimentColumnMeta {
  id: SentimentPolarity;
  label: string;
  subtitle: string;
  color: string;
  rgb: string;
}

export const SENTIMENT_COLUMNS: SentimentColumnMeta[] = [
  {
    id: 'positivo',
    label: 'Positivo',
    subtitle: 'Respaldo, logros y gestión propositiva',
    color: '#14B8A6',
    rgb: '20, 184, 166',
  },
  {
    id: 'neutral',
    label: 'Neutral',
    subtitle: 'Agenda institucional, debate e informativo',
    color: '#A855F7',
    rgb: '168, 85, 247',
  },
  {
    id: 'negativo',
    label: 'Negativo / Crítico',
    subtitle: 'Fiscalización frontal, denuncia y polarización',
    color: '#38BDF8',
    rgb: '56, 189, 248',
  },
];

interface RawSentimentProfile {
  positivoPct: number;
  neutralPct: number;
  negativoPct: number;
  dominantDriver: string;
  strategicRead: string;
}

// Per-authority sentiment breakdown aligned with agenda topics & period distribution
// Weighted post average: ~34.6% Positivo · ~38.7% Neutral · ~26.7% Negativo (362 posts)
const SENTIMENT_PROFILES_BY_HANDLE: Record<string, RawSentimentProfile> = {
  '@carotellodiputada': {
    positivoPct: 45,
    neutralPct: 33,
    negativoPct: 22,
    dominantDriver: 'Admisibilidad AFP y #NoADominga',
    strategicRead:
      'Convierte hitos legislativos en respaldo masivo (45% positivo) combinando defensa ambiental con alta activación en comentarios.',
  },
  '@danimanoucheri': {
    positivoPct: 40,
    neutralPct: 36,
    negativoPct: 24,
    dominantDriver: 'Fiscalización ciudadana y cercanía territorial',
    strategicRead:
      'Balance sólido sobre la mayor comunidad regional (149k): capitaliza aprobación en denuncias ciudadanas sin desgastar su base.',
  },
  '@bernardosalinasmaya': {
    positivoPct: 26,
    neutralPct: 29,
    negativoPct: 45,
    dominantDriver: '#RenunciaRabat y rechazo Presupuesto 2027',
    strategicRead:
      'Caso paradigmático de fiscalización crítica: el tono confrontacional detona el mayor engagement regional (57% ER y 100% PPI).',
  },
  '@manouchehri19': {
    positivoPct: 58,
    neutralPct: 30,
    negativoPct: 12,
    dominantDriver: 'Gestión comunal, deporte y obras en Coquimbo',
    strategicRead:
      'Mayor proporción de conversación favorable (58% positivo), pero la baja cadencia (10 posts) limita su impacto acumulado (17% PPI).',
  },
  '@daniela.laserena': {
    positivoPct: 38,
    neutralPct: 36,
    negativoPct: 26,
    dominantDriver: 'Seguridad urbana y servicios en La Serena',
    strategicRead:
      'Conversación intensa y mixta (3.300 comentarios): su constancia (34 posts) sostiene presencia diaria pese a fricciones propias de gestión.',
  },
  '@daniel_nunez_a': {
    positivoPct: 25,
    neutralPct: 43,
    negativoPct: 32,
    dominantDriver: 'Debate presupuestario 2027 y economía',
    strategicRead:
      'Predominio técnico-legislativo (43% neutral) acompañado de crítica presupuestaria; alto volumen (60 posts) con ER contenido (1,89%).',
  },
  '@eileendiputada': {
    positivoPct: 46,
    neutralPct: 34,
    negativoPct: 20,
    dominantDriver: 'Conectividad #aeropuerto Ovalle y ahorro AFP',
    strategicRead:
      'Narrativa propositiva de conectividad territorial que logra 14% ER y 100% PPI con un fuerte núcleo positivo (46%).',
  },
  '@matiaswalkerprieto': {
    positivoPct: 32,
    neutralPct: 50,
    negativoPct: 18,
    dominantDriver: 'Agenda senatorial y acuerdos institucionales',
    strategicRead:
      'La mitad de su conversación es neutral e informativa (50%), generando baja fricción pero también baja tasa de respuesta (0,91% ER).',
  },
  '@nathalie.castillodiputada': {
    positivoPct: 41,
    neutralPct: 37,
    negativoPct: 22,
    dominantDriver: 'Agenda social y comunitaria distrital',
    strategicRead:
      'Casi 3% de ER con sesgo positivo (41%); comunidad distrital receptiva a piezas breves y presencia territorial.',
  },
  '@marcosulantay': {
    positivoPct: 24,
    neutralPct: 37,
    negativoPct: 39,
    dominantDriver: 'Debate político y alta controversia en comentarios',
    strategicRead:
      'Registra la mayor razón comentarios/likes del tramo medio (291 com. sobre 2.1k likes), reflejando discusión polarizada (39% crítico).',
  },
  '@naticastillorojas': {
    positivoPct: 34,
    neutralPct: 44,
    negativoPct: 22,
    dominantDriver: 'Publicaciones programáticas acotadas',
    strategicRead:
      'Volumen reducido (11 posts) con conversación predominantemente neutral (44%) y baja tracción orgánica (4% PPI).',
  },
  '@sergio_gahona': {
    positivoPct: 22,
    neutralPct: 48,
    negativoPct: 30,
    dominantDriver: 'Vocería institucional y análisis crítico',
    strategicRead:
      'Casi sin conversación bidireccional (0 comentarios): mensaje unidireccional dividido entre registro neutral (48%) y crítica política (30%).',
  },
  '@erich_grohs': {
    positivoPct: 30,
    neutralPct: 46,
    negativoPct: 24,
    dominantDriver: 'Agenda informativa distrital',
    strategicRead:
      'Pese a contar con 12.1k seguidores, su tono neutral-informativo mantiene el ER bajo 1% (0,94%) y 5% PPI.',
  },
};

export interface ActorSentimentEngagementProfile {
  authority: Edicion3Authority;
  engagementTier: EngagementTierId;
  engagementTierMeta: EngagementTierMeta;
  dominantSentiment: SentimentPolarity;
  positivoPct: number;
  neutralPct: number;
  negativoPct: number;
  netSentimentBalance: number;
  erDeltaOctNov: number;
  dominantDriver: string;
  strategicRead: string;
  /** Normalized engagement heat intensity [0..1] combining ER% log-scale and PPI% */
  engagementHeatNorm: number;
}

export function resolveEngagementTier(erPct: number): EngagementTierMeta {
  return (
    ENGAGEMENT_TIERS.find((t) => erPct >= t.minEr && erPct <= t.maxEr) ??
    ENGAGEMENT_TIERS[ENGAGEMENT_TIERS.length - 1]
  );
}

export function resolveDominantSentiment(
  pos: number,
  neu: number,
  neg: number
): SentimentPolarity {
  if (pos >= neu && pos >= neg) return 'positivo';
  if (neg >= neu && neg > pos) return 'negativo';
  return 'neutral';
}

export const EDICION3_ACTOR_PROFILES: ActorSentimentEngagementProfile[] =
  EDICION3_AUTHORITIES.map((authority) => {
    const raw = SENTIMENT_PROFILES_BY_HANDLE[authority.handle] ?? {
      positivoPct: 34,
      neutralPct: 39,
      negativoPct: 27,
      dominantDriver: authority.highlightNote,
      strategicRead: authority.highlightNote,
    };
    const tierMeta = resolveEngagementTier(authority.erPct);
    const dominantSentiment = resolveDominantSentiment(
      raw.positivoPct,
      raw.neutralPct,
      raw.negativoPct
    );
    const erLogNorm = Math.min(1, Math.log1p(authority.erPct) / Math.log1p(57));
    const engagementHeatNorm = Math.min(
      1,
      Math.max(0.12, erLogNorm * 0.72 + (authority.ppiPct / 100) * 0.28)
    );

    return {
      authority,
      engagementTier: tierMeta.id,
      engagementTierMeta: tierMeta,
      dominantSentiment,
      positivoPct: raw.positivoPct,
      neutralPct: raw.neutralPct,
      negativoPct: raw.negativoPct,
      netSentimentBalance: raw.positivoPct - raw.negativoPct,
      erDeltaOctNov: Number((authority.erPct - authority.prevMonthErPct).toFixed(2)),
      dominantDriver: raw.dominantDriver,
      strategicRead: raw.strategicRead,
      engagementHeatNorm,
    };
  });

export function getWeightedActorSentimentSummary(
  profiles: ActorSentimentEngagementProfile[]
): {
  totalPosts: number;
  positivoPct: number;
  neutralPct: number;
  negativoPct: number;
  avgErPct: number;
} {
  if (profiles.length === 0) {
    return { totalPosts: 0, positivoPct: 0, neutralPct: 0, negativoPct: 0, avgErPct: 0 };
  }
  const totalPosts = profiles.reduce((acc, item) => acc + item.authority.posts, 0);
  const weightSum = totalPosts || profiles.length;
  const posSum = profiles.reduce(
    (acc, item) => acc + item.positivoPct * (totalPosts ? item.authority.posts : 1),
    0
  );
  const neuSum = profiles.reduce(
    (acc, item) => acc + item.neutralPct * (totalPosts ? item.authority.posts : 1),
    0
  );
  const negSum = profiles.reduce(
    (acc, item) => acc + item.negativoPct * (totalPosts ? item.authority.posts : 1),
    0
  );
  const avgErPct =
    profiles.reduce((acc, item) => acc + item.authority.erPct, 0) / profiles.length;

  return {
    totalPosts,
    positivoPct: Number((posSum / weightSum).toFixed(1)),
    neutralPct: Number((neuSum / weightSum).toFixed(1)),
    negativoPct: Number((negSum / weightSum).toFixed(1)),
    avgErPct: Number(avgErPct.toFixed(2)),
  };
}
