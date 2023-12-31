<script>
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { spring } from "svelte/motion";
  import Dots from "./Dots.svelte";

  export let who = "you";
  export let text = "";
  export let ready = false;
  export let delay;

  $: _ready = who === "you" ? true : ready;

  let el;

  const height = spring(35);
  const width = spring(60);

  $: _ready && width.set(360) && height.set(el + 30);

  onMount(() => {
    setTimeout(() => {
      ready = true;
    }, delay);

    //     setTimeout(
    //     () => {
    //       window.scrollTo({
    //         top: document.documentElement.scrollHeight,
    //         behavior: "smooth",
    //       });
    //     },
    //     isolateDelay * 2 - 200
    //   );
  });
</script>

<div style="height: {el + 40 || 35}px">
  <div
    in:fly={{
      y: 50,
      opacity: 0,
      duration: 250,
      delay: who === "you" ? 100 : 200,
    }}
    class="box {who}"
    class:ready={_ready}
    style="width: {$width}px; height: {$height}px"
  >
    {#if !_ready && who !== "you"}
      <div transition:fade={{ duration: 100 }} class="bouncy-box">
        <Dots />
      </div>
    {/if}
    <div class="text-box" class:show={_ready} bind:clientHeight={el}>
      <p>
        {text}
      </p>
    </div>
  </div>
</div>

<style>
  .box {
    background-color: #eee;
    border-radius: 5px;
    background-color: #eee;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  .bouncy-box {
    width: 60px;
    height: 45px;
    padding-bottom: 15px;
  }

  .text-box {
    width: 360px;
    opacity: 0;
    transition: 0.2s;
    transition-delay: 0.2s;
  }
  .show {
    opacity: 1;
  }

  .ready {
    width: 360px;
  }

  p {
    padding: 5px 20px;
  }

  .you {
    border-bottom-right-radius: 0px;
    float: right;
    clear: both;
    background: #3865f4;
    color: #fff;
  }

  .them {
    border-top-left-radius: 0px;
    float: left;
    clear: both;
  }
</style>
