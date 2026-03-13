'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';

export default function PersonaGenerator() {
  const [formData, setFormData] = useState({
    industry: '',
    ageRange: '',
    income: '',
    behavior: ''
  });
  const [persona, setPersona] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPersona({
        name: 'Tech-Savvy Professional',
        age: '28-35',
        income: '$75,000 - $95,000',
        goals: ['Career growth', 'Work-life balance', 'Financial independence'],
        channels: ['LinkedIn', 'Twitter', 'Tech blogs'],
        painPoints: ['Too many emails', 'Information overload', 'Finding quality products'],
        bio: 'A mid-level professional who values efficiency and quality.',
        interests: ['Technology', 'Fitness', 'Travel']
      });
    } catch (error) {
      setError('Failed to generate persona');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/tools" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold mb-2">Customer Persona Generator</h1>
          <p className="text-gray-600">
            Describe your target audience and get detailed marketing personas instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            {error && (
              <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select industry</option>
                  <option value="saas">SaaS / Technology</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Range
                </label>
                <select
                  value={formData.ageRange}
                  onChange={(e) => setFormData({...formData, ageRange: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select age range</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55+">55+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Income Level
                </label>
                <select
                  value={formData.income}
                  onChange={(e) => setFormData({...formData, income: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select income level</option>
                  <option value="0-30k">$0 - $30,000</option>
                  <option value="30k-50k">$30,000 - $50,000</option>
                  <option value="50k-80k">$50,000 - $80,000</option>
                  <option value="80k-120k">$80,000 - $120,000</option>
                  <option value="120k+">$120,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Behaviors
                </label>
                <textarea
                  value={formData.behavior}
                  onChange={(e) => setFormData({...formData, behavior: e.target.value})}
                  placeholder="e.g., price-sensitive, early adopter, brand loyal"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400"
              >
                {loading ? 'Generating...' : 'Generate Persona →'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Creating your persona...</p>
              </div>
            ) : persona ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">{persona.name}</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">📋 Bio</p>
                    <p className="text-gray-800">{persona.bio}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 mb-1">Age Range</p>
                      <p className="font-semibold">{persona.age}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 mb-1">Income</p>
                      <p className="font-semibold">{persona.income}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">🎯 Goals</p>
                    <ul className="list-disc list-inside space-y-1">
                      {persona.goals.map((goal: string, i: number) => (
                        <li key={i} className="text-gray-700">{goal}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">📱 Preferred Channels</p>
                    <div className="flex flex-wrap gap-2">
                      {persona.channels.map((channel: string, i: number) => (
                        <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">😫 Pain Points</p>
                    <ul className="list-disc list-inside">
                      {persona.painPoints.map((point: string, i: number) => (
                        <li key={i} className="text-gray-700">{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">🌟 Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {persona.interests.map((interest: string, i: number) => (
                        <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">👥</div>
                <p>Fill out the form to generate a detailed customer persona</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}