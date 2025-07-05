
import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar si el ancho de la pantalla coincide con una media query.
 * @param query La media query string (e.g., '(min-width: 1024px)').
 * @returns `true` si la media query coincide, `false` en caso contrario.
 */
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Asegurarse de que window está definido (para evitar errores en SSR)
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      // Actualizar el estado si el resultado de la media query cambia
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      // Añadir un listener para detectar cambios en el tamaño de la ventana
      const listener = () => setMatches(media.matches);
      window.addEventListener('resize', listener);
      
      // Limpiar el listener al desmontar el componente
      return () => window.removeEventListener('resize', listener);
    }
  }, [matches, query]);

  return matches;
};

export default useMediaQuery;
