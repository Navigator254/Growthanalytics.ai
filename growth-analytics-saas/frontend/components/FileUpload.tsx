'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import LoadingSpinner from './LoadingSpinner';

interface FileUploadProps {
  onUploadComplete: (data: any) => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx', '.xls']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    }
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/segment', {
        method: 'POST',
        body: formData,
      });

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }

      const data = await response.json();
      onUploadComplete(data);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please check the file format and try again.');
    } finally {
      setUploading(false);
    }
  };

  if (uploading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500">
        <input {...getInputProps()} />
        <div className="text-4xl mb-4">📁</div>
        {file ? (
          <p className="text-blue-600 font-medium">{file.name}</p>
        ) : (
          <div>
            <p className="text-gray-700 mb-2">Drag & drop your CSV or Excel file here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
          </div>
        )}
      </div>

      {file && (
        <div className="mt-6">
          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Analyze My Data →
          </button>
        </div>
      )}
    </div>
  );
}