export interface AnalyticsCardProps {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export function AnalyticsCard({
  title,
  value,
  change,
  icon,
  trend = 'up',
}: AnalyticsCardProps) {
  const isPositive = trend === 'up' || change >= 0
  
  return (
    <div className="glass backdrop-blur-xl bg-white/50 border border-white/20 rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-semibold ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </span>
        <span className="text-xs text-text-secondary">vs last month</span>
      </div>
    </div>
  )
}
