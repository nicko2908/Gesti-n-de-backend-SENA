<template>
  <div class="login-page">
    <div class="login-main">
      <q-card class="login-card">
        <!-- Marca: logo oficial del SENA (verde corporativo) + nombre del sistema -->
        <q-card-section class="login-head">
          <img
            src="/sena-logo.png"
            alt="Logotipo del SENA"
            class="login-logo"
          />
          <div class="login-brand">Guaika</div>
          <div class="login-subtitle">Inicia sesión en tu cuenta</div>
        </q-card-section>

        <q-card-section class="login-form">
          <q-form @submit.prevent="iniciarSesion" class="login-fields">
            <q-input
              v-model="email"
              type="email"
              label="Correo institucional"
              outlined
              dense
              autofocus
              autocomplete="username"
              :rules="reglasEmail"
            >
              <template v-slot:prepend>
                <q-icon name="mail" color="primary" />
              </template>
            </q-input>

            <q-input
              v-model="password"
              :type="mostrarPassword ? 'text' : 'password'"
              label="Contraseña"
              outlined
              dense
              autocomplete="current-password"
              :rules="reglasPassword"
              @keyup="detectarCapsLock"
              @keydown="detectarCapsLock"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="mostrarPassword ? 'visibility_off' : 'visibility'"
                  color="primary"
                  class="cursor-pointer"
                  role="button"
                  :aria-label="
                    mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  "
                  @click="mostrarPassword = !mostrarPassword"
                />
              </template>
            </q-input>

            <div v-if="capsLock" class="caps-lock text-caption">
              <q-icon name="warning" size="16px" />
              Bloq Mayús está activado
            </div>

            <q-btn
              type="submit"
              label="Iniciar sesión"
              color="primary"
              class="full-width login-btn"
              no-caps
              unelevated
              :loading="cargando"
            />
          </q-form>
        </q-card-section>

        <q-card-section class="login-note">
          <div class="login-demo">
            <div class="login-demo__title">
              <q-icon name="info" size="16px" />
              Credenciales de ejemplo
            </div>

            <div class="login-demo__rows">
              <div class="login-demo__row">
                <span class="login-demo__label">Correo</span>
                <code class="login-demo__value">admin@sena.edu.co</code>
              </div>
              <div class="login-demo__row">
                <span class="login-demo__label">Contraseña</span>
                <code class="login-demo__value">123456</code>
              </div>
            </div>

            <p class="login-demo__hint">
              Úsalas solo en este entorno de práctica.
            </p>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  useQuasar,
  QCard,
  QCardSection,
  QForm,
  QInput,
  QIcon,
  QBtn,
} from 'quasar'
import { useAuthStore } from '../stores/auth.js'
import AppFooter from '../components/AppFooter.vue'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const cargando = ref(false)
const mostrarPassword = ref(false)
const capsLock = ref(false)

// Reglas de validación en el cliente. q-form no dispara el submit si alguna falla,
// así se evita ir al servidor con campos vacíos o mal escritos.
const reglasEmail = [
  (valor) => !!valor || 'El correo es obligatorio',
  (valor) => /.+@.+\..+/.test(valor) || 'Ingresa un correo válido',
]
const reglasPassword = [(valor) => !!valor || 'La contraseña es obligatoria']

// Avisa si el usuario tiene Bloq Mayús activado mientras escribe la contraseña.
function detectarCapsLock(evento) {
  if (evento.getModifierState) {
    capsLock.value = evento.getModifierState('CapsLock')
  }
}

async function iniciarSesion() {
  cargando.value = true
  try {
    await auth.login(email.value, password.value)
    $q.notify({ type: 'positive', message: 'Bienvenido' })
    router.push({ name: 'dashboard' })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.msg || 'No fue posible iniciar sesión',
    })
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(
      1100px 520px at 50% -10%,
      rgba(57, 169, 0, 0.12),
      transparent 60%
    ),
    var(--surface-alt);
}

.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
}

.login-card {
  width: 100%;
  max-width: 520px;
  border-radius: 16px;
  border: 1px solid rgba(57, 169, 0, 0.14);
  box-shadow: 0 10px 30px rgba(20, 60, 0, 0.1);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

/* Scale suave de toda la tarjeta al pasar el mouse. */
.login-card:hover {
  transform: scale(1.02);
  box-shadow: 0 16px 40px rgba(20, 60, 0, 0.16);
}

.login-head {
  text-align: center;
  padding-bottom: 0.25rem;
}

.login-logo {
  width: 88px;
  height: 88px;
  object-fit: contain;
}

.login-brand {
  margin-top: 0.75rem;
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 1;
  color: var(--color-principal);
}

.login-subtitle {
  margin-top: 0.4rem;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.login-form {
  padding-top: 0.25rem;
}

/* Campos y botón como columna flex con gap: así todos comparten exactamente
   el mismo ancho (el q-gutter de Quasar usa márgenes y podía descuadrar el
   botón respecto a los inputs). */
.login-fields {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.caps-lock {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: -8px;
  color: #b26a00;
}

.login-btn {
  border-radius: 10px;
  font-weight: 600;
  min-height: 42px;
}

/* Quasar deja el contenido del botón pegado arriba cuando se le da más alto
   (su .q-btn es una columna flex y .q-btn__content no crece). Esto lo centra
   vertical y horizontalmente dentro del botón. */
.login-btn :deep(.q-btn__content) {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* El efecto de hover vive en la tarjeta; el botón solo responde al clic. */
.login-btn:active {
  transform: scale(0.98);
}

.login-note {
  padding: 0.9rem 1.1rem 1.2rem;
  border-top: 1px solid rgba(57, 169, 0, 0.12);
}

.login-demo {
  padding: 12px 14px;
  border: 1px dashed color-mix(in srgb, var(--color-principal) 30%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--color-principal) 6%, transparent);
}

.login-demo__title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

.login-demo__rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.login-demo__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.8rem;
}

.login-demo__label {
  color: var(--text-muted);
}

.login-demo__value {
  padding: 3px 8px;
  border: 1px solid var(--card-border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text-strong);
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  user-select: all;
}

.login-demo__hint {
  margin: 8px 0 0;
  text-align: center;
  font-size: 0.72rem;
  color: var(--text-soft);
}
</style>
