import type { Control } from 'leaflet';

export const ControlContextKey = 'sveltelet-control';

export type ControlContext = {
  getLayerControl: () => Control.Layers | null;
};
