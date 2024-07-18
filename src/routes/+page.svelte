<script lang="ts">
  import Card from '$lib/card/card.svelte';
  import YutubePoster from '$lib/youtubePoster/youtubePoster.svelte';
  import ImagePoster from '$lib/imagePoster/imagePoster.svelte';
  import AssetSelector from '$lib/assetSelector/assetSelector.svelte';
  import NftPoster from '$lib/nftPoster/nftPoster.svelte';
  import CanvasModal from '$lib/CanvasModal/Modal.svelte';
  import { nftInfo, tokenInfo } from '../constants.js';
  import Jumbotron from '$lib/JumboTron/index.svelte';
  import TokenPoster from '$lib/tokenPoster/tokenPoster.svelte';
  
  let recordMouseMoveTrack = true;
  let intervalData = 5;
  let testnetBaseURL = "https://horizon-testnet.stellar.org/";
  let mainnetBaseURL = "https://horizon.stellar.org/";

  let isMouseEntered = false;
  let showModal = false;
  let tokenValFromComp:string = '';
  const _getInfo = (val:string) =>{
      tokenValFromComp = val;
  }

  function getTokenAssetInfo(data: any): void {
    console.log("token asset info", data.assetInfo);
    console.log("token metadata info", data.assetMetadata);
  }

  function getNFTAssetInfo(data: any): void {
    console.log("nft asset info", data.assetInfo);
    console.log("nft meta data info", data.assetMetadata);
  }
</script>

<div class="w-full mx-auto p-6 flex justify-center flex-col gap-2 max-w-7xl">
  <Jumbotron title="Metastellar">
    for people to do stuff
  </Jumbotron>
  <div class="flex flex-row gap-5 max-w-7xl">
      <Card 
        img="/images/wallet.webp"
        imgClass="m-lg rounded-lg"
        isMouseTrackRecord={recordMouseMoveTrack} 
        dataURL="http://localhost/api"
        intervalData={intervalData}
        hoverTransform
        shadow
        rounded
        >
          <h5 class="mb-2 text-xl  tracking-tight text-gray-900 ">Meta stellar card</h5> 
          <p class="mb-3 font-normal text-gray-700 leading-tight">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae accusantium praesentium ullam alias aut quod cum perferendis maiores.</p>
      </Card>
      <Card 
        img="/images/wallet.webp"
        imgClass=" rounded-lg"
        isMouseTrackRecord={recordMouseMoveTrack} 
        dataURL="http://localhost/api" 
        intervalData={intervalData}
        hoverTransform
        imgHoverTransform
        reverse
        shadow
        rounded
        >
          <h5 class="mb-2 text-xl  tracking-tight text-gray-900 ">Meta stellar card(reverse)</h5> 
          <p class="mb-3 font-normal text-gray-700 leading-tight">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae accusantium praesentium ullam alias aut quod cum perferendis maiores.</p>
      </Card>
  </div>
  <div class="flex flex-wor gap-5 mzx-w-6xl mt-16">
    <div>
      <Card 
        isMouseTrackRecord={recordMouseMoveTrack} 
        dataURL="http://localhost/api" 
        intervalData={intervalData}
        hoverTransform
        shadow
        rounded
        >
          <h5 class="mb-2 text-xl  tracking-tight text-gray-900 ">Meta stellar card(no image)</h5> 
          <p class="mb-3 font-normal text-gray-700 leading-tight">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae accusantium praesentium ullam alias aut quod cum perferendis maiores.</p>
      </Card> 
      
        <ImagePoster 
            img="/images/test.png" 
            isMouseTrackRecord={recordMouseMoveTrack} 
            dataURL="http://localhost/api" 
            intervalData={intervalData} 
            hoverTransform
            class="rounded-lg"
            imgClass="rounded-lg"
            shadow
            rounded>
          </ImagePoster>
          <h3 class="mt-4">
            Image poster card
          </h3>
      </div>
      <YutubePoster
      isMouseTrackRecord={recordMouseMoveTrack} dataURL="http://localhost/api" intervalData={intervalData}
      yutubeURL="/video/1.mp4"
      thumnailURL="/images/1.jpg"
      type="video/mp4"
      shadow
      rounded
    >
      <div class="">
        <a href="/video/1.mp4" class="mt-2">
          <h5 class="mb-2 text-xl tracking-tight text-gray-900 hover:text-[#1a0dab] hover:cursor-pointer hover:underline">Meta stellar Yutube card</h5>
        </a>
        <p class="mb-3 font-normal text-gray-700 leading-tight">Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
      </div>
    </YutubePoster>
  </div>
  <div class="flex flex-row gap-5 max-w-7xl mt-16">
    <div class="w-1/2">
      <NftPoster 
          isMouseTrackRecord={false} 
          dataURL="http://localhost/api"
          baseURL = {mainnetBaseURL}
          intervalData={intervalData} 
          hoverTransform
          imgHoverTransform
          assetAccount={nftInfo}
          getNFTAssetInfo={getNFTAssetInfo}
          shadow
          rounded
        >
      </NftPoster>
        
      <h3 class="mt-4">
        NFT poster card
      </h3>
    </div>
    <div class="w-1/2">
      <TokenPoster 
          isMouseTrackRecord={false} 
          baseURL = {testnetBaseURL}
          dataURL="http://localhost/api"
          intervalData={intervalData} 
          hoverTransform
          balance={0.117}
          imgHoverTransform
          assetAccount={tokenInfo}
          getTokenAssetInfo={getTokenAssetInfo}
          shadow
          rounded
        >
      </TokenPoster>
      <h3 class="mt-4">
        Token poster card
      </h3>
    </div>
  </div>
  <div class="flex flex-row gap-5 max-w-6xl  mt-16">
    <CanvasModal bind:showModal={showModal} autoScaleHeight={true}>
      <h1>Canvas Modal</h1>
      <p>Canvas Modal</p>
    </CanvasModal>
    <button on:click={()=>showModal=true}>open modal</button>
  </div>
</div>