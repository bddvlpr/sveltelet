<script lang="ts">
  import { type ControlContext, ControlContextKey } from '$lib/context/control.js';
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { type ImageOverlayOptions, type LatLngBoundsExpression, VideoOverlay } from 'leaflet';
  import { getContext, onMount, setContext, type Snippet } from 'svelte';

  const {
    name = 'Unnamed video overlay',
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

  let videoOverlay: VideoOverlay;

  let map = $derived(mapContext.getMap());
  let parent = $derived(layerContext.getLayerGroup());
  let control = $derived(controlContext.getLayerControl());

  onMount(() => {
    videoOverlay = new VideoOverlay(url, bounds, options);
  });

  $effect(() => {
    if (parent) {
      parent.addLayer(videoOverlay);
    } else if (control) {
      if (overlay) {
        control.addOverlay(videoOverlay, name);
      } else {
        control.addBaseLayer(videoOverlay, name);
      }

      if (add) {
        videoOverlay.addTo(map);
      }
    } else {
      map.addLayer(videoOverlay);
    }
    mounted = true;

    return () => {
      mounted = false;
      videoOverlay.remove();

      if (control) {
        control.removeLayer(videoOverlay);
      }
    };
  });

  setContext<LayerContext>(LayerContextKey, {
    ...layerContext,
    getLayer: () => videoOverlay
  });
</script>

{#if mounted}
  {@render children?.()}
{/if}
