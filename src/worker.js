import * as Comlink from "comlink";

const obj = {
  counter: 12,
  inc() {
    this.counter++;
  },
};

setInterval(() => {
  obj.inc();
}, 1000);

Comlink.expose(obj);
