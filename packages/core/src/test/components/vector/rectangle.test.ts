import { ControlContextKey, LayerContextKey, MapContextKey, Rectangle } from '$lib/index.js';
import { render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';

it('(un)renders', () => {
  const mapMock = {
    addLayer: vi.fn()
  };

  const { component, unmount } = render(Rectangle, {
    props: {
      latLngs: [
        [0, 0],
        [1, 1]
      ]
    },
    context: new Map([
      [ControlContextKey, { getLayersControl: () => null }],
      [LayerContextKey, { getLayerGroup: () => null }],
      [MapContextKey, { getMap: () => mapMock }]
    ])
  });

  expect(mapMock.addLayer).toHaveBeenCalledTimes(1);

  const rectangle = component.getRectangle();
  rectangle.remove = vi.fn();

  unmount();

  expect(rectangle.remove).toHaveBeenCalledTimes(1);
});
