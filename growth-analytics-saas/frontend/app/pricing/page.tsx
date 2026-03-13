'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
  const [showEnterprise, setShowEnterprise] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Basic analytics for individuals',
      features: [
        'Customer Segmentation Calculator',
        'Basic reports',
        'CSV export',
        'Email support',
        '1 analysis per month'
      ],
      buttonText: 'Get Started',
      buttonClass: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      href: '/tools/segmentation'
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/month',
      description: 'Advanced tools for growing businesses',
      features: [
        '✅ Customer Segmentation Calculator',
        '✅ Persona Generator',
        '✅ CAC Payback Calculator',
        '✅ Churn Risk Predictor',
        '✅ PDF reports',
        '✅ Priority support',
        '✅ Unlimited analyses',
        '✅ Export to multiple formats'
      ],
      buttonText: 'Start Free Trial',
      buttonClass: 'bg-blue-600 text-white hover:bg-blue-700',
      popular: true,
      href: '/signup?plan=pro'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for large teams',
      features: [
        '✅ Everything in Pro',
        '✅ Custom integrations',
        '✅ Dedicated account manager',
        '✅ SLA guarantee',
        '✅ SSO & advanced security',
        '✅ Custom ML model training',
        '✅ API access',
        '✅ On-premise deployment option'
      ],
      buttonText: 'Contact Sales',
      buttonClass: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      href: '#enterprise'
    }
  ];

  const enterprisePackages = [
    {
      name: 'Startup',
      price: '$299',
      period: '/month',
      description: 'For growing startups ready to scale',
      features: [
        'All Pro features',
        'Up to 50,000 customers',
        'API access (1,000 calls/day)',
        'Basic custom integration',
        'Email & chat support',
        'Monthly strategy call'
      ]
    },
    {
      name: 'Business',
      price: '$799',
      period: '/month',
      description: 'For established businesses',
      features: [
        'All Startup features',
        'Up to 200,000 customers',
        'API access (10,000 calls/day)',
        'Custom integrations',
        'Dedicated account manager',
        'Weekly strategy calls',
        'SLA guarantee'
      ]
    },
    {
      name: 'Enterprise Plus',
      price: '$1,999',
      period: '/month',
      description: 'For large organizations',
      features: [
        'All Business features',
        'Unlimited customers',
        'Unlimited API access',
        'Custom ML model training',
        'On-premise deployment',
        '24/7 phone support',
        'Quarterly business review',
        'SSO & advanced security'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Choose the plan that's right for your business. All plans include our core AI-powered analytics.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/tools/segmentation"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-50 transition inline-block font-medium"
            >
              Try Free →
            </Link>
            <a
              href="#enterprise"
              className="border border-white text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition inline-block font-medium"
            >
              Enterprise
            </a>
          </div>
        </div>
      </div>

      {/* Main Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`bg-white rounded-xl shadow-md p-8 relative ${plan.popular ? 'border-2 border-blue-500 transform scale-105' : ''}`}>
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
                  <li key={feature} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{feature.replace('✅ ', '')}</span>
                  </li>
                ))}
              </ul>
              {plan.name === 'Enterprise' ? (
                <button
                  onClick={() => setShowEnterprise(!showEnterprise)}
                  className={`block w-full text-center py-3 rounded-lg transition font-medium ${plan.buttonClass}`}
                >
                  {plan.buttonText}
                </button>
              ) : (
                <Link
                  href={plan.href}
                  className={`block w-full text-center py-3 rounded-lg transition font-medium ${plan.buttonClass}`}
                >
                  {plan.buttonText}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Enterprise Packages (shown when Contact Sales is clicked) */}
        {showEnterprise && (
          <div id="enterprise" className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Enterprise Solutions</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tailored packages for businesses with specific needs. All include custom ML model training and dedicated support.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {enterprisePackages.map((pkg) => (
                <div key={pkg.name} className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                  <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{pkg.price}</span>
                    <span className="text-gray-600">{pkg.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{pkg.description}</p>
                  <ul className="space-y-2 mb-8">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start text-sm">
                        <span className="text-blue-500 mr-2">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=duseugebarker@gmail.com&su=Enterprise%20Inquiry%20-%20${encodeURIComponent(pkg.name)}&body=${encodeURIComponent(`I'm interested in the ${pkg.name} plan.\n\nPlease provide more information.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    📧 Inquire via Gmail
                  </a>
                </div>
              ))}
            </div>

            {/* Custom Enterprise Section */}
            <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Need Something Completely Custom?</h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                We build custom analytics solutions tailored to your specific business needs. 
                Contact our sales team for a personalized quote.
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=duseugebarker@gmail.com&su=Custom%20Enterprise%20Solution&body=I'd%20like%20to%20discuss%20a%20custom%20analytics%20solution%20for%20my%20business."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  📧 Email via Gmail
                </a>
                <a
                  href="https://www.kaggle.com/mosesmasinya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  📊 View My Kaggle
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Check out my customer segmentation work on Kaggle: 
                <a href="https://www.kaggle.com/mosesmasinya" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  kaggle.com/mosesmasinya
                </a>
              </p>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600">Yes, you can change your plan at any time. Changes are prorated for the remainder of your billing cycle.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-2">Is there a free trial for Pro?</h3>
              <p className="text-gray-600">Yes! Start with a 14-day free trial of our Pro plan. No credit card required.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-2">Do you offer custom ML solutions?</h3>
              <p className="text-gray-600">Absolutely! Our enterprise plans include custom model training tailored to your specific data and use cases.</p>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            🏆 Trusted by 500+ companies worldwide • GDPR Compliant • 99.9% Uptime SLA
          </p>
        </div>
      </div>
    </div>
  );
}