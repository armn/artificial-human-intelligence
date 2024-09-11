<script>
  import {
    clicks,
    clickMultiplier,
    answers,
    gameTimer,
    answersPerSecond,
    gameStep,
    customers,
    codeTasks,
    answerPrice,
    luckyPrice,
    customerChange,
    money,
    guessedPrice,
    answerGenerationPrice,
    customerFindingPrice,
    customersAdded,
    captchaTimer,
    gameCompleted,
    customersPerSecond,
    maxClicks,
    name,
  } from "./store";
  import PocketBase from "pocketbase";
  import { onMount } from "svelte";
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
  const url = "https://ahi.pockethost.io/";
  const client = new PocketBase(url);
  let records;
  onMount(async () => {
    records = await client.collection("scores").getFullList({
      sort: "-gameTimer",
    });
  });
  function newGame() {
    localStorage.clear();
    window.location.reload();
  }

  // Holds table sort state.  Initialized to reflect table sorted by id column ascending.
  let sortBy = { col: "gameTimer", ascending: true };

  $: sort = (column) => {
    if (sortBy.col == column) {
      sortBy.ascending = !sortBy.ascending;
    } else {
      sortBy.col = column;
      sortBy.ascending = true;
    }

    // Modifier to sorting function for ascending or descending
    let sortModifier = sortBy.ascending ? 1 : -1;

    let sort = (a, b) =>
      a[column] < b[column]
        ? -1 * sortModifier
        : a[column] > b[column]
          ? 1 * sortModifier
          : 0;

    records = records.sort(sort);
  };
</script>

<div class="result">
  <h1>Thank you for playing, <mark>{$name}</mark>!</h1>
  <p>
    In total you played the game for <mark>{$gameTimer}</mark> seconds (that is
    <mark>{convertSToTime($gameTimer)}</mark>) and you managed to complete the
    initial captcha in <mark>{($captchaTimer / 1000).toFixed(2)}</mark>
    seconds. You clicked <mark>{$maxClicks - 1}</mark> times.
  </p>
  <p>
    You ended with the game with <mark
      >{Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
        roundingPriority: "lessPrecision",
      }).format($answers)}</mark
    >
    answers and you were generating
    <mark
      >{Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
        roundingPriority: "lessPrecision",
      }).format($answersPerSecond)}</mark
    >
    answers per second. You had
    <mark
      >{Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
        roundingPriority: "lessPrecision",
      }).format($customers)}</mark
    >
    customers and made
    <strong
      ><mark
        >{Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          currencyDisplay: "narrowSymbol",
          notation: "compact",
          maximumFractionDigits: 2,
          roundingPriority: "lessPrecision",
        }).format($money)}</mark
      >
    </strong> money.
  </p>

  <h2>Thank you for playing!</h2>
</div>
<div class="browser-window">
  <div class="top-bar">
    <div class="circles">
      <div class="circle circle-red" />
      <div class="circle circle-yellow" />
      <div class="circle circle-green" />
    </div>
    <div class="title"><small>Leaderboard</small></div>
  </div>

  <div class="content">
    {#if records}
      <table>
        <thead>
          <tr>
            <th on:click={sort("name")}>Name</th>
            <th on:click={sort("gameTimer")}>Time</th>
            <th on:click={sort("captchaTimer")}>Captcha</th>
            <th on:click={sort("maxClicks")}>Clicks</th>
            <th on:click={sort("money")}>Money</th>
          </tr>
        </thead>
        <tbody> </tbody><tbody>
          {#each records as row}
            <tr>
              <td><span>{row.name}</span></td>
              <td><span>{convertSToTime(row.gameTimer)}</span></td>
              <td><span>{(row.captchaTimer / 1000).toFixed(2)}</span></td>
              <td><span>{row.maxClicks}</span></td>
              <td
                ><span
                  >{Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    currencyDisplay: "narrowSymbol",
                    notation: "compact",
                    maximumFractionDigits: 2,
                    roundingPriority: "lessPrecision",
                  }).format(row.money)}</span
                ></td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>
<button on:click={newGame}>Play again</button>

<style lang="scss">
  $bottomColor: #e2e2e1;
  $topColor: #e2e2e1ce;
  $border: $bottomColor;

  $width: 100%;

  .browser-window {
    text-align: left;
    width: $width;
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
    //height: calc(100% - 30px);
    display: block;
    border-radius: 0 0 5px 5px;
    background-color: #fafafa;
  }

  .content {
    padding: 1rem;
  }
  h1 {
    margin-top: 0.5rem;
    margin-bottom: 0;
  }
  button {
    margin-top: 1rem;
  }
  table td {
    border: 1px solid black;
    padding: 0.5rem;
  }
  table td span {
    display: block;
    max-width: 100%;
    overflow-wrap: break-word;
  }

  table th {
    cursor: pointer;
    padding-right: 0.25rem;
  }
</style>
