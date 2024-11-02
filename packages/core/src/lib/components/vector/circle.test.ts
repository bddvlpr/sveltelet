import { Circle, ControlContextKey, LayerContextKey, MapContextKey } from '$lib/index.js';
import { render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';

it('(un)renders', () => {
  const mapMock = {
    addLayer: vi.fn()
  };

  const { component, unmount } = render(Circle, {
    context: new Map([
      [ControlContextKey, { getLayersControl: () => null }],
      [LayerContextKey, { getLayerGroup: () => null }],
      [MapContextKey, { getMap: () => mapMock }]
    ])
  });

  expect(mapMock.addLayer).toHaveBeenCalledTimes(1);

  const circle = component.getCircle();
  circle.remove = vi.fn();

  unmount();

  expect(circle.remove).toHaveBeenCalledTimes(1);
});
