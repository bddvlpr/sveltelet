<script lang="ts">
  import { type ControlContext, ControlContextKey } from '$lib/context/control.js';
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { GeoJSON, layerGroup, type GeoJSONOptions } from 'leaflet';
  import { getContext, onMount } from 'svelte';
  import type { GeoJsonObject } from 'geojson';

  const {
    name = 'Unnamed geojson',
    overlay = false,
    add = true,
    object,
    ...options
  }: {
    name?: string;
    overlay?: boolean;
    add?: boolean;
    object: GeoJsonObject;
  } & GeoJSONOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);
  const controlContext = getContext<ControlContext>(ControlContextKey);

  let mounted = $state(false);

  let geoJSON: GeoJSON;

  let map = $derived(mapContext.getMap());
  let parent = $derived(layerContext.getLayerGroup());
  let control = $derived(controlContext.getLayerControl());

  onMount(() => {
    geoJSON = new GeoJSON(object, options);
  });

  $effect(() => {
    if (parent) {
      parent.addLayer(geoJSON);
    } else if (control) {
      if (overlay) {
        control.addOverlay(geoJSON, name);
      } else {
        control.addBaseLayer(geoJSON, name);
      }

      if (add) {
        geoJSON.addTo(map);
      }
    } else {
      map.addLayer(geoJSON);
    }
    mounted = true;

    return () => {
      mounted = false;
      geoJSON.remove();

      if (control) {
        control.removeLayer(geoJSON);
      }
    };
  });
</script>
