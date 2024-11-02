<script lang="ts">
  import { type ControlContext, ControlContextKey } from '$lib/context/control.js';
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { ImageOverlay, type ImageOverlayOptions, type LatLngBoundsExpression } from 'leaflet';
  import { getContext, onMount, setContext, type Snippet } from 'svelte';

  const {
    name = 'Unnamed image overlay',
    overlay = true,
    add = true,
    url,
    bounds,
    children,
    ...options
  }: {
    name?: string;
    overlay?: boolean;
    add?: boolean;
    url: string;
    bounds: LatLngBoundsExpression;
    children?: Snippet;
  } & ImageOverlayOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);
  const controlContext = getContext<ControlContext>(ControlContextKey);

  let mounted = $state(false);

  let imageOverlay: ImageOverlay;

  let map = $derived(mapContext.getMap());
  let parent = $derived(layerContext.getLayerGroup());
  let control = $derived(controlContext.getLayersControl());

  onMount(() => {
    imageOverlay = new ImageOverlay(url, bounds, options);
  });

  $effect(() => {
    if (parent) {
      parent.addLayer(imageOverlay);
    } else if (control) {
      if (overlay) {
        control.addOverlay(imageOverlay, name);
      } else {
        control.addBaseLayer(imageOverlay, name);
      }

      if (add) {
        imageOverlay.addTo(map);
      }
    } else {
      map.addLayer(imageOverlay);
    }
    mounted = true;

    return () => {
      mounted = false;
      imageOverlay.remove();

      if (control) {
        control.removeLayer(imageOverlay);
      }
    };
  });

  $effect(() => {
    const { opacity, zIndex } = options;

    if (opacity) imageOverlay.setOpacity(opacity);
    if (zIndex) imageOverlay.setZIndex(zIndex);

    // TODO: Support bounds
    imageOverlay.setUrl(url);
  });

  setContext<LayerContext>(LayerContextKey, {
    ...layerContext,
    getLayer: () => imageOverlay
  });

  export const getImageOverlay = () => imageOverlay;
</script>

{#if mounted}
  {@render children?.()}
{/if}
