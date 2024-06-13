<script lang="ts">
	import { onDestroy, type ComponentProps} from 'svelte';
	import Frame from "../frame/frame.svelte";
  import { twMerge } from 'tailwind-merge';
	import {sizes, paddings} from '$lib/constants.js';
	import type {SizeType} from '$lib/types.js'

  export let href: string | null | undefined = undefined;
  export let img: string | undefined = undefined;
  export let imgClass: string = '';
  export let padding: SizeType | 'none' = 'lg';
  export let size: SizeType | 'none' = 'sm';
  export let horizontal: boolean = false;
  export let reverse: boolean = false;
	
	interface $$Props extends ComponentProps<Frame> {
    img?: string;
    horizontal?: boolean;
    reverse?: boolean;
    padding?: SizeType | 'none';
    size?: SizeType | 'none';
  }

	let innerPadding: string;
  $: innerPadding = paddings[padding];

  let cardClass: string;
  $: cardClass = twMerge('flex w-full', sizes[size], reverse ? 'flex-col-reverse' : 'flex-col', horizontal && (reverse ? 'md:flex-row-reverse' : 'md:flex-row'), $$restProps.href && 'hover:bg-gray-100 dark:hover:bg-gray-700', !img && innerPadding, $$props.class);

  let imgCls: string;
  $: imgCls = twMerge(reverse ? 'rounded-b-lg' : 'rounded-t-lg', horizontal && 'object-cover w-full h-96 md:h-auto md:w-48 md:rounded-none', horizontal && (reverse ? 'md:rounded-e-lg' : 'md:rounded-s-lg'), imgClass);

</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
	<Frame tag={href ? 'a' : 'div'} {...$$restProps} border shadow class={cardClass}>
		{#if img}
    <img class={imgCls} src={img} alt="" />
    <div class={innerPadding}>
      <slot />
    </div>
  {:else}
    <slot />
  {/if}
	</Frame>
