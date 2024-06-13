<script lang="ts">
  import Card from '$lib/card/card.svelte';
  import YutubePoster from '$lib/yutubePoster/yutubePoster.svelte';
  import AssetSelector from '$lib/assetSelector/assetSelector.svelte';
  let recordMouseMoveTrack = true;
  let intervalData = 5;
</script>
<div class="w-full mx-auto p-6 flex justify-center flex-wrap gap-2">
  <div class="flex flex-col gap-5">
    <!--- Card component-->
    <h3>Metastellar basic card</h3>
    <Card img="/images/test.png" isMouseTrackRecord={recordMouseMoveTrack} dataURL="http://localhost/api" intervalData={intervalData}>
      <h5 class="mb-2 text-xl  tracking-tight text-gray-900 ">Meta stellar card</h5>
      <p class="mb-3 font-normal text-gray-700 leading-tight">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque at nobis doloremque odit labore provident unde officiis odio sit sint? Vitae accusantium praesentium ullam alias aut quod cum perferendis maiores.</p>
    </Card>
    <!--- Yubute poseter component-->
    <h3>Yutube poster component</h3>
    <YutubePoster
      isMouseTrackRecord={recordMouseMoveTrack} dataURL="http://localhost/api" intervalData={intervalData}
      yutubeURL="/video/1.mp4"
      thumnailURL="/images/1.jpg"
      type="video/mp4"
    >
      <div class="pt-4 sm:pt-6">
        <a href="/video/1.mp4" class="mt-2">
          <h5 class="mb-2 text-xl tracking-tight text-gray-900 hover:text-blue-600 hover:cursor-pointer">Meta stellar Yutube card</h5>
        </a>
        <p class="mb-3 font-normal text-gray-700 leading-tight">Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
      </div>
    </YutubePoster>
    <!--- Image post component-->
    <h3>Image poster component</h3>
     <Card img="/images/test.png" isMouseTrackRecord={recordMouseMoveTrack} dataURL="http://localhost/api" intervalData={intervalData} padding="none" tag="a" href="/images/test.png"></Card>
    <!--- Assets selector component-->
    <h3>Assets selector component</h3>
    <AssetSelector/>
  </div>
</div>