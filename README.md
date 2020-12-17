# vue-lazy-renderer

> Lazily render Vue.js components for performance.

## Feature

- **Speed.** Use the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) (IO) to prevent performance problems.
- **Degrade Gracefully.** If a user's browser doesn't support the IO, use [getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) instead. (vue-lazy-renderer does not load the [IO polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill)—it is too fat. You can load it by yourself.)
- **Lightweight.** Only [3.7 kB minified](https://bundlephobia.com/result?p=vue-lazy-renderer).
- **Highly Customized.** You can globally set several options and locally override them.

## Installation

npm:

```shell
npm install vue-lazy-renderer
```

Yarn:

```shell
yarn add vue-lazy-renderer
```

## Usage

### Registration

Use a plugin to register a global component:

```javascript
import VueLazyRenderer from 'vue-lazy-renderer';
import Vue from 'vue';

Vue.use(VueLazyRenderer);
```

### Example



## Customization

### Options/Props

| Parameter | Description | Type | Default |
|---|---|-|-|
| tagName | The tag name of the root node of `<lazy-renderer>` | String | 'div' |
| preLoad | The proportion of a pre-loading height or width to `window.innerHeight` or `window.innerWidth` | Number | 1.5 |
| observerOptions | The Intersection Observer options | Object | { rootMargin: '0px 50% 50% 0px' } |
| listenedEvents | The events you want `window` to listen for (used by `getBoundingClientRect`) | Array | ['scroll', 'resize', 'orientationChange'] |
| throttledWait | The number of milliseconds to throttle invocations to | Number | 100 |

### Events
| Name | Description |
|-|-|
| load | Start to load elements wrapped in `<lazy-renderer>` |

## License

[MIT](./LICENSE.txt)
