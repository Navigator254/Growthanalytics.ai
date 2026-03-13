'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultsDisplay from '@/components/ResultsDisplay';
import EmailModal from '@/components/EmailModal';
import { supabase } from '@/lib/supabase/client';
export default function SegmentationTool() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check if backend is running with improved error handling
  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Try the health endpoint first with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('http://localhost:8000/api/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Backend connected:', data);
          setBackendStatus('online');
        } else {
          console.log('⚠️ Backend returned error:', response.status);
          setBackendStatus('offline');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
console.log('❌ Backend check failed:', errorMessage);
        setBackendStatus('offline');
      }
    };
    
    checkBackend();
  }, []);

  const handleUploadComplete = (data: any) => {
    setJobId(data.job_id);
    setPreview(data.preview);
    setShowEmailModal(true);
  };

  const handleEmailSubmit = async (email: string) => {
    try {
      // Save lead to Supabase (always try)
      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([
          {
            email: email,
            source: 'segmentation_tool',
            converted: false,
            created_at: new Date().toISOString()
          }
        ]);

      console.log('📧 Lead capture attempted for:', email);

      // Get the full report from backend
      const response = await fetch(`http://localhost:8000/api/report/${jobId}?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      setResults(data.results);

      // If user is logged in, save analysis to their account
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('analysis_jobs').insert([
          {
            user_id: user.id,
            filename: 'Uploaded dataset',
            segments: data.results.segment_profiles,
            created_at: new Date().toISOString()
          }
        ]);
        console.log('✅ Analysis saved to user account');
      }

      setShowEmailModal(false);
    } catch (error) {
      console.error('Failed to get report:', error);
      alert(`Failed to get full report. ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  const handleReset = () => {
    setJobId(null);
    setPreview(null);
    setResults(null);
    setShowEmailModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Backend Status Banner - Only show when offline */}
        {backendStatus === 'offline' && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-medium">⚠️ Backend server is not running</p>
            <p className="text-yellow-700 text-sm mt-1">
              Please start it with:
            </p>
            <code className="block bg-yellow-100 px-3 py-2 rounded mt-2 text-sm font-mono">
              cd ~/Desktop/growth-analytics-saas/backend &amp;&amp; source venv/bin/activate &amp;&amp; uvicorn main:app --reload --port 8000
            </code>
            <p className="text-yellow-700 text-sm mt-2">
              Don't worry - you can still upload files. The upload uses a different endpoint.
            </p>
          </div>
        )}

        {backendStatus === 'checking' && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700">🔄 Checking backend connection...</p>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-2">Customer Segmentation Calculator</h1>
        <p className="text-gray-600 mb-8">
          Upload your customer dataset (CSV or Excel) and get AI-powered segmentation in seconds.
        </p>

        {!results && <FileUpload onUploadComplete={handleUploadComplete} />}
        
        {preview && !results && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-4">Preview Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700">Total Customers</p>
                <p className="text-2xl font-bold text-blue-900">{preview.total_customers}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Segments Found</p>
                <p className="text-2xl font-bold text-blue-900">{preview.segments_found}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-blue-700 mb-2">Segments:</p>
              {preview.segment_names && Object.entries(preview.segment_names).map(([key, name]) => (
                <span key={key} className="inline-block bg-white text-blue-800 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                  {String(name)}
                </span>
              ))}
            </div>
          </div>
        )}

        {results && <ResultsDisplay results={results} onReset={handleReset} />}
        
        <EmailModal 
          isOpen={showEmailModal} 
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailSubmit}
        />
      </div>
    </div>
  );
}