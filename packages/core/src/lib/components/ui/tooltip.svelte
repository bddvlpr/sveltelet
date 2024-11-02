<script lang="ts">
  import { type LayerContext, LayerContextKey } from '$lib/index.js';
  import { Tooltip, type TooltipOptions } from 'leaflet';
  import { getContext, type Snippet } from 'svelte';

  const layerContext = getContext<LayerContext>(LayerContextKey);

  const {
    children,
    ...options
  }: {
    children: Snippet;
  } & TooltipOptions = $props();

  let mounted = $state(false);

  let tooltip: Tooltip;
  let element: HTMLDivElement;

  let layer = $derived(layerContext.getLayer());

  $effect(() => {
    if (layer) {
      tooltip = new Tooltip({
        ...options,
        content: element
      });
      layer.bindTooltip(tooltip);
      mounted = true;
    }

    return () => {
      mounted = false;
      tooltip.remove();
    };
  });

  export const getTooltip = () => tooltip;
</script>

<div style="display: none">
  <div bind:this={element}>
    {#if mounted}
      {@render children()}
    {/if}
  </div>
</div>
