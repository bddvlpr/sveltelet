<script lang="ts">
  import { type ControlContext, ControlContextKey } from '$lib/context/control.js';
  import { type LayerContext, LayerContextKey } from '$lib/context/layer.js';
  import { type MapContext, MapContextKey } from '$lib/context/map.js';
  import { LayerGroup, type LayerOptions } from 'leaflet';
  import { getContext, onMount, setContext, type Snippet } from 'svelte';

  const {
    name = 'Unnamed layer group',
    overlay = false,
    add = true,
    children,
    ...options
  }: {
    name?: string;
    overlay?: boolean;
    add?: boolean;
    children?: Snippet;
  } & LayerOptions = $props();

  const mapContext = getContext<MapContext>(MapContextKey);
  const layerContext = getContext<LayerContext>(LayerContextKey);
  const controlContext = getContext<ControlContext>(ControlContextKey);

  let mounted = $state(false);

  let layerGroup: LayerGroup;

  let map = $derived(mapContext.getMap());
  let parent = $derived(layerContext.getLayerGroup());
  let control = $derived(controlContext.getLayersControl());

  onMount(() => {
    layerGroup = new LayerGroup([], options);
  });

  $effect(() => {
    if (parent) {
      parent.addLayer(layerGroup);
    } else if (control) {
      if (overlay) {
        control.addOverlay(layerGroup, name);
      } else {
        control.addBaseLayer(layerGroup, name);
      }

      if (add) {
        layerGroup.addTo(map);
      }
    } else {
      map.addLayer(layerGroup);
    }
    mounted = true;

    return () => {
      mounted = false;
      layerGroup.remove();

      if (control) {
        control.removeLayer(layerGroup);
      }
    };
  });

  setContext<LayerContext>(LayerContextKey, {
    ...layerContext,
    getLayerGroup: () => layerGroup,
    getLayer: () => layerGroup
  });

  export const getLayerGroup = () => layerGroup;
</script>

{#if mounted}
  {@render children?.()}
{/if}
