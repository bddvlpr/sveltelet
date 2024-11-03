<script lang="ts">
  import { type MapContext, MapContextKey } from '@sveltelet/core';
  import { Control } from 'leaflet';
  import * as lc from 'leaflet.locatecontrol';
  import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
  import { getContext, onMount } from 'svelte';

  const { ...options }: Control.LocateOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);

  let locateControl: Control.Locate;

  let map = $derived(mapContext.getMap());

  onMount(() => {
    // @ts-expect-error This library is so cursed that this is necessary.
    locateControl = lc.locate(options);
  });

  $effect(() => {
    map.addControl(locateControl);

    return () => {
      map.removeControl(locateControl);
    };
  });
</script>
