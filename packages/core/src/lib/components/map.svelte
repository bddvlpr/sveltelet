<script lang="ts">
  import type { Map, MapOptions } from 'leaflet';

  import { type ControlContext, ControlContextKey } from '$lib/context/control.js';
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { onMount, setContext, type Snippet } from 'svelte';

  const {
    children,
    ...options
  }: {
    children?: Snippet;
  } & MapOptions = $props();

  let mounted = $state(false);

  let element: HTMLDivElement;
  let map: Map;

  onMount(() => {
    map = L.map(element, options);
  });

  $effect(() => {
    mounted = true;

    return () => {
      mounted = false;
      map?.remove();
    };
  });

  setContext<MapContext>(MapContextKey, {
    getMap: () => map
  });
  setContext<LayerContext>(LayerContextKey, {
    getLayer: () => null,
    getLayerGroup: () => null
  });
  setContext<ControlContext>(ControlContextKey, {
    getLayerControl: () => null
  });

  $effect(() => {
    const { maxBounds, minZoom, maxZoom, zoom } = options;

    if (maxBounds) map.setMaxBounds(maxBounds);
    if (minZoom) map.setMinZoom(minZoom);
    if (maxZoom) map.setMaxZoom(maxZoom);
    if (zoom) map.setZoom(zoom);
  });

  export const getMap = () => map;
</script>

<div bind:this={element} style="width: 100%; height: 100%;">
  {#if mounted}
    {@render children?.()}
  {/if}
</div>
