<script lang="ts">
	import { onDestroy, type ComponentProps} from 'svelte';
	import Frame from "../frame/frame.svelte";
  import { twMerge } from 'tailwind-merge';
	import {sizes, paddings} from '$lib/constants.js';
	import type {SizeType} from '$lib/types.js'

  export let href: string | null | undefined = undefined;
  export let img: string | undefined = undefined;
  export let padding: SizeType | 'none' = 'lg';
  export let size: SizeType | 'none' = 'sm';
  export let horizontal: boolean = false;
  export let reverse: boolean = false;
  export let isMouseEntered:boolean = false;
	
	interface $$Props extends ComponentProps<Frame> {
    horizontal?: boolean;
    reverse?: boolean;
    padding?: SizeType | 'none';
    size?: SizeType | 'none';
  }

	let innerPadding: string;
  $: innerPadding = paddings[padding];
  let cardClass: string;
  $: cardClass = twMerge('flex w-full ', sizes[size], reverse ? 'flex-col-reverse' : 'flex-col', horizontal && (reverse ? 'md:flex-row-reverse' : 'md:flex-row'), $$restProps.href && 'hover:bg-gray-100 dark:hover:bg-gray-700', !img && innerPadding, $$props.class);

</script>
<div  >
<Frame tag={href ? 'a' : 'div'} {...$$restProps} border shadow class={cardClass} bind:isMouseEntered>
  <div style="perspective: 1000px;">
    <slot />
  </div>
</Frame>
</div>