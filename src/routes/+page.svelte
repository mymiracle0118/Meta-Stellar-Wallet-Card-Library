<script lang="ts">
  import Card from '$lib/card/Card.svelte'
  import AssetSelector from '$lib/assetSelector/assetSelector.svelte'
</script>
<Card isMouseTrackRecord={true} intervalData={5} dataURL="http://URL"><h1>hello world!</h1><p>description</p></Card>

<AssetSelector />
