<script lang="ts">
	import type {  ComponentProps} from 'svelte';
  import { ImagePlaceholder } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { twMerge } from 'tailwind-merge';
	import Frame from "../frame/frame.svelte";
	import type {SizeType, AssetAccount, AssetRaw, AssetMetaData} from '$lib/types.js';
	import {sizes, baseURL} from '$lib/constants.js';

	let showModal = false;

  export let size: SizeType | 'none' = 'sm';
  export let assetAccount: AssetAccount;

	interface $$Props extends ComponentProps<Frame> {
    assetAccount: AssetAccount;
    padding?: SizeType | 'none';
    size?: SizeType | 'none';
	}

 	let cardClass: string;
  $: cardClass = twMerge('flex w-full', sizes[size], 'flex-col', $$props.class);
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

</script>

<Frame tag="div" {...$$restProps} border shadow class={cardClass} on:click={() => (showModal = true)}>
  {#if assetMetadata?.image}
  <img class="rounded-t-lg p-4" src={assetMetadata?.image} alt="product 1" />
  {:else}
  <ImagePlaceholder imgOnly class="mt-12" />
  {/if}
  
  <div class="px-5 pb-5">
  <!-- <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{token?.name + " #" + token?.id}</h5> -->
</Frame>
