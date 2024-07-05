<script lang="ts">
	import type {  ComponentProps} from 'svelte';
  import { ImagePlaceholder } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { twMerge } from 'tailwind-merge';

	import Frame from "../frame/frame.svelte";
	import type {AssetAccount, AssetRaw, AssetStatistics, AssetFlag, AssetMetaData, links, SizeType} from '$lib/types.js';
  import {getMetadata} from '$lib/utility.js';

	let showModal = false;

  export let assetAccount: AssetAccount;
  export let imgClass: string | undefined = undefined;
  export let padding: SizeType | 'none' = 'lg';
  export let reverse: boolean = false;

	interface $$Props extends ComponentProps<Frame> {
    assetAccount: AssetAccount;
    imgClass?:string;
    reverse?: boolean;
    padding?: SizeType | 'none';
	}

  const paddings: Record<SizeType | 'none', string> = {
    none: '',
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-4 sm:p-6',
    xl: 'p-4 sm:p-8'
  };

  let innerPadding: string;
  $: innerPadding = paddings[padding];

  let assetInfo: AssetRaw;
  let assetMetadata: AssetMetaData;

  async function getAssetData(assetAccount: AssetAccount) {
    const data = await getMetadata(assetAccount);
    if(data?.result) {
      assetInfo = data.data?.asset_raw as AssetRaw;
      assetMetadata = data.data?.metadata as AssetMetaData;
      console.log("token card metadata", assetMetadata);
    }
  }
  function shortenString(str:string, maxLength:number): string {
    if (str.length <= maxLength) {
        return str;  // No need to shorten
    } else {
        // Calculate lengths of the parts
        let firstPartLength = Math.ceil(maxLength / 2);
        let secondPartLength = maxLength - firstPartLength;
        
        // Extract the first and last parts
        let firstPart = str.substring(0, firstPartLength);
        let secondPart = str.substring(str.length - secondPartLength);
        
        // Construct the shortened string
        return firstPart + "...." + secondPart;
    }
  }

  onMount(() => {
    getAssetData(assetAccount);
	});

  let cardClass: string;
  $: cardClass = twMerge('flex w-full', $$props.class);
  $: cardClass = twMerge('flex w-full',  'flex-row gap-5 ', innerPadding, $$restProps.imgHoverTransform && 'img-hover', $$restProps.hoverTransform && 'hover');


	let imgCls:string;
	$:imgCls = twMerge('hover:cursor-pointer w-20 h-20 mt-1', imgClass)
  
</script>

<Frame tag="div" {...$$restProps} class={cardClass} on:click={() => (showModal = true)}>
  {#if assetMetadata?.image}
    <img class={imgCls} src={assetMetadata?.image} alt="product 1" width={100} />
  {:else}
  <!-- <div class="flex justify-center items-center w-full h-48 bg-gray-300 rounded dark:bg-gray-700">
    <svg width="48" height="48" class="text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512">
      <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
    </svg>
  </div> -->
  {/if}
  <div class="">
    <h3 class=" font-bold ">{assetMetadata?.code ? assetMetadata?.code : ""}</h3>
    <p class=" text-slate-600 ">{assetMetadata?.name ? assetMetadata?.name : ""}</p>
    <p class=" my-2">{assetMetadata?.issuer ? shortenString(assetMetadata?.issuer, 20): ""}</p>
  </div>
  <!-- <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{token?.name + " #" + token?.id}</h5> -->
</Frame>
