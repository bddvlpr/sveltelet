<script lang="ts">
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import {
    type LatLngBoundsExpression,
    type LatLngExpression,
    type PolylineOptions,
    Rectangle
  } from 'leaflet';
  import { getContext, onMount } from 'svelte';

  const {
    latLngs,
    ...options
  }: {
    latLngs: LatLngBoundsExpression;
  } & PolylineOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);

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

  export const getRectangle = () => rectangle;
</script>
