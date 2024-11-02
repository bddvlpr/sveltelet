import { ControlContextKey, LayerContextKey, MapContextKey, Popup } from '$lib/index.js';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { expect, it, vi } from 'vitest';

it('(un)renders', () => {
  const layerMock = {
    bindPopup: vi.fn()
  };

  const { component, unmount } = render(Popup, {
    props: {
      children: createRawSnippet(() => ({
        render: () => '<div>Hello world!</div>'
      }))
    },
    context: new Map([
      [ControlContextKey, { getLayersControl: () => null }],
      [LayerContextKey, { getLayer: () => layerMock }],
      [MapContextKey, { getMap: () => null }]
    ])
  });

  expect(layerMock.bindPopup).toHaveBeenCalledTimes(1);

  const popup = component.getPopup();
  popup.remove = vi.fn();

  unmount();

  expect(popup.remove).toHaveBeenCalledTimes(1);
});
