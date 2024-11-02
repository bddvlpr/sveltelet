<script lang="ts">
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { CircleMarker, type CircleMarkerOptions, type LatLngExpression } from 'leaflet';
  import { getContext, onMount } from 'svelte';

  const {
    latLng,
    radius,
    ...options
  }: {
    latLng: LatLngExpression;
    radius: number;
  } & CircleMarkerOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);

  let circleMarker: CircleMarker;

  let map = $derived(mapContext.getMap());
  let layerGroup = $derived(layerContext.getLayerGroup());

  onMount(() => {
    circleMarker = new CircleMarker(latLng, { ...options, radius });
  });

  $effect(() => {
    if (layerGroup) {
      layerGroup.addLayer(circleMarker);
    } else {
      map.addLayer(circleMarker);
    }

    return () => {
      circleMarker.remove();
    };
  });

  $effect(() => {
    circleMarker.setLatLng(latLng);
    circleMarker.setRadius(radius);
  });

  export const getCircleMarker = () => circleMarker;
</script>
