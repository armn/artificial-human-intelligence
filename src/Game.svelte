<script>
  import Editor from "./Editor.svelte";
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
    name,
    maxClicks,
  } from "./store";
  import PocketBase from "pocketbase";

  const url = "https://ahi.pockethost.io/";
  const client = new PocketBase(url);

  let playerName = "";

  function buttonClick() {
    clicks.set(($clicks + 1) * $clickMultiplier);
  }

  function launchParty() {
    answersPerSecond.set($clicks / $gameTimer);
    const amount = $clicks - $clicks / 10;
    clicks.set(amount);
    gameStep.set(1);
  }

  function lookForCustomers(a, c) {
    const luck = Math.random() * 10;
    customers.set((((luck * a) / 5) * c) / 10);
    answers.set($answers - a);
    clicks.set($clicks - c);
    gameStep.set(2);
  }

  let costValue = 1;
  let costValid = true;
  function validateCost() {
    if (costValue < 1 || costValue > 100) {
      costValid = false;
    } else {
      costValid = true;
    }
  }

  function setPrice() {
    luckyPrice.set(Math.round(Math.random() * 100));
    answerPrice.set(costValue);
    guessedPrice.set(answerPrice);
    gameStep.set(3);

    const difference = $answerPrice - $luckyPrice;
    const modifier = Math.abs(difference / 100);
    if (difference > 0) {
      customerChange.set(Math.abs($customers * modifier));
      customers.set($customers - $customerChange);
    } else if (difference === 0) {
      customerChange.set(0);
    } else if (difference < 0) {
      customerChange.set($customers + $customers * modifier);
      customers.set($customers + $customerChange);
    }
  }

  function sellAnswers() {
    $money = $money + ($answers * $customers * $answerPrice) / 100;
    $answers = 0.0;
    if ($gameStep === 3) {
      $gameStep = 4;
    }
  }

  function increaseAnswerSpeed() {
    $money = $money - $answerGenerationPrice;
    $answerGenerationPrice = $answerGenerationPrice * 2;
    $answersPerSecond = $answersPerSecond * 2;
  }

  function increaseCustomers() {
    const luck = Math.random() * 10;
    $money = $money - $customerFindingPrice;
    $customersAdded = $customers * luck;
    $customers = $customers + $customersAdded;
    $customerFindingPrice = $customerFindingPrice + $customers * 2;
  }

  async function submitToLeaderboard() {
    $name = playerName;
    const data = {
      name: playerName,
      captchaTimer: $captchaTimer,
      gameTimer: $gameTimer,
      answers: $answers,
      answersPerSecond: $answersPerSecond,
      maxClicks: $maxClicks,
      customers: $customers,
      customersPerSecond: $customersPerSecond,
      answerPrice: $answerPrice,
      luckyPrice: $luckyPrice,
      money: $money,
      guessedPrice: $guessedPrice,
    };

    const record = await client.collection("scores").create(data);
    if (record) {
      $gameCompleted = true;
    }
  }
</script>

{#if !$gameStep}
  <p>
    You've successfully built a self-sufficient AI. Now you need to conquer the
    world with it. No pressure! Oh, and we've been counting your clicks. Keep
    them coming!
  </p>
{:else if $gameStep === 1}
  <p>
    🎉 The party was a great success! Your AI now generates answers
    automatically. Initial answer generation speed of <mark
      >{Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
        roundingPriority: "lessPrecision",
      }).format($answersPerSecond)}</mark
    > was awarded based on how quick you were to get here and clicks used for launch.
    Your next step is to find customers to sell the answers to.
  </p>
{:else if $gameStep === 2 && $codeTasks !== 7}
  <p>
    📈 You just got <mark
      >{Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
        roundingPriority: "lessPrecision",
      }).format($customers)}</mark
    > new customers! Time to monetize your AI. You know what to do!
  </p>
{:else if $gameStep === 2 && $codeTasks === 7}
  <p>
    Let's see if the code worked! Time to set the price you want to sell an
    answer to the customer for.
  </p>
{:else if $gameStep === 3}
  <p>
    The price your customers were looking for was <mark>{$luckyPrice}</mark>
    cents.
    {#if $luckyPrice < $answerPrice}
      <strong>You set the price too high!</strong> As a result, you lost
      <mark>{Math.round($customerChange)}</mark>
      customers. Nevertheless, you can start making money now!
    {:else if $luckyPrice === $answerPrice}
      <strong>You were spot on!</strong> Let's start making money right now.
    {:else if $luckyPrice > $answerPrice}
      <strong>You undercut yourself.</strong> However, you gained
      <mark>{Math.round($customerChange)}</mark>
      new customers! And you can start making money now!
    {/if}
  </p>
{/if}

<div class="card">
  {#if !$gameStep}
    <button on:click={launchParty}
      >AI launch party for {Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
        roundingPriority: "lessPrecision",
      }).format($clicks / 10)} clicks</button
    >
  {:else if $gameStep === 1}
    <p><strong>I want to look for</strong></p>
    <button on:click={lookForCustomers($answers / 10, $clicks / 10)}
      >A few customers</button
    >
    <small>
      for {Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
        roundingPriority: "lessPrecision",
      }).format($answers / 10)} answers and {Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
        roundingPriority: "lessPrecision",
      }).format($clicks / 10)} clicks
    </small>
    <br />
    <button on:click={lookForCustomers($answers / 2, $clicks / 2)}
      >Some customers</button
    >
    <small>
      for {Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
        roundingPriority: "lessPrecision",
      }).format($answers / 2)} answers and {Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
        roundingPriority: "lessPrecision",
      }).format($clicks / 2)} clicks
    </small>

    <br />
    <button on:click={lookForCustomers($answers, $clicks)}
      >All the customers</button
    >
    <small>
      for {Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
        roundingPriority: "lessPrecision",
      }).format($answers)} answers and {Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 2,
        roundingPriority: "lessPrecision",
      }).format($clicks)} clicks
    </small>
  {:else if $gameStep === 2 && $codeTasks !== 7}
    <Editor template={2} />
  {:else if $gameStep === 2 && $codeTasks === 7}
    <p><strong>I want to sell an answer for (in cents, 1-100)</strong></p>
    <input
      type="number"
      max="100"
      min="1"
      step="1"
      bind:value={costValue}
      on:change={validateCost}
      on:blur={validateCost}
      class={costValid ? "" : "invalid"}
    />
    <br />
    <button disabled={!costValid} on:click={setPrice}>Set price</button>
  {:else if $gameStep >= 3}
    <div class="buy">
      <p>
        You can sell <mark
          >{Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 2,
            roundingPriority: "lessPrecision",
          }).format($answers)}</mark
        >
        answers to
        <mark
          >{Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 2,
            roundingPriority: "lessPrecision",
          }).format($customers)}</mark
        >
        customers for
        <strong
          ><mark
            >{Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              currencyDisplay: "narrowSymbol",
              notation: "compact",
              maximumFractionDigits: 2,
              roundingPriority: "lessPrecision",
            }).format(($answers * $customers * $answerPrice) / 100)}</mark
          ></strong
        >
      </p>
      <button on:click={sellAnswers}>Sell</button>
    </div>
    {#if $money > 0}
      <div class="buy">
        <p>
          You can increase answer generation speed by <mark
            >{Intl.NumberFormat("en-US", {
              notation: "compact",
              maximumFractionDigits: 2,
              roundingPriority: "lessPrecision",
            }).format($answersPerSecond * 2)}</mark
          >
          for
          <strong
            ><mark
              >{Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                currencyDisplay: "narrowSymbol",
                notation: "compact",
                maximumFractionDigits: 2,
                roundingPriority: "lessPrecision",
              }).format($answerGenerationPrice)}</mark
            ></strong
          >
        </p>
        <button
          disabled={$money < $answerGenerationPrice}
          on:click={increaseAnswerSpeed}>Increase</button
        >
      </div>
    {/if}
    {#if $money > 0}
      <div class="buy">
        <p>
          You can look for new customers for
          <strong
            ><mark
              >{Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                currencyDisplay: "narrowSymbol",
                notation: "compact",
                maximumFractionDigits: 2,
                roundingPriority: "lessPrecision",
              }).format($customerFindingPrice)}</mark
            ></strong
          >{#if $customersAdded}
            <br /><small>
              <mark
                >{Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 2,
                  roundingPriority: "lessPrecision",
                }).format($customersAdded)}</mark
              > new customers found</small
            >
          {/if}
        </p>
        <button
          disabled={$money < $customerFindingPrice}
          on:click={increaseCustomers}>Find</button
        >
      </div>
    {/if}

    {#if $clicks > 100}
      <div class="buy">
        <p>
          You can end the game and submit your score
          <input type="text" placeholder="Your name" bind:value={playerName} />
        </p>
        <button disabled={!playerName} on:click={submitToLeaderboard}
          >End game</button
        >
      </div>
    {/if}
  {/if}
</div>

<style>
  .card {
    cursor: pointer;
  }

  .invalid {
    border-color: red;
  }
  .sell,
  .buy {
    display: flex;
    gap: 5px;
    flex-wrap: nowrap;
    border: 1px solid black;
    padding: 1rem;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
</style>
