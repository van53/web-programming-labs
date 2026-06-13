import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface FileMetadata {
  id: string;
  originalName: string;
  generatedName: string;
  size: number;
  mimetype: string;
  url: string;
}

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploadedFile, setUploadedFile] = useState<FileMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    // Generate preview URL
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Cleanup memory when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Client-side validation
      if (file.size > 5 * 1024 * 1024) {
        setError("Розмір файлу не може перевищувати 5МБ");
        setSelectedFile(null);
        return;
      }
      if (!file.type.match('image/.*')) {
        setError("Можна завантажувати лише зображення");
        setSelectedFile(null);
        return;
      }

      setError(null);
      setUploadedFile(null);
      setProgress(0);
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post<FileMetadata>(`${apiUrl}/files`, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        },
      });

      setUploadedFile(response.data);
      setProgress(100);
      setSelectedFile(null); // Clear selection after successful upload
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || err.message;
      setError(`Помилка завантаження: ${serverMsg}`);
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Завантаження файлів (Лабораторна 11)</h1>
      
      <div style={{ border: '1px dashed #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={isUploading}
        />
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>{error}</div>}

      {previewUrl && selectedFile && (
        <div style={{ marginBottom: '1rem' }}>
          <h3>Попередній перегляд:</h3>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }} />
          <p>
            Назва: {selectedFile.name} <br/>
            Розмір: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      {isUploading && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>
            <div 
              style={{ 
                height: '24px', 
                width: `${progress}%`, 
                backgroundColor: '#4caf50', 
                borderRadius: '4px',
                transition: 'width 0.2s',
                textAlign: 'center',
                color: 'white',
                lineHeight: '24px'
              }}
            >
              {progress}%
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={handleUpload} 
        disabled={!selectedFile || isUploading}
        style={{
          padding: '10px 20px',
          backgroundColor: !selectedFile || isUploading ? '#ccc' : '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: !selectedFile || isUploading ? 'not-allowed' : 'pointer'
        }}
      >
        {isUploading ? 'Завантаження...' : 'Відправити на сервер'}
      </button>

      {uploadedFile && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
          <h3 style={{ color: '#2e7d32' }}>Успішно завантажено!</h3>
          <p>Згенероване ім'я: {uploadedFile.generatedName}</p>
          <img src={uploadedFile.url} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }} />
          <p><a href={uploadedFile.url} target="_blank" rel="noreferrer">Відкрити файл за посиланням</a></p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
