/**
 * Patrones compartidos para validar campos de texto.
 * Se usan en aprendiz, curso y usuario para evitar valores compuestos
 * únicamente por signos como ",", "." o comillas.
 */

// Solo letras (incluye tildes/ñ) separadas por espacios.
export const SOLO_LETRAS = /^[\p{L}\p{M}]+(?: +[\p{L}\p{M}]+)*$/u;

// Letras, números, espacios, guiones y guiones bajos. Exige que el primer
// carácter sea alfanumérico, por lo que rechaza valores solo de puntuación.
export const ALFANUMERICO = /^[\p{L}\p{N}][\p{L}\p{N} _-]*$/u;
