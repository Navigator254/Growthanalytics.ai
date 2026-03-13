import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">GrowthAnalytics.ai</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/tools" className="text-gray-700 hover:text-blue-600">Tools</Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</Link>
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Understand Your Customers
              <span className="text-blue-600">. Instantly.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Upload your customer data and get AI-powered segmentation, personas, and churn predictions in seconds.
              Used by 500+ companies worldwide.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/tools/segmentation" 
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700">
                Start Free Analysis →
              </Link>
              <Link href="/how-it-works" 
                    className="border border-gray-300 px-8 py-3 rounded-lg text-lg hover:bg-gray-50">
                Watch Demo
              </Link>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-gray-600">Companies Trust Us</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">1M+</div>
              <div className="text-gray-600">Customers Analyzed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">GDPR</div>
              <div className="text-gray-600">Compliant</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
