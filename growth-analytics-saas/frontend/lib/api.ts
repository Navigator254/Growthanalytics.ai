const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/segment', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function getReport(jobId: string, email: string) {
  try {
    const response = await fetch(`${API_URL}/api/report/${jobId}?email=${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      throw new Error('Failed to get report');
    }

    return await response.json();
  } catch (error) {
    console.error('Report fetch error:', error);
    throw error;
  }
}