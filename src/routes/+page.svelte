<script lang="ts">
  import { Map, TileLayer } from '$lib/index.js';
</script>

<Map center={[1, 1]} zoom={11}>
  <TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
</Map>
