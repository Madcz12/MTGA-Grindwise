import { useEffect, useRef, useState } from 'react';

interface ProgressRingProps {
  /** Value from 0-100 */
  percentage: number;
  /** Size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Ring color (CSS class or value) */
  color?: string;
  /** Show percentage text inside */
  showText?: boolean;
  /** Label below the percentage */
  label?: string;
  /** Additional value text */
  valueText?: string;
}

export function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 10,
  color = '#10b981',
  showText = true,
  label,
  valueText,
}: ProgressRingProps) {
  const [animatedPct, setAnimatedPct] = useState(0);
  const circleRef = useRef<SVGCircleElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedPct / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPct(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 drop-shadow-[0_0_12px_rgba(16,185,129,0.2)]"
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(15, 23, 42, 0.5)"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />
        </svg>
        {showText && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-black text-text-primary tracking-tighter"
              style={{ fontSize: size * 0.25 }}
            >
              {valueText || `${Math.round(animatedPct)}%`}
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</span>
      )}
    </div>
  );
}

}
