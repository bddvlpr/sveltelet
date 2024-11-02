<script lang="ts">
  import {
    type ControlContext,
    ControlContextKey,
    type LayerContext,
    LayerContextKey,
    type MapContext,
    MapContextKey
  } from '$lib/index.js';
  import { type ImageOverlayOptions, type LatLngBoundsExpression, SVGOverlay } from 'leaflet';
  import { getContext, onMount, setContext, type Snippet } from 'svelte';

  const {
    name = 'Unnamed svg overlay',
    overlay = true,
    add = true,
    bounds,
    children,
    ...options
  }: {
    name?: string;
    overlay?: boolean;
    add?: boolean;
    bounds: LatLngBoundsExpression;
    children: Snippet;
  } & ImageOverlayOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);
  const controlContext = getContext<ControlContext>(ControlContextKey);

  let mounted = $state(false);

  let svgOverlay: SVGOverlay;
  let element: SVGElement;

  let map = $derived(mapContext.getMap());
  let parent = $derived(layerContext.getLayerGroup());
  let control = $derived(controlContext.getLayersControl());

  onMount(() => {
    svgOverlay = new SVGOverlay(element, bounds, options);
  });

  $effect(() => {
    if (parent) {
      parent.addLayer(svgOverlay);
    } else if (control) {
      if (overlay) {
        control.addOverlay(svgOverlay, name);
      } else {
        control.addBaseLayer(svgOverlay, name);
      }

      if (add) {
        svgOverlay.addTo(map);
      }
    } else {
      map.addLayer(svgOverlay);
    }
    mounted = true;

    return () => {
      mounted = false;
      svgOverlay.remove();

      if (control) {
        control.removeLayer(svgOverlay);
      }
    };
  });

  $effect(() => {
    const { opacity, zIndex } = options;

    if (opacity) svgOverlay.setOpacity(opacity);
    if (zIndex) svgOverlay.setZIndex(zIndex);

    // TODO: Support bounds
  });

  setContext(LayerContextKey, {
    ...layerContext,
    getLayer: () => svgOverlay
  });

  export const getSVGOverlay = () => svgOverlay;
</script>

<svg bind:this={element} xmlns="http://www.w3.org/2000/svg">
  {#if mounted}
    {@render children()}
  {/if}
</svg>
