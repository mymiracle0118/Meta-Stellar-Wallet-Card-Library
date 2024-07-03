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
  export let padding: SizeType | 'none' = 'lg';

	interface $$Props extends ComponentProps<Frame> {
    img?: string;
		imgClass?:string;
    padding?: SizeType | 'none';
    size?: SizeType | 'none';
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
 	let cardClass: string;
  $: cardClass = twMerge('flex w-full', $$props.class, innerPadding);

	let imgCls:string;
	$:imgCls = twMerge('hover:cursor-pointer', imgClass, )

</script>

<Frame tag="div" {...$$restProps} class={cardClass} on:click={() => (showModal = true)}>
	<img class={imgCls} src={img} alt="" />
</Frame>
<Modal bind:showModal>
	<img class="" src={img} alt="" />
</Modal>