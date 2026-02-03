/**
 * Configuración de la API
 * La URL base se obtiene de la variable de entorno VITE_API_BASE_URL
 * Si no está definida, se usa http://localhost:3000 como valor por defecto
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

