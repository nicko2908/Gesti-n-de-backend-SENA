<template>
  <!--
    Rail lateral verde SENA (estilo Platzi) expandible.
    Sin header. view="hHh LpR fFf" -> la L mayúscula empuja el contenido.
    El propio logo es el botón: al pasar el cursor se convierte en la
    hamburguesa; ya expandido, la hamburguesa aparece junto a "Guaika".
  -->
  <q-layout view="hHh LpR fFf">
    <q-drawer
      show-if-above
      side="left"
      :width="expandido ? 190 : 76"
      behavior="desktop"
      class="rail"
    >
      <div class="rail__inner" :class="{ 'is-collapsed': !expandido }">
        <!-- Logo = botón de expandir/contraer -->
        <button
          type="button"
          class="rail__brand"
          :aria-expanded="expandido"
          aria-label="Expandir o contraer el menú"
          @click="expandido = !expandido"
        >
          <span class="rail__brand-badge">
            <img
              src="/sena-logo.png"
              alt="Guaika"
              class="rail__logo"
            />
            <!-- Aparece encima del logo al pasar el cursor (modo rail) -->
            <span class="rail__badge-hover">
              <q-icon name="menu" size="24px" />
            </span>
          </span>

          <span class="rail__brand-text">Guaika</span>

          <!-- Hamburgesa junto a "Guaika" cuando está expandido -->
          <q-icon name="menu" size="22px" class="rail__brand-menu" />
        </button>

        <q-list class="rail__nav">
          <q-item
            clickable
            v-ripple
            :to="{ name: 'dashboard' }"
            exact
            class="rail__item"
          >
            <q-item-section avatar>
              <q-icon name="home" size="24px" />
            </q-item-section>
            <q-item-section>Inicio</q-item-section>
            <q-tooltip v-if="!expandido" anchor="center right" self="center left">
              Inicio
            </q-tooltip>
          </q-item>

          <q-item clickable v-ripple :to="{ name: 'cursos' }" class="rail__item">
            <q-item-section avatar>
              <q-icon name="school" size="24px" />
            </q-item-section>
            <q-item-section>Cursos</q-item-section>
            <q-tooltip v-if="!expandido" anchor="center right" self="center left">
              Cursos
            </q-tooltip>
          </q-item>

          <q-item clickable v-ripple :to="{ name: 'aprendices' }" class="rail__item">
            <q-item-section avatar>
              <q-icon name="groups" size="24px" />
            </q-item-section>
            <q-item-section>Aprendices</q-item-section>
            <q-tooltip v-if="!expandido" anchor="center right" self="center left">
              Aprendices
            </q-tooltip>
          </q-item>

          <q-item
            v-if="auth.usuario?.rol === 'ADMIN'"
            clickable
            v-ripple
            :to="{ name: 'usuarios' }"
            class="rail__item"
          >
            <q-item-section avatar>
              <q-icon name="manage_accounts" size="24px" />
            </q-item-section>
            <q-item-section>Usuarios</q-item-section>
            <q-tooltip v-if="!expandido" anchor="center right" self="center left">
              Usuarios
            </q-tooltip>
          </q-item>
        </q-list>

        <div class="rail__spacer" />

        <!-- Cambiar entre modo claro y oscuro -->
        <q-item clickable v-ripple class="rail__item" @click="alternarTema">
          <q-item-section avatar>
            <q-icon
              :name="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
              size="24px"
            />
          </q-item-section>
          <q-item-section>
            {{ $q.dark.isActive ? 'Modo claro' : 'Modo oscuro' }}
          </q-item-section>
          <q-tooltip v-if="!expandido" anchor="center right" self="center left">
            {{ $q.dark.isActive ? 'Modo claro' : 'Modo oscuro' }}
          </q-tooltip>
        </q-item>

        <q-item clickable v-ripple class="rail__item" @click="salir">
          <q-item-section avatar>
            <q-icon name="logout" size="24px" />
          </q-item-section>
          <q-item-section>Cerrar sesión</q-item-section>
          <q-tooltip v-if="!expandido" anchor="center right" self="center left">
            Cerrar sesión
          </q-tooltip>
        </q-item>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  useQuasar,
  QLayout,
  QDrawer,
  QList,
  QItem,
  QItemSection,
  QIcon,
  QTooltip,
  QPageContainer,
} from 'quasar'
import { useAuthStore } from '../stores/auth.js'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

// false = rail de iconos; true = menú completo con etiquetas.
const expandido = ref(false)

// Cambia claro/oscuro y guarda la preferencia para la próxima visita.
function alternarTema() {
  $q.dark.toggle()
  localStorage.setItem('guaika-dark', String($q.dark.isActive))
}

function salir() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
/*
  Verde oscuro SENA (secundario) como fondo: mantiene el aire institucional y
  da buen contraste con el blanco (el verde corporativo #39A900 con texto
  blanco no llega al mínimo AA). El verde corporativo se usa en el ítem activo.

  OJO: Quasar aplica la clase del q-drawer al div interno .q-drawer__content
  (que NO lleva el atributo de scope de Vue), por eso se usa :deep().
*/
:deep(.rail),
:deep(.q-drawer) {
  background: var(--rail-bg);
}

/* El aside del drawer: sombra y animación suave del ancho */
:deep(.q-drawer) {
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.12);
  transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.rail__inner {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 0.75rem 0;
  overflow: hidden;
  white-space: nowrap;
}

/* --- Logo / botón de expandir --- */
.rail__brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0 18px;
  margin-bottom: 0.5rem;
  border: none;
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.rail__brand-badge {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
}

.rail__logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  transition: opacity 0.18s ease;
}

/* Icono que sustituye al logo al pasar el cursor (solo en modo rail) */
.rail__badge-hover {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.rail__brand-text {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  transition: opacity 0.18s ease;
}

/* Hamburgesa junto a "Guaika": visible solo cuando está expandido */
.rail__brand-menu {
  color: #ffffff;
  opacity: 0;
  transition:
    opacity 0.18s ease,
    transform 0.18s ease,
    filter 0.18s ease;
}

.rail__inner:not(.is-collapsed) .rail__brand-menu {
  opacity: 1;
}

/* Al pasar el cursor sobre las 3 líneas, se iluminan */
.rail__brand-menu:hover {
  transform: scale(1.15);
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.95));
}

/* En modo rail: el logo se convierte en hamburguesa al pasar el cursor */
.rail__inner.is-collapsed .rail__brand:hover .rail__logo {
  opacity: 0;
}

.rail__inner.is-collapsed .rail__brand:hover .rail__badge-hover {
  opacity: 1;
}

.rail__nav {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
  padding: 0;
}

.rail__item {
  width: 100%;
  height: 48px;
  min-height: 48px;
  padding: 0 14px;
  justify-content: flex-start;
  color: rgba(255, 255, 255, 0.9);
}

/* La cajita del icono (48x48) es la que se resalta: cuadro redondeado */
.rail__item :deep(.q-item__section--avatar) {
  width: 48px;
  min-width: 48px;
  height: 48px;
  padding: 0;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.rail__item :deep(.q-item__section--main) {
  color: #ffffff;
  transition: opacity 0.18s ease;
}

/* Menú cerrado (modo rail): ocultar los títulos por completo, con fundido */
.rail__inner.is-collapsed :deep(.q-item__section--main),
.rail__inner.is-collapsed .rail__brand-text {
  opacity: 0;
}

.rail__item:hover :deep(.q-item__section--avatar) {
  background: rgba(255, 255, 255, 0.14);
}

/* Ítem activo: cuadro en verde corporativo SENA */
.rail__item.q-item--active {
  color: #ffffff;
}

.rail__item.q-item--active :deep(.q-item__section--avatar) {
  background: var(--rail-active);
}

.rail__spacer {
  flex: 1;
}

/* El contenedor de la página también anima su desplazamiento */
:deep(.q-page-container) {
  transition: padding-left 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
