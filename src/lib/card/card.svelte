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
  export let reverse: boolean = false;
  export let imgClass: string = '';
  export let isMouseEntered:boolean = false;
	
	interface $$Props extends ComponentProps<Frame> {
    img?:string;
    imgClass?:string;
    reverse?: boolean;
    padding?: SizeType | 'none';
    size?: SizeType | 'none';
  }

	let innerPadding: string;
  $: innerPadding = paddings[padding];
  let cardClass: string;
  $: cardClass = twMerge('flex w-full ', sizes[size], reverse ? 'flex-col-reverse' : 'flex-col', !img && innerPadding, $$props.class);


  let imgCls: string;
  $: imgCls = twMerge(reverse ? 'rounded-b-lg' : 'rounded-t-lg', imgClass);

</script>
<Frame tag={href ? 'a' : 'div'} {...$$restProps} class={cardClass} bind:isMouseEntered><!--bind:isMouseEntered-->
  {#if img}
    <img class={imgCls} src={img} alt="" />
    <div class={innerPadding}>
      <slot />
    </div>
  {:else}
    <slot />
  {/if}
</Frame>