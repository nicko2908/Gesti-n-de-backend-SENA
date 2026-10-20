<template>
  <q-page padding>
    <div class="row items-center q-col-gutter-sm q-mb-lg">
      <div class="col-12 col-sm">
        <h1 class="page-head__title">Usuarios</h1>
        <p class="page-head__subtitle">
          Administra las cuentas y los roles de acceso al sistema.
        </p>
      </div>

      <div class="col-12 col-sm-auto">
        <q-btn
          color="primary"
          unelevated
          no-caps
          icon="person_add"
          label="Nueva cuenta"
          @click="abrirFormulario()"
        />
      </div>
    </div>

    <div class="q-gutter-y-lg">
      <!-- Administradores activos -->
      <TablePanel
        title="Administradores activos"
        subtitle="Cuentas con acceso completo al sistema."
        :rows="administradores"
        :search-fields="['nombre', 'email']"
        search-placeholder="Buscar administrador…"
        :statusable="false"
      >
        <template #default="{ rows }">
          <q-table
            :rows="rows"
            :columns="columnasAdministradores"
            row-key="_id"
            :loading="cargando"
            loading-label="Cargando administradores…"
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
                    <div class="cell-user__meta">{{ props.row.email }}</div>
                  </div>
                </div>
              </q-td>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props" class="text-center">
                <span
                  class="status-chip"
                  :class="
                    props.row.status === 0
                      ? 'status-chip--on'
                      : 'status-chip--off'
                  "
                >
                  {{ props.row.status === 0 ? 'Activo' : 'Inactivo' }}
                </span>
              </q-td>
            </template>

            <template #body-cell-createdAt="props">
              <q-td :props="props">
                {{ formatearFecha(props.row.createdAt) }}
              </q-td>
            </template>

            <template #no-data>
              <div class="table-empty">
                <q-icon
                  name="admin_panel_settings"
                  size="44px"
                  class="table-empty__icon"
                />
                <div class="table-empty__title">
                  {{
                    administradores.length
                      ? 'Sin resultados'
                      : 'Sin administradores activos'
                  }}
                </div>
                <div class="table-empty__text">
                  {{
                    administradores.length
                      ? 'Prueba con otro término de búsqueda.'
                      : 'Crea una cuenta con rol Administrador para gestionar el sistema.'
                  }}
                </div>
                <q-btn
                  v-if="!administradores.length"
                  color="primary"
                  unelevated
                  no-caps
                  icon="admin_panel_settings"
                  label="Nuevo administrador"
                  class="q-mt-sm"
                  @click="abrirFormulario('ADMIN')"
                />
              </div>
            </template>
          </q-table>
        </template>
      </TablePanel>

      <!-- Usuarios -->
      <TablePanel
        title="Usuarios creados"
        subtitle="Cuentas con rol de usuario en el panel de gestión."
        :rows="usuariosCreados"
        :search-fields="['nombre', 'email']"
        search-placeholder="Buscar usuario…"
        :statusable="false"
      >
        <template #default="{ rows }">
          <q-table
            :rows="rows"
            :columns="columnasUsuarios"
            row-key="_id"
            :loading="cargando"
            loading-label="Cargando usuarios…"
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
                    <div class="cell-user__meta">{{ props.row.email }}</div>
                  </div>
                </div>
              </q-td>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props" class="text-center">
                <span
                  class="status-chip"
                  :class="
                    props.row.status === 0
                      ? 'status-chip--on'
                      : 'status-chip--off'
                  "
                >
                  {{ props.row.status === 0 ? 'Activo' : 'Inactivo' }}
                </span>
              </q-td>
            </template>

            <template #body-cell-createdAt="props">
              <q-td :props="props">
                {{ formatearFecha(props.row.createdAt) }}
              </q-td>
            </template>

            <template #no-data>
              <div class="table-empty">
                <q-icon name="group" size="44px" class="table-empty__icon" />
                <div class="table-empty__title">
                  {{
                    usuariosCreados.length
                      ? 'Sin resultados'
                      : 'Aún no hay usuarios'
                  }}
                </div>
                <div class="table-empty__text">
                  {{
                    usuariosCreados.length
                      ? 'Prueba con otro término de búsqueda.'
                      : 'Registra la primera cuenta de usuario para comenzar.'
                  }}
                </div>
                <q-btn
                  v-if="!usuariosCreados.length"
                  color="primary"
                  unelevated
                  no-caps
                  icon="person_add"
                  label="Nuevo usuario"
                  class="q-mt-sm"
                  @click="abrirFormulario('USER')"
                />
              </div>
            </template>
          </q-table>
        </template>
      </TablePanel>
    </div>

    <FormDialog
      v-model="dialogo"
      titulo="Nueva cuenta"
      subtitulo="Crea un usuario o administrador y define su rol de acceso."
      icono="manage_accounts"
      acento="var(--c-blue)"
      etiqueta-guardar="Registrar"
      :guardando="guardando"
      @submit="guardar"
    >
      <div class="form-section">
        <div class="form-section__title">Datos de la cuenta</div>
        <div class="row q-col-gutter-md">
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

          <div class="col-12 col-sm-6">
            <q-select
              v-model="form.rol"
              :options="opcionesRol"
              label="Rol"
              outlined
              dense
              emit-value
              map-options
              :rules="[seleccionObligatoria]"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="admin_panel_settings" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              v-model="form.password"
              :type="mostrarPassword ? 'text' : 'password'"
              label="Contraseña"
              outlined
              dense
              hint="Mínimo 6 caracteres"
              :rules="[passwordObligatoria]"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="lock" />
              </template>
              <template #append>
                <q-icon
                  :name="mostrarPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  role="button"
                  :aria-label="
                    mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  "
                  @click="mostrarPassword = !mostrarPassword"
                />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <div class="form-notice">
        <q-icon name="info" size="20px" />
        <div v-if="form.rol === 'ADMIN'">
          Los administradores pueden gestionar cursos, aprendices y cuentas de
          usuario.
        </div>
        <div v-else>
          Los usuarios pueden acceder al panel de gestión del sistema.
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
  QInput,
  QSelect,
} from 'quasar'
import api from '../api/axios.js'
import TablePanel from '../components/TablePanel.vue'
import FormDialog from '../components/FormDialog.vue'
import { iniciales, estiloAvatar } from '../utils/avatar.js'
import {
  nombreTexto,
  emailObligatorio,
  passwordObligatoria,
  seleccionObligatoria,
} from '../utils/validaciones.js'

const $q = useQuasar()

const usuarios = ref([])
const cargando = ref(false)
const guardando = ref(false)
const dialogo = ref(false)
const mostrarPassword = ref(false)
const form = ref({ nombre: '', email: '', password: '', rol: 'USER' })

const opcionesRol = [
  { label: 'Usuario', value: 'USER' },
  { label: 'Administrador', value: 'ADMIN' },
]

// Solo administradores con estado activo (0).
const administradores = computed(() =>
  usuarios.value.filter((u) => u.rol === 'ADMIN' && u.status === 0)
)

// Cuentas con rol de usuario.
const usuariosCreados = computed(() =>
  usuarios.value.filter((u) => u.rol === 'USER')
)

const columnasAdministradores = [
  { name: 'nombre', label: 'Administrador', field: 'nombre', align: 'left', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' },
  { name: 'createdAt', label: 'Alta', field: 'createdAt', align: 'left', sortable: true },
]

const columnasUsuarios = [
  { name: 'nombre', label: 'Usuario', field: 'nombre', align: 'left', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' },
  { name: 'createdAt', label: 'Alta', field: 'createdAt', align: 'left', sortable: true },
]

function etiquetaPaginacion(inicio, fin, total) {
  return `${inicio}-${fin} de ${total}`
}

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function mensajeError(error, porDefecto) {
  const data = error.response?.data
  if (data?.errors?.length) {
    return data.errors.join('. ')
  }
  return data?.msg || porDefecto
}

async function listar() {
  cargando.value = true
  try {
    const { data } = await api.get('/usuarios')
    usuarios.value = data
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: mensajeError(error, 'No se pudieron cargar los usuarios'),
    })
  } finally {
    cargando.value = false
  }
}

function abrirFormulario(rol = 'USER') {
  form.value = { nombre: '', email: '', password: '', rol }
  mostrarPassword.value = false
  dialogo.value = true
}

async function guardar() {
  guardando.value = true
  const rol = form.value.rol

  try {
    await api.post('/usuarios/register', {
      nombre: form.value.nombre.trim(),
      email: form.value.email.trim(),
      password: form.value.password,
      rol,
    })
    $q.notify({
      type: 'positive',
      message: rol === 'ADMIN' ? 'Administrador registrado' : 'Usuario registrado',
    })
    dialogo.value = false
    listar()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: mensajeError(error, 'No se pudo registrar la cuenta'),
    })
  } finally {
    guardando.value = false
  }
}

onMounted(listar)
</script>
