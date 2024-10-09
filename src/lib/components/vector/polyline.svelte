<script lang="ts">
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { Polyline, type LatLngExpression, type PolylineOptions } from 'leaflet';
  import { getContext, onMount } from 'svelte';

  const {
    latLngs,
    ...options
  }: {
    latLngs: LatLngExpression[] | LatLngExpression[][];
  } & PolylineOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);

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

    return () => {
      polyline.remove();
    };
  });

  $effect(() => {
    polyline.setLatLngs(latLngs);
  });
</script>
