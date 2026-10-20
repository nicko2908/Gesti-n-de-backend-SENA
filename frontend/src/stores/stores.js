import { defineStore } from 'pinia'

// Store de ejemplo documentado en ANALISIS-CONFIGURACION.md.
// "persist: true" guarda el estado en localStorage (gracias a
// pinia-plugin-persistedstate): recarga la página y el contador se conserva.
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
  },
  persist: true,
})
