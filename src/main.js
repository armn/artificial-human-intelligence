import App from "./App.svelte";
import * as Comlink from "comlink";

// async function init() {
//   const worker = new Worker("worker.js");
//   // WebWorkers use `postMessage` and therefore work with Comlink.
//   const obj = Comlink.wrap(worker);
//   alert(`Counter: ${await obj.counter}`);
//   await obj.inc();
//   alert(`Counter: ${await obj.counter}`);
// }
// init();

const app = new App({
  target: document.body,
  props: {
    // name: "world",
  },
});

export default app;
