<script>
  import { editorSpeed, codeTasks } from "./store";
  import { fade, fly } from "svelte/transition";
  export let template;

  let readyToSubmit = false;

  const templates = [
    `<html>
  <head>
    <title>AI Chatbot</title>
      <script>const AI = (question) => { answer; }<\/script>
    </head>
    <body>
      What is your question?
      <form onSubmit="AI(question)">
        <input /><button>Send</button>
      </form>
    </body>
</html>`,
    `/* Bugfix for prompts without a question */
if (!question) {
  let answer;
  const length = Math.random() * 10;
  while (length) {
    answer = answer + Words.generate();
  }
  answer = String.filterForProfanities(answer);
  return answer;
}
`,
    `function monetizeAI(economy, customer) {
  let income;
  forEach(customer) {
    income = income + customer.money;
    economy = economy - customer.money;
  }
  addToWallet(income);
}`,
  ];

  let code = "";
  let i = 0;

  let disabled = false;
  function handleKeyDown(e) {
    e.preventDefault();
    e.stopPropagation();
    code += templates[template].slice(i, i + $editorSpeed);
    i += $editorSpeed;
    if (i >= templates[template].length) {
      disabled = true;
      // codeTasks.set($codeTasks + 1);
      readyToSubmit = true;
    }
  }
</script>

<div class="editor">
  <div class="header">
    <div class="buttons">
      <div class="button" />
      <div class="button" />
      <div class="button" />
    </div>
    <div class="speed">{$editorSpeed} chars/key</div>
  </div>

  <div class="editor-content">
    <mark>/* Write code below */</mark>
    <textarea
      on:keydown={(e) => e.preventDefault()}
      on:keyup={(e) => handleKeyDown(e)}
      value={code}
      {disabled}
    />
  </div>
  <div class="editor-footer">
    <div>
      {#if readyToSubmit}
        <button
          in:fade={{ delay: 500, duration: 1000 }}
          on:click={codeTasks.set($codeTasks + 1)}>Run code</button
        >
      {/if}
    </div>
    <div style="text-align:right;">
      {code.length}/{templates[template].length}
    </div>
  </div>
</div>

<style lang="scss">
  .editor {
    width: calc(100vw - 2rem);
    max-width: 500px;
    background: rgb(55, 65, 75);
    font-family: monospace;
    font-size: 15px;
    border-radius: 5px;
    box-shadow: var(--box-shadow);
    color: white;
  }

  textarea {
    background: rgb(42, 65, 75);
    width: 100%;
    height: 220px;
    padding: 1rem;
    resize: none;
    color: white;
    overflow: hidden;
  }

  .header {
    display: flex;
    align-items: center;
  }

  .header .speed {
    margin-left: auto;
    padding: 1rem;
  }

  .editor .buttons {
    box-sizing: border-box;
    border-bottom: 1px solid rgb(45, 55, 65);
    padding: 10px;
  }

  .editor .button {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    display: inline-block;
  }

  .editor .button:nth-child(1) {
    background: rgb(250, 50, 50);
  }

  .editor .button:nth-child(2) {
    background: rgb(250, 250, 50);
  }

  .editor .button:nth-child(3) {
    background: rgb(50, 250, 50);
  }

  .editor .editor-content {
    padding: 15px;
  }

  .editor-footer {
    padding: 15px;
    height: 55px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
</style>
