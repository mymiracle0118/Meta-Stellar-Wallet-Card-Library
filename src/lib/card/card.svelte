<script lang="ts">
	import { type ComponentProps} from 'svelte';
	import Frame from "../frame/frame.svelte";
  import { twMerge } from 'tailwind-merge';
  import type { SizeType } from '$lib/types.js';

  export let href: string | null | undefined = undefined;
  export let img: string | undefined = undefined;
  export let reverse: boolean = false;
  export let imgClass: string = '';
  export let isMouseEntered:boolean = false;
  export let padding: SizeType | 'none' = 'lg';

	
	interface $$Props extends ComponentProps<Frame> {
    img?:string;
    imgClass?:string;
    reverse?: boolean;
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
  let cardClass: string;
  $: cardClass = twMerge('flex w-full  ', reverse ? 'flex-col-reverse ' : 'flex-col', $$props.class, innerPadding, $$restProps.imgHoverTransform && 'img-hover', $$restProps.hoverTransform && 'hover');

</script>
<Frame tag={href ? 'a' : 'div'} {...$$restProps} class={cardClass} bind:isMouseEntered><!--bind:isMouseEntered-->
  {#if img}
    <img class={imgClass} src={img} alt="" />
    <div class={innerYpadding}>
      <slot />
    </div>
  {:else}
    <slot />
  {/if}
</Frame>