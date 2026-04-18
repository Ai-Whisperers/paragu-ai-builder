import { SushiPlate } from '@/components/icons/sushi'

export interface ConveyorBeltStripPlate {
  color: string
  variant?: 'nigiri' | 'maki' | 'sashimi'
}

export interface ConveyorBeltStripProps {
  plates: ConveyorBeltStripPlate[]
  speed?: string
  beltColor?: string
  className?: string
}

export function ConveyorBeltStrip({
  plates,
  speed = '20s',
  beltColor = '#37474F',
  className,
}: ConveyorBeltStripProps) {
  if (plates.length === 0) return null
  const loop = [...plates, ...plates]

  return (
    <div
      className={`relative overflow-hidden ${className ?? ''}`}
      aria-hidden="true"
      style={
        {
          '--belt-speed': speed,
          '--belt-color': beltColor,
        } as React.CSSProperties
      }
    >
      <div
        className="absolute inset-x-0 top-1/2 h-20 -translate-y-1/2 rounded-md"
        style={{
          background: `linear-gradient(180deg, ${beltColor}DD 0%, ${beltColor} 50%, ${beltColor}CC 100%)`,
        }}
      />
      <div
        className="absolute inset-x-0 top-1/2 h-20 -translate-y-1/2 opacity-40"
        style={{
          background:
            'repeating-linear-gradient(90deg, transparent 0 28px, rgba(255,255,255,0.15) 28px 30px)',
        }}
      />
      <div className="absolute inset-x-0 top-[calc(50%-40px)] h-1 bg-black/25" />
      <div className="absolute inset-x-0 top-[calc(50%+39px)] h-1 bg-black/40" />

      <div className="conveyor-track relative flex items-center gap-6 py-12">
        {loop.map((plate, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{
              width: '88px',
              height: '88px',
              filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.25))',
            }}
          >
            <SushiPlate
              plateColor={plate.color}
              toppingVariant={plate.variant ?? 'nigiri'}
              width="88"
              height="88"
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes conveyor-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .conveyor-track {
          animation: conveyor-scroll var(--belt-speed, 20s) linear infinite;
          width: max-content;
        }
        @media (prefers-reduced-motion: reduce) {
          .conveyor-track { animation: none; }
        }
      `}</style>
    </div>
  )
}
