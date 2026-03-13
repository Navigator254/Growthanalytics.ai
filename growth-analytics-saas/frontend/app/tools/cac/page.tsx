'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';

export default function CACCalculator() {
  const [formData, setFormData] = useState({
    cac: '',
    monthlyRevenue: '',
    grossMargin: '',
    customers: ''
  });

  const [results, setResults] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cac = parseFloat(formData.cac);
    const monthlyRevenue = parseFloat(formData.monthlyRevenue);
    const grossMargin = parseFloat(formData.grossMargin) / 100;
    const customers = parseFloat(formData.customers);

    // Calculate metrics
    const arpu = monthlyRevenue / customers;
    const ltv = arpu * 12 * 3; // Assuming 3-year average customer lifespan
    const paybackMonths = cac / (arpu * grossMargin);
    const ltvCacRatio = ltv / cac;
    
    let healthScore = '';
    let healthColor = '';

    if (ltvCacRatio > 3) {
      healthScore = 'Excellent';
      healthColor = 'text-green-600';
    } else if (ltvCacRatio > 2) {
      healthScore = 'Good';
      healthColor = 'text-blue-600';
    } else if (ltvCacRatio > 1) {
      healthScore = 'Fair';
      healthColor = 'text-yellow-600';
    } else {
      healthScore = 'Poor';
      healthColor = 'text-red-600';
    }

    setResults({
      cac,
      arpu,
      ltv,
      paybackMonths,
      ltvCacRatio,
      healthScore,
      healthColor
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/tools" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold mb-2">CAC Payback Calculator</h1>
          <p className="text-gray-600">
            Calculate how long it takes to recover your customer acquisition costs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Acquisition Cost (CAC) ($)
                </label>
                <input
                  type="number"
                  value={formData.cac}
                  onChange={(e) => setFormData({...formData, cac: e.target.value})}
                  placeholder="e.g., 500"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Recurring Revenue ($)
                </label>
                <input
                  type="number"
                  value={formData.monthlyRevenue}
                  onChange={(e) => setFormData({...formData, monthlyRevenue: e.target.value})}
                  placeholder="e.g., 50000"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gross Margin (%)
                </label>
                <input
                  type="number"
                  value={formData.grossMargin}
                  onChange={(e) => setFormData({...formData, grossMargin: e.target.value})}
                  placeholder="e.g., 75"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  max="100"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Customers
                </label>
                <input
                  type="number"
                  value={formData.customers}
                  onChange={(e) => setFormData({...formData, customers: e.target.value})}
                  placeholder="e.g., 1000"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                  step="1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Calculate →
              </button>
            </form>
          </div>

          {/* Results Display */}
          <div className="bg-white rounded-xl shadow-md p-6">
            {results ? (
              <div>
                <h2 className="text-2xl font-bold mb-6">Results</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">CAC</span>
                    <span className="font-semibold text-lg">${results.cac.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">ARPU (Avg Revenue Per User)</span>
                    <span className="font-semibold text-lg">${results.arpu.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">LTV (Customer Lifetime Value)</span>
                    <span className="font-semibold text-lg">${results.ltv.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-800 font-medium">Payback Period</span>
                    <span className="font-bold text-xl text-blue-600">
                      {results.paybackMonths.toFixed(1)} months
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-800 font-medium">LTV:CAC Ratio</span>
                    <span className={`font-bold text-xl ${results.healthColor}`}>
                      {results.ltvCacRatio.toFixed(2)}:1
                    </span>
                  </div>

                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Business Health:</p>
                    <p className={`text-2xl font-bold ${results.healthColor}`}>
                      {results.healthScore}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {results.ltvCacRatio > 3 
                        ? 'Excellent! Your unit economics are strong.'
                        : results.ltvCacRatio > 2
                        ? 'Good. Keep optimizing.'
                        : results.ltvCacRatio > 1
                        ? 'Fair. Work on improving LTV or reducing CAC.'
                        : 'Poor. Your business model needs attention.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">💰</div>
                <p>Enter your metrics to calculate CAC payback</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
