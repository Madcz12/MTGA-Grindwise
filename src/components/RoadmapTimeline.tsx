import type { RoadmapWeek } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface RoadmapTimelineProps {
  weeks: RoadmapWeek[];
}

export function RoadmapTimeline({ weeks }: RoadmapTimelineProps) {
  const { t } = useLanguage();

  if (weeks.length === 0) {
    return (
      <div className="bg-surface-container-low p-12 text-center rounded-xl border border-outline-variant/20 shadow-sm">
        <span className="material-symbols-outlined text-5xl mb-4 text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
        <p className="text-xl font-bold text-on-surface">{t('roadmapTimeline.success.title')}</p>
        <p className="text-sm text-on-surface-variant mt-2">{t('roadmapTimeline.success.message')}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm">
      {weeks.map((week, index) => (
        <div key={week.weekNumber} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b border-outline-variant/10 hover:bg-surface-variant/10 transition-colors animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
          <div>
            <div className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
              {week.isComplete ? t('roadmapTimeline.labels.finalWeek') : t('roadmapTimeline.labels.weekQuests', { week: week.weekNumber })}
            </div>
            <div className="text-xl font-bold text-on-surface mb-1">
              {week.dailyQuestsCompleted}{t('roadmapTimeline.labels.perDay')}
            </div>
            <div className="flex gap-2">
              {week.wildcardCumulative.mythic > 0 && (
                <span className="bg-error/20 text-error text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  {week.wildcardCumulative.mythic}
                </span>
              )}
              {week.wildcardCumulative.rare > 0 && (
                <span className="bg-primary-container/20 text-primary-container text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {week.wildcardCumulative.rare}
                </span>
              )}
              {week.wildcardCumulative.uncommon > 0 && (
                <span className="bg-surface-variant text-on-surface-variant text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
                  {week.wildcardCumulative.uncommon}
                </span>
              )}
            </div>
          </div>
          
          <div>
            <div className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">{t('roadmapTimeline.labels.wins')}</div>
            <div className="text-xl font-bold text-on-surface">{week.weeklyWinsAchieved}{t('roadmapTimeline.labels.perWeek')}</div>
          </div>
          
          <div>
            <div className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">{t('roadmapTimeline.labels.gold')}</div>
            <div className="text-xl font-bold text-secondary-fixed">+{week.goldEarned.toLocaleString()}</div>
          </div>
          
          <div>
            <div className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">{t('roadmapTimeline.labels.packs')}</div>
            <div className="text-xl font-bold text-on-surface">
              {week.packsOpened} <span className="text-on-surface-variant text-sm font-normal">({week.packsCumulative})</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
