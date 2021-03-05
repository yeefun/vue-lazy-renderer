// Import vue component
import component from '@/lazy-renderer.vue';

// install function executed by Vue.use()
const install = function installLazyRenderer(Vue, options = {}) {
  if (install.installed) return;
  install.installed = true;

  const {
    tagName = 'div',
    observerOptions,
    preLoad = 1.5,
    listenedEvents = ['scroll', 'resize', 'orientationChange'],
    throttledWait = 100,
  } = options;

  Vue.component(
    component.name,
    Vue.extend(component).extend({
      props: {
        tagName: {
          type: String,
          default: tagName,
        },

        observerOptions: {
          type: Object,
          default: () => observerOptions,
        },

        preLoad: {
          type: Number,
          default: preLoad,
        },

        listenedEvents: {
          type: Array,
          default: () => listenedEvents,
        },

        throttledWait: {
          type: Number,
          default: throttledWait,
        },
      },

      computed: {
        defaultObserverOptions() {
          if (this.observerOptions !== undefined) {
            return this.observerOptions;
          }

          const percent = (this.preLoad - 1) * 100; // 1.5 -> 50
          return { rootMargin: `0px ${percent}% ${percent}% 0px` };
        },
      },
    })
  );
};

// Create module definition for Vue.use()
const plugin = {
  install,
};

// To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare
/* global window, global */
if ('false' === process.env.ES_BUILD) {
  let GlobalVue = null;
  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }
  if (GlobalVue) {
    GlobalVue.use(plugin);
  }
}

// Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()
component.install = install;

// Export component by default
export default component;

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
