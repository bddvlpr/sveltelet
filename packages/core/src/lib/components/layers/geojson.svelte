<script lang="ts">
  import type { GeoJsonObject } from 'geojson';

  import { type ControlContext, ControlContextKey } from '$lib/context/control.js';
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { GeoJSON, type GeoJSONOptions } from 'leaflet';
  import { getContext, onMount } from 'svelte';

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

  let geoJSON: GeoJSON;

  let map = $derived(mapContext.getMap());
  let parent = $derived(layerContext.getLayerGroup());
  let control = $derived(controlContext.getLayersControl());

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

    return () => {
      geoJSON.remove();

      if (control) {
        control.removeLayer(geoJSON);
      }
    };
  });

  export const getGeoJSON = () => geoJSON;
</script>
