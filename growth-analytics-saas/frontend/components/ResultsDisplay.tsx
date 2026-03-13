'use client';

interface ResultsDisplayProps {
  results: any;
  onReset?: () => void; // Add this prop
}

export default function ResultsDisplay({ results, onReset }: ResultsDisplayProps) {
  if (!results) return null;

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">Your Segmentation Results</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(results.segment_profiles || {}).map(([key, data]: [string, any]) => (
          <div key={key} className="border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{key}</h3>
            <p className="text-blue-600 font-medium mb-4">
              {results.segment_names?.[key] || 'Customer Segment'}
            </p>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Size</span>
                <span className="font-medium">{data.size} customers ({data.percentage}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Income</span>
                <span className="font-medium">${data.avg_income?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Spending</span>
                <span className="font-medium">${data.avg_spending?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Purchases</span>
                <span className="font-medium">{data.avg_purchases || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recency</span>
                <span className="font-medium">{data.avg_recency || 0} days</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => window.print()}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          📥 Download PDF
        </button>
        {onReset && (
          <button
            onClick={onReset}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            🔄 Analyze Another File
          </button>
        )}
      </div>
    </div>
  );
}