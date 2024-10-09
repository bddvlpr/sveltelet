<script lang="ts">
  import { type ControlContext, ControlContextKey } from '$lib/context/control.js';
  import { MapContextKey, type MapContext } from '$lib/context/map.js';
  import { Control } from 'leaflet';
  import { getContext, onMount, setContext, type Snippet } from 'svelte';

  const {
    children,
    ...options
  }: {
    children?: Snippet;
  } & Control.LayersOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const controlContext = getContext<ControlContext>(ControlContextKey);

  let mounted = $state(false);

  let layersControl: Control.Layers;

  let map = $derived(mapContext.getMap());

  onMount(() => {
    layersControl = new Control.Layers(undefined, undefined, options);
  });

  $effect(() => {
    map.addControl(layersControl);
    mounted = true;

    return () => {
      mounted = false;
      map.removeControl(layersControl);
    };
  });

  setContext(ControlContextKey, {
    ...controlContext,
    getLayerControl: () => layersControl
  });
</script>

{#if mounted}
  {@render children?.()}
{/if}
