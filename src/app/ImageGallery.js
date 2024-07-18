'use client';

import { useState, useEffect } from 'react';

export default function ImageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/images');
        if (!response.ok) {
          throw new Error('Error al obtener las imágenes');
        }
        const data = await response.json();
        setImages(data); // Asumiendo que el backend devuelve una lista de imágenes
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  if (loading) return <div>Cargando imágenes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Imágenes del Storage Account</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {images.map((image) => (
          <div key={image.name}>
            <img src={image.url} alt={image.name} style={{ width: '100%', height: 'auto' }} />
            <p>{image.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
