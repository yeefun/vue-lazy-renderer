<template>
  <component :is="tagName">
    <slot v-if="shouldLoadSlot"></slot>
  </component>
</template>

<script>
const isInBrowser = typeof window === 'object';
const doesWindowHaveIo =
  isInBrowser &&
  'IntersectionObserver' in window &&
  'IntersectionObserverEntry' in window &&
  'intersectionRatio' in window.IntersectionObserverEntry.prototype;

let io;

let startTime = Date.now();
let timeoutId;

export default {
  name: 'LazyRenderer',

  data() {
    return {
      shouldLoadSlot: false,
    };
  },

  mounted() {
    if (!isInBrowser) {
      return;
    }

    if (doesWindowHaveIo) {
      this.initIo();
    } else {
      this.observeViewportToLoad();

      this.listenedEvents.forEach((event) => {
        window.addEventListener(event, this.observeViewportToLoadWithThrottle);
      });
    }
  },

  beforeDestroy() {
    this.cleanup();
  },

  methods: {
    initIo() {
      io = new IntersectionObserver(
        this.handleIntersection,
        this.observerOptions
      );

      io.observe(this.$el);
    },
    handleIntersection([entry]) {
      if (entry.isIntersecting) {
        this.load();
      }
    },

    observeViewportToLoadWithThrottle() {
      clearTimeout(timeoutId);

      const currentTime = Date.now();

      if (currentTime - startTime > this.throttledWait) {
        this.observeViewportToLoad();

        startTime = currentTime;
      } else {
        timeoutId = setTimeout(this.observeViewportToLoad, this.throttledWait);
      }
    },
    observeViewportToLoad() {
      const { top, bottom, left, right } = this.$el.getBoundingClientRect();

      if (
        top <= window.innerHeight * this.preLoad &&
        bottom > 0 &&
        left <= window.innerWidth * this.preLoad &&
        right > 0
      ) {
        this.load();
      }
    },

    load() {
      this.shouldLoadSlot = true;

      this.$emit('load');

      this.cleanup();
    },

    cleanup() {
      if (doesWindowHaveIo) {
        io.disconnect();
      } else {
        this.listenedEvents.forEach((event) => {
          window.removeEventListener(
            event,
            this.observeViewportToLoadWithThrottle
          );
        });
      }
    },
  },
};

if (doesWindowHaveIo) {
  /**
   * Minimal polyfill for Edge 15's lack of `isIntersecting`
   * See: https://github.com/w3c/IntersectionObserver/issues/211
   */
  if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
    Object.defineProperty(
      window.IntersectionObserverEntry.prototype,
      'isIntersecting',
      {
        get() {
          return this.intersectionRatio > 0;
        },
      }
    );
  }
}
</script>
