<template>
  <q-dialog v-model="abierto" persistent>
    <q-card class="confirm-card">
      <q-card-section class="confirm-card__head">
        <div class="confirm-card__icon">
          <q-icon name="warning_amber" size="26px" />
        </div>

        <div>
          <div class="confirm-card__title">{{ titulo }}</div>
          <p v-if="mensaje" class="confirm-card__text">{{ mensaje }}</p>
        </div>
      </q-card-section>

      <q-card-section class="confirm-card__body">
        <p class="confirm-card__text">{{ instruccion }}</p>

        <div
          class="confirm-card__phrase"
          draggable="false"
          @copy.prevent
          @contextmenu.prevent
        >
          {{ palabra }}
        </div>

        <q-input
          ref="campo"
          v-model="texto"
          outlined
          dense
          class="q-mt-md"
          :placeholder="palabra || 'Escribe aquí'"
          hint="Escríbelo manualmente: pegar está deshabilitado."
          :error="errorTexto"
          :error-message="
            errorTexto
              ? 'El texto no coincide. Revísalo tal cual se muestra arriba.'
              : ''
          "
          aria-label="Texto de confirmación"
          @blur="intento = true"
          @keyup.enter="confirmar"
          @paste.prevent
          @drop.prevent
          @contextmenu.prevent
          @keydown="bloquearAtajos"
        >
          <template #prepend>
            <q-icon name="keyboard" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right" class="confirm-card__actions">
        <q-btn flat label="Cancelar" color="grey" v-close-popup />
        <q-btn
          color="negative"
          :label="etiquetaConfirmar"
          :icon="iconoConfirmar"
          unelevated
          no-caps
          :disable="!coincide"
          @click="confirmar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import {
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  QInput,
  QBtn,
  QIcon,
} from 'quasar'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  titulo: { type: String, default: 'Confirmar acción' },
  mensaje: { type: String, default: '' },
  // Frase o nombre completo que el usuario debe escribir para confirmar.
  palabra: { type: String, default: '' },
  instruccion: {
    type: String,
    default: 'Para continuar, escribe exactamente el siguiente texto:',
  },
  etiquetaConfirmar: { type: String, default: 'Confirmar' },
  iconoConfirmar: { type: String, default: 'warning' },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const texto = ref('')
const campo = ref(null)
// Marca si el usuario ya intentó confirmar: evita mostrar el error mientras
// todavía está escribiendo el texto.
const intento = ref(false)

const abierto = computed({
  get: () => props.modelValue,
  set: (valor) => emit('update:modelValue', valor),
})

// Compara sin importar mayúsculas, tildes ni espacios repetidos, pero exige el
// texto completo para evitar confirmaciones accidentales.
function normalizar(valor) {
  return String(valor ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
}

const objetivo = computed(() => normalizar(props.palabra))

// Si no hay texto que copiar, la confirmación queda bloqueada.
const coincide = computed(
  () => objetivo.value.length > 0 && normalizar(texto.value) === objetivo.value
)

const errorTexto = computed(
  () => intento.value && texto.value.length > 0 && !coincide.value
)

watch(
  () => props.modelValue,
  async (estaAbierto) => {
    if (!estaAbierto) return
    texto.value = ''
    intento.value = false
    await nextTick()
    campo.value?.focus()
  }
)

function confirmar() {
  if (!coincide.value) {
    intento.value = true
    return
  }
  emit('confirm')
  abierto.value = false
}

// Refuerza el bloqueo del pegado con atajos (Ctrl/Cmd+V, Shift+Insert) además
// del evento paste, para que el texto tenga que escribirse a mano.
function bloquearAtajos(evento) {
  const tecla = String(evento.key).toLowerCase()
  const pegarConCtrl = (evento.ctrlKey || evento.metaKey) && tecla === 'v'
  const pegarConShift = evento.shiftKey && evento.key === 'Insert'

  if (pegarConCtrl || pegarConShift) {
    evento.preventDefault()
    evento.stopPropagation()
  }
}
</script>

<style scoped>
.confirm-card {
  width: 440px;
  max-width: 92vw;
  border-radius: 14px;
}

.confirm-card__head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 4px;
}

.confirm-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 12px;
  background: var(--chip-off-bg);
  color: var(--chip-off-text);
}

.confirm-card__title {
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-strong);
}

.confirm-card__text {
  margin: 4px 0 0;
  font-size: 0.875rem;
  line-height: 1.45;
  color: var(--text-muted);
}

.confirm-card__body {
  padding-top: 4px;
}

.confirm-card__phrase {
  margin-top: 10px;
  padding: 10px 12px;
  border: 1px dashed var(--chip-off-text);
  border-radius: 10px;
  background: var(--chip-off-bg);
  color: var(--chip-off-text);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-align: center;
  /* Evita que el texto se pueda seleccionar/copiar: debe escribirse a mano. */
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.confirm-card__actions {
  padding: 8px 16px 14px;
}
</style>
