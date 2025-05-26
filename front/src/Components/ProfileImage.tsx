import React, { useState, useEffect } from 'react';
import GoBabyGo from "../assets/logo-babygo.png";
import { checkImageLoad, preloadImage, getInitials, generateBackgroundColor } from '../utils/imageOptimizer';

interface ProfileImageProps {
  alt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fallbackText?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ 
  alt = "Go Baby Go Logo", 
  className = "", 
  size = 'md',
  fallbackText = "Go Baby Go"
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  useEffect(() => {
    // Precargar y verificar la imagen
    const loadImage = async () => {
      setIsLoading(true);
      
      try {
        // Precargar la imagen
        preloadImage(GoBabyGo);
        
        // Verificar si se puede cargar
        const canLoad = await checkImageLoad(GoBabyGo);
        
        if (!canLoad) {
          setImageError(true);
        }
      } catch (error) {
        console.error('Error loading Go Baby Go logo:', error);
        setImageError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, []);

  const handleImageError = () => {
    console.error('Error loading Go Baby Go logo');
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setIsLoading(false);
  };

  const initials = getInitials(fallbackText);
  const backgroundColor = generateBackgroundColor(fallbackText);

  if (imageError) {
    // Fallback: mostrar iniciales con color generado
    return (
      <div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center border-2 border-white ${className}`}
        style={{ backgroundColor }}
      >
        <span className="text-white text-xs font-semibold">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white bg-white flex-shrink-0 ${className}`}>
      {isLoading && (
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <img 
        src={GoBabyGo} 
        alt={alt}
        className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          objectFit: 'contain',
          padding: '3px', // Aumentado un poco el padding
          backgroundColor: 'white'
        }}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default ProfileImage; 