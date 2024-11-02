import type { Layer, LayerGroup } from 'leaflet';

export const LayerContextKey = 'sveltelet-layer';

export type LayerContext = {
  getLayer: () => Layer | null;
  getLayerGroup: () => LayerGroup | null;
};
