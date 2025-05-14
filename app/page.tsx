import BonsaiGenerator from "@/components/bonsai-generator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-forest-800 via-forest-700 to-forest-900 text-white overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-forest-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-forest-500/10 rounded-full blur-3xl"></div>

      {/* Star decorations */}
      <div className="absolute top-40 right-20 w-8 h-8 bg-white star-shape opacity-20"></div>
      <div className="absolute bottom-40 left-20 w-6 h-6 bg-white star-shape opacity-20"></div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header section with creative typography */}
          <div className="mb-8 relative">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2 gradient-text">
              DIGITAL
              <br />
              BONSAI
            </h1>
            <div className="w-24 h-1 bg-white mb-3"></div>
            <p className="text-base md:text-lg text-forest-100 max-w-xl">
              Create your own unique digital bonsai masterpiece with our interactive generator. Shape, grow, and
              customize your perfect tree.
            </p>

            {/* Decorative arrow */}
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2">
              <svg width="120" height="16" viewBox="0 0 180 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 12H178M178 12L166 1M178 12L166 23" stroke="white" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <BonsaiGenerator />
        </div>
      </div>
    </main>
  )
}
