// Utilidades para los avatares de iniciales de las tablas.

// Devuelve hasta dos iniciales: "Ana María Gómez" -> "AM".
export function iniciales(nombre) {
  const palabras = String(nombre || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!palabras.length) return '?'

  return palabras
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join('')
    .toUpperCase()
}

// Tono estable (0-359) a partir del nombre, para que cada persona conserve
// siempre el mismo color de avatar.
export function estiloAvatar(nombre) {
  let tono = 0
  for (const caracter of String(nombre || '?')) {
    tono = (tono * 31 + caracter.charCodeAt(0)) % 360
  }
  return { '--avatar-hue': tono }
}
