<script lang="ts">
  import { type LayerContext, LayerContextKey } from '$lib/index.js';
  import { Popup, type PopupOptions } from 'leaflet';
  import { getContext, type Snippet } from 'svelte';

  const layerContext = getContext<LayerContext>(LayerContextKey);

  const {
    children,
    ...options
  }: {
    children: Snippet;
  } & PopupOptions = $props();

  let mounted = $state(false);

  let popup: Popup;
  let element: HTMLDivElement;

  let layer = $derived(layerContext.getLayer());

  $effect(() => {
    if (layer) {
      popup = new Popup({
        ...options,
        content: element
      });
      layer.bindPopup(popup);
      mounted = true;
    }

    return () => {
      mounted = false;
      popup.remove();
    };
  });

  export const getPopup = () => popup;
</script>

<div style="display: none">
  <div bind:this={element}>
    {#if mounted}
      {@render children()}
    {/if}
  </div>
</div>
