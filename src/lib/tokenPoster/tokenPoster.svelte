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

  export let token: NFTToken | undefined = undefined;
  export let nft_metadata: NFTMetadata | undefined = undefined;
  export let metadata_url: string;
  export let imgClass: string |undefined = undefined;

	interface $$Props extends ComponentProps<Frame> {
    token: NFTToken;
    metadata_url: string;
    imgClass?:string;
	}


  let cardClass: string;
  $: cardClass = twMerge('flex w-full', $$props.class);


	let imgCls:string;
	$:imgCls = twMerge('hover:cursor-pointer', imgClass)

  async function getMetadata (metadata_url: string) {
		if (metadata_url == undefined) return;

		try {
			const res = await fetch(metadata_url);
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
    getMetadata(metadata_url);
	});

</script>

<Frame tag="div" {...$$restProps} class={cardClass} on:click={() => (showModal = true)}>
  {#if nft_metadata?.image_url}
  <img class={imgCls} src={nft_metadata?.image_url} alt="product 1" />
  {:else}
  <ImagePlaceholder imgOnly class="mt-12" />
  {/if}
  <div class="px-5 pb-5">
  <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{token?.name + " #" + token?.id}</h5>
</Frame>
