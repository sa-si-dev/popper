# Popper Plugin

> A javascript plugin for popper which could be used to positioning tooltip or popover

## Install

```shell
npm install --save popper-plugin
```

## Import file

```html
<script src="node_modules/popper-plugin/dist/popper.min.js"></script>
```

## Initialize plugin

```js
const samplePopper = new PopperComponent({
  /** Refer below for available properties */
});
```

## Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| $popperEle | Element | | Popper element |
| $triggerEle | Element | | Trigger element |
| $arrowEle | Element | | Arrow icon in the popper |
| position | Number | auto | Position of popper (top, bottom, left, right, auto) |
| margin | Number | 8 | Space between popper and its activator (in pixel) |
| offset | Number | 5 | Space between popper and window edge (in pixel) |
| enterDelay | Number | 0 | Delay time before showing popper (in milliseconds) |
| exitDelay | Number | 0 | Delay time before hiding popper (in milliseconds) |
| showDuration | Number | 300 | Transition duration for show animation (in milliseconds) |
| hideDuration | Number | 200 | Transition duration for hide animation (in milliseconds) |
| transitionDistance | Number | 10 | Distance to translate on show/hide animation (in pixel) |
| zIndex | Number | 1 | CSS z-index value for popper |
| afterShow | Function | | Callback function to trigger after show |
| afterHide | Function | | Callback function to trigger after hide |

## Methods

### show()

```js
/**
 * @prop {boolean} [resetPosition] - Recalculate position before show
 * @prop {object} [data] - Any custom data which would be passed to afterShow callback function call
 */
samplePopper.show({});
```

### hide()

```js
/**
 * @prop {object} [data] - Any custom data which would be passed to afterHide callback function call
 */
samplePopper.hide({});
```
