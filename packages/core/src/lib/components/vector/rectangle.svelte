<script lang="ts">
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import {
    type LatLngBoundsExpression,
    type LatLngExpression,
    type PolylineOptions,
    Rectangle
  } from 'leaflet';
  import { getContext, onMount, setContext, type Snippet } from 'svelte';

  const {
    latLngs,
    children,
    ...options
  }: {
    latLngs: LatLngBoundsExpression;
    children?: Snippet;
  } & PolylineOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);

  let mounted = $state(false);

  let rectangle: Rectangle;

  let map = $derived(mapContext.getMap());
  let layerGroup = $derived(layerContext.getLayerGroup());

  onMount(() => {
    rectangle = new Rectangle(latLngs, options);
  });

  $effect(() => {
    if (layerGroup) {
      rectangle.addTo(layerGroup);
    } else {
      rectangle.addTo(map);
    }

    return () => {
      rectangle.remove();
    };
  });

  $effect(() => {
    rectangle.setLatLngs(latLngs as LatLngExpression[]);
  });

  setContext<LayerContext>(LayerContextKey, {
    ...layerContext,
    getLayer: () => rectangle
  });

  export const getRectangle = () => rectangle;
</script>

{#if mounted}
  {@render children?.()}
{/if}
