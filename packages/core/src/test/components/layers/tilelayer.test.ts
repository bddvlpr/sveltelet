import { ControlContextKey, LayerContextKey, MapContextKey, TileLayer } from '$lib/index.js';
import { render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';

it('(un)renders', () => {
  const mapMock = {
    addLayer: vi.fn()
  };

  const { component, unmount } = render(TileLayer, {
    context: new Map([
      [ControlContextKey, { getLayersControl: () => null }],
      [LayerContextKey, { getLayerGroup: () => null }],
      [MapContextKey, { getMap: () => mapMock }]
    ])
  });

  expect(mapMock.addLayer).toHaveBeenCalledTimes(1);

  const tileLayer = component.getTileLayer();
  tileLayer.remove = vi.fn();

  unmount();

  expect(tileLayer.remove).toHaveBeenCalledTimes(1);
});
