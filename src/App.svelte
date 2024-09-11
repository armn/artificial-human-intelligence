<script>
  import Browser from "./Browser.svelte";
  import Leaderboard from "./Leaderboard.svelte";
  import Editor from "./Editor.svelte";
  import InlineInput from "svelte-inline-input";
  import { onMount } from "svelte";
  import Scheduler from "./Scheduler.svelte";
  import Chat from "./Chat.svelte";
  import { fade, fly } from "svelte/transition";

  import {
    introDone,
    captchaTimer,
    captchaCompleted,
    gameTimer,
    gameStarted,
    training,
    codeTasks,
    answers,
    editorSpeed,
    clicks,
    maxClicks,
    economy,
    answersPerSecond,
    customers,
    money,
    answerPrice,
    gameCompleted,
  } from "./store";
  import ChatInput from "./ChatInput.svelte";
  import Game from "./Game.svelte";

  const worker = new Worker("./worker.js", {
    name: "ticker",
    type: "module",
  });

  let captcha = "";
  function onInputBlur(value, target) {
    value.detail ? target.set(value.detail) : target.set("Dashclicker");
  }

  function handleKey(e) {
    if (captcha === 12) {
      stopCaptchaTimer();
      console.log(`${end - start}`);
      introDone.set(true);
      captchaTimer.set(end - start);
    }
  }

  let start;
  let end;
  let timerStarted = false;

  function startCaptchaTimer() {
    if (!timerStarted) {
      start = performance.now();
    }
    timerStarted = true;
  }

  function stopCaptchaTimer() {
    end = performance.now();
  }

  function startGame() {
    if (!$gameStarted) {
      gameStarted.set(true);
    }
  }
  onMount(async () => {
    worker.onmessage = ({ data }) => {
      if (data.message === "tick") {
        if (!$gameCompleted) {
          $gameTimer = $gameTimer + 1;
          $answers = $answers + $answersPerSecond;
        }
        if ($gameCompleted) {
          worker.terminate();
        }
      }
    };
  });

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function convertSToTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
      seconds
    )}`;
  }

  function registerClick() {
    if (!$gameCompleted) {
      clicks.set($clicks + 1);
      maxClicks.set($maxClicks + 1);
    }
  }
</script>

<main on:click={registerClick} on:keypress>
  <div class="logo">
    <mark>Artificial Human Intelligence</mark> <small>v.1.3</small>
  </div>
  {#if $money > 0 && !$gameCompleted}
    <div class="economy">
      <small>MONEY</small><br />
      <strong
        >{Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          currencyDisplay: "narrowSymbol",
        }).format($money)}</strong
      >
    </div>
  {/if}
  {#if !$gameCompleted}
    <h1>
      {$gameStarted ? convertSToTime($gameTimer) : "Hi! 👋"}
    </h1>
  {/if}
  {#if $training && !$gameCompleted}
    <div class="wallet">
      <div
        class="wallet__item"
        title={Intl.NumberFormat("en-US").format($answers)}
      >
        <mark
          >{Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 2,
            roundingPriority: "lessPrecision",
          }).format($answers)}</mark
        >
        <strong>ANSWERS</strong>
        {#if $answersPerSecond}
          (+{Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 2,
            roundingPriority: "lessPrecision",
          }).format($answersPerSecond)}/s)
        {/if}
      </div>
      {#if $codeTasks >= 6}
        <div
          class="wallet__item"
          title={Intl.NumberFormat("en-US").format($clicks)}
        >
          <mark
            >{Intl.NumberFormat("en-US", {
              notation: "compact",
              maximumFractionDigits: 2,
              roundingPriority: "lessPrecision",
            }).format($clicks)}</mark
          >
          <strong>CLICKS</strong>
        </div>
      {/if}
      {#if $customers}
        <div
          class="wallet__item"
          title={Intl.NumberFormat("en-US").format($customers)}
        >
          <mark
            >{Intl.NumberFormat("en-US", {
              notation: "compact",
              maximumFractionDigits: 2,
              roundingPriority: "lessPrecision",
            }).format($customers)}</mark
          >
          <strong>CUSTOMERS</strong>
        </div>
      {/if}
      {#if $answerPrice}
        <div
          class="wallet__item"
          title={Intl.NumberFormat("en-US").format($customers)}
        >
          <mark
            >{Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              currencyDisplay: "narrowSymbol",
              notation: "compact",
              maximumFractionDigits: 2,
              roundingPriority: "lessPrecision",
            }).format($answerPrice / 100)}</mark
          >
          <strong>PRICE</strong>
        </div>
      {/if}
    </div>
  {/if}
  {#if !$introDone}
    <p class="intro">
      You will be <mark>pretending to be an AI chatbot</mark>. No pressure, it
      will be just fine!
    </p>
    <button type="button" on:click={() => introDone.set(true)}>Got it!</button>
  {:else if $captchaTimer === 0}
    <p>
      But first, please prove that you are human by completing this simple
      captcha.
    </p>
    <strong>5 + 7 = </strong>
    <input
      type="number"
      on:change={(e) => handleKey(e)}
      on:keyup={(e) => handleKey(e)}
      on:keydown={(e) => handleKey(e)}
      bind:value={captcha}
      class="captcha"
      on:focus={startCaptchaTimer}
    />
  {:else if $captchaCompleted === false}
    <p>
      Great job! It took you <mark
        >{($captchaTimer / 1000).toFixed(2)} seconds</mark
      >
      to complete the captcha.
    </p>

    <button type="button" on:click={() => captchaCompleted.set(true)}
      >I didn't know I was being timed</button
    >
  {:else if !$gameStarted}
    <p>Don't worry about it! Are you ready to begin your AI chatbot duties?</p>
    <button type="button" on:click={startGame}>Sure!</button>
  {:else if $training === 0}
    <Chat
      who="them"
      text="How many seconds are there in a minute?"
      delay="1500"
    />
    <ChatInput solution={60} />
  {:else if $training === 1}
    <Chat
      who="them"
      text="Send me three Christmas tree emojis! 🎄"
      delay="1500"
    />
    <ChatInput solution={"🎄🎄🎄"} />
  {:else if $training === 2}
    <Chat
      who="them"
      text="Can you build an AI chatbot for me? The only accepted answer is YES in all caps."
      delay="1500"
    />
    <ChatInput solution={"YES"} />
  {:else if $training === 3 && $codeTasks === 0}
    <p>Well, let's get to coding, I guess...</p>
    <div in:fade={{ delay: 500, duration: 1000 }}>
      <Editor template={0} />
    </div>
  {:else if $codeTasks === 1}
    <p>
      You just automated the job we wanted you to do. Let's see how you did!
    </p>
    <button
      type="button"
      on:click={() => {
        codeTasks.set(2);
      }}>Show me!</button
    >
  {:else if $codeTasks === 2}
    <div in:fade={{ delay: 500, duration: 1000 }}>
      <Browser />
    </div>
    <p in:fade={{ delay: 12000, duration: 2000 }}>
      <button
        on:click={() => {
          codeTasks.set(3);
        }}>Uh, oh!</button
      >
    </p>
  {:else if $codeTasks === 3}
    <p>
      Looks like you'll have to make changes to your code. May I suggest that
      you <mark>increase your coding speed</mark> by 3 characters per keypress in
      exchange for 3 answers?
    </p>
    <button
      on:click={() => {
        codeTasks.set(4);
        editorSpeed.set(4);
        answers.set(2);
      }}>Sure</button
    >
    <button
      on:click={() => {
        codeTasks.set(4);
      }}>No, I like to take my time</button
    >
  {:else if $codeTasks === 4}
    <div in:fade={{ delay: 500, duration: 1000 }}>
      <Editor template={1} />
    </div>
  {:else if $codeTasks === 5}
    <p>Great, let's see how you did!</p>
    <Scheduler request={1} />
    <div in:fade={{ delay: 5000, duration: 1000 }} style="text-align: center;">
      <button on:click={() => codeTasks.set(6)}>Superb, what's next?</button>
    </div>
  {:else if $codeTasks >= 6 && !$gameCompleted}
    <Game />
  {:else if $gameCompleted}
    <Leaderboard />
  {/if}
</main>

<style lang="scss">
  h1 {
    margin-top: 0.5rem;
    margin-bottom: 0;
  }
  main {
    padding: 1rem;
    min-height: 100vh;
  }

  .logo {
    font-size: 0.6rem;
    text-transform: uppercase;
    border: 1px solid black;
    display: inline-block;
    padding: 0.2rem;
    font-weight: bold;
  }

  .captcha {
    width: 50px;
  }

  .wallet {
    padding: 0.8rem;
    border: 1px solid black;
    font-size: 0.8rem;
    margin-bottom: 1rem;

    display: flex;
    gap: 1rem;

    div {
      border: 1px solid black;
      padding: 0.5rem;
      user-select: none;
    }
  }
  .economy {
    position: absolute;
    right: 0;
    top: 3.1rem;
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
    text-align: right;
  }
</style>
