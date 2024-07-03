<script lang="ts">
	import type {  ComponentProps} from 'svelte';
  import { ImagePlaceholder } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { twMerge } from 'tailwind-merge';

	import Frame from "../frame/frame.svelte";
	import type {AssetAccount, AssetRaw, AssetMetaData, SizeType} from '$lib/types.js';
	import {baseURL} from '$lib/constants.js';

	let showModal = false;

  export let assetAccount: AssetAccount;
  export let imgClass: string | undefined = undefined;
  export let padding: SizeType | 'none' = 'lg';

	interface $$Props extends ComponentProps<Frame> {
    assetAccount: AssetAccount;
    imgClass?:string;
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

  const yPaddings: Record<SizeType | 'none', string> = {
    none: '',
    xs: 'py-2',
    sm: 'py-4',
    md: 'py-4 sm:py-5',
    lg: 'py-4 sm:py-6',
    xl: 'py-4 sm:py-8'
  };

  let innerPadding: string;
  $: innerPadding = paddings[padding];
  let innerYpadding: string;
  $: innerYpadding = yPaddings[padding];

  let assetInfo: AssetRaw;
  let assetMetadata: AssetMetaData;

  async function fetchToml(request: string, code: string) {
    console.log("request", request);
    try {
      const res = await fetch(request);
      if(res.ok) {
        let result = await res.text();
        // result = result.replaceAll(" ", "");
        // console.log(result);
        const assetMetadataArray = result.split('[[CURRENCIES]]')
        .filter(Boolean) // Filter empty elements resulting from splitting
        .slice(1) // Slice away the first element, which includes VERSION and NETWORK_PASSPHRASE
        .map(entry => ({
          code: entry.match(/code\s*=\s*['"]*([^'"]*)['"]*/)?.[1],
          issuer: entry.match(/issuer\s*=\s*['"]*([^'"]*)['"]*/)?.[1],
          // anchor_asset_type: entry.match(/anchor_asset_type\s*=\s*['"]*([^'"]*)['"]*/)?.[1],
          name: entry.match(/name\s*=\s*['"]*([^'"]*)['"]*/)?.[1],
          desc: entry.match(/desc\s*=\s*['"]*([^'"]*)['"]*/)?.[1],
          image: entry.match(/image\s*=\s*['"]*([^'"]*)['"]*/)?.[1],
          // display_decimals: entry.match(/display_decimals\s*=\s*(\d*\.*\d*)/)?.[1]
        }));
        // console.log(assetMetadataArray);
        const assetMetadata = assetMetadataArray.filter(entry => !code || entry.code?.includes(code));
        console.log("assetMetadata", assetMetadata);
        if(assetMetadata == undefined || assetMetadata[0] == undefined) {
          return {
            result: false,
            data: null,
            error: null
          }
        }
        return {
          result: true,
          data: assetMetadata[0],
          error: null
        }
      }      
    } catch (error) {
      return {
        result: false,
        data: null,
        error: error
      }
    }    
  }

  async function getMetadata (assetAccount: AssetAccount) {
		if (assetAccount == undefined) return;
    let request = baseURL + "assets?asset_code=" + assetAccount.code + "&asset_issuer=" + assetAccount.issuer;
		try {
			const res = await fetch(request);
      if(res.ok){
        const result =  await res.json();
        if(result?._embedded == undefined) {
          return;
        }

        assetInfo = result._embedded.records[0];
        // console.log(assetInfo._links.toml.href);
        const metaDataInfo = await fetchToml(assetInfo._links.toml.href, assetAccount.code);
        console.log(metaDataInfo);
        // return metaDataInfo;
        if(metaDataInfo && metaDataInfo.result) {
          assetMetadata = metaDataInfo.data as AssetMetaData;
          // console.log(assetMetadata);
        }
      }
		} catch (e) {
			console.log('nft metadata request error', e);
      // return {
      //   result: false,
      //   data: null,
      //   error: e
      // }
		}
	};
  
  onMount(() => {
    getMetadata(assetAccount);
	});

  let cardClass: string;
  $: cardClass = twMerge('flex w-full', $$props.class);
  $: cardClass = twMerge('flex w-full',  $$props.class, innerPadding, $$restProps.imgHoverTransform && 'img-hover', $$restProps.hoverTransform && 'hover');


	let imgCls:string;
	$:imgCls = twMerge('hover:cursor-pointer', imgClass)
</script>

<Frame tag="div" {...$$restProps} class={cardClass} on:click={() => (showModal = true)}>
  {#if assetMetadata?.image}
  <img class={imgCls} src={assetMetadata?.image} alt="product 1" />
  {:else}
  <!-- <ImagePlaceholder imgOnly class="mt-12 w-full" style={{width:'100%'}} size="lg"/> -->
 <div class="flex justify-center items-center w-full h-48 bg-gray-300 rounded dark:bg-gray-700">
    <svg width="48" height="48" class="text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512">
      <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
    </svg>
  </div>
  {/if}
  
  <!-- <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{token?.name + " #" + token?.id}</h5> -->
</Frame>
