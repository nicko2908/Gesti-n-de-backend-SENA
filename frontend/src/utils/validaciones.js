// Reglas de validación reutilizables para los formularios (q-form / q-input).

// Rechaza valores vacíos y cadenas compuestas solo por espacios.
export function textoObligatorio(valor) {
  return (
    (typeof valor === 'string' && valor.trim().length > 0) ||
    'Este campo es obligatorio'
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

// Selects u opciones obligatorias.
export function seleccionObligatoria(valor) {
  return !!valor || 'Selecciona una opción'
}
