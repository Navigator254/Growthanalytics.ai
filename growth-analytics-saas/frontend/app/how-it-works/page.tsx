import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '1',
      title: 'Upload Your Data',
      description: 'Upload your customer dataset in CSV or Excel format. We accept any data with customer information like demographics, purchase history, and behavior.',
      icon: '📤',
      color: 'bg-blue-50'
    },
    {
      number: '2',
      title: 'AI Analysis',
      description: 'Our machine learning models analyze your data to identify patterns, segments, and insights using advanced clustering algorithms.',
      icon: '🤖',
      color: 'bg-purple-50'
    },
    {
      number: '3',
      title: 'Get Results',
      description: 'Receive detailed segment profiles, personas, and actionable marketing recommendations instantly.',
      icon: '📊',
      color: 'bg-green-50'
    }
  ];

  const features = [
    {
      title: 'Customer Segmentation',
      description: 'Automatically cluster your customers into meaningful groups based on behavior and demographics.',
      icon: '📊'
    },
    {
      title: 'Persona Generation',
      description: 'Create detailed marketing personas with goals, pain points, and channel preferences.',
      icon: '👥'
    },
    {
      title: 'Churn Prediction',
      description: 'Identify customers at risk of leaving before they churn with predictive analytics.',
      icon: '⚠️'
    },
    {
      title: 'CAC Analysis',
      description: 'Calculate customer acquisition costs and payback periods to optimize marketing spend.',
      icon: '💰'
    }
  ];

  const faqs = [
    {
      question: 'What data formats do you accept?',
      answer: 'We accept CSV and Excel files (.csv, .xlsx, .xls). Your data should include customer information like demographics, purchase history, and engagement metrics.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We take security seriously. All data is encrypted in transit and at rest. We never share your data with third parties.'
    },
    {
      question: 'How long does analysis take?',
      answer: 'Most analyses complete within seconds. For larger datasets (10,000+ customers), it may take up to a minute.'
    },
    {
      question: 'Can I export the results?',
      answer: 'Yes! You can download reports as PDF, export segments to CSV, or share insights directly from the dashboard.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">How It Works</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get from customer data to actionable insights in three simple steps
          </p>
          <Link
            href="/tools/segmentation"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-50 transition inline-block font-medium"
          >
            Start Free Analysis →
          </Link>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-blue-200 -z-10 transform -translate-x-1/2" />
              )}
              <div className={`${step.color} rounded-xl p-8 text-center relative`}>
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to understand your customers?</h2>
          <p className="text-xl text-blue-100 mb-8">Join 500+ companies already using GrowthAnalytics</p>
          <Link
            href="/tools/segmentation"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-50 transition inline-block font-medium"
          >
            Start Free Analysis →
          </Link>
        </div>
      </div>
    </div>
  );
}
