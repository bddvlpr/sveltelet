<script lang="ts">
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { CircleMarker, type CircleMarkerOptions, type LatLngExpression } from 'leaflet';
  import { getContext, onMount, setContext, type Snippet } from 'svelte';

  const {
    latLng,
    radius,
    children,
    ...options
  }: {
    latLng: LatLngExpression;
    radius: number;
    children?: Snippet;
  } & CircleMarkerOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);

  let mounted = $state(false);

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
    mounted = true;

    return () => {
      mounted = false;
      circleMarker.remove();
    };
  });

  $effect(() => {
    circleMarker.setLatLng(latLng);
    circleMarker.setRadius(radius);
  });

  setContext<LayerContext>(LayerContextKey, {
    ...layerContext,
    getLayer: () => circleMarker
  });

  export const getCircleMarker = () => circleMarker;
</script>

{#if mounted}
  {@render children?.()}
{/if}
