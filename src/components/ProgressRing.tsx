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
  strokeWidth = 8,
  color = '#d4af37',
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
    // Animate from 0 to target percentage
    const timer = setTimeout(() => setAnimatedPct(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
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
              transition: 'stroke-dashoffset 1.2s ease-out',
              filter: `drop-shadow(0 0 6px ${color}40)`,
            }}
          />
        </svg>
        {showText && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-mono font-bold text-text-primary"
              style={{ fontSize: size * 0.22 }}
            >
              {valueText || `${Math.round(animatedPct)}%`}
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="text-sm text-text-secondary font-medium">{label}</span>
      )}
    </div>
  );
}
