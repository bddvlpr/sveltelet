<script lang="ts">
  import { type ControlContext, ControlContextKey } from '$lib/context/control.js';
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { TileLayer, type WMSOptions } from 'leaflet';
  import { getContext, onMount, setContext, type Snippet } from 'svelte';

  const {
    name = 'Unnamed wms layer',
    overlay = false,
    add = true,
    url,
    children,
    ...options
  }: {
    name?: string;
    overlay?: boolean;
    add?: boolean;
    url: string;
    children?: Snippet;
  } & WMSOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);
  const controlContext = getContext<ControlContext>(ControlContextKey);

  let mounted = $state(false);

  let tileLayerWMS: TileLayer.WMS;

  let map = $derived(mapContext.getMap());
  let parent = $derived(layerContext.getLayerGroup());
  let control = $derived(controlContext.getLayerControl());

  onMount(() => {
    tileLayerWMS = new TileLayer.WMS(url, options);
  });

  $effect(() => {
    if (parent) {
      parent.addLayer(tileLayerWMS);
    } else if (control) {
      if (overlay) {
        control.addOverlay(tileLayerWMS, name);
      } else {
        control.addBaseLayer(tileLayerWMS, name);
      }

      if (add) {
        tileLayerWMS.addTo(map);
      }
    } else {
      map.addLayer(tileLayerWMS);
    }
    mounted = true;

    return () => {
      mounted = false;
      tileLayerWMS.remove();

      if (control) {
        control.removeLayer(tileLayerWMS);
      }
    };
  });

  $effect(() => {
    const { opacity, zIndex } = options;

    if (opacity) tileLayerWMS.setOpacity(opacity);
    if (zIndex) tileLayerWMS.setZIndex(zIndex);

    tileLayerWMS.setUrl(url);
  });

  setContext<LayerContext>(LayerContextKey, {
    ...layerContext,
    getLayer: () => tileLayerWMS
  });

  export const getTileLayerWMS = () => tileLayerWMS;
</script>

{#if mounted}
  {@render children?.()}
{/if}
