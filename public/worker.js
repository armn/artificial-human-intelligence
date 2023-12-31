// addEventListener("message", ({ data }) => {
//   switch (data.message) {
//     case "tick":
//       clearInterval(timer);
//       send(data);
//       timer = setInterval(() => {
//         send(data);
//       }, 1000);
//       break;

//     case "stop":
//       clearInterval(timer);
//       break;
//   }
// });

function send() {
  const result = {
    message: "tick",
  };
  postMessage({ ...result });
}

setInterval(() => {
  send();
}, 1000);
