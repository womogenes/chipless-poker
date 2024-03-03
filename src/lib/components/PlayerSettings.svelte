<script>
import * as Drawer from '$lib/components/ui/drawer';
import { Input } from '$lib/components/ui/input';
import { Button } from '$lib/components/ui/button';
import { PlusIcon, MinusIcon } from 'svelte-feather-icons';

export let playerIdx, handleBalanceIncrease, handleBalanceDecrease;
import { players } from '$lib/stores';
</script>

<Drawer.Content class="flex flex-col items-center">
  <div class="flex w-full max-w-sm flex-col gap-4 p-6">
    <div class="relative flex items-center">
      <Input placeholder="Enter Player Name" bind:value={$players[playerIdx].name} />
      <button
        class="absolute right-2 h-6 w-6 rounded"
        style="background-color: {$players[playerIdx].color};"
        onClick="this.firstChild.click();"
      >
        <input
          class="absolute left-0 right-2 top-0 h-6 w-6 cursor-pointer rounded opacity-0"
          type="color"
          onChange="this.parentElement.style.backgroundColor = this.value;"
        />
      </button>
    </div>

    <div class="flex w-full flex-col items-center gap-2">
      <!-- Column for label / button -->
      <p class="font-bold">Balance</p>
      <div class="flex w-3/4 flex-row items-center gap-4">
        <!-- Row for Buttons and text -->
        <Button
          variant="outline"
          size="icon"
          class="justify-left h-8 w-8 shrink-0 rounded-full"
          on:click={() => {
              handleBalanceDecrease();
              let elem = document.getElementById("unreactiveDivToChange-" + $players[playerIdx].id);
              elem.innerHTML = $players[playerIdx].balance;
            }}
          disabled={$players[playerIdx].balance <= 0}
        >
          <MinusIcon size="24" />
        </Button>
        <div
          class="w-3/4 justify-center text-center text-xl font-bold"
          id="unreactiveDivToChange-{$players[playerIdx].id}"
        >
          {$players[playerIdx].balance}
        </div>
        <Button
          variant="outline"
          size="icon"
          class="justify-right h-8 w-8 shrink-0 rounded-full"
          on:click={() => {
            handleBalanceIncrease();          
            let elem = document.getElementById("unreactiveDivToChange-" + $players[playerIdx].id);
            elem.innerHTML = $players[playerIdx].balance;
          }}
        >
          <PlusIcon size="24" />
        </Button>
      </div>
    </div>
  </div>
  <Drawer.Footer>
    <Drawer.Close class="flex gap-2">
      <Button>Delete player</Button>
      <Button variant="outline">Close</Button>
    </Drawer.Close>
  </Drawer.Footer>
</Drawer.Content>
