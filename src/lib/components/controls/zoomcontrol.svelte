<script lang="ts">
  import { MapContextKey, type MapContext } from '$lib/context/map.js';
  import { Control } from 'leaflet';
  import { getContext } from 'svelte';

  const { ...options }: Control.ZoomOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);

  let zoomControl: Control.Zoom;

  let map = $derived(mapContext.getMap());

  $effect(() => {
    zoomControl = new Control.Zoom(options);

    map.addControl(zoomControl);

    return () => {
      map.removeControl(zoomControl);
    };
  });
</script>
