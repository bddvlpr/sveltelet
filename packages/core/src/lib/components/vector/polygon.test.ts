import { ControlContextKey, LayerContextKey, MapContextKey, Polygon } from '$lib/index.js';
import { render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';

it('(un)renders', () => {
  const mapMock = {
    addLayer: vi.fn()
  };

  const { component, unmount } = render(Polygon, {
    props: {
      latLngs: []
    },
    context: new Map([
      [ControlContextKey, { getLayersControl: () => null }],
      [LayerContextKey, { getLayerGroup: () => null }],
      [MapContextKey, { getMap: () => mapMock }]
    ])
  });

  expect(mapMock.addLayer).toHaveBeenCalledTimes(1);

  const polygon = component.getPolygon();
  polygon.remove = vi.fn();

  unmount();

  expect(polygon.remove).toHaveBeenCalledTimes(1);
});
