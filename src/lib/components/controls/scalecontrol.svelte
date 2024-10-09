<script lang="ts">
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { Control } from 'leaflet';
  import { getContext } from 'svelte';

  const { ...options }: Control.ScaleOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);

  let scaleControl: Control.Scale;

  let map = $derived(mapContext.getMap());

  $effect(() => {
    scaleControl = new Control.Scale(options);
    map.addControl(scaleControl);

    return () => {
      map.removeControl(scaleControl);
    };
  });
</script>
