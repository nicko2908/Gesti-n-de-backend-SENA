<template>
  <footer class="app-footer">
    <span class="app-footer__copyright">
      © {{ anio }} Guaika. Todos los derechos reservados.
    </span>
    <span class="app-footer__dot" aria-hidden="true">•</span>
    <button type="button" class="app-footer__link" @click="verPrivacidad">
      Política de privacidad
    </button>
  </footer>
</template>

<script setup>
// Pie de página reutilizable. Por ahora se usa en el login; más adelante puede
// montarse también dentro del DashboardLayout.
import { useQuasar } from 'quasar'

const $q = useQuasar()
const anio = new Date().getFullYear()

// La política de privacidad todavía no existe como documento/página, así que
// se avisa al usuario en lugar de enlazar a un destino vacío.
function verPrivacidad() {
  $q.notify({
    type: 'info',
    message: 'Aquí irá la política de privacidad de Guaika.',
    caption: 'Documento próximamente',
  })
}
</script>

<style scoped>
.app-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.25rem 1.5rem;
  font-size: 0.78rem;
  color: var(--text-muted);
}

.app-footer__dot {
  color: var(--text-soft);
}

.app-footer__link {
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  color: var(--link);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.app-footer__link:hover {
  color: var(--color-principal);
}
</style>
