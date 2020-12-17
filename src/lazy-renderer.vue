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

export default {
  name: 'LazyRenderer',

  data() {
    return {
      shouldLoadSlot: false,

      io: undefined,

      startTime: Date.now(),
      timeoutId: undefined,
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
      this.io = new IntersectionObserver(
        this.handleIntersect,
        this.observerOptions
      );

      this.io.observe(this.$el);
    },
    handleIntersect(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.load();
        }
      });
    },

    observeViewportToLoadWithThrottle() {
      clearTimeout(this.timeoutId);

      const currentTime = Date.now();

      if (currentTime - this.startTime > this.throttledWait) {
        this.observeViewportToLoad();

        this.startTime = currentTime;
      } else {
        this.timeoutId = setTimeout(
          this.observeViewportToLoad,
          this.throttledWait
        );
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
        this.io.disconnect();
        this.io = undefined;
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
