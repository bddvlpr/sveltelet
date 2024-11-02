<script lang="ts">
  import { type MapContext, MapContextKey } from '@sveltelet/core';
  import { Control } from 'leaflet';
  import * as L from 'leaflet.locatecontrol';
  import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
  import { getContext, onMount } from 'svelte';

  const { ...options }: Control.LocateOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);

  let locateControl: Control.Locate;

  let map = $derived(mapContext.getMap());

  onMount(() => {
    // @ts-ignore This scuffed package...
    locateControl = new L.LocateControl(options);
  });

  $effect(() => {
    map.addControl(locateControl);

    return () => {
      map.removeControl(locateControl);
    };
  });
</script>
