
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Photo } from '../types';

// Modal Component (defined here for brevity, could be separate)
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 rounded-lg shadow-xl max-w-3xl max-h-[90vh] overflow-auto relative animate-gentle-fade-in">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl leading-none p-1"
          aria-label="Fechar modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};


const PhotoGallery: React.FC = () => {
  const { content, theme } = useAppContext();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  if (content.photos.length === 0) {
    return (
      <div className={`p-8 text-center ${theme.cardBg} ${theme.text} rounded-lg shadow-lg my-8 animate-gentle-fade-in`}>
        <p className="text-xl">Nosso álbum de fotos está esperando por lindas memórias...</p>
        <p className="mt-2 opacity-80">Adicione algumas fotos no painel de administração para vê-las aqui!</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 animate-gentle-fade-in">
      <h2 className={`text-4xl font-bold text-center mb-8 ${theme.accent}`}>Nossos Momentos Queridos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {content.photos.map((photo) => (
          <div
            key={photo.id}
            className={`rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 ${theme.cardBg}`}
            onClick={() => setSelectedPhoto(photo)}
          >
            <img src={photo.url} alt={photo.caption || 'Um momento querido'} className="w-full h-64 object-cover" />
            {photo.caption && (
              <div className={`p-3 ${theme.text} text-sm`}>
                <p>{photo.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <Modal isOpen={!!selectedPhoto} onClose={() => setSelectedPhoto(null)}>
          <img src={selectedPhoto.url} alt={selectedPhoto.caption || 'Um momento querido'} className="max-w-full max-h-[80vh] rounded-md object-contain mx-auto" />
          {selectedPhoto.caption && (
            <p className={`mt-4 text-center text-gray-700`}>{selectedPhoto.caption}</p>
          )}
        </Modal>
      )}
    </div>
  );
};

export default PhotoGallery;
