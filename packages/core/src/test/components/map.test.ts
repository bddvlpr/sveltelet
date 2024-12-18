import { Map } from '$lib/index.js';
import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

it('(un)renders', () => {
  const { unmount } = render(Map, {
    props: {
      center: [0, 0],
      zoom: 1
    }
  });

  expect(document.getElementsByClassName('leaflet-container').length).greaterThan(0);

  unmount();

  expect(document.getElementsByClassName('leaflet-container').length).toEqual(0);
});
