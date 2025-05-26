// imageOptimizer.ts - Utilidades para optimización de imágenes

/**
 * Verifica si una imagen se puede cargar correctamente
 * @param src - URL de la imagen
 * @returns Promise<boolean> - true si la imagen se carga correctamente
 */
export const checkImageLoad = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

/**
 * Precarga una imagen para mejorar la experiencia del usuario
 * @param src - URL de la imagen
 */
export const preloadImage = (src: string): void => {
  const img = new Image();
  img.src = src;
};

/**
 * Genera un color de fondo basado en texto (para avatares de fallback)
 * @param text - Texto para generar el color
 * @returns string - Color en formato hex
 */
export const generateBackgroundColor = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
};

/**
 * Extrae las iniciales de un nombre para usar como fallback
 * @param name - Nombre completo
 * @returns string - Iniciales (máximo 2 caracteres)
 */
export const getInitials = (name: string): string => {
  if (!name) return 'U';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Optimiza el tamaño de imagen según el dispositivo
 * @param originalSrc - URL original de la imagen
 * @param size - Tamaño deseado ('sm', 'md', 'lg')
 * @returns string - URL optimizada o original
 */
export const getOptimizedImageSrc = (originalSrc: string, size: 'sm' | 'md' | 'lg'): string => {
  // Aquí podrías implementar lógica para servir diferentes tamaños de imagen
  // Por ahora, retornamos la imagen original
  return originalSrc;
};

/**
 * Valida si un archivo es una imagen válida
 * @param file - Archivo a validar
 * @returns boolean - true si es una imagen válida
 */
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Convierte una imagen a base64
 * @param file - Archivo de imagen
 * @returns Promise<string> - Imagen en formato base64
 */
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}; 