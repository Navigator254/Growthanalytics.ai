'use client';

import { useState } from 'react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';

export default function ChurnPredictor() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Mock churn prediction function (replace with real API later)
  const predictChurn = async (file: File) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setResults({
        totalCustomers: 1240,
        highRisk: 87,
        mediumRisk: 245,
        lowRisk: 908,
        riskFactors: [
          'Low engagement (last 30 days)',
          'Decreased purchase frequency',
          'Support tickets > 3',
          'Price sensitivity'
        ],
        recommendations: [
          'Send re-engagement email campaign',
          'Offer loyalty discount',
          'Schedule check-in call',
          'Feature new product releases'
        ]
      });
      setLoading(false);
    }, 2000);
  };

  const handleUploadComplete = (data: any) => {
    // This would be called after file upload
    console.log('File uploaded:', data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing churn patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/tools" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold mb-2">Churn Risk Predictor</h1>
          <p className="text-gray-600 mb-4">
            Identify customers at risk of leaving before they churn.
          </p>
        </div>

        {!results ? (
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-semibold mb-2">Upload Your Customer Data</h2>
              <p className="text-gray-600">
                Upload your customer engagement data to predict churn risk
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    predictChurn(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer"
              >
                <div className="text-4xl mb-4">📤</div>
                <p className="text-blue-600 font-medium mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">CSV or Excel files only</p>
              </label>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Low Risk: Active customers
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Medium Risk: Show signs
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                High Risk: At risk of churn
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Risk Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <p className="text-sm text-green-700 mb-1">Low Risk</p>
                <p className="text-3xl font-bold text-green-700">{results.lowRisk}</p>
                <p className="text-xs text-green-600 mt-1">{((results.lowRisk/results.totalCustomers)*100).toFixed(1)}%</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-6 text-center">
                <p className="text-sm text-yellow-700 mb-1">Medium Risk</p>
                <p className="text-3xl font-bold text-yellow-700">{results.mediumRisk}</p>
                <p className="text-xs text-yellow-600 mt-1">{((results.mediumRisk/results.totalCustomers)*100).toFixed(1)}%</p>
              </div>
              <div className="bg-red-50 rounded-xl p-6 text-center">
                <p className="text-sm text-red-700 mb-1">High Risk</p>
                <p className="text-3xl font-bold text-red-700">{results.highRisk}</p>
                <p className="text-xs text-red-600 mt-1">{((results.highRisk/results.totalCustomers)*100).toFixed(1)}%</p>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">⚠️ Top Risk Factors</h3>
              <div className="space-y-3">
                {results.riskFactors.map((factor: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">💡 Recommended Actions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {results.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  // Generate and download CSV of at-risk customers
                  alert('Download feature coming soon!');
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition mr-4"
              >
                📥 Download At-Risk List
              </button>
              <button
                onClick={() => setResults(null)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                🔄 Analyze Another File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
