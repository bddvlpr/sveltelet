<script lang="ts">
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { Circle, type CircleOptions, type LatLngExpression } from 'leaflet';
  import { getContext, onMount, setContext, type Snippet } from 'svelte';

  const {
    latLng,
    radius,
    children,
    ...options
  }: {
    latLng: LatLngExpression;
    radius?: number;
    children?: Snippet;
  } & CircleOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);

  let mounted = $state(false);

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
    mounted = true;

    return () => {
      mounted = false;
      circle.remove();
    };
  });

  $effect(() => {
    circle.setLatLng(latLng);
    circle.setRadius(radius);
  });

  setContext<LayerContext>(LayerContextKey, {
    ...layerContext,
    getLayer: () => circle
  });

  export const getCircle = () => circle;
</script>

{#if mounted}
  {@render children?.()}
{/if}
