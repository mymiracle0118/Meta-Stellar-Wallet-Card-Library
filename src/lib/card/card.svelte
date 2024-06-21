<script lang="ts">
	import { type ComponentProps} from 'svelte';
	import Frame from "../frame/frame.svelte";
  import { twMerge } from 'tailwind-merge';

  export let href: string | null | undefined = undefined;
  export let img: string | undefined = undefined;
  export let reverse: boolean = false;
  export let imgClass: string = '';
  export let bodyClass: string = '';
  export let isMouseEntered:boolean = false;
	
	interface $$Props extends ComponentProps<Frame> {
    img?:string;
    imgClass?:string;
    bodyClass?:string;
    reverse?: boolean;
  }

  let cardClass: string;
  $: cardClass = twMerge('flex w-full ', reverse ? 'flex-col-reverse' : 'flex-col', $$props.class);

</script>
<Frame tag={href ? 'a' : 'div'} {...$$restProps} class={cardClass} bind:isMouseEntered><!--bind:isMouseEntered-->
  {#if img}
    <img class={imgClass} src={img} alt="" />
    <div class={bodyClass}>
      <slot />
    </div>
  {:else}
    <slot />
  {/if}
</Frame>