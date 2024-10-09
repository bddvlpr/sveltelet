import { Map } from '$lib/index.js';
import { render } from '@testing-library/svelte';
import { LatLngBounds, type MapOptions } from 'leaflet';
import { describe, expect, it } from 'vitest';

const DEFAULT_PROPS: MapOptions = {
  zoom: 11,
  center: [0, 0]
};

it('should render', () => {
  render(Map, DEFAULT_PROPS);

  expect(document.getElementsByClassName('leaflet-container').length).toBe(1);
});

describe('effects', () => {
  it('should update maxBounds', async () => {
    const bounds1 = new LatLngBounds([1, 1], [2, 2]);
    const bounds2 = new LatLngBounds([2, 3], [2, 2]);

    const { component, rerender } = render(Map, {
      ...DEFAULT_PROPS,
      maxBounds: bounds1
    });
    const map = component.getMap();

    expect(map.options.maxBounds).toBe(bounds1);

    await rerender({
      ...DEFAULT_PROPS,
      maxBounds: bounds2
    });

    expect(map.options.maxBounds).toBe(bounds2);
  });

  it('should update minZoom', async () => {
    const { component, rerender } = render(Map, {
      ...DEFAULT_PROPS,
      minZoom: 7
    });
    const map = component.getMap();

    expect(map.getMinZoom()).toBe(7);

    await rerender({
      ...DEFAULT_PROPS,
      minZoom: 8
    });

    expect(map.getMinZoom()).toBe(8);
  });

  it('should update maxZoom', async () => {
    const { component, rerender } = render(Map, {
      ...DEFAULT_PROPS,
      maxZoom: 7
    });
    const map = component.getMap();

    expect(map.getMaxZoom()).toBe(7);

    await rerender({
      ...DEFAULT_PROPS,
      maxZoom: 8
    });

    expect(map.getMaxZoom()).toBe(8);
  });

  it('should update zoom', async () => {
    const { component, rerender } = render(Map, {
      ...DEFAULT_PROPS,
      zoom: 6
    });
    const map = component.getMap();

    expect(map.getZoom()).toBe(6);

    await rerender({
      ...DEFAULT_PROPS,
      zoom: 9
    });

    expect(map.getZoom()).toBe(9);
  });
});
