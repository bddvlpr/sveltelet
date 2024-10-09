<script lang="ts">
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { Circle, type CircleOptions, type LatLngExpression } from 'leaflet';
  import { getContext, onMount } from 'svelte';

  const {
    latLng,
    radius,
    ...options
  }: {
    latLng: LatLngExpression;
    radius?: number;
  } & CircleOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);

  let circle: Circle;

  let map = $derived(mapContext.getMap());
  let layerGroup = $derived(layerContext.getLayerGroup());

  onMount(() => {
    circle = new Circle(latLng, radius, { ...options, radius });
  });

  $effect(() => {
    if (layerGroup) {
      layerGroup.addLayer(circle);
    } else {
      map.addLayer(circle);
    }

    return () => {
      circle.remove();
    };
  });

  $effect(() => {
    circle.setLatLng(latLng);
    circle.setRadius(radius);
  });
</script>
