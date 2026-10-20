<template>
  <!--
    Envoltorio común de las tablas del panel: tarjeta, cabecera, buscador,
    filtro por estado y contador. Las filas ya filtradas se exponen por slot
    para que cada vista las pase a su q-table.
  -->
  <section class="table-panel">
    <header class="table-panel__head">
      <div class="table-panel__heading">
        <h2 class="table-panel__title">{{ title }}</h2>
        <p v-if="subtitle" class="table-panel__subtitle">{{ subtitle }}</p>
      </div>

      <q-btn
        v-if="createLabel"
        class="table-panel__create"
        color="primary"
        unelevated
        no-caps
        :icon="createIcon"
        :label="createLabel"
        @click="emit('create')"
      />
    </header>

    <div class="table-panel__toolbar">
      <q-input
        v-model="busqueda"
        class="table-panel__search"
        outlined
        dense
        clearable
        debounce="200"
        :placeholder="searchPlaceholder"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <div
        v-if="statusable"
        class="table-panel__chips"
        role="group"
        aria-label="Filtrar por estado"
      >
        <button
          v-for="opcion in opcionesEstado"
          :key="opcion.value"
          type="button"
          class="filter-chip"
          :class="{ 'filter-chip--active': estado === opcion.value }"
          :aria-pressed="estado === opcion.value"
          @click="estado = opcion.value"
        >
          {{ opcion.label }}
        </button>
      </div>

      <div class="table-panel__count" aria-live="polite">{{ resumen }}</div>
    </div>

    <slot :rows="filasFiltradas" :total="filasFiltradas.length" />
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { QBtn, QIcon, QInput } from 'quasar'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  rows: { type: Array, default: () => [] },
  // Campos donde busca el buscador; admite rutas anidadas ("curso.nombre").
  searchFields: { type: Array, default: () => [] },
  searchPlaceholder: {
    type: String,
    default: 'Buscar por nombre, documento o correo…',
  },
  createLabel: { type: String, default: '' },
  createIcon: { type: String, default: 'add' },
  // Activa los chips Todos / Activos / Inactivos (usa la propiedad "status").
  statusable: { type: Boolean, default: true },
})

const emit = defineEmits(['create'])

const busqueda = ref('')
const estado = ref('todos')

const opcionesEstado = [
  { label: 'Todos', value: 'todos' },
  { label: 'Activos', value: 'activos' },
  { label: 'Inactivos', value: 'inactivos' },
]

// Búsqueda sin distinguir mayúsculas ni tildes.
function normalizar(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function valorPorRuta(fila, ruta) {
  return ruta.split('.').reduce((valor, clave) => valor?.[clave], fila)
}

const filasFiltradas = computed(() => {
  const termino = normalizar(busqueda.value).trim()

  return props.rows.filter((fila) => {
    if (props.statusable) {
      if (estado.value === 'activos' && fila.status !== 0) return false
      if (estado.value === 'inactivos' && fila.status === 0) return false
    }

    if (!termino) return true

    const campos = props.searchFields.length
      ? props.searchFields
      : Object.keys(fila)

    return campos.some((campo) =>
      normalizar(valorPorRuta(fila, campo)).includes(termino)
    )
  })
})

const resumen = computed(() => {
  const total = props.rows.length
  const visibles = filasFiltradas.value.length
  return visibles === total ? `${total} en total` : `${visibles} de ${total}`
})
</script>
