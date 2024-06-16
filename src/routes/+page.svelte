<script lang="ts">
  import Card from '$lib/card/card.svelte';
  import CardItem from '$lib/card/item.svelte';
  import YutubePoster from '$lib/yutubePoster/yutubePoster.svelte';
  import ImagePoster from '$lib/imagePoster/imagePoster.svelte';
  import AssetSelector from '$lib/assetSelector/assetSelector.svelte';
  import NftPoster from '$lib/nftPoster/nftPoster.svelte';

  import { nftInfo } from '../constants.js';

  let recordMouseMoveTrack = true;
  let intervalData = 5;
  let isMouseEntered = false;

</script>
<div class="w-full mx-auto p-6 flex justify-center flex-wrap gap-2 mt-10">
  <div class="flex flex-col gap-5">
    <!--- Card component-->
    <div>
      <Card 
        bind:isMouseEntered
        isHoverTransform
        isMouseTrackRecord={recordMouseMoveTrack} 
        dataURL="http://localhost/api" 
        intervalData={intervalData}
        >
          <CardItem
            {isMouseEntered}
            translateZ="100"
            isHoverTransform={true}
            className=" mt-4"> 
            <img class={"rounded-lg"} src={"/images/test.png"} alt="" />
          </CardItem>
          <CardItem
            {isMouseEntered}
            translateZ="100"
            isHoverTransform={true}
            className=" mt-4"> 
            <h5 class="mb-2 text-xl  tracking-tight text-gray-900 ">Meta stellar card</h5> 
            <p class="mb-3 font-normal text-gray-700 leading-tight">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae accusantium praesentium ullam alias aut quod cum perferendis maiores.</p>
          </CardItem>
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
        bind:isMouseEntered
        isHoverTransform></ImagePoster>
      <h3  class="mt-5">Image poster component</h3>
    </div>
    <div>
      <!--- NFT post component-->
      <NftPoster 
        isMouseTrackRecord={recordMouseMoveTrack} 
        dataURL="http://localhost/api" 
        intervalData={intervalData} 
        padding="none"
        bind:isMouseEntered
        isHoverTransform
        token={nftInfo}
        metadataURL={"https://ipfs.io/ipfs/QmQiBZYdiTEozdn4LiumyACiQ9F7ga9tdu6GZmnqHQaLBh/843.json"}
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