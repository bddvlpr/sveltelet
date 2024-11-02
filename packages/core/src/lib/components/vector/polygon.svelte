<script lang="ts">
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { type LatLngExpression, Polygon, type PolylineOptions } from 'leaflet';
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

  let polygon: Polygon;

  let map = $derived(mapContext.getMap());
  let layerGroup = $derived(layerContext.getLayerGroup());

  onMount(() => {
    polygon = new Polygon(latLngs, options);
  });

  $effect(() => {
    if (layerGroup) {
      polygon.addTo(layerGroup);
    } else {
      polygon.addTo(map);
    }
    mounted = true;

    return () => {
      mounted = false;
      polygon.remove();
    };
  });

  $effect(() => {
    polygon.setLatLngs(latLngs);
  });

  setContext<LayerContext>(LayerContextKey, {
    ...layerContext,
    getLayer: () => polygon
  });

  export const getPolygon = () => polygon;
</script>

{#if mounted}
  {@render children?.()}
{/if}
