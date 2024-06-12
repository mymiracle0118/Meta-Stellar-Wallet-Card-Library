<script lang="ts">
  import Card from '$lib/card/card.svelte'
  import AssetSelector from '$lib/assetSelector/assetSelector.svelte'
  let recordMouseMoveTrack = true;
  let intervalData = 5;
</script>
<div class="w-full mx-auto p-6 flex justify-center flex-wrap gap-2">
  <div class="flex flex-col gap-5">
    <Card img="/images/test.png" isMouseTrackRecord={recordMouseMoveTrack} dataURL="http://localhost/" intervalData={intervalData}>
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">Meta stellar card title</h5>
      <p class="mb-3 font-normal text-gray-700 leading-tight">Meta stellar card content.</p>
    </Card>
    <AssetSelector/>
  </div>
</div>