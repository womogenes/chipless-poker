<script>
import * as Drawer from '$lib/components/ui/drawer';
import * as Card from '$lib/components/ui/card';
import { Button } from '$lib/components/ui/button';
import { Input } from '$lib/components/ui/input';
import { Slider } from '$lib/components/ui/slider';
import * as Accordion from '$lib/components/ui/accordion';
import { Separator } from '$lib/components/ui/separator';
import { Checkbox } from '$lib/components/ui/checkbox';
import * as RadioGroup from '$lib/components/ui/radio-group';

import PlayerSettings from '$lib/components/PlayerSettings.svelte';
import LoadingIcon from '$lib/components/LoadingIcon.svelte';

import {
  UserPlusIcon,
  SettingsIcon,
  PlusCircleIcon,
  PlusIcon,
  MinusIcon,
  MoreHorizontalIcon,
  CheckCircleIcon,
  XCircleIcon,
  DollarSignIcon,
  ChevronsRightIcon,
} from 'svelte-feather-icons';

import { players, blinds, initBalance, raiseValue, gameState, getUID } from '$lib/stores.js';
import ChipIcon from '$lib/components/ChipIcon.svelte';

function handleBlindsClick(adjustment) {
  $blinds += adjustment;
}

function handleRaiseClick(adjustment) {
  $raiseValue += adjustment;
}

function handleInitBalanceClick(adjustment) {
  $initBalance += adjustment;
}
function adjustPlayerBalance(playerIdx, adjustment) {
  $players[playerIdx].balance += adjustment;
}

const stepGame = () => {
  if ($gameState.atRoundEnd) {
    $gameState.atRoundEnd = false;
    $gameState.didRoundEnd = true;
    $gameState.roundWinner = -1;
    return;
  }
  let foldCount = 0;
  while ($players[$gameState.currentPlayerIdx].hasFolded) {
    $gameState.currentPlayerIdx++;
    foldCount++;
    if ($gameState.currentPlayerIdx >= $players.length) {
      if (foldCount == $players.length - 1) break;
      $gameState.currentPlayerIdx = 0;
      foldCount = 0;
    }
  }
  if (foldCount == $players.length - 1) {
    for (let i = 0; i < $players.length; i++) {
      if (!$players[i].hasFolded) $gameState.roundWinner = i;
    }
    console.log($gameState.roundWinner, $players);
    $gameState.atRoundEnd = true;
    return;
  }
  if ($gameState.currentPlayerIdx >= $players.length) {
    $gameState.currentPlayerIdx = 0;
    $gameState.currentHand++;

    if ($gameState.currentHand >= 3) {
      if ($gameState.didRoundEnd) {
        $gameState.currentHand = 0;
        $gameState.round++;
        // Reset all bets:
        for (let i = 0; i < $players.length; i++) {
          $players[i].currentBet = 0;
          $players[i].hasFolded = false;
        }
      } else {
        $gameState.atRoundEnd = true;
      }
    }
  }
};

const raiseBet = (playerIdx, raiseVal) => {
  $players[playerIdx].currentBet = raiseVal;
  $players[playerIdx].balance -= raiseVal;
  $gameState.minimumBet = raiseVal;
  $gameState.pot += raiseVal;
  $raiseValue = 0;
  stepGame();
};

const finishRound = () => {
  stepGame();
  // $players[$gameState.roundWinner].balance += $gameState.pot;
  // $gameState.currentHand = 0;
  // $gameState.currentPlayerIdx = 0;
  // $gameState.didRoundEnd = false;
  // $gameState.atRoundEnd = false;
  // $gameState.round = 0;
  // $gameState.minimumBet = 0;
};

const getCurrentHandName = () => {
  return ['Pre-Flop', 'Flop', 'Turn', 'River'][$gameState.currentHand];
};
</script>

<div class="max-w-screen relative flex h-full flex-col justify-between">
  <!-- Top bar -->
  <div class="mb-4 flex items-center justify-between gap-4">
    <Drawer.Root>
      <Drawer.Trigger>
        <Button
          variant="ghost"
          on:click={() => {
                console.log('hello world');
                $players = [...$players, {
                  id: getUID(8),
                  name: getUID(8),
                  color: '#ff0000',
                  balance: $initBalance,
                  currentBet: 0,
                  hasFolded: false
                }];
              }}
        >
          <UserPlusIcon size="24" />
        </Button>
      </Drawer.Trigger>
      <Drawer.Content class="flex flex-col items-center">
        <div class="flex w-full max-w-sm flex-col gap-4 p-6">
          <p class="font-bold">New Player</p>
          <div class="relative flex items-center">
            <Input
              placeholder="Enter Player Name"
              bind:value={$players[$players.length - 1].name}
            />
            <button
              class="absolute right-2 h-6 w-6 rounded"
              style="background-color: purple;"
              onClick="this.firstChild.click();"
            >
              <input
                class="absolute left-0 right-2 top-0 h-6 w-6 cursor-pointer rounded opacity-0"
                type="color"
                onChange="this.parentElement.style.backgroundColor = this.value;"
              />
            </button>
          </div>
          <Drawer.Close>
            <Button>Add Player</Button>
            <Button
              variant="outline"
              on:click={() => {
                  $players = $players.slice(0, $players.length - 1)
                }}
              >Cancel</Button
            >
          </Drawer.Close>
        </div>
      </Drawer.Content>
    </Drawer.Root>

    <h1 class="flex text-center text-xl font-black uppercase tracking-widest">Chipless Poker</h1>

    <Drawer.Root>
      <Drawer.Trigger>
        <Button variant="ghost">
          <SettingsIcon size="24" />
        </Button>
      </Drawer.Trigger>
      <Drawer.Content class="flex flex-col items-center">
        <div class="flex w-full max-w-sm flex-col gap-4 p-6">
          <div class="flex w-full flex-col items-center gap-4">
            <!-- Column for each of blinds/init Balance -->
            <div class="flex w-full flex-col items-center gap-2">
              <!-- Column for label / button -->
              <p class="font-bold">Blinds</p>
              <div class="flex w-3/4 flex-row items-center gap-4">
                <!-- Row for Buttons and text -->
                <Button
                  variant="outline"
                  size="icon"
                  class="justify-left h-8 w-8 shrink-0 rounded-full"
                  on:click={() => handleBlindsClick(-10)}
                  disabled={$blinds <= 0}
                >
                  <MinusIcon size="24" />
                </Button>
                <div class="w-3/4 justify-center text-center text-xl font-bold">
                  {$blinds}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  class="justify-right h-8 w-8 shrink-0 rounded-full"
                  on:click={() => handleBlindsClick(10)}
                >
                  <PlusIcon size="24" />
                </Button>
              </div>
            </div>

            <div class="flex w-full flex-col items-center gap-2">
              <!-- Column for label / button -->
              <p class="font-bold">Initial Balance</p>
              <div class="flex w-3/4 flex-row items-center gap-4">
                <!-- Row for Buttons and text -->
                <Button
                  variant="outline"
                  size="icon"
                  class="h-8 w-8 shrink-0 rounded-full"
                  on:click={() => handleInitBalanceClick(-10)}
                  disabled={$initBalance <= 0}
                >
                  <MinusIcon size="24" />
                </Button>
                <div class="w-3/4 text-center text-xl font-bold">
                  {$initBalance}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  class="h-8 w-8 shrink-0 rounded-full"
                  on:click={() => handleInitBalanceClick(10)}
                >
                  <PlusIcon size="24" />
                </Button>
              </div>
            </div>
          </div>
          <Drawer.Close>
            <Button class="w-3/4">Close</Button>
          </Drawer.Close>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  </div>

  <div class="flex w-full items-center justify-center divide-x text-sm">
    <span class="px-4 pl-0">{getCurrentHandName()}</span>
    <span class="px-4">Minimum Bet: {$gameState.minimumBet}</span>
    <span class="px-4 pr-0">Pot: ${$gameState.pot}</span>
  </div>

  <!-- List of players -->
  <div class="mb-32 flex w-full flex-grow flex-col gap-2 pt-5">
    <p class="font-bold">Active Players</p>
    <div class="overflow-y-auto border-t">
      <RadioGroup.Root bind:value={$gameState.roundWinner}>
        {#each $players as player, playerIdx (player.id)}
          <div class="player flex items-center gap-2 border-b py-3">
            <div class="h-4 w-4 rounded-full" style={`background-color: ${player.color}`}></div>
            <p class="mr-auto flex items-center gap-2">
              <span>{player.name}</span>
              {#if $gameState.atRoundEnd}
                <RadioGroup.Item id={playerIdx} value={playerIdx} />
                {#if playerIdx === parseInt($gameState.roundWinner)}
                  <div class="rounded-md bg-neutral-100 px-2 py-1 text-sm">winner</div>{/if}
              {:else if $gameState.currentPlayerIdx == playerIdx}
                <LoadingIcon />
              {/if}
            </p>

            <p class="mr-4 flex items-center gap-2">
              <span>{$players[playerIdx].currentBet}</span>
            </p>
            <p class="mr-4 flex items-center gap-2">
              <span>{$players[playerIdx].balance}</span><ChipIcon class="h-4 w-4" />
            </p>
            <Drawer.Root>
              <Drawer.Trigger><MoreHorizontalIcon /></Drawer.Trigger>
              <PlayerSettings
                playerIdx={playerIdx}
                handleBalanceIncrease={() => adjustPlayerBalance(playerIdx, 10)}
                handleBalanceDecrease={() => adjustPlayerBalance(playerIdx, -10)}
              />
            </Drawer.Root>
          </div>
        {/each}
      </RadioGroup.Root>
    </div>
  </div>

  <!-- Text if at round end -->
  {#if $gameState.atRoundEnd}
    <p class="py-4 text-center font-bold">Click on winner!</p>
  {/if}

  <!-- Actions -->
  <div class="background-blur-sm sticky bottom-0 flex w-full flex-col gap-4 bg-white pb-5 pt-4">
    <!-- division for -->
    <div class="flex items-center justify-between gap-4">
      <!-- <Input placeholder="Raise value" value="5" type="number" min="5" max="200" step="5" /> -->
      <Button
        variant="outline"
        size="icon"
        class="justify-left h-10 w-10 shrink-0 rounded-full"
        on:click={() => handleRaiseClick(-5)}
        disabled={$gameState.atRoundEnd || $raiseValue <= 0}
      >
        <MinusIcon size="24" />
      </Button>

      <Input
        placeholder="Raise value"
        value={$raiseValue}
        type="number"
        min="5"
        class="w-20 py-5 text-xl"
      />
      <Button
        variant="outline"
        size="icon"
        class="justify-right h-10 w-10 shrink-0 rounded-full"
        on:click={() => handleRaiseClick(5)}
        disabled={$gameState.atRoundEnd || $raiseValue >= $players[$gameState.currentPlayerIdx].balance - $players[$gameState.currentPlayerIdx].currentBet}
      >
        <PlusIcon size="24" />
      </Button>
    </div>

    <div class="flex w-full flex-col gap-4">
      {#if $gameState.atRoundEnd}
        <Button
          class="flex flex-col items-center gap-4 py-12"
          disabled={$gameState.roundWinner == -1}
          on:click={finishRound}
        >
          <div><ChevronsRightIcon /></div>
          <p class="font-semibold uppercase tracking-wider">Finish round</p>
        </Button>
      {:else}
        <div class=" grid w-full grid-cols-3 gap-3">
          <Button
            class="flex flex-col items-center gap-4 py-12"
            on:click={() => {
              raiseBet(
                $gameState.currentPlayerIdx, Math.max(0, $gameState.minimumBet - $players[$gameState.currentPlayerIdx].currentBet)
              );
              $raiseValue = 0;
              stepGame();
            }}
          >
            <div>
              {#if $players[$gameState.currentPlayerIdx].currentBet >= $gameState.minimumBet}
                <CheckCircleIcon />
              {:else}
                <DollarSignIcon />
              {/if}
            </div>
            <p class="font-semibold uppercase tracking-wider">
              {#if $players[$gameState.currentPlayerIdx].currentBet >= $gameState.minimumBet}
                Check
              {:else}
                Call
              {/if}
            </p>
          </Button>
          <Button
            class="flex flex-col items-center gap-4 py-12"
            disabled={$raiseValue <= 0}
            on:click={() => raiseBet($gameState.currentPlayerIdx, $raiseValue)}
          >
            <div><PlusCircleIcon /></div>
            <p class="font-semibold uppercase tracking-wider">Raise</p>
          </Button>
          <Button
            class="flex flex-col items-center gap-4 py-12"
            on:click={()=>{
            $players[$gameState.currentPlayerIdx].hasFolded = true;
            stepGame();
          }}
          >
            <div><XCircleIcon /></div>
            <p class="font-semibold uppercase tracking-wider">Fold</p>
          </Button>
        </div>
      {/if}
    </div>
  </div>
</div>
