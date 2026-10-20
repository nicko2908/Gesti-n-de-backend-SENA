<template>
  <router-view />
</template>

<script setup>
// Punto raíz de la aplicación: solo renderiza la vista activa según el router.
</script>

<style>
/* Variables CSS globales disponibles en toda la aplicación. */
:root {
  --color-principal: #39a900;
  --color-secundario: #2e7d00;
  /* Superficies y textos que cambian según el tema */
  --surface: #ffffff;
  --surface-alt: #f4f7f2;
  /* Fondo de las tarjetas de contenido: un poco más oscuro que el lienzo
     para que se distingan del fondo blanco de la página. */
  --card-bg: #f2f6ee;
  --card-border: rgba(57, 105, 40, 0.2);
  --text-strong: #1d1d1d;
  --text-muted: #5b6b57;
  --text-soft: #9aa598;
  --link: #2e7d00;
  --track: #e6ebe3;
  /* Tablas: cabecera, líneas y hover de filas */
  --table-head-bg: #e9efe3;
  --table-line: rgba(57, 105, 40, 0.1);
  --row-hover: rgba(57, 169, 0, 0.07);
  /* Chips de estado (activo / inactivo) */
  --chip-ok-bg: rgba(57, 169, 0, 0.14);
  --chip-ok-text: #2e7d00;
  --chip-off-bg: rgba(198, 40, 40, 0.12);
  --chip-off-text: #c62828;
  /* Rail lateral y sus acentos */
  --rail-bg: #2e7d00;
  --rail-active: #39a900;
  /* Colores de acento de las tarjetas */
  --c-green: #39a900;
  --c-blue: #1565c0;
  --c-violet: #7c3aed;
}

body.body--dark {
  --surface: #1e1e1e;
  --surface-alt: #121212;
  --card-bg: #1e1e1e;
  --card-border: rgba(255, 255, 255, 0.1);
  --text-strong: #ececec;
  --text-muted: #a0a0a0;
  --text-soft: #7a7a7a;
  --link: #7ed957;
  --track: #333333;
  /* Tablas: cabecera, líneas y hover de filas */
  --table-head-bg: #262626;
  --table-line: rgba(255, 255, 255, 0.08);
  --row-hover: rgba(126, 217, 87, 0.08);
  /* Chips de estado (activo / inactivo) */
  --chip-ok-bg: rgba(126, 217, 87, 0.16);
  --chip-ok-text: #8fe06f;
  --chip-off-bg: rgba(255, 138, 128, 0.14);
  --chip-off-text: #ff8a80;
  /* Opción A: el rail pasa a superficie oscura neutra */
  --rail-bg: #1a1a1a;
  --rail-active: #39a900;
  /* Acentos aclarados para no vibrar sobre oscuro */
  --c-green: #7ed957;
  --c-blue: #64b5f6;
  --c-violet: #b39dff;
}

/* Quasar no oscurece q-card ni q-table (tienen background fijo #fff); lo
   compensamos aquí para que se vean bien en modo oscuro. */
body.body--dark .q-card {
  background: var(--surface);
}

body.body--dark .q-table__card {
  background-color: var(--surface);
  color: var(--text-strong);
}

body.body--dark .q-table thead tr th {
  color: var(--text-muted);
}

body.body--dark .q-separator {
  background: rgba(255, 255, 255, 0.12);
}

/* El rail neutro necesita un borde sutil para separarse del fondo */
body.body--dark .q-drawer {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
