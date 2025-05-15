import { Metadata } from 'next';
import BonsaiGenerator from "@/components/bonsai-generator"

export const metadata: Metadata = {
  title: 'Bonsai Tree Generator - Create Your Digital Masterpiece',
  description: 'Generate and customize unique digital bonsai trees. An interactive experience to shape, grow, and design your perfect virtual bonsai.',
};
export default function Home() {
  return (
    <main className="min-h-screen bg-deep-forest text-white overflow-hidden relative">
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
              <span className="gradient-text">DIGITAL</span>
              <br />
              <span className="gradient-text">BONSAI</span>
            </h1>
            <div className="w-24 h-1 bg-amber-500 mb-3"></div>
            <p className="text-base md:text-lg text-forest-100 max-w-xl">
              Create your own unique digital bonsai masterpiece with our interactive generator. Shape, grow, and
              customize your perfect tree.
            </p>
          </div>

          <BonsaiGenerator />
        </div>
      </div>
    </main>
  )
}
