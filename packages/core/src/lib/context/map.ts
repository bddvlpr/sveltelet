import type { Map } from 'leaflet';

export const MapContextKey = 'sveltelet-map';

export type MapContext = {
  getMap: () => Map;
};
