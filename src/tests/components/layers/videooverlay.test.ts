import { ControlContextKey, LayerContextKey, MapContextKey, VideoOverlay } from '$lib/index.js';
import { render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

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

      render(VideoOverlay, {
        props: {
          url: '',
          bounds: [
            [0, 0],
            [1, 1]
          ]
        },
        context: new Map([
          [
            ControlContextKey,
            {
              getLayerControl: () => control
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
            MapContextKey,
            {
              getMap: () => map
            }
          ]
        ])
      });

      expect(map.addLayer).toHaveBeenCalledOnce();
      expect(control.addOverlay).toHaveBeenCalledOnce();
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

      render(VideoOverlay, {
        props: {
          url: '',
          bounds: [
            [0, 0],
            [1, 1]
          ]
        },
        context: new Map([
          [
            ControlContextKey,
            {
              getLayerControl: () => null
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
            MapContextKey,
            {
              getMap: () => map
            }
          ]
        ])
      });

      expect(map.addLayer).not.toHaveBeenCalled();
      expect(layerGroup.addLayer).toHaveBeenCalledOnce();
    });

    it('should take priority over map', () => {
      const map = {
        addLayer: vi.fn()
      };
      const layerGroup = {
        addLayer: vi.fn()
      };

      render(VideoOverlay, {
        props: {
          url: '',
          bounds: [
            [0, 0],
            [1, 1]
          ]
        },
        context: new Map([
          [
            ControlContextKey,
            {
              getLayerControl: () => null
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
            MapContextKey,
            {
              getMap: () => map
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

      render(VideoOverlay, {
        props: {
          url: '',
          bounds: [
            [0, 0],
            [1, 1]
          ]
        },
        context: new Map([
          [
            ControlContextKey,
            {
              getLayerControl: () => control
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
            MapContextKey,
            {
              getMap: () => map
            }
          ]
        ])
      });

      expect(map.addLayer).not.toHaveBeenCalledOnce();
      expect(layerGroup.addLayer).toHaveBeenCalled();
      expect(control.addOverlay).not.toHaveBeenCalledOnce();
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

      render(VideoOverlay, {
        props: {
          url: '',
          bounds: [
            [0, 0],
            [1, 1]
          ]
        },
        context: new Map([
          [
            ControlContextKey,
            {
              getLayerControl: () => control
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
            MapContextKey,
            {
              getMap: () => map
            }
          ]
        ])
      });

      expect(map.addLayer).toHaveBeenCalledOnce();
      expect(control.addOverlay).toHaveBeenCalledOnce();
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

      const { unmount } = render(VideoOverlay, {
        props: {
          url: '',
          bounds: [
            [0, 0],
            [1, 1]
          ]
        },
        context: new Map([
          [
            ControlContextKey,
            {
              getLayerControl: () => control
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
            MapContextKey,
            {
              getMap: () => map
            }
          ]
        ])
      });

      expect(map.addLayer).toHaveBeenCalledOnce();
      expect(control.addOverlay).toHaveBeenCalledOnce();

      unmount();

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

      render(VideoOverlay, {
        props: {
          url: '',
          bounds: [
            [0, 0],
            [1, 1]
          ]
        },
        context: new Map([
          [
            ControlContextKey,
            {
              getLayerControl: () => control
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
            MapContextKey,
            {
              getMap: () => map
            }
          ]
        ])
      });

      expect(map.addLayer).toHaveBeenCalledOnce();
      expect(control.addOverlay).toHaveBeenCalledOnce();
    });
  });
});

describe('effects', () => {
  it('should update url', async () => {
    const { component, rerender } = render(VideoOverlay, {
      props: {
        url: 'https://placebo.bddvlpr.com/test1.mp4',
        bounds: [
          [0, 0],
          [1, 1]
        ]
      },
      context: new Map([
        [
          ControlContextKey,
          {
            getLayerControl: () => null
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
          MapContextKey,
          {
            getMap: () => ({
              addLayer: vi.fn()
            })
          }
        ]
      ])
    });
    const videoOverlay = component.getVideoOverlay();

    expect(videoOverlay._url).toBe('https://placebo.bddvlpr.com/test1.mp4');

    await rerender({
      url: 'https://placebo.bddvlpr.com/test2.mp4',
      bounds: [
        [0, 0],
        [1, 1]
      ]
    });

    expect(videoOverlay._url).toBe('https://placebo.bddvlpr.com/test2.mp4');
  });

  it('should update opacity', async () => {
    const { component, rerender } = render(VideoOverlay, {
      props: {
        url: 'https://placebo.bddvlpr.com/test1.mp4',
        bounds: [
          [0, 0],
          [1, 1]
        ],
        opacity: 0.5
      },
      context: new Map([
        [
          ControlContextKey,
          {
            getLayerControl: () => null
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
          MapContextKey,
          {
            getMap: () => ({
              addLayer: vi.fn()
            })
          }
        ]
      ])
    });
    const videoOverlay = component.getVideoOverlay();

    expect(videoOverlay.options.opacity).toBe(0.5);

    await rerender({
      url: 'https://placebo.bddvlpr.com/test1.mp4',
      bounds: [
        [0, 0],
        [1, 1]
      ],
      opacity: 0.75
    });

    expect(videoOverlay.options.opacity).toBe(0.75);
  });

  it('should update zIndex', async () => {
    const { component, rerender } = render(VideoOverlay, {
      props: {
        url: 'https://placebo.bddvlpr.com/test1.mp4',
        bounds: [
          [0, 0],
          [1, 1]
        ],
        zIndex: 1
      },
      context: new Map([
        [
          ControlContextKey,
          {
            getLayerControl: () => null
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
          MapContextKey,
          {
            getMap: () => ({
              addLayer: vi.fn()
            })
          }
        ]
      ])
    });
    const videoOverlay = component.getVideoOverlay();

    expect(videoOverlay.options.zIndex).toBe(1);

    await rerender({
      url: 'https://placebo.bddvlpr.com/test1.mp4',
      bounds: [
        [0, 0],
        [1, 1]
      ],
      zIndex: 5
    });

    expect(videoOverlay.options.zIndex).toBe(5);
  });
});

declare module 'leaflet' {
  interface VideoOverlay {
    _url: string;
  }
}
