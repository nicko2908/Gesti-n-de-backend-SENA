<template>
  <q-page padding>
    <div class="page-head">
      <h1 class="page-head__title">Cursos</h1>
      <p class="page-head__subtitle">
        Administra la oferta de formación: crea, edita y activa cursos.
      </p>
    </div>

    <TablePanel
      title="Cursos inscritos"
      subtitle="Busca por nombre o código del curso."
      :rows="cursos"
      :search-fields="['nombre', 'codigo']"
      search-placeholder="Buscar por nombre o código…"
      create-label="Nuevo curso"
      create-icon="add"
      @create="abrirFormulario()"
    >
      <template #default="{ rows }">
        <q-table
          :rows="rows"
          :columns="columns"
          row-key="_id"
          :loading="loading"
          loading-label="Cargando cursos…"
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
                  class="cell-user__avatar cell-user__avatar--icon"
                  aria-hidden="true"
                >
                  <q-icon name="school" size="18px" />
                </div>
                <div class="cell-user__body">
                  <div class="cell-user__name">{{ props.row.nombre }}</div>
                  <div class="cell-user__meta">{{ props.row.codigo }}</div>
                </div>
              </div>
            </q-td>
          </template>

          <template #body-cell-duracion="props">
            <q-td :props="props">{{ props.row.duracion }} h</q-td>
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
                  aria-label="Editar curso"
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
                  aria-label="Desactivar curso"
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
                  aria-label="Activar curso"
                  @click="cambiarEstado(props.row, 'active')"
                >
                  <q-tooltip>Activar</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <template #no-data>
            <div class="table-empty">
              <q-icon name="school" size="44px" class="table-empty__icon" />
              <div class="table-empty__title">
                {{ cursos.length ? 'Sin resultados' : 'Aún no hay cursos' }}
              </div>
              <div class="table-empty__text">
                {{
                  cursos.length
                    ? 'Prueba con otro término de búsqueda o cambia el filtro de estado.'
                    : 'Crea el primer curso para comenzar a llenar la tabla.'
                }}
              </div>
              <q-btn
                v-if="!cursos.length"
                color="primary"
                unelevated
                no-caps
                icon="add"
                label="Nuevo curso"
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
      titulo="Desactivar curso"
      :mensaje="mensajeDesactivacion"
      palabra="SI, AUTORIZO DESACTIVAR"
      etiqueta-confirmar="Desactivar"
      icono-confirmar="block"
      @confirm="desactivarCurso"
    />

    <FormDialog
      v-model="dialogo"
      :titulo="editando ? 'Editar curso' : 'Nuevo curso'"
      :subtitulo="
        editando
          ? 'Actualiza la información del curso seleccionado.'
          : 'Registra un nuevo curso en la oferta de formación.'
      "
      icono="school"
      acento="var(--c-blue)"
      :etiqueta-guardar="editando ? 'Guardar cambios' : 'Registrar curso'"
      :guardando="guardando"
      @submit="guardar"
    >
      <div class="form-section">
        <div class="form-section__title">Información del curso</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-input
              v-model="form.codigo"
              label="Código"
              outlined
              dense
              hint="Letras, números, espacios y guiones"
              :rules="[codigoTexto]"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="tag" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              v-model="form.duracion"
              type="number"
              label="Duración"
              outlined
              dense
              suffix="h"
              hint="Duración total en horas"
              :rules="[duracionObligatoria]"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="schedule" />
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <q-input
              v-model="form.nombre"
              label="Nombre completo"
              outlined
              dense
              hint="Solo letras y espacios"
              :rules="[nombreTexto]"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="menu_book" />
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
import {
  nombreTexto,
  codigoTexto,
  duracionObligatoria,
} from '../utils/validaciones.js'

const $q = useQuasar()

const cursos = ref([])
const loading = ref(false)
const guardando = ref(false)
const dialogo = ref(false)
const editando = ref(false)
const form = ref({ id: null, codigo: '', nombre: '', duracion: null })

// Confirmación por texto antes de desactivar (evita clics accidentales).
const confirmarDesactivacion = ref(false)
const cursoADesactivar = ref(null)

const mensajeDesactivacion = computed(() => {
  const curso = cursoADesactivar.value
  if (!curso) return ''
  const detalle = curso.codigo ? `${curso.nombre} (${curso.codigo})` : curso.nombre
  return `Vas a desactivar el curso ${detalle}. Dejará de estar disponible para asignar aprendices, pero podrás activarlo de nuevo.`
})

const columns = [
  { name: 'nombre', label: 'Curso', field: 'nombre', align: 'left', sortable: true },
  { name: 'duracion', label: 'Duración (h)', field: 'duracion', align: 'left', sortable: true },
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
    const { data } = await api.get('/cursos')
    cursos.value = data
  } catch (error) {
    $q.notify({ type: 'negative', message: mensajeError(error, 'No se pudo cargar los cursos') })
  } finally {
    loading.value = false
  }
}

function abrirFormulario(curso = null) {
  editando.value = !!curso
  form.value = curso
    ? { id: curso._id, codigo: curso.codigo, nombre: curso.nombre, duracion: curso.duracion }
    : { id: null, codigo: '', nombre: '', duracion: null }
  dialogo.value = true
}

async function guardar() {
  guardando.value = true
  const datos = {
    codigo: (form.value.codigo ?? '').trim(),
    nombre: (form.value.nombre ?? '').trim(),
    duracion: Number(form.value.duracion),
  }
  try {
    if (editando.value) {
      await api.put(`/cursos/update/${form.value.id}`, datos)
      $q.notify({ type: 'positive', message: 'Curso actualizado' })
    } else {
      await api.post('/cursos/register', datos)
      $q.notify({ type: 'positive', message: 'Curso registrado' })
    }
    dialogo.value = false
    listar()
  } catch (error) {
    $q.notify({ type: 'negative', message: mensajeError(error, 'No se pudo guardar el curso') })
  } finally {
    guardando.value = false
  }
}

function pedirDesactivacion(curso) {
  cursoADesactivar.value = curso
  confirmarDesactivacion.value = true
}

function desactivarCurso() {
  const curso = cursoADesactivar.value
  cursoADesactivar.value = null
  if (curso) cambiarEstado(curso, 'inactive')
}

async function cambiarEstado(curso, accion) {
  try {
    await api.put(`/cursos/${accion}/${curso._id}`)
    $q.notify({
      type: 'positive',
      message: accion === 'active' ? 'Curso activado' : 'Curso desactivado',
    })
    listar()
  } catch (error) {
    $q.notify({ type: 'negative', message: mensajeError(error, 'No se pudo actualizar el curso') })
  }
}

onMounted(listar)
</script>
