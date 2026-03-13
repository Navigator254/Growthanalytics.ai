import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Basic analytics for individuals',
      features: [
        'Customer Segmentation Calculator',
        'Basic reports',
        'CSV export',
        'Email support'
      ],
      buttonText: 'Get Started',
      buttonClass: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'Advanced tools for growing businesses',
      features: [
        'Everything in Free',
        'Persona Generator',
        'CAC Calculator',
        'Churn Prediction',
        'PDF reports',
        'Priority support'
      ],
      buttonText: 'Start Free Trial',
      buttonClass: 'bg-blue-600 text-white hover:bg-blue-700',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for large teams',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'SSO & advanced security'
      ],
      buttonText: 'Contact Sales',
      buttonClass: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that's right for your business</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`bg-white rounded-xl shadow-md p-8 relative ${plan.popular ? 'border-2 border-blue-500' : ''}`}>
              {plan.popular && (
                <span className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm rounded-tr-xl rounded-bl-xl">
                  Most Popular
                </span>
              )}
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-gray-600">{plan.period}</span>}
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`block text-center py-3 rounded-lg transition ${plan.buttonClass}`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
