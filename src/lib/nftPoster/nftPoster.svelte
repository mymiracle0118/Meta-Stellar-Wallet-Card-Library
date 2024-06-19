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
    try {
      const res = await fetch(request);
      if(res.ok) {
        const result = await res.text();
        const assetMetadataArray = result.split('[[CURRENCIES]]')
        .filter(Boolean) // Filter empty elements resulting from splitting
        .slice(1) // Slice away the first element, which includes VERSION and NETWORK_PASSPHRASE
        .map(entry => ({
          code: entry.match(/code = '[^']+'/)?.[0].replace('code = ', '').replace(/'/g, ""),
          issuer: entry.match(/issuer = '[^']+'/)?.[0].replace('issuer = ', '').replace(/'/g, ""),
          decimals: entry.match(/display_decimals = (\d+\.\d+)/)?.[1].replace(/'/g, ""),
          anchored: entry.match(/is_asset_anchored = (true|false)/)?.[1] === 'true',
          name: entry.match(/name = '[^']+'/)?.[0].replace('name = ', '').replace(/'/g, ""),
          desc: entry.match(/desc = '[^']+'/)?.[0].replace('desc = ', '').replace(/'/g, ""),
          image: entry.match(/image = '[^']+'/)?.[0].replace('image = ', '').replace(/'/g, "")
        }));
        const assetMetadata = assetMetadataArray.filter(entry => !code || entry.code?.includes(code));
        // console.log("assetMetadata", assetMetadata);
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
        console.log(assetInfo._links.toml.href);
        const metaDataInfo = await fetchToml(assetInfo._links.toml.href, assetAccount.code);
        // return metaDataInfo;
        if(metaDataInfo && metaDataInfo.result) {
          assetMetadata = metaDataInfo.data as AssetMetaData;
          console.log(assetMetadata);
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
