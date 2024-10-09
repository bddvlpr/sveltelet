import { it, vi, expect, describe } from 'vitest';
import { render } from '@testing-library/svelte';

import { TileLayerWMS, LayerContextKey, MapContextKey, ControlContextKey } from '$lib/index.js';

describe('renders', () => {
  describe('map parent', () => {
    it('should render', () => {
      const map = {
        addLayer: vi.fn()
      };
      const control = {
        addOverlay: vi.fn(),
        addBaseLayer: vi.fn(),
        removeLayer: vi.fn()
      };

      render(TileLayerWMS, {
        props: {
          url: ''
        },
        context: new Map([
          [
            MapContextKey,
            {
              getMap: () => map
            }
          ],
          [
            LayerContextKey,
            {
              getLayerGroup: () => null,
              getLayer: () => null
            }
          ],
          [
            ControlContextKey,
            {
              getLayerControl: () => control
            }
          ]
        ])
      });

      expect(map.addLayer).toHaveBeenCalledOnce();
      expect(control.addBaseLayer).toHaveBeenCalledOnce();
    });
  });

  describe('layergroup parent', () => {
    it('should render', () => {
      const map = {
        addLayer: vi.fn()
      };
      const layerGroup = {
        addLayer: vi.fn()
      };

      render(TileLayerWMS, {
        props: {
          url: ''
        },
        context: new Map([
          [
            MapContextKey,
            {
              getMap: () => map
            }
          ],
          [
            LayerContextKey,
            {
              getLayerGroup: () => layerGroup,
              getLayer: () => null
            }
          ],
          [
            ControlContextKey,
            {
              getLayerControl: () => null
            }
          ]
        ])
      });

      expect(layerGroup.addLayer).toHaveBeenCalledOnce();
    });

    it('should take priority over map', () => {
      const map = {
        addLayer: vi.fn()
      };
      const layerGroup = {
        addLayer: vi.fn()
      };

      render(TileLayerWMS, {
        props: {
          url: ''
        },
        context: new Map([
          [
            MapContextKey,
            {
              getMap: () => map
            }
          ],
          [
            LayerContextKey,
            {
              getLayerGroup: () => layerGroup,
              getLayer: () => null
            }
          ],
          [
            ControlContextKey,
            {
              getLayerControl: () => null
            }
          ]
        ])
      });

      expect(map.addLayer).not.toHaveBeenCalled();
      expect(layerGroup.addLayer).toHaveBeenCalledOnce();
    });

    it('should take priority over control', () => {
      const map = {
        addLayer: vi.fn()
      };
      const layerGroup = {
        addLayer: vi.fn()
      };
      const control = {
        addOverlay: vi.fn(),
        addBaseLayer: vi.fn(),
        removeLayer: vi.fn()
      };

      render(TileLayerWMS, {
        props: {
          url: ''
        },
        context: new Map([
          [
            MapContextKey,
            {
              getMap: () => map
            }
          ],
          [
            LayerContextKey,
            {
              getLayerGroup: () => layerGroup,
              getLayer: () => null
            }
          ],
          [
            ControlContextKey,
            {
              getLayerControl: () => control
            }
          ]
        ])
      });

      expect(map.addLayer).not.toHaveBeenCalledOnce();
      expect(layerGroup.addLayer).toHaveBeenCalled();
      expect(control.addBaseLayer).not.toHaveBeenCalledOnce();
    });
  });

  describe('control parent', () => {
    it('should render', () => {
      const map = {
        addLayer: vi.fn()
      };
      const control = {
        addOverlay: vi.fn(),
        addBaseLayer: vi.fn(),
        removeLayer: vi.fn()
      };

      render(TileLayerWMS, {
        props: {
          url: ''
        },
        context: new Map([
          [
            MapContextKey,
            {
              getMap: () => map
            }
          ],
          [
            LayerContextKey,
            {
              getLayerGroup: () => null,
              getLayer: () => null
            }
          ],
          [
            ControlContextKey,
            {
              getLayerControl: () => control
            }
          ]
        ])
      });

      expect(map.addLayer).toHaveBeenCalledOnce();
      expect(control.addBaseLayer).toHaveBeenCalledOnce();
    });

    it('should unmount', () => {
      const map = {
        addLayer: vi.fn()
      };
      const control = {
        addOverlay: vi.fn(),
        addBaseLayer: vi.fn(),
        removeLayer: vi.fn()
      };

      const { unmount } = render(TileLayerWMS, {
        props: {
          url: ''
        },
        context: new Map([
          [
            MapContextKey,
            {
              getMap: () => map
            }
          ],
          [
            LayerContextKey,
            {
              getLayerGroup: () => null,
              getLayer: () => null
            }
          ],
          [
            ControlContextKey,
            {
              getLayerControl: () => control
            }
          ]
        ])
      });

      unmount();

      expect(map.addLayer).toHaveBeenCalledOnce();
      expect(control.addBaseLayer).toHaveBeenCalledOnce();
      expect(control.removeLayer).toHaveBeenCalledOnce();
    });

    it('should take priority over map', () => {
      const map = {
        addLayer: vi.fn()
      };
      const control = {
        addOverlay: vi.fn(),
        addBaseLayer: vi.fn(),
        removeLayer: vi.fn()
      };

      render(TileLayerWMS, {
        props: {
          url: ''
        },
        context: new Map([
          [
            MapContextKey,
            {
              getMap: () => map
            }
          ],
          [
            LayerContextKey,
            {
              getLayerGroup: () => null,
              getLayer: () => null
            }
          ],
          [
            ControlContextKey,
            {
              getLayerControl: () => control
            }
          ]
        ])
      });

      expect(map.addLayer).toHaveBeenCalledOnce();
      expect(control.addBaseLayer).toHaveBeenCalledOnce();
    });
  });
});

describe('effects', () => {
  it('should update url', async () => {
    const { component, rerender } = render(TileLayerWMS, {
      props: {
        url: 'https://placebo.bddvlpr.com/{z}/{x}/{y}.png'
      },
      context: new Map([
        [MapContextKey, { getMap: () => ({ addLayer: vi.fn() }) }],
        [LayerContextKey, { getLayerGroup: () => null, getLayer: () => null }],
        [ControlContextKey, { getLayerControl: () => null }]
      ])
    });
    const tileLayerWMS = component.getTileLayerWMS();

    expect(tileLayerWMS._url).toBe('https://placebo.bddvlpr.com/{z}/{x}/{y}.png');

    await rerender({
      url: 'https://placebo2.bddvlpr.com/{z}/{x}/{y}.png'
    });

    expect(tileLayerWMS._url).toBe('https://placebo2.bddvlpr.com/{z}/{x}/{y}.png');
  });

  it('should update opacity', async () => {
    const { component, rerender } = render(TileLayerWMS, {
      props: {
        url: 'https://placebo.bddvlpr.com/{z}/{x}/{y}.png',
        opacity: 0.5
      },
      context: new Map([
        [MapContextKey, { getMap: () => ({ addLayer: vi.fn() }) }],
        [LayerContextKey, { getLayerGroup: () => null, getLayer: () => null }],
        [ControlContextKey, { getLayerControl: () => null }]
      ])
    });
    const tileLayerWMS = component.getTileLayerWMS();

    expect(tileLayerWMS.options.opacity).toBe(0.5);

    await rerender({
      url: 'https://placebo.bddvlpr.com/{z}/{x}/{y}.png',
      opacity: 0.8
    });

    expect(tileLayerWMS.options.opacity).toBe(0.8);
  });

  it('should update zIndex', async () => {
    const { component, rerender } = render(TileLayerWMS, {
      props: {
        url: 'https://placebo.bddvlpr.com/{z}/{x}/{y}.png',
        zIndex: 5
      },
      context: new Map([
        [MapContextKey, { getMap: () => ({ addLayer: vi.fn() }) }],
        [LayerContextKey, { getLayerGroup: () => null, getLayer: () => null }],
        [ControlContextKey, { getLayerControl: () => null }]
      ])
    });
    const tileLayerWMS = component.getTileLayerWMS();

    expect(tileLayerWMS.options.zIndex).toBe(5);

    await rerender({
      url: 'https://placebo.bddvlpr.com/{z}/{x}/{y}.png',
      zIndex: 10
    });

    expect(tileLayerWMS.options.zIndex).toBe(10);
  });
});
