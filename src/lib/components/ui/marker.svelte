<script lang="ts">
  import { LayerContextKey, type LayerContext } from '$lib/context/layer.js';
  import { MapContextKey, type MapContext } from '$lib/context/map.js';
  import { Marker, type LatLngExpression, type MarkerOptions } from 'leaflet';
  import { getContext, onMount, setContext, type Snippet } from 'svelte';

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);

  const {
    latLng,
    children,
    ...options
  }: {
    latLng: LatLngExpression;
    children?: Snippet;
  } & MarkerOptions = $props();

  let mounted = $state(false);

  let marker: Marker;

  let map = $derived(mapContext.getMap());
  let layerGroup = $derived(layerContext.getLayerGroup());

  onMount(() => {
    marker = new Marker(latLng, options);
  });

  $effect(() => {
    if (layerGroup) {
      layerGroup.addLayer(marker);
    } else {
      map.addLayer(marker);
    }
    mounted = true;

    return () => {
      mounted = false;
      marker.remove();
    };
  });

  $effect(() => {
    marker.setLatLng(latLng);
  });

  setContext(LayerContextKey, {
    ...layerContext,
    getLayer: () => marker
  });
</script>

{#if mounted}
  {@render children?.()}
{/if}
