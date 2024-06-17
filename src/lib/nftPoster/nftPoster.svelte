<script lang="ts">
	import type {  ComponentProps} from 'svelte';
  import { ImagePlaceholder } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { twMerge } from 'tailwind-merge';
	import Frame from "../frame/frame.svelte";
	import type {SizeType} from '$lib/types.js';
  import type {NFTToken, NFTMetadata} from '$lib/types.js';
	import {sizes} from '$lib/constants.js';

	let showModal = false;

  export let size: SizeType | 'none' = 'sm';
  export let token: NFTToken | undefined = undefined;
  export let nft_metadata: NFTMetadata | undefined = undefined;
  export let metadataURL: string;

	interface $$Props extends ComponentProps<Frame> {
    token: NFTToken;
    metadataURL: string;
    padding?: SizeType | 'none';
    size?: SizeType | 'none';
	}

 	let cardClass: string;
  $: cardClass = twMerge('flex w-full', sizes[size], 'flex-col', $$props.class);

  async function getMetadata (metadataURL: string) {
		if (metadataURL == undefined) return;

		try {
			const res = await fetch(metadataURL);
      if(res.ok){
        const result =  await res.json();
        nft_metadata = result as NFTMetadata;
        console.log(nft_metadata);
      }
		} catch (e) {
			console.log('nft metadata request error', e);
		}
	};
  
  onMount(() => {
    getMetadata(metadataURL);
	});

</script>

<Frame tag="div" {...$$restProps} border shadow class={cardClass} on:click={() => (showModal = true)}>
  {#if nft_metadata?.image_url}
  <img class="rounded-t-lg p-4" src={nft_metadata?.image_url} alt="product 1" />
  {:else}
  <ImagePlaceholder imgOnly class="mt-12" />
  {/if}
  
  <div class="px-5 pb-5">
  <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{token?.name + " #" + token?.id}</h5>
</Frame>
