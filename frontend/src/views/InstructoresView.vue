<template>
  <q-page padding>
    <div class="page-head">
      <h1 class="page-head__title">Instructores</h1>
      <p class="page-head__subtitle">
        Administra los instructores de la entidad y sus especialidades.
      </p>
    </div>

    <TablePanel
      title="Instructores inscritos"
      subtitle="Busca por nombre, documento, correo o especialidad."
      :rows="instructores"
      :search-fields="['nombre', 'documento', 'email', 'especialidad']"
      search-placeholder="Buscar por nombre, documento o especialidad…"
      create-label="Nuevo instructor"
      create-icon="person_add"
      @create="abrirFormulario()"
    >
      <template #default="{ rows }">
        <q-table
          :rows="rows"
          :columns="columns"
          row-key="_id"
          :loading="loading"
          loading-label="Cargando instructores…"
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
                    {{ props.row.documento }}
                  </div>
                </div>
              </div>
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
                  aria-label="Editar instructor"
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
                  aria-label="Desactivar instructor"
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
                  aria-label="Activar instructor"
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
                  aria-label="Eliminar instructor"
                  @click="pedirEliminacion(props.row)"
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <template #no-data>
            <div class="table-empty">
              <q-icon
                name="supervisor_account"
                size="44px"
                class="table-empty__icon"
              />
              <div class="table-empty__title">
                {{
                  instructores.length
                    ? 'Sin resultados'
                    : 'Aún no hay instructores'
                }}
              </div>
              <div class="table-empty__text">
                {{
                  instructores.length
                    ? 'Prueba con otro término de búsqueda o cambia el filtro de estado.'
                    : 'Registra el primer instructor para comenzar a llenar la tabla.'
                }}
              </div>
              <q-btn
                v-if="!instructores.length"
                color="primary"
                unelevated
                no-caps
                icon="person_add"
                label="Nuevo instructor"
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
      titulo="Desactivar instructor"
      :mensaje="mensajeDesactivacion"
      palabra="SI, AUTORIZO DESACTIVAR"
      etiqueta-confirmar="Desactivar"
      icono-confirmar="block"
      @confirm="desactivarInstructor"
    />

    <ConfirmarAccion
      v-model="confirmarEliminacion"
      titulo="Eliminar instructor"
      :mensaje="mensajeEliminacion"
      :palabra="instructorAEliminar?.nombre || ''"
      instruccion="Para confirmar, escribe el nombre completo del instructor:"
      etiqueta-confirmar="Eliminar"
      icono-confirmar="delete_forever"
      @confirm="eliminarInstructor"
    />

    <FormDialog
      v-model="dialogo"
      :titulo="editando ? 'Editar instructor' : 'Nuevo instructor'"
      :subtitulo="
        editando
          ? 'Actualiza la información del instructor seleccionado.'
          : 'Registra los datos del instructor de la entidad.'
      "
      icono="supervisor_account"
      acento="var(--c-violet)"
      :etiqueta-guardar="editando ? 'Guardar cambios' : 'Registrar instructor'"
      :guardando="guardando"
      @submit="guardar"
    >
      <div class="form-section">
        <div class="form-section__title">Datos del instructor</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
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

          <div class="col-12 col-sm-6">
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

          <div class="col-12">
            <q-input
              v-model="form.especialidad"
              label="Especialidad"
              outlined
              dense
              hint="Área o especialidad que imparte."
              :rules="[textoObligatorio]"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="work" />
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </FormDialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  useQuasar,
  QPage,
  QBtn,
  QTable,
  QTd,
  QIcon,
  QTooltip,
  QInput,
} from 'quasar'
import api from '../api/axios.js'
import TablePanel from '../components/TablePanel.vue'
import ConfirmarAccion from '../components/ConfirmarAccion.vue'
import FormDialog from '../components/FormDialog.vue'
import { iniciales, estiloAvatar } from '../utils/avatar.js'
import {
  textoObligatorio,
  emailObligatorio,
} from '../utils/validaciones.js'

const $q = useQuasar()

const instructores = ref([])
const loading = ref(false)
const guardando = ref(false)
const dialogo = ref(false)
const editando = ref(false)
const form = ref({ id: null, documento: '', nombre: '', email: '', especialidad: '' })

// Confirmación por texto antes de desactivar (evita clics accidentales).
const confirmarDesactivacion = ref(false)
const instructorADesactivar = ref(null)

const mensajeDesactivacion = computed(() =>
  instructorADesactivar.value
    ? `Vas a desactivar al instructor ${instructorADesactivar.value.nombre}. Dejará de contar como instructor activo, pero sus datos se conservan y podrás activarlo de nuevo.`
    : ''
)

// Confirmación por texto antes de eliminar (debe escribir el nombre completo).
const confirmarEliminacion = ref(false)
const instructorAEliminar = ref(null)

const mensajeEliminacion = computed(() =>
  instructorAEliminar.value
    ? `Vas a eliminar definitivamente al instructor ${instructorAEliminar.value.nombre}. Esta acción no se puede deshacer.`
    : ''
)

const columns = [
  { name: 'nombre', label: 'Instructor', field: 'nombre', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'especialidad', label: 'Especialidad', field: 'especialidad', align: 'left', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' },
  { name: 'acciones', label: 'Acciones', align: 'right' },
]

// Texto del pie de la tabla: "1-10 de 25".
function etiquetaPaginacion(inicio, fin, total) {
  return `${inicio}-${fin} de ${total}`
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
    const { data } = await api.get('/instructores')
    instructores.value = data
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: mensajeError(error, 'No se pudo cargar los instructores'),
    })
  } finally {
    loading.value = false
  }
}

function abrirFormulario(instructor = null) {
  editando.value = !!instructor
  form.value = instructor
    ? {
        id: instructor._id,
        documento: instructor.documento,
        nombre: instructor.nombre,
        email: instructor.email,
        especialidad: instructor.especialidad,
      }
    : { id: null, documento: '', nombre: '', email: '', especialidad: '' }
  dialogo.value = true
}

async function guardar() {
  guardando.value = true
  const datos = {
    documento: (form.value.documento ?? '').trim(),
    nombre: (form.value.nombre ?? '').trim(),
    email: (form.value.email ?? '').trim(),
    especialidad: (form.value.especialidad ?? '').trim(),
  }
  try {
    if (editando.value) {
      await api.put(`/instructores/update/${form.value.id}`, datos)
      $q.notify({ type: 'positive', message: 'Instructor actualizado' })
    } else {
      await api.post('/instructores/register', datos)
      $q.notify({ type: 'positive', message: 'Instructor registrado' })
    }
    dialogo.value = false
    listar()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: mensajeError(error, 'No se pudo guardar el instructor'),
    })
  } finally {
    guardando.value = false
  }
}

function pedirDesactivacion(instructor) {
  instructorADesactivar.value = instructor
  confirmarDesactivacion.value = true
}

function desactivarInstructor() {
  const instructor = instructorADesactivar.value
  instructorADesactivar.value = null
  if (instructor) cambiarEstado(instructor, 'inactive')
}

function pedirEliminacion(instructor) {
  instructorAEliminar.value = instructor
  confirmarEliminacion.value = true
}

async function eliminarInstructor() {
  const instructor = instructorAEliminar.value
  instructorAEliminar.value = null
  if (!instructor) return

  try {
    await api.delete(`/instructores/${instructor._id}`)
    $q.notify({ type: 'positive', message: 'Instructor eliminado' })
    listar()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: mensajeError(error, 'No se pudo eliminar el instructor'),
    })
  }
}

async function cambiarEstado(instructor, accion) {
  try {
    await api.put(`/instructores/${accion}/${instructor._id}`)
    $q.notify({
      type: 'positive',
      message: accion === 'active' ? 'Instructor activado' : 'Instructor desactivado',
    })
    listar()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: mensajeError(error, 'No se pudo actualizar el instructor'),
    })
  }
}

onMounted(listar)
</script>
