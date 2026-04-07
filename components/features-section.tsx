export function FeaturesSection() {
  const features = [
    {
      icon: '🔍',
      title: 'Intelligent Search',
      description: 'Filter by price, category, location, and more with our advanced search engine.',
    },
    {
      icon: '✅',
      title: 'Verified Listings',
      description: 'All sellers are verified and vehicles are inspected for quality and authenticity.',
    },
    {
      icon: '💳',
      title: 'Secure Payments',
      description: 'Protected transactions with escrow service for both buyers and sellers.',
    },
    {
      icon: '⭐',
      title: 'Ratings & Reviews',
      description: 'Real feedback from the community to help you make informed decisions.',
    },
    {
      icon: '🚚',
      title: 'Flexible Delivery',
      description: 'Options for pickup, delivery, or local pickup with support from our team.',
    },
    {
      icon: '🛡️',
      title: 'Buyer Protection',
      description: '30-day satisfaction guarantee and hassle-free returns on most vehicles.',
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container-max">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
              <span className="text-balance">Why Choose AutoFleet Pro?</span>
            </h2>
            <p className="text-xl text-text-secondary">
              The most trusted automotive marketplace with millions of vehicles and happy customers worldwide.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="card hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="text-5xl">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
