<script lang="ts">
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { type LatLngExpression, Polygon, type PolylineOptions } from 'leaflet';
  import { getContext, onMount } from 'svelte';

  const {
    latLngs,
    ...options
  }: { latLngs: LatLngExpression[] | LatLngExpression[][] } & PolylineOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);

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

    return () => {
      polygon.remove();
    };
  });

  $effect(() => {
    polygon.setLatLngs(latLngs);
  });

  export const getPolygon = () => polygon;
</script>
