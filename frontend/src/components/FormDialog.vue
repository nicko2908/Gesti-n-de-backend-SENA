<template>
  <q-dialog v-model="abierto" persistent @show="enfocarPrimerCampo">
    <q-card
      ref="tarjeta"
      class="form-dialog"
      :style="{ '--form-accent': acento }"
      @keydown.esc.stop.prevent="cerrar"
    >
      <header class="form-dialog__head">
        <div class="form-dialog__badge" aria-hidden="true">
          <q-icon :name="icono" size="24px" />
        </div>

        <div class="form-dialog__heading">
          <h2 class="form-dialog__title">{{ titulo }}</h2>
          <p v-if="subtitulo" class="form-dialog__subtitle">{{ subtitulo }}</p>
        </div>

        <q-btn
          class="form-dialog__close"
          flat
          round
          dense
          icon="close"
          aria-label="Cerrar"
          :disable="guardando"
          @click="cerrar"
        />
      </header>

      <q-separator />

      <q-form class="form-dialog__form" @submit.prevent="enviar">
        <div class="form-dialog__body">
          <slot />
        </div>

        <footer class="form-dialog__foot">
          <q-btn
            flat
            no-caps
            label="Cancelar"
            color="grey"
            :disable="guardando"
            @click="cerrar"
          />
          <q-btn
            type="submit"
            color="primary"
            unelevated
            no-caps
            :icon="iconoGuardar"
            :label="etiquetaGuardar"
            :loading="guardando"
            :disable="guardarDeshabilitado"
          />
        </footer>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import {
  QDialog,
  QCard,
  QBtn,
  QIcon,
  QForm,
  QSeparator,
} from 'quasar'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: '' },
  icono: { type: String, default: 'edit_note' },
  // Color de acento del icono de cabecera (se pasa como var(--c-...)).
  acento: { type: String, default: 'var(--color-principal)' },
  etiquetaGuardar: { type: String, default: 'Guardar' },
  iconoGuardar: { type: String, default: 'save' },
  guardando: { type: Boolean, default: false },
  guardarDeshabilitado: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const tarjeta = ref(null)

const abierto = computed({
  get: () => props.modelValue,
  set: (valor) => emit('update:modelValue', valor),
})

function cerrar() {
  if (props.guardando) return
  abierto.value = false
}

function enviar() {
  if (props.guardando || props.guardarDeshabilitado) return
  emit('submit')
}

// Enfoca el primer campo cada vez que se abre el modal.
async function enfocarPrimerCampo() {
  await nextTick()
  const campo = tarjeta.value?.$el?.querySelector(
    'input:not([type="hidden"]), textarea'
  )
  campo?.focus()
}
</script>
