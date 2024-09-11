<script>
  import { fade, fly } from "svelte/transition";
  import Chat from "./Chat.svelte";

  import { training, answers } from "./store";

  export let answer = "";
  export let solution;

  let validator = true;
  let isCorrect = false;

  function submitAnswer(e) {
    e.preventDefault();
    if (answer.replace(/\s+/g, "") == solution) {
      inputVisible = false;
      isCorrect = true;
    } else {
      validator = false;
    }
  }

  let inputVisible = true;

  function claimAnswer() {
    training.set($training + 1);
    answers.set($answers + 1);
  }
  //   onMount(() => {
  //     // setTimeout(() => {
  //     //   inputVisible = true;
  //     // }, 1500);
  //   });
</script>

{#if inputVisible}
  <div in:fade={{ delay: 1500, duration: 500 }} class="answer">
    <form on:submit={(e) => submitAnswer(e)}>
      <input
        type="text"
        bind:value={answer}
        class={validator ? "" : "incorrect"}
      />
      <button type="submit" on:click={(e) => submitAnswer(e)}>Send</button>
    </form>
  </div>
{:else if isCorrect}
  <Chat who="you" text={answer} delay="0" />
  {#if $training !== 2}
    <p in:fade={{ delay: 250, duration: 500 }} style="text-align: center;">
      <button on:click={claimAnswer}>Claim answer</button>
    </p>
  {:else}
    <p in:fade={{ delay: 250, duration: 500 }} style="text-align: center;">
      <button on:click={claimAnswer}>What have I gotten myself into?</button>
    </p>
  {/if}
{/if}

<style>
  .incorrect {
    border-color: red;
  }
</style>
