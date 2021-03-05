function getSharedProps({
  tagName = 'div',
  observerOptions,
  preLoad = 1.5,
  listenedEvents = () => ['scroll', 'resize', 'orientationChange'],
  throttledWait = 100,
} = {}) {
  return {
    tagName: {
      type: String,
      default: tagName,
    },

    observerOptions: {
      type: Object,
      default: observerOptions,
    },

    preLoad: {
      type: Number,
      default: preLoad,
    },

    listenedEvents: {
      type: Array,
      default: listenedEvents,
    },

    throttledWait: {
      type: Number,
      default: throttledWait,
    },
  };
}

const sharedComputed = {
  defaultObserverOptions() {
    if (this.observerOptions !== undefined) {
      return this.observerOptions;
    }

    const percent = (this.preLoad - 1) * 100; // 1.5 -> 50
    return { rootMargin: `0px ${percent}% ${percent}% 0px` };
  },
};

export { getSharedProps, sharedComputed };
