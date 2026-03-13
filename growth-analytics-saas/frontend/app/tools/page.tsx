import Link from 'next/link';

export default function ToolsPage() {
  const tools = [
    {
      name: 'Customer Segmentation Calculator',
      description: 'Upload customer data and get instant segment analysis',
      href: '/tools/segmentation',
      icon: '📊',
      color: 'bg-blue-50',
      status: 'Live'
    },
    {
      name: 'Customer Persona Generator',
      description: 'Generate detailed marketing personas from behavioral data',
      href: '/tools/persona',
      icon: '👥',
      color: 'bg-purple-50',
      status: 'Live'
    },
    {
      name: 'CAC Payback Calculator',
      description: 'Calculate customer acquisition cost recovery period',
      href: '/tools/cac',
      icon: '💰',
      color: 'bg-green-50',
      status: 'Live'
    },
    {
      name: 'Churn Risk Predictor',
      description: 'Identify customers at risk of leaving',
      href: '/tools/churn',
      icon: '⚠️',
      color: 'bg-orange-50',
      status: 'Live'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Analytics Tools</h1>
        <p className="text-gray-600 mb-8">Free tools to help you understand your customers better</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link href={tool.href} key={tool.name}>
              <div className={`${tool.color} p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 relative`}>
                <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  LIVE
                </span>
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                <p className="text-gray-600">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Companies Love Our Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">1M+</div>
              <div className="text-gray-600">Customers Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">4.8/5</div>
              <div className="text-gray-600">User Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

