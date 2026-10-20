// Reglas de validación reutilizables para los formularios (q-form / q-input).

// Solo letras (con tildes/ñ), sin comas, puntos, comillas ni otros signos.
const SOLO_LETRAS = /^[\p{L}\p{M}]+(?: +[\p{L}\p{M}]+)*$/u

// Letras, números, espacios, guiones y guiones bajos; exige al menos uno
// alfanumérico, así que rechaza valores compuestos solo por signos.
const ALFANUMERICO = /^[\p{L}\p{N}][\p{L}\p{N} _-]*$/u

// Rechaza valores vacíos y cadenas compuestas solo por espacios.
export function textoObligatorio(valor) {
  return (
    (typeof valor === 'string' && valor.trim().length > 0) ||
    'Este campo es obligatorio'
  )
}

// Nombres: solo letras y espacios (rechaza ",", ".", comillas, etc.).
export function nombreTexto(valor) {
  const limpio = String(valor ?? '').trim()
  if (!limpio) return 'Este campo es obligatorio'
  return SOLO_LETRAS.test(limpio) || 'Solo se permiten letras y espacios'
}

// Documentos: letras/números/espacios/guiones, sin signos como , . o ".
export function documentoTexto(valor) {
  const limpio = String(valor ?? '').trim()
  if (!limpio) return 'Este campo es obligatorio'
  return (
    ALFANUMERICO.test(limpio) ||
    'Solo se permiten letras, números, espacios y guiones'
  )
}

// Códigos de curso: mismo criterio que el documento.
export function codigoTexto(valor) {
  const limpio = String(valor ?? '').trim()
  if (!limpio) return 'Este campo es obligatorio'
  return (
    ALFANUMERICO.test(limpio) ||
    'Solo se permiten letras, números, espacios y guiones'
  )
}

// Correo obligatorio y con un formato básico válido.
export function emailObligatorio(valor) {
  const limpio = String(valor ?? '').trim()
  if (!limpio) return 'El correo es obligatorio'
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio) || 'El correo no es válido'
  )
}

// Duración numérica mayor que cero.
export function duracionObligatoria(valor) {
  const numero = Number(valor)
  return (
    (valor !== '' && valor !== null && Number.isFinite(numero) && numero > 0) ||
    'La duración debe ser mayor que 0'
  )
}

// Contraseña: obligatoria, mínimo 6 caracteres y no solo espacios.
export function passwordObligatoria(valor) {
  const limpio = String(valor ?? '')
  if (!limpio) return 'La contraseña es obligatoria'
  if (limpio.length < 6) return 'Debe tener al menos 6 caracteres'
  if (!limpio.trim()) return 'La contraseña no puede ser solo espacios'
  return true
}

// Selects u opciones obligatorias.
export function seleccionObligatoria(valor) {
  return !!valor || 'Selecciona una opción'
}
