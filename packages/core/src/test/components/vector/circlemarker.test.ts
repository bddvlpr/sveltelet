import { CircleMarker, ControlContextKey, LayerContextKey, MapContextKey } from '$lib/index.js';
import { render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';

it('(un)renders', () => {
  const mapMock = {
    addLayer: vi.fn()
  };

  const { component, unmount } = render(CircleMarker, {
    context: new Map([
      [ControlContextKey, { getLayersControl: () => null }],
      [LayerContextKey, { getLayerGroup: () => null }],
      [MapContextKey, { getMap: () => mapMock }]
    ])
  });

  expect(mapMock.addLayer).toHaveBeenCalledTimes(1);

  const circleMarker = component.getCircleMarker();
  circleMarker.remove = vi.fn();

  unmount();

  expect(circleMarker.remove).toHaveBeenCalledTimes(1);
});
