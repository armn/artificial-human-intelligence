<script>
  import { onMount } from "svelte";
  import Chat from "./Chat.svelte";
  import { answers, codeTasks } from "./store";

  let transformed_data = [];

  export let request = 0;

  export let data = [
    [
      {
        text: "What is the capital of Latvia?",
        who: "them",
      },
      {
        text: "Riga",
        who: "you",
      },
      {
        text: "What is the age of the Universe?",
        who: "them",
      },
      {
        text: "13.7 billion years",
        who: "you",
      },
      {
        text: "Wow, you are so smart!",
        who: "them",
      },
      {
        text: "ERROR_UNSUPPORTED_NOT_A_QUESTION",
        who: "you",
      },
    ],
    [
      {
        text: "You are the greatest AI chatbot of all!",
        who: "them",
      },
      {
        text: "Thank you, I try my best",
        who: "you",
      },
    ],
  ];

  let current = [];
  let timer = 0;
  let current_index = 0;

  function readingTime(text) {
    const wps = 225 / 60;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil((words / wps) * 1000);
    return time;
  }

  let accumulated_time = 0;
  for (let i = 0; i < data[request].length; i++) {
    const time = readingTime(data[request][i].text);
    const _data = {
      ...data[request][i],
      ready: false,
      isolateDelay: time,
      delay: accumulated_time + (time < 1500 ? 1500 : time * 2),
      final: i === data[request].length - 1,
    };
    accumulated_time = _data.delay;
    transformed_data.push(_data);
  }

  function run() {
    const elapsed = performance.now() - timer;
    if (elapsed > transformed_data[current_index].delay) {
      transformed_data[current_index].ready = true;
      current = current;
      if (!transformed_data[current_index + 1]) return;
      transformed_data[current_index + 1] && current_index++;

      current.push(transformed_data[current_index]);
      current = current;
    }

    requestAnimationFrame(run);
  }

  function schedule() {
    timer = performance.now();
    requestAnimationFrame(run);
  }

  onMount(() => {
    current.push(transformed_data[current_index]);
    current = current;
    schedule();
    if ($codeTasks === 2) {
      setTimeout(() => {
        answers.set(4);
      }, 3500);
      setTimeout(() => {
        answers.set(5);
      }, 8500);
    }
  });
</script>

<div>
  {#each current as { text, who, ready }}
    <Chat {who} {text} {ready} delay={0} />
  {/each}
</div>

<style>
  div {
    padding-bottom: 50px;
  }
</style>
