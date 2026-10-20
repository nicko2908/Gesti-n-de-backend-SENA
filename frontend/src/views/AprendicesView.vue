<template>
  <q-page padding>
    <div class="page-head">
      <h1 class="page-head__title">Aprendices</h1>
      <p class="page-head__subtitle">
        Gestiona los aprendices de la entidad y su curso asignado.
      </p>
    </div>

    <TablePanel
      title="Aprendices inscritos"
      subtitle="Busca por nombre, documento, correo o curso."
      :rows="aprendices"
      :search-fields="[
        'nombre',
        'documento',
        'email',
        'curso.nombre',
        'curso.codigo',
      ]"
      create-label="Nuevo aprendiz"
      create-icon="person_add"
      @create="abrirFormulario()"
    >
      <template #default="{ rows }">
        <q-table
          :rows="rows"
          :columns="columns"
          row-key="_id"
          :loading="loading"
          loading-label="Cargando aprendices…"
          flat
          binary-state-sort
          :pagination="{ rowsPerPage: 10 }"
          :rows-per-page-options="[5, 10, 25, 0]"
          rows-per-page-label="Filas por página"
          :pagination-label="etiquetaPaginacion"
        >
          <template #body-cell-nombre="props">
            <q-td :props="props">
              <div class="cell-user">
                <div
                  class="cell-user__avatar"
                  aria-hidden="true"
                  :style="estiloAvatar(props.row.nombre)"
                >
                  {{ iniciales(props.row.nombre) }}
                </div>
                <div class="cell-user__body">
                  <div class="cell-user__name">{{ props.row.nombre }}</div>
                  <div class="cell-user__meta">
                    {{ props.row.email || 'Sin correo' }}
                  </div>
                </div>
              </div>
            </q-td>
          </template>

          <template #body-cell-curso="props">
            <q-td :props="props">
              {{ props.row.curso?.nombre || 'Sin curso' }}
              <span v-if="props.row.curso?.codigo" class="cell-sub">
                {{ props.row.curso.codigo }}
              </span>
            </q-td>
          </template>

          <template #body-cell-status="props">
            <q-td :props="props" class="text-center">
              <span
                class="status-chip"
                :class="
                  props.row.status === 0 ? 'status-chip--on' : 'status-chip--off'
                "
              >
                {{ props.row.status === 0 ? 'Activo' : 'Inactivo' }}
              </span>
            </q-td>
          </template>

          <template #body-cell-acciones="props">
            <q-td :props="props">
              <div class="row-actions">
                <q-btn
                  dense
                  flat
                  round
                  color="primary"
                  icon="edit"
                  aria-label="Editar aprendiz"
                  @click="abrirFormulario(props.row)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="props.row.status === 0"
                  dense
                  flat
                  round
                  color="negative"
                  icon="block"
                  aria-label="Desactivar aprendiz"
                  @click="pedirDesactivacion(props.row)"
                >
                  <q-tooltip>Desactivar</q-tooltip>
                </q-btn>

                <q-btn
                  v-else
                  dense
                  flat
                  round
                  color="positive"
                  icon="check_circle"
                  aria-label="Activar aprendiz"
                  @click="cambiarEstado(props.row, 'active')"
                >
                  <q-tooltip>Activar</q-tooltip>
                </q-btn>

                <q-btn
                  dense
                  flat
                  round
                  color="negative"
                  icon="delete"
                  aria-label="Eliminar aprendiz"
                  @click="pedirEliminacion(props.row)"
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <template #no-data>
            <div class="table-empty">
              <q-icon name="groups" size="44px" class="table-empty__icon" />
              <div class="table-empty__title">
                {{ aprendices.length ? 'Sin resultados' : 'Aún no hay aprendices' }}
              </div>
              <div class="table-empty__text">
                {{
                  aprendices.length
                    ? 'Prueba con otro término de búsqueda o cambia el filtro de estado.'
                    : 'Registra el primer aprendiz para comenzar a llenar la tabla.'
                }}
              </div>
              <q-btn
                v-if="!aprendices.length"
                color="primary"
                unelevated
                no-caps
                icon="person_add"
                label="Nuevo aprendiz"
                class="q-mt-sm"
                @click="abrirFormulario()"
              />
            </div>
          </template>
        </q-table>
      </template>
    </TablePanel>

    <ConfirmarAccion
      v-model="confirmarDesactivacion"
      titulo="Desactivar aprendiz"
      :mensaje="mensajeDesactivacion"
      palabra="SI, AUTORIZO DESACTIVAR"
      etiqueta-confirmar="Desactivar"
      icono-confirmar="block"
      @confirm="desactivarAprendiz"
    />

    <ConfirmarAccion
      v-model="confirmarEliminacion"
      titulo="Eliminar aprendiz"
      :mensaje="mensajeEliminacion"
      :palabra="aprendizAEliminar?.nombre || ''"
      instruccion="Para confirmar, escribe el nombre completo del aprendiz:"
      etiqueta-confirmar="Eliminar"
      icono-confirmar="delete_forever"
      @confirm="eliminarAprendiz"
    />

    <FormDialog
      v-model="dialogo"
      :titulo="editando ? 'Editar aprendiz' : 'Nuevo aprendiz'"
      :subtitulo="
        editando
          ? 'Actualiza la información del aprendiz seleccionado.'
          : 'Registra sus datos y asígnalo a un curso.'
      "
      icono="groups"
      acento="var(--c-green)"
      :etiqueta-guardar="editando ? 'Guardar cambios' : 'Registrar aprendiz'"
      :guardando="guardando"
      :guardar-deshabilitado="!opcionesCursos.length"
      @submit="guardar"
    >
      <div v-if="!opcionesCursos.length" class="form-notice">
        <q-icon name="info" size="20px" />
        <div>
          No hay cursos activos disponibles.
          <a
            class="form-notice__link"
            role="button"
            tabindex="0"
            @click="irACursos"
            @keydown.enter.prevent="irACursos"
            @keydown.space.prevent="irACursos"
          >
            Crea o activa un curso
          </a>
          para poder asignar aprendices.
        </div>
      </div>

      <div class="form-section">
        <div class="form-section__title">Datos personales</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-5">
            <q-input
              v-model="form.documento"
              label="Documento"
              outlined
              dense
              :rules="[textoObligatorio]"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="badge" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-7">
            <q-input
              v-model="form.nombre"
              label="Nombre completo"
              outlined
              dense
              :rules="[textoObligatorio]"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="person" />
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <q-input
              v-model="form.email"
              type="email"
              label="Correo electrónico"
              outlined
              dense
              :rules="[emailObligatorio]"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="alternate_email" />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="form-section__title">Asignación</div>
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-select
              v-model="form.curso"
              :options="opcionesFiltradas"
              label="Curso"
              outlined
              dense
              emit-value
              map-options
              use-input
              fill-input
              hide-selected
              input-debounce="0"
              hint="Solo aparecen cursos activos."
              :rules="[seleccionObligatoria]"
              lazy-rules
              @filter="filtrarCursos"
            >
              <template #prepend>
                <q-icon name="school" />
              </template>
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin cursos que coincidan
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </div>
    </FormDialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  useQuasar,
  QPage,
  QBtn,
  QTable,
  QTd,
  QIcon,
  QTooltip,
  QInput,
  QSelect,
} from 'quasar'
import api from '../api/axios.js'
import TablePanel from '../components/TablePanel.vue'
import ConfirmarAccion from '../components/ConfirmarAccion.vue'
import FormDialog from '../components/FormDialog.vue'
import { iniciales, estiloAvatar } from '../utils/avatar.js'
import {
  textoObligatorio,
  emailObligatorio,
  seleccionObligatoria,
} from '../utils/validaciones.js'

const $q = useQuasar()
const router = useRouter()

const aprendices = ref([])
const cursos = ref([])
const loading = ref(false)
const guardando = ref(false)
const dialogo = ref(false)
const editando = ref(false)
const form = ref({ id: null, documento: '', nombre: '', email: '', curso: null })

// Confirmación por texto antes de desactivar (evita clics accidentales).
const confirmarDesactivacion = ref(false)
const aprendizADesactivar = ref(null)

const mensajeDesactivacion = computed(() =>
  aprendizADesactivar.value
    ? `Vas a desactivar a ${aprendizADesactivar.value.nombre}. Dejará de contar como aprendiz activo, pero sus datos se conservan y podrás activarlo de nuevo.`
    : ''
)

// Confirmación por texto antes de eliminar (debe escribir el nombre completo).
const confirmarEliminacion = ref(false)
const aprendizAEliminar = ref(null)

const mensajeEliminacion = computed(() =>
  aprendizAEliminar.value
    ? `Vas a eliminar definitivamente a ${aprendizAEliminar.value.nombre}. Esta acción no se puede deshacer.`
    : ''
)

const columns = [
  { name: 'nombre', label: 'Aprendiz', field: 'nombre', align: 'left', sortable: true },
  { name: 'documento', label: 'Documento', field: 'documento', align: 'left', sortable: true },
  {
    name: 'curso',
    label: 'Curso',
    field: (row) => row.curso?.nombre || '',
    align: 'left',
    sortable: true,
  },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' },
  { name: 'acciones', label: 'Acciones', align: 'right' },
]

// Texto del pie de la tabla: "1-10 de 25".
function etiquetaPaginacion(inicio, fin, total) {
  return `${inicio}-${fin} de ${total}`
}

// Solo los cursos activos aparecen en el select.
const opcionesCursos = computed(() =>
  cursos.value
    .filter((c) => c.status === 0)
    .map((c) => ({ label: `${c.nombre} (${c.codigo})`, value: c._id }))
)

// Copia filtrable que usa el q-select con use-input.
const opcionesFiltradas = ref([])

watch(
  opcionesCursos,
  (nuevas) => {
    opcionesFiltradas.value = nuevas
  },
  { immediate: true }
)

function filtrarCursos(valor, update) {
  update(() => {
    const termino = String(valor ?? '').toLowerCase().trim()
    opcionesFiltradas.value = termino
      ? opcionesCursos.value.filter((opcion) =>
          opcion.label.toLowerCase().includes(termino)
        )
      : opcionesCursos.value
  })
}

function irACursos() {
  dialogo.value = false
  router.push({ name: 'cursos' })
}

function mensajeError(error, porDefecto) {
  const data = error.response?.data
  if (data?.errors?.length) {
    return data.errors.join('. ')
  }
  return data?.msg || porDefecto
}

async function listar() {
  loading.value = true
  try {
    const [{ data: aprendizData }, { data: cursoData }] = await Promise.all([
      api.get('/aprendices'),
      api.get('/cursos'),
    ])
    aprendices.value = aprendizData
    cursos.value = cursoData
  } catch (error) {
    $q.notify({ type: 'negative', message: mensajeError(error, 'No se pudo cargar los datos') })
  } finally {
    loading.value = false
  }
}

function abrirFormulario(aprendiz = null) {
  editando.value = !!aprendiz
  form.value = aprendiz
    ? {
        id: aprendiz._id,
        documento: aprendiz.documento,
        nombre: aprendiz.nombre,
        email: aprendiz.email,
        curso: aprendiz.curso?._id ?? aprendiz.curso,
      }
    : { id: null, documento: '', nombre: '', email: '', curso: null }
  dialogo.value = true
}

async function guardar() {
  guardando.value = true
  const datos = {
    documento: (form.value.documento ?? '').trim(),
    nombre: (form.value.nombre ?? '').trim(),
    email: (form.value.email ?? '').trim(),
    curso: form.value.curso,
  }
  try {
    if (editando.value) {
      await api.put(`/aprendices/update/${form.value.id}`, datos)
      $q.notify({ type: 'positive', message: 'Aprendiz actualizado' })
    } else {
      await api.post('/aprendices/register', datos)
      $q.notify({ type: 'positive', message: 'Aprendiz registrado' })
    }
    dialogo.value = false
    listar()
  } catch (error) {
    $q.notify({ type: 'negative', message: mensajeError(error, 'No se pudo guardar el aprendiz') })
  } finally {
    guardando.value = false
  }
}

function pedirDesactivacion(aprendiz) {
  aprendizADesactivar.value = aprendiz
  confirmarDesactivacion.value = true
}

function desactivarAprendiz() {
  const aprendiz = aprendizADesactivar.value
  aprendizADesactivar.value = null
  if (aprendiz) cambiarEstado(aprendiz, 'inactive')
}

function pedirEliminacion(aprendiz) {
  aprendizAEliminar.value = aprendiz
  confirmarEliminacion.value = true
}

async function eliminarAprendiz() {
  const aprendiz = aprendizAEliminar.value
  aprendizAEliminar.value = null
  if (!aprendiz) return

  try {
    await api.delete(`/aprendices/${aprendiz._id}`)
    $q.notify({ type: 'positive', message: 'Aprendiz eliminado' })
    listar()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: mensajeError(error, 'No se pudo eliminar el aprendiz'),
    })
  }
}

async function cambiarEstado(aprendiz, accion) {
  try {
    await api.put(`/aprendices/${accion}/${aprendiz._id}`)
    $q.notify({
      type: 'positive',
      message: accion === 'active' ? 'Aprendiz activado' : 'Aprendiz desactivado',
    })
    listar()
  } catch (error) {
    $q.notify({ type: 'negative', message: mensajeError(error, 'No se pudo actualizar el aprendiz') })
  }
}

onMounted(listar)
</script>
