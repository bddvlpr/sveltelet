<script lang="ts">
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { type LatLngExpression, Polyline, type PolylineOptions } from 'leaflet';
  import { getContext, onMount, setContext, type Snippet } from 'svelte';

  const {
    latLngs,
    children,
    ...options
  }: {
    latLngs: LatLngExpression[] | LatLngExpression[][];
    children?: Snippet;
  } & PolylineOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);

  let mounted = $state(false);

  let polyline: Polyline;

  let map = $derived(mapContext.getMap());
  let layerGroup = $derived(layerContext.getLayerGroup());

  onMount(() => {
    polyline = new Polyline(latLngs, options);
  });

  $effect(() => {
    if (layerGroup) {
      polyline.addTo(layerGroup);
    } else {
      polyline.addTo(map);
    }
    mounted = true;

    return () => {
      mounted = false;
      polyline.remove();
    };
  });

  $effect(() => {
    polyline.setLatLngs(latLngs);
  });

  setContext<LayerContext>(LayerContextKey, {
    ...layerContext,
    getLayer: () => polyline
  });

  export const getPolyline = () => polyline;
</script>

{#if mounted}
  {@render children?.()}
{/if}
