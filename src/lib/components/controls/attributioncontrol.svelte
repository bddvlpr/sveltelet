<script lang="ts">
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { Control } from 'leaflet';
  import { getContext, onMount } from 'svelte';

  const {
    text,
    ...options
  }: {
    text: string;
  } & Control.AttributionOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);

  let attributionControl: Control.Attribution;

  let map = $derived(mapContext.getMap());

  $effect(() => {
    attributionControl = new Control.Attribution(options);
    attributionControl.addAttribution(text);

    map.addControl(attributionControl);

    return () => {
      map.removeControl(attributionControl);
    };
  });
</script>
