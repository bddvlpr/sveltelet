import { ControlContextKey, LayerContextKey, MapContextKey, SVGOverlay } from '$lib/index.js';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { expect, it, vi } from 'vitest';

it('(un)renders', () => {
  const mapMock = {
    addLayer: vi.fn()
  };

  const { component, unmount } = render(SVGOverlay, {
    props: {
      bounds: [
        [0, 0],
        [1, 1]
      ],
      children: createRawSnippet(() => ({
        render: () => '<rect width="100" height="50" style="fill:green" />'
      }))
    },
    context: new Map([
      [ControlContextKey, { getLayersControl: () => null }],
      [LayerContextKey, { getLayerGroup: () => null }],
      [MapContextKey, { getMap: () => mapMock }]
    ])
  });

  expect(mapMock.addLayer).toHaveBeenCalledTimes(1);

  const svgOverlay = component.getSVGOverlay();
  svgOverlay.remove = vi.fn();

  unmount();

  expect(svgOverlay.remove).toHaveBeenCalledTimes(1);
});
