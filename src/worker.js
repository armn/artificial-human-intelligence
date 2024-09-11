import * as Comlink from "comlink";

const obj = {
  counter: 0,
  inc() {
    this.counter++;
  },
};

let timer = setInterval(() => {
  obj.inc();
}, 1000);

Comlink.expose(obj);
Comlink.expose(timer);
