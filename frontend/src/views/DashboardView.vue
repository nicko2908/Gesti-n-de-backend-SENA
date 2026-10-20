<template>
  <q-page padding>
    <div class="q-mb-lg">
      <div class="text-h5">Panel principal</div>
      <div class="text-grey-7">Hola, {{ auth.usuario?.nombre }}</div>
    </div>

    <!-- ============================ RESUMEN ============================ -->
    <section class="q-mb-lg">
      <div class="section-title q-mb-sm">Resumen</div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <q-card
            flat
            v-ripple
            class="stat-card cursor-pointer"
            style="--accent: var(--c-green)"
            role="link"
            tabindex="0"
            @click="irA('aprendices')"
            @keydown.enter.prevent="irA('aprendices')"
            @keydown.space.prevent="irA('aprendices')"
          >
            <q-card-section class="row items-center no-wrap q-gutter-md">
              <div class="stat-card__icon">
                <q-icon name="groups" size="28px" />
              </div>
              <div>
                <div class="stat-card__number">
                  <q-skeleton v-if="cargando" type="text" width="48px" />
                  <template v-else>{{ totalAprendices }}</template>
                </div>
                <div class="stat-card__label">Aprendices inscritos</div>
                <div class="stat-card__hint">{{ aprendicesActivos }} activos</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6">
          <q-card
            flat
            v-ripple
            class="stat-card cursor-pointer"
            style="--accent: var(--c-blue)"
            role="link"
            tabindex="0"
            @click="irA('cursos')"
            @keydown.enter.prevent="irA('cursos')"
            @keydown.space.prevent="irA('cursos')"
          >
            <q-card-section class="row items-center no-wrap q-gutter-md">
              <div class="stat-card__icon">
                <q-icon name="school" size="28px" />
              </div>
              <div>
                <div class="stat-card__number">
                  <q-skeleton v-if="cargando" type="text" width="48px" />
                  <template v-else>{{ totalCursos }}</template>
                </div>
                <div class="stat-card__label">Cursos inscritos</div>
                <div class="stat-card__hint">{{ cursosActivos }} activos</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- ========================= INDICADORES =========================== -->
    <section class="q-mb-lg">
      <div class="section-title q-mb-sm">Indicadores</div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat class="indicator">
            <q-card-section class="row items-center no-wrap q-gutter-sm">
              <q-icon name="task_alt" size="26px" class="indicator__icon" />
              <div>
                <div class="indicator__value">
                  <q-skeleton v-if="cargando" type="text" width="40px" />
                  <template v-else>{{ pctAprendicesActivos }}%</template>
                </div>
                <div class="indicator__label">Aprendices activos</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat class="indicator">
            <q-card-section class="row items-center no-wrap q-gutter-sm">
              <q-icon name="schedule" size="26px" class="indicator__icon" />
              <div>
                <div class="indicator__value">
                  <q-skeleton v-if="cargando" type="text" width="60px" />
                  <template v-else>
                    {{ horasFormacion.toLocaleString('es-CO') }} h
                  </template>
                </div>
                <div class="indicator__label">Horas de formación (activas)</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat class="indicator">
            <q-card-section class="row items-center no-wrap q-gutter-sm">
              <q-icon name="analytics" size="26px" class="indicator__icon" />
              <div>
                <div class="indicator__value">
                  <q-skeleton v-if="cargando" type="text" width="40px" />
                  <template v-else>{{ promedioPorCurso }}</template>
                </div>
                <div class="indicator__label">Aprendices por curso (promedio)</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- ==================== DISTRIBUCIÓN Y ESTADO ====================== -->
    <section class="q-mb-lg">
      <div class="row q-col-gutter-md">
        <!-- Aprendices por curso -->
        <div class="col-12 col-md-7">
          <q-card flat class="panel">
            <q-card-section>
              <div class="panel__title">Aprendices por curso</div>
            </q-card-section>
            <q-card-section>
              <div v-if="aprendicesPorCurso.length" class="bars">
                <div
                  v-for="c in aprendicesPorCurso"
                  :key="c.key"
                  class="bar"
                >
                  <div class="bar__head">
                    <span class="bar__name">
                      {{ c.nombre }}
                      <span class="bar__code">{{ c.codigo }}</span>
                    </span>
                    <span class="bar__count">{{ c.total }}</span>
                  </div>
                  <div class="bar__track">
                    <div
                      class="bar__fill"
                      :style="{ width: (c.total / maxPorCurso) * 100 + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
              <div v-else class="empty">Sin aprendices registrados.</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Estado de los registros -->
        <div class="col-12 col-md-5">
          <q-card flat class="panel">
            <q-card-section>
              <div class="panel__title">Estado de registros</div>
            </q-card-section>

            <q-card-section class="column items-center">
              <div class="donut" :style="donutStyle">
                <div class="donut__hole">
                  <div class="donut__value">{{ pctAprendicesActivos }}%</div>
                  <div class="donut__caption">aprendices activos</div>
                </div>
              </div>

              <div class="legend q-mt-md">
                <div class="legend__row">
                  <span class="legend__dot" style="background: var(--c-green)"></span>
                  <span class="legend__name">Activos</span>
                  <span class="legend__val">{{ aprendicesActivos }}</span>
                </div>
                <div class="legend__row">
                  <span class="legend__dot" style="background: var(--track)"></span>
                  <span class="legend__name">Inactivos</span>
                  <span class="legend__val">
                    {{ totalAprendices - aprendicesActivos }}
                  </span>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-gutter-y-md">
              <div class="mini">
                <div class="mini__head">
                  <span>Cursos</span>
                  <span>{{ cursosActivos }}/{{ totalCursos }} activos</span>
                </div>
                <div class="mini__track">
                  <div class="mini__fill" :style="{ width: pctCursosActivos + '%' }"></div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- ========================= ACCESOS RÁPIDOS ======================== -->
    <section>
      <div class="section-title q-mb-sm">Accesos rápidos</div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <q-card flat class="quick-card" style="--accent: var(--c-blue)">
            <q-card-section>
              <div class="text-h6">Cursos</div>
              <p class="text-grey-7">Crea, edita, activa y desactiva cursos.</p>
              <q-btn color="primary" label="Ir a cursos" to="/dashboard/cursos" />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6">
          <q-card flat class="quick-card" style="--accent: var(--c-green)">
            <q-card-section>
              <div class="text-h6">Aprendices</div>
              <p class="text-grey-7">Gestiona aprendices y asígnalos a un curso.</p>
              <q-btn
                color="primary"
                label="Ir a aprendices"
                to="/dashboard/aprendices"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  useQuasar,
  QPage,
  QCard,
  QCardSection,
  QBtn,
  QIcon,
  QSkeleton,
  QSeparator,
} from 'quasar'
import api from '../api/axios.js'
import { useAuthStore } from '../stores/auth.js'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const aprendices = ref([])
const cursos = ref([])
const cargando = ref(false)

const totalAprendices = computed(() => aprendices.value.length)
const totalCursos = computed(() => cursos.value.length)

const aprendicesActivos = computed(
  () => aprendices.value.filter((a) => a.status === 0).length
)
const cursosActivos = computed(
  () => cursos.value.filter((c) => c.status === 0).length
)

// --- Indicadores ---
const pctAprendicesActivos = computed(() =>
  porciento(aprendicesActivos.value, totalAprendices.value)
)
const pctCursosActivos = computed(() =>
  porciento(cursosActivos.value, totalCursos.value)
)

// Horas de formación = suma de la duración de los cursos activos.
const horasFormacion = computed(() =>
  cursos.value
    .filter((c) => c.status === 0)
    .reduce((suma, c) => suma + (Number(c.duracion) || 0), 0)
)

// Aprendices por curso (promedio).
const promedioPorCurso = computed(() =>
  totalCursos.value
    ? (totalAprendices.value / totalCursos.value).toFixed(1)
    : '0.0'
)

// --- Aprendices agrupados por curso (para las barras) ---
const aprendicesPorCurso = computed(() => {
  const mapa = new Map()
  for (const a of aprendices.value) {
    const key = a.curso?._id || a.curso || 'sin-curso'
    if (!mapa.has(key)) {
      mapa.set(key, {
        key,
        nombre: a.curso?.nombre || 'Sin curso',
        codigo: a.curso?.codigo || '',
        total: 0,
      })
    }
    mapa.get(key).total++
  }
  return [...mapa.values()].sort((x, y) => y.total - x.total)
})

const maxPorCurso = computed(() =>
  Math.max(1, ...aprendicesPorCurso.value.map((c) => c.total))
)

// Fondo de la dona (activos vs el resto).
const donutStyle = computed(() => {
  const pct = pctAprendicesActivos.value
  return {
    background: `conic-gradient(var(--c-green) 0 ${pct}%, var(--track) ${pct}% 100%)`,
  }
})

function porciento(parte, total) {
  return total ? Math.round((parte / total) * 100) : 0
}

// Las tarjetas del resumen llevan a su apartado correspondiente.
function irA(nombreRuta) {
  router.push({ name: nombreRuta })
}

onMounted(async () => {
  cargando.value = true
  try {
    // No hay endpoints de conteo: se traen los listados y se calcula aquí.
    const [{ data: listaAprendices }, { data: listaCursos }] =
      await Promise.all([api.get('/aprendices'), api.get('/cursos')])
    aprendices.value = listaAprendices
    cursos.value = listaCursos
  } catch (error) {
    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.msg || 'No se pudo cargar el resumen del panel',
    })
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
/* Fondo de las tarjetas: se combina con .q-card para ganarle al blanco
   que Quasar aplica por defecto a ese componente. */
.q-card.stat-card,
.q-card.indicator,
.q-card.panel,
.q-card.quick-card {
  background: var(--card-bg);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-muted);
}

/* --------- Tarjetas de resumen (acento arriba) --------- */
.stat-card {
  height: 100%;
  border: 1px solid var(--card-border);
  border-top: 4px solid var(--accent);
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
}

/* Accesible con teclado: marca el foco usando el acento de cada tarjeta. */
.stat-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.stat-card:active {
  transform: translateY(-1px);
}

.stat-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  border-radius: 14px;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
}

.stat-card__number {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-strong);
}

.stat-card__label {
  color: var(--text-muted);
}

.stat-card__hint {
  font-size: 0.75rem;
  color: var(--text-soft);
}

/* --------- Indicadores --------- */
.indicator {
  height: 100%;
  border: 1px solid var(--card-border);
  border-radius: 12px;
}

.indicator__icon {
  color: var(--color-principal);
}

.indicator__value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-strong);
}

.indicator__label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* --------- Paneles (barras y estado) --------- */
.panel {
  height: 100%;
  border: 1px solid var(--card-border);
  border-radius: 12px;
}

.panel__title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-strong);
}

/* Barras de aprendices por curso */
.bars {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.bar__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.bar__name {
  color: var(--text-strong);
  font-size: 0.9rem;
}

.bar__code {
  margin-left: 0.4rem;
  font-size: 0.72rem;
  color: var(--text-soft);
}

.bar__count {
  font-weight: 700;
  color: var(--text-strong);
}

.bar__track {
  margin-top: 0.3rem;
  height: 10px;
  border-radius: 999px;
  background: var(--track);
  overflow: hidden;
}

.bar__fill {
  height: 100%;
  border-radius: 999px;
  background: var(--c-green);
  transition: width 0.5s ease;
}

.empty {
  color: var(--text-soft);
  font-size: 0.9rem;
}

/* Dona de estado */
.donut {
  width: 148px;
  height: 148px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut__hole {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--card-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.donut__value {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1;
  color: var(--text-strong);
}

.donut__caption {
  margin-top: 2px;
  font-size: 0.65rem;
  color: var(--text-muted);
}

.legend {
  width: 100%;
  max-width: 240px;
}

.legend__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  padding: 2px 0;
}

.legend__name {
  flex: 1;
}

.legend__val {
  color: var(--text-strong);
  font-weight: 600;
}

.legend__dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  flex: 0 0 12px;
}

/* Mini barra de cursos */
.mini__head {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.3rem;
}

.mini__track {
  height: 8px;
  border-radius: 999px;
  background: var(--track);
  overflow: hidden;
}

.mini__fill {
  height: 100%;
  border-radius: 999px;
  background: var(--c-green);
  transition: width 0.5s ease;
}

/* --------- Accesos rápidos (acento a la izquierda) --------- */
.quick-card {
  height: 100%;
  border: 1px solid var(--card-border);
  border-left: 4px solid var(--accent);
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.quick-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
}
</style>
