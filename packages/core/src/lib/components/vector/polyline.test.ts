import { ControlContextKey, LayerContextKey, MapContextKey, Polyline } from '$lib/index.js';
import { render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';

it('(un)renders', () => {
  const mapMock = {
    addLayer: vi.fn()
  };

  const { component, unmount } = render(Polyline, {
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

  const polyline = component.getPolyline();
  polyline.remove = vi.fn();

  unmount();

  expect(polyline.remove).toHaveBeenCalledTimes(1);
});
