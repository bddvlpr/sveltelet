import { ControlContextKey, GeoJSON, LayerContextKey, MapContextKey } from '$lib/index.js';
import { render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';

it('(un)renders', () => {
  const mapMock = {
    addLayer: vi.fn()
  };

  const { component, unmount } = render(GeoJSON, {
    context: new Map([
      [ControlContextKey, { getLayersControl: () => null }],
      [LayerContextKey, { getLayerGroup: () => null }],
      [MapContextKey, { getMap: () => mapMock }]
    ])
  });

  expect(mapMock.addLayer).toHaveBeenCalledTimes(1);

  const geoJSON = component.getGeoJSON();
  geoJSON.remove = vi.fn();

  unmount();

  expect(geoJSON.remove).toHaveBeenCalledTimes(1);
});
