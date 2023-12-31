<script>
  import Scheduler from "./Scheduler.svelte";
</script>

<div class="browser-window">
  <div class="top-bar">
    <div class="circles">
      <div class="circle circle-red" />
      <div class="circle circle-yellow" />
      <div class="circle circle-green" />
    </div>
    <div class="title"><small>AI Chatbot</small></div>
  </div>
  <div class="content">
    <Scheduler />
  </div>
</div>

<style lang="scss">
  $bottomColor: #e2e2e1;
  $topColor: #e2e2e1ce;
  $border: $bottomColor;

  $width: calc(100vw - 2rem);
  $height: 470px;

  .browser-window {
    text-align: left;
    width: $width;
    height: $height;
    max-width: 500px;
    display: block;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: var(--box-shadow);
  }
  .browser-window .top-bar {
    height: 30px;
    border-radius: 5px 5px 0 0;
    border-top: thin solid lighten($topColor, 1%);
    border-bottom: thin solid darken($bottomColor, 1%);
    background: linear-gradient($topColor, $bottomColor);
    display: flex;
    align-items: center;
  }
  .browser-window .circle {
    height: 10px;
    width: 10px;
    display: inline-block;
    border-radius: 50%;
    margin: 0 3px;
  }

  .circle-red {
    background: var(--red);
  }

  .circle-yellow {
    background: var(--yellow);
  }

  .circle-green {
    background: var(--green);
  }
  .browser-window .circles {
    margin: 0 0.5rem;
  }
  .browser-window .content {
    margin: 0;
    width: 100%;
    height: calc(100% - 30px);
    display: block;
    border-radius: 0 0 5px 5px;
    background-color: #fafafa;
  }

  .content {
    padding: 1rem;
  }
</style>
