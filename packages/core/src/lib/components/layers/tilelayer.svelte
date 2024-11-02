<script lang="ts">
  import { type ControlContext, ControlContextKey } from '$lib/context/control.js';
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { TileLayer, type TileLayerOptions } from 'leaflet';
  import { getContext, onMount, setContext, type Snippet } from 'svelte';

  const {
    name = 'Unnamed layer',
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
  } & TileLayerOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);
  const controlContext = getContext<ControlContext>(ControlContextKey);

  let mounted = $state(false);

  let tileLayer: TileLayer;

  let map = $derived(mapContext.getMap());
  let parent = $derived(layerContext.getLayerGroup());
  let control = $derived(controlContext.getLayersControl());

  onMount(() => {
    tileLayer = new TileLayer(url, options);
  });

  $effect(() => {
    if (parent) {
      parent.addLayer(tileLayer);
    } else if (control) {
      if (overlay) {
        control.addOverlay(tileLayer, name);
      } else {
        control.addBaseLayer(tileLayer, name);
      }

      if (add) {
        tileLayer.addTo(map);
      }
    } else {
      map.addLayer(tileLayer);
    }
    mounted = true;

    return () => {
      mounted = false;
      tileLayer.remove();

      if (control) {
        control.removeLayer(tileLayer);
      }
    };
  });

  $effect(() => {
    const { opacity, zIndex } = options;

    if (opacity) tileLayer.setOpacity(opacity);
    if (zIndex) tileLayer.setZIndex(zIndex);

    tileLayer.setUrl(url);
  });

  setContext<LayerContext>(LayerContextKey, {
    ...layerContext,
    getLayer: () => tileLayer
  });

  export const getTileLayer = () => tileLayer;
</script>

{#if mounted}
  {@render children?.()}
{/if}
