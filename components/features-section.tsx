'use client'

import { Shield, Zap, CreditCard, Star, Truck, Heart } from 'lucide-react'

const features = [
  {
    title: 'Verified DNA',
    description: 'Every vehicle undergoes a 200-point inspection and deep history audit before listing.',
    icon: Shield,
    className: 'lg:col-span-2 lg:row-span-2 bg-midnight text-white',
    accent: 'text-rivian'
  },
  {
    title: 'Instant Escrow',
    description: 'Payments are held securely in escrow until you take delivery.',
    icon: CreditCard,
    className: 'bg-rivian text-white',
    accent: 'text-compass'
  },
  {
    title: 'Real Reviews',
    description: 'Trustworthy feedback from our community of verified buyers.',
    icon: Star,
    className: 'bg-glacier-white text-midnight',
    accent: 'text-amber-500'
  },
  {
    title: 'Flexible Logistics',
    description: 'Home delivery or local pickup. You choose how you get your ride.',
    icon: Truck,
    className: 'bg-glacier-white text-midnight',
    accent: 'text-rivian'
  },
  {
    title: 'Smart Favorites',
    description: 'Save vehicles and get price drop alerts in real-time.',
    icon: Heart,
    className: 'lg:col-span-2 bg-compass text-midnight',
    accent: 'text-rivian'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="container-max">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="badge-accent">Platform Excellence</span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-midnight">
            Engineered for <br />
            <span className="text-rivian">Total Confidence.</span>
          </h2>
          <p className="text-lg text-text-secondary font-medium">
            We’ve removed the friction from automotive commerce. From secure payments to verified inspections, every detail is handled.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[240px]">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative rounded-[32px] p-8 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 ${feature.className}`}
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 ${feature.className.includes('bg-glacier-white') ? 'bg-black/5' : ''}`}>
                  <feature.icon className={`w-6 h-6 ${feature.accent}`} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tighter leading-tight">
                    {feature.title}
                  </h3>
                  <p className={`text-sm font-medium leading-relaxed opacity-60`}>
                    {feature.description}
                  </p>
                </div>
              </div>
              
              {/* Decorative Circle */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
