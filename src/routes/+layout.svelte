<script>
import '../app.css';
</script>

<svelte:head>
  <title>Chipless Poker</title>
  <link rel="icon" href="https://fav.farm/🪙" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
    rel="stylesheet"
  />

  <script src="https://unpkg.com/feather-icons"></script>
  <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
</svelte:head>

<main class="flex h-full justify-center p-6">
  <div class="w-full max-w-md">
    <slot />
  </div>
</main>
