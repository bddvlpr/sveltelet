import { ControlContextKey, LayerContextKey, MapContextKey, Tooltip } from '$lib/index.js';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { expect, it, vi } from 'vitest';

it('(un)renders', () => {
  const layerMock = {
    bindTooltip: vi.fn()
  };

  const { component, unmount } = render(Tooltip, {
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

  expect(layerMock.bindTooltip).toHaveBeenCalledTimes(1);

  const tooltip = component.getTooltip();
  tooltip.remove = vi.fn();

  unmount();

  expect(tooltip.remove).toHaveBeenCalledTimes(1);
});
