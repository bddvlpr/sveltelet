import { MapContextKey, ZoomControl } from '$lib/index.js';
import { render } from '@testing-library/svelte';
import { expect, it, vi } from 'vitest';

it('(un)renders', () => {
  const mapMock = {
    addControl: vi.fn(),
    removeControl: vi.fn()
  };

  const { unmount } = render(ZoomControl, {
    context: new Map([[MapContextKey, { getMap: () => mapMock }]])
  });

  expect(mapMock.addControl).toHaveBeenCalledTimes(1);

  unmount();

  expect(mapMock.removeControl).toHaveBeenCalledTimes(1);
});
