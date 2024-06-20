<script lang="ts">
  import Card from '$lib/card/card.svelte';
  import YutubePoster from '$lib/youtubePoster/youtubePoster.svelte';
  import ImagePoster from '$lib/imagePoster/imagePoster.svelte';
  import AssetSelector from '$lib/assetSelector/assetSelector.svelte';
  import NftPoster from '$lib/nftPoster/nftPoster.svelte';

  import { assetInfo } from '../constants.js';

  let recordMouseMoveTrack = true;
  let intervalData = 5;

  let isMouseEntered = false;
</script>
<div class="w-full mx-auto p-6 flex justify-center flex-wrap gap-2 mt-10">
  <div class="flex flex-col gap-5">
    <!--- Card component-->
    <div>
      <Card 
        img="/images/test.png"
        imgClass="m-3 rounded-lg"
        isMouseTrackRecord={recordMouseMoveTrack} 
        dataURL="http://localhost/api" 
        intervalData={intervalData}
        isMouseEntered
        border
        size="lg"
        rounded
        shadow
        hoverTransform
        >
          <h5 class="mb-2 text-xl  tracking-tight text-gray-900 ">Meta stellar card</h5> 
          <p class="mb-3 font-normal text-gray-700 leading-tight">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae accusantium praesentium ullam alias aut quod cum perferendis maiores.</p>
      </Card>
      <h3 class="mt-5">Metastellar basic card</h3>
    </div>
    <div>
    <!--- Yubute poseter component-->
      <YutubePoster
        isMouseTrackRecord={recordMouseMoveTrack} dataURL="http://localhost/api" intervalData={intervalData}
        yutubeURL="/video/1.mp4"
        thumnailURL="/images/1.jpg"
        type="video/mp4"
        border
        rounded
        size="lg"
        shadow
        videoClass="p-3"
        hoverTransform
      >
        <div class="">
          <a href="/video/1.mp4" class="mt-2">
            <h5 class="mb-2 text-xl tracking-tight text-gray-900 hover:text-[#1a0dab] hover:cursor-pointer hover:underline">Meta stellar Yutube card</h5>
          </a>
          <p class="mb-3 font-normal text-gray-700 leading-tight">Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
        </div>
      </YutubePoster>
    <h3 class="mt-5">Yutube poster component</h3>
    </div>
    <div>
      <!--- Image post component-->
      <ImagePoster 
        img="/images/test.png" 
        isMouseTrackRecord={recordMouseMoveTrack} 
        dataURL="http://localhost/api" 
        intervalData={intervalData} 
        padding="none"
        size="lg"
        rounded
        hoverTransform></ImagePoster>
      <h3  class="mt-5">Image poster component</h3>
    </div>
    <div>
      <!--- NFT post component-->
      <NftPoster 
        isMouseTrackRecord={recordMouseMoveTrack} 
        dataURL="http://localhost/api" 
        intervalData={intervalData} 
        hoverTransform
        size="lg"
        rounded
        shadow
        assetAccount={assetInfo}
      >
      </NftPoster>
      <h3  class="mt-5">Nft poster component</h3>
    </div>
    <div class="">
      <!--- Assets selector component-->
      <AssetSelector/>
      <h3 class="mt-5">Assets selector component</h3>
    </div>
  </div>
</div>