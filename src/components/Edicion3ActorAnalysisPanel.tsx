import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpDown,
  Crosshair,
  Grid3X3,
  LayoutGrid,
  Search,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  ActorSentimentEngagementProfile,
  EDICION3_ACTOR_PROFILES,
  ENGAGEMENT_TIERS,
  EngagementTierId,
  SENTIMENT_COLUMNS,
  SentimentPolarity,
  getWeightedActorSentimentSummary,
} from '../data/edicion3ActorAnalysis';
import { AuthorityRoleCategory } from '../data/edicion3Data';

interface Edicion3ActorAnalysisPanelProps {
  isOpen: boolean;
  initialRank?: number | null;
  onClose: () => void;
  onFocusAuthorityIn3D: (rank: number) => void;
}

type MatrixViewMode = 'actors' | 'quadrant';
type ActorSortKey = 'erPct' | 'rank' | 'positivoPct' | 'negativoPct' | 'ppiPct';

function formatDecimalEs(value: number, decimals = 1): string {
  return value.toFixed(decimals).replace('.', ',');
}

function formatLikesCompact(likes: number): string {
  if (likes >= 1000) {
    return `${(likes / 1000).toFixed(1).replace(/\.0$/, '').replace('.', ',')}k`;
  }
  return String(likes);
}

export const Edicion3ActorAnalysisPanel: React.FC<Edicion3ActorAnalysisPanelProps> = ({
  isOpen,
  initialRank = null,
  onClose,
  onFocusAuthorityIn3D,
}) => {
  const [viewMode, setViewMode] = useState<MatrixViewMode>('actors');
  const [roleFilter, setRoleFilter] = useState<'all' | AuthorityRoleCategory>('all');
  const [tierFilter, setTierFilter] = useState<'all' | EngagementTierId>('all');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<ActorSortKey>('erPct');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedRank, setSelectedRank] = useState<number>(initialRank ?? 1);

  useEffect(() => {
    if (isOpen && initialRank !== null) {
      setSelectedRank(initialRank);
    }
  }, [initialRank, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const filteredProfiles = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = EDICION3_ACTOR_PROFILES.filter((p) => {
      if (roleFilter !== 'all' && p.authority.role !== roleFilter) return false;
      if (tierFilter !== 'all' && p.engagementTier !== tierFilter) return false;
      if (!q) return true;
      return (
        p.authority.name.toLowerCase().includes(q) ||
        p.authority.handle.toLowerCase().includes(q) ||
        p.authority.role.toLowerCase().includes(q) ||
        p.dominantDriver.toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      let av = 0;
      let bv = 0;
      if (sortBy === 'erPct') {
        av = a.authority.erPct;
        bv = b.authority.erPct;
      } else if (sortBy === 'rank') {
        av = a.authority.rank;
        bv = b.authority.rank;
      } else if (sortBy === 'ppiPct') {
        av = a.authority.ppiPct;
        bv = b.authority.ppiPct;
      } else if (sortBy === 'positivoPct') {
        av = a.positivoPct;
        bv = b.positivoPct;
      } else {
        av = a.negativoPct;
        bv = b.negativoPct;
      }
      return sortAsc ? av - bv : bv - av;
    });
  }, [query, roleFilter, sortAsc, sortBy, tierFilter]);

  const summary = useMemo(
    () => getWeightedActorSentimentSummary(filteredProfiles),
    [filteredProfiles]
  );

  const selectedProfile: ActorSentimentEngagementProfile = useMemo(() => {
    return (
      filteredProfiles.find((p) => p.authority.rank === selectedRank) ??
      EDICION3_ACTOR_PROFILES.find((p) => p.authority.rank === selectedRank) ??
      EDICION3_ACTOR_PROFILES[0]
    );
  }, [filteredProfiles, selectedRank]);

  if (!isOpen) return null;

  const handleSortToggle = (key: ActorSortKey) => {
    if (sortBy === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortBy(key);
      setSortAsc(key === 'rank');
    }
  };

  const renderSentimentHeatCell = (
    profile: ActorSentimentEngagementProfile,
    polarity: SentimentPolarity
  ) => {
    const colMeta = SENTIMENT_COLUMNS.find((c) => c.id === polarity)!;
    const pct =
      polarity === 'positivo'
        ? profile.positivoPct
        : polarity === 'neutral'
          ? profile.neutralPct
          : profile.negativoPct;
    const isDominant = profile.dominantSentiment === polarity;

    // Cross sentiment intensity with the authority's engagement heat
    const combinedHeat = Math.min(
      1,
      Math.max(0.08, (pct / 60) * 0.62 + profile.engagementHeatNorm * 0.38)
    );
    const bgAlpha = 0.08 + combinedHeat * 0.44;
    const borderAlpha = isDominant ? 0.72 : 0.16 + combinedHeat * 0.24;

    return (
      <div
        className="flex h-10 flex-col items-center justify-center rounded-lg border transition-transform duration-150"
        style={{
          backgroundColor: `rgba(${colMeta.rgb}, ${bgAlpha.toFixed(3)})`,
          borderColor: `rgba(${colMeta.rgb}, ${borderAlpha.toFixed(3)})`,
        }}
        title={`${profile.authority.shortName} · ${colMeta.label}: ${pct}% (${profile.authority.erLabel} ER)`}
      >
        <div className="flex items-baseline gap-1">
          <span className="font-mono-tabular text-xs font-bold text-white">{pct}%</span>
          {isDominant && (
            <span
              className="text-[9px] font-semibold uppercase"
              style={{ color: colMeta.color }}
            >
              Dom
            </span>
          )}
        </div>
        <div className="mt-0.5 h-1 w-12 overflow-hidden rounded-full bg-black/35">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, Math.round((pct / 60) * 100))}%`,
              backgroundColor: colMeta.color,
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panel de Análisis de Actores: Matriz de Calor Sentimiento por Engagement"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/82 p-3 backdrop-blur-md sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[92dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#070E20] text-slate-100 shadow-2xl">
        {/* Top Modal Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-[#F59E0B]">Edición N° 3</span>
              <span aria-hidden="true">·</span>
              <span>Análisis de Actores</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                {filteredProfiles.length} de 13 autoridades · {summary.totalPosts} publicaciones
              </span>
            </div>
            <h2
              className="font-display mt-1 text-lg font-bold tracking-tight text-white sm:text-2xl"
              style={{ textWrap: 'balance' }}
            >
              Matriz de Calor: Sentimiento de Conversación × Nivel de Engagement
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de Análisis de Actores"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-slate-300 transition-colors hover:bg-white/12 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Summary Strip + Controls Toolbar */}
        <div className="flex flex-col gap-3 border-b border-white/10 bg-[#0B1326]/70 px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Segmented View Toggle */}
            <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-[#060B19] p-1">
              <button
                type="button"
                onClick={() => setViewMode('actors')}
                className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                  viewMode === 'actors'
                    ? 'bg-[#F59E0B] text-[#060B19]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Grid3X3 className="h-3.5 w-3.5 shrink-0" />
                <span>Matriz por Autoridad (13×3)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('quadrant')}
                className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                  viewMode === 'quadrant'
                    ? 'bg-[#00F0FF] text-[#060B19]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
                <span>Cuadrante Calor (4×3)</span>
              </button>
            </div>

            {/* Weighted Aggregate Readout */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span className="text-slate-400">Balance muestra:</span>
              <span className="font-mono-tabular font-semibold text-[#14B8A6]">
                Positivo {formatDecimalEs(summary.positivoPct)}%
              </span>
              <span className="font-mono-tabular font-semibold text-[#A855F7]">
                Neutral {formatDecimalEs(summary.neutralPct)}%
              </span>
              <span className="font-mono-tabular font-semibold text-[#38BDF8]">
                Crítico {formatDecimalEs(summary.negativoPct)}%
              </span>
              <span className="text-slate-600" aria-hidden="true">
                |
              </span>
              <span className="font-mono-tabular font-semibold text-[#F59E0B]">
                ER prom. {formatDecimalEs(summary.avgErPct, 2)}%
              </span>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {(['all', 'Diputado/a', 'Senador', 'Alcalde/sa'] as const).map((role) => {
                const active = roleFilter === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setRoleFilter(role)}
                    className={`min-h-[34px] rounded-lg px-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-white text-[#060B19]'
                        : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {role === 'all' ? 'Todos los cargos' : role}
                  </button>
                );
              })}

              <span className="mx-1 hidden h-4 w-px bg-white/10 sm:inline-block" />

              {(['all', 'muy-alto', 'alto', 'medio', 'bajo'] as const).map((tierId) => {
                const active = tierFilter === tierId;
                const label =
                  tierId === 'all'
                    ? 'Todo ER'
                    : ENGAGEMENT_TIERS.find((t) => t.id === tierId)?.label ?? tierId;
                return (
                  <button
                    key={tierId}
                    type="button"
                    onClick={() => setTierFilter(tierId)}
                    className={`min-h-[34px] rounded-lg px-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? 'border border-[#00F0FF]/60 bg-[#00F0FF]/18 text-[#00F0FF]'
                        : 'border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrar autoridad o tema..."
                className="min-h-[36px] w-full rounded-lg border border-white/15 bg-[#060B19] pr-3 pl-8 text-xs text-white placeholder:text-slate-500 focus:border-[#00F0FF] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Main Split Body: Left Matrix (8 cols) + Right Authority Inspector (4 cols) */}
        <div className="grid min-h-0 flex-1 grid-cols-1 divide-y divide-white/10 overflow-hidden lg:grid-cols-12 lg:divide-x lg:divide-y-0">
          {/* Left Stage: Visual Heatmap Matrix */}
          <div className="editorial-scroll min-h-0 overflow-y-auto p-4 sm:p-5 lg:col-span-8">
            {filteredProfiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-6 py-12 text-center">
                <p className="text-sm font-medium text-slate-200">
                  Ninguna autoridad coincide con los filtros seleccionados.
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Restablece el filtro de cargo, tramo de engagement o búsqueda para visualizar la matriz completa.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRoleFilter('all');
                    setTierFilter('all');
                    setQuery('');
                  }}
                  className="mt-4 inline-flex min-h-[38px] items-center rounded-lg bg-[#F59E0B] px-4 text-xs font-semibold text-[#060B19] hover:bg-amber-400"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : viewMode === 'actors' ? (
              <div className="space-y-3">
                {/* Heatmap Thermal Scale Legend */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <span>
                    Intensidad de celda = proporción de sentimiento ponderada por tracción de engagement (ER% + PPI)
                  </span>
                  <div className="flex items-center gap-2">
                    <span>Menor calor</span>
                    <div className="flex h-2.5 w-24 overflow-hidden rounded-full border border-white/15">
                      <span className="flex-1 bg-[#14B8A6]/15" />
                      <span className="flex-1 bg-[#14B8A6]/35" />
                      <span className="flex-1 bg-[#14B8A6]/60" />
                      <span className="flex-1 bg-[#14B8A6]/90" />
                    </div>
                    <span>Mayor calor</span>
                  </div>
                </div>

                {/* 13x3 Authority Sentiment x Engagement Matrix */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] border-separate border-spacing-y-1.5 text-left text-xs">
                    <thead>
                      <tr className="text-[11px] text-slate-400">
                        <th className="px-2 pb-1">
                          <button
                            type="button"
                            onClick={() => handleSortToggle('rank')}
                            className="inline-flex items-center gap-1 hover:text-white"
                          >
                            Autoridad <ArrowUpDown className="h-3 w-3" />
                          </button>
                        </th>
                        <th className="px-2 pb-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleSortToggle('erPct')}
                            className="inline-flex items-center gap-1 hover:text-white"
                          >
                            Engagement <ArrowUpDown className="h-3 w-3" />
                          </button>
                        </th>
                        <th className="px-1.5 pb-1 text-center">
                          <button
                            type="button"
                            onClick={() => handleSortToggle('positivoPct')}
                            className="inline-flex items-center gap-1 text-[#14B8A6] hover:text-white"
                          >
                            Positivo <ArrowUpDown className="h-3 w-3" />
                          </button>
                        </th>
                        <th className="px-1.5 pb-1 text-center text-[#A855F7]">Neutral</th>
                        <th className="px-1.5 pb-1 text-center">
                          <button
                            type="button"
                            onClick={() => handleSortToggle('negativoPct')}
                            className="inline-flex items-center gap-1 text-[#38BDF8] hover:text-white"
                          >
                            Crítico <ArrowUpDown className="h-3 w-3" />
                          </button>
                        </th>
                        <th className="px-2 pb-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleSortToggle('ppiPct')}
                            className="inline-flex items-center gap-1 hover:text-white"
                          >
                            PPI <ArrowUpDown className="h-3 w-3" />
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProfiles.map((profile) => {
                        const { authority, engagementTierMeta } = profile;
                        const isSelected = selectedProfile.authority.rank === authority.rank;
                        return (
                          <tr
                            key={authority.handle}
                            onClick={() => setSelectedRank(authority.rank)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
                            }`}
                          >
                            <td className="rounded-l-xl border-y border-l border-white/10 px-2.5 py-1.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className="font-mono-tabular w-6 text-xs font-bold"
                                  style={{ color: authority.color }}
                                >
                                  #{String(authority.rank).padStart(2, '0')}
                                </span>
                                <div className="min-w-0">
                                  <div className="truncate font-semibold text-white">
                                    {authority.shortName}
                                  </div>
                                  <div className="truncate text-[10px] text-slate-400">
                                    {authority.role} · {authority.posts} posts · {authority.likesLabel} likes
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="border-y border-white/10 px-2 py-1.5 text-right">
                              <div
                                className="font-mono-tabular text-xs font-bold"
                                style={{ color: engagementTierMeta.accentColor }}
                              >
                                {authority.erLabel}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {engagementTierMeta.label}
                              </div>
                            </td>

                            <td className="border-y border-white/10 px-1.5 py-1.5">
                              {renderSentimentHeatCell(profile, 'positivo')}
                            </td>
                            <td className="border-y border-white/10 px-1.5 py-1.5">
                              {renderSentimentHeatCell(profile, 'neutral')}
                            </td>
                            <td className="border-y border-white/10 px-1.5 py-1.5">
                              {renderSentimentHeatCell(profile, 'negativo')}
                            </td>

                            <td className="rounded-r-xl border-y border-r border-white/10 px-2.5 py-1.5 text-right">
                              <span className="font-mono-tabular text-xs font-bold text-[#10B981]">
                                {authority.ppiLabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* 4 x 3 Quadrant Heatmap Grid: Engagement Tier (Y) x Dominant Sentiment Polarity (X) */
              <div className="space-y-3">
                <p className="text-[11px] text-slate-400">
                  Cruce bidimensional de los 4 niveles de engagement obtenido (eje vertical) frente a la polaridad predominante de la conversación (eje horizontal).
                </p>
                <div className="overflow-x-auto">
                  <div className="min-w-[660px] space-y-2">
                    {/* Column Headers */}
                    <div className="grid grid-cols-12 gap-2 text-xs">
                      <div className="col-span-3 px-2 py-1 text-[11px] font-semibold text-slate-400">
                        Nivel de Engagement
                      </div>
                      {SENTIMENT_COLUMNS.map((col) => (
                        <div key={col.id} className="col-span-3 px-2 py-1">
                          <div className="font-semibold" style={{ color: col.color }}>
                            {col.label}
                          </div>
                          <div className="text-[10px] text-slate-400">{col.subtitle}</div>
                        </div>
                      ))}
                    </div>

                    {/* 4 Engagement Tier Rows */}
                    {ENGAGEMENT_TIERS.map((tier) => (
                      <div key={tier.id} className="grid grid-cols-12 items-stretch gap-2">
                        {/* Y-axis Tier Header */}
                        <div className="col-span-3 flex flex-col justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                          <span
                            className="text-xs font-bold"
                            style={{ color: tier.accentColor }}
                          >
                            {tier.label}
                          </span>
                          <span className="font-mono-tabular mt-0.5 text-[11px] text-slate-300">
                            {tier.rangeLabel}
                          </span>
                        </div>

                        {/* 3 Sentiment Intersections */}
                        {SENTIMENT_COLUMNS.map((col) => {
                          const cellActors = filteredProfiles.filter(
                            (p) => p.engagementTier === tier.id && p.dominantSentiment === col.id
                          );
                          const cellLikes = cellActors.reduce(
                            (s, p) => s + p.authority.likes,
                            0
                          );
                          const avgCellHeat =
                            cellActors.length > 0
                              ? cellActors.reduce((s, p) => s + p.engagementHeatNorm, 0) /
                                cellActors.length
                              : 0;
                          const alpha = cellActors.length > 0 ? 0.1 + avgCellHeat * 0.24 : 0.02;

                          return (
                            <div
                              key={`${tier.id}-${col.id}`}
                              className="col-span-3 flex min-h-[96px] flex-col justify-between rounded-xl border p-2.5 transition-colors"
                              style={{
                                backgroundColor: `rgba(${col.rgb}, ${alpha.toFixed(3)})`,
                                borderColor:
                                  cellActors.length > 0
                                    ? `rgba(${col.rgb}, 0.42)`
                                    : 'rgba(255, 255, 255, 0.08)',
                              }}
                            >
                              {cellActors.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
                                  Sin actores en este cruce
                                </div>
                              ) : (
                                <>
                                  <div className="flex flex-col gap-1">
                                    {cellActors.map((item) => {
                                      const isSelected =
                                        selectedProfile.authority.rank === item.authority.rank;
                                      return (
                                        <button
                                          key={item.authority.handle}
                                          type="button"
                                          onClick={() => setSelectedRank(item.authority.rank)}
                                          className={`flex w-full items-center justify-between gap-1.5 rounded-lg border px-2 py-1 text-left text-[11px] transition-colors ${
                                            isSelected
                                              ? 'border-white bg-white/15 font-bold text-white'
                                              : 'border-white/10 bg-[#060B19]/75 text-slate-200 hover:border-white/30'
                                          }`}
                                        >
                                          <span className="truncate">
                                            #{item.authority.rank} {item.authority.shortName}
                                          </span>
                                          <span
                                            className="font-mono-tabular shrink-0 font-bold"
                                            style={{ color: tier.accentColor }}
                                          >
                                            {item.authority.erLabel}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <div className="font-mono-tabular mt-2 flex items-center justify-between border-t border-white/10 pt-1 text-[10px] text-slate-300">
                                    <span>
                                      {cellActors.length}{' '}
                                      {cellActors.length === 1 ? 'actor' : 'actores'}
                                    </span>
                                    <span>{formatLikesCompact(cellLikes)} likes</span>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Stage: Selected Authority Detail Inspector */}
          <aside className="editorial-scroll flex min-h-0 flex-col justify-between overflow-y-auto bg-[#060B19]/65 p-4 sm:p-5 lg:col-span-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span
                    className="font-mono-tabular font-bold"
                    style={{ color: selectedProfile.authority.color }}
                  >
                    Posición #{String(selectedProfile.authority.rank).padStart(2, '0')}
                  </span>
                  <span className="text-slate-400">
                    {selectedProfile.authority.role} · {selectedProfile.engagementTierMeta.label}
                  </span>
                </div>
                <h3 className="font-display mt-1 text-lg font-bold text-white">
                  {selectedProfile.authority.name}
                </h3>
                <p className="font-mono-tabular text-xs text-[#00F0FF]">
                  {selectedProfile.authority.handle}
                </p>
              </div>

              {/* Sentiment Composition Bar */}
              <div className="border-y border-white/10 py-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    Perfil de Sentimiento en el Período
                  </span>
                  <span className="font-mono-tabular text-[11px] text-slate-400">
                    Balance neto:{' '}
                    <strong
                      className={
                        selectedProfile.netSentimentBalance >= 0
                          ? 'text-[#14B8A6]'
                          : 'text-[#38BDF8]'
                      }
                    >
                      {selectedProfile.netSentimentBalance >= 0 ? '+' : ''}
                      {selectedProfile.netSentimentBalance} pts
                    </strong>
                  </span>
                </div>

                <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    style={{ width: `${selectedProfile.positivoPct}%`, backgroundColor: '#14B8A6' }}
                    title={`Positivo: ${selectedProfile.positivoPct}%`}
                  />
                  <div
                    style={{ width: `${selectedProfile.neutralPct}%`, backgroundColor: '#A855F7' }}
                    title={`Neutral: ${selectedProfile.neutralPct}%`}
                  />
                  <div
                    style={{ width: `${selectedProfile.negativoPct}%`, backgroundColor: '#38BDF8' }}
                    title={`Crítico/Negativo: ${selectedProfile.negativoPct}%`}
                  />
                </div>

                <div className="mt-2.5 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Positivo</div>
                    <div className="font-mono-tabular text-sm font-bold text-[#14B8A6]">
                      {selectedProfile.positivoPct}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Neutral</div>
                    <div className="font-mono-tabular text-sm font-bold text-[#A855F7]">
                      {selectedProfile.neutralPct}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Negativo</div>
                    <div className="font-mono-tabular text-sm font-bold text-[#38BDF8]">
                      {selectedProfile.negativoPct}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement & Performance Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Engagement ER</div>
                  <div
                    className="font-mono-tabular mt-0.5 text-sm font-bold"
                    style={{ color: selectedProfile.engagementTierMeta.accentColor }}
                  >
                    {selectedProfile.authority.erLabel}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Var. Oct → Nov</div>
                  <div
                    className={`font-mono-tabular mt-0.5 inline-flex items-center gap-1 text-xs font-bold ${
                      selectedProfile.erDeltaOctNov >= 0 ? 'text-[#10B981]' : 'text-[#FB7185]'
                    }`}
                  >
                    {selectedProfile.erDeltaOctNov >= 0 ? (
                      <TrendingUp className="h-3 w-3 shrink-0" />
                    ) : (
                      <TrendingDown className="h-3 w-3 shrink-0" />
                    )}
                    <span>
                      {selectedProfile.erDeltaOctNov >= 0 ? '+' : ''}
                      {formatDecimalEs(selectedProfile.erDeltaOctNov, 2)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Índice PPI</div>
                  <div className="font-mono-tabular mt-0.5 text-sm font-bold text-[#10B981]">
                    {selectedProfile.authority.ppiLabel}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Me gusta</div>
                  <div className="font-mono-tabular mt-0.5 font-bold text-white">
                    {selectedProfile.authority.likesLabel}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Comentarios</div>
                  <div className="font-mono-tabular mt-0.5 font-bold text-white">
                    {selectedProfile.authority.commentsLabel}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Posts (28d)</div>
                  <div className="font-mono-tabular mt-0.5 font-bold text-slate-200">
                    {selectedProfile.authority.posts}
                  </div>
                </div>
              </div>

              {/* Strategic Reading */}
              <div className="space-y-1.5 border-t border-white/10 pt-3 text-xs">
                <div className="text-[11px] font-semibold text-[#F59E0B]">
                  Eje de conversación: {selectedProfile.dominantDriver}
                </div>
                <p className="leading-relaxed text-slate-300">
                  {selectedProfile.strategicRead}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => onFocusAuthorityIn3D(selectedProfile.authority.rank)}
                className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-4 text-xs font-bold text-[#060B19] transition-colors hover:bg-amber-400"
              >
                <Crosshair className="h-4 w-4 shrink-0" />
                <span>Enfocar peldaño #{selectedProfile.authority.rank} en escena 3D</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
