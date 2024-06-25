<script lang="ts">
	import type {  ComponentProps} from 'svelte';
  import { twMerge } from 'tailwind-merge';
	import Frame from "../frame/frame.svelte";
	import type {SizeType} from '$lib/types.js'
	import {sizes} from '$lib/constants.js';
	import Modal from './imageModal.svelte';

	let showModal = false;

	export let img: string | undefined = undefined;
	export let imgClass: string | undefined = undefined;

	interface $$Props extends ComponentProps<Frame> {
    img?: string;
		imgClass?:string;
    padding?: SizeType | 'none';
    size?: SizeType | 'none';
	}

 	let cardClass: string;
  $: cardClass = twMerge('flex w-full', $$props.class);

	let imgCls:string;
	$:imgCls = twMerge('hover:cursor-pointer', imgClass)

</script>

<Frame tag="div" {...$$restProps} class={cardClass} on:click={() => (showModal = true)}>
	<img class={imgCls} src={img} alt="" />
</Frame>
<Modal bind:showModal>
	<img class="" src={img} alt="" />
</Modal>