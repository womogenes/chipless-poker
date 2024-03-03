<script>
import { Drawer as DrawerPrimitive } from 'vaul-svelte';
export let shouldScaleBackground = true;
export let open = false;
export let activeSnapPoint = undefined;
</script>

<DrawerPrimitive.Root
  shouldScaleBackground={shouldScaleBackground}
  bind:open={open}
  bind:activeSnapPoint={activeSnapPoint}
  {...$$restProps}
>
  <slot />
</DrawerPrimitive.Root>
