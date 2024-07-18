<script lang="ts">
	import { onMount, type ComponentProps} from 'svelte';
  import { twMerge } from 'tailwind-merge';

  import Frame from '$lib/frame/frame.svelte'
	import type {SizeType} from '$lib/types.js'
  
  export let reverse: boolean = false;
  export let videoClass:string = '';
  export let padding: SizeType | 'none' = 'lg';
  
  interface $$Props extends ComponentProps<Frame> {
    yutubeURL:string;
    thumnailURL:string;
    type:string;
    reverse?: boolean;
    videoClass?:string;
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

  export let yutubeURL:string = "";
  export let thumnailURL:string = "";
  export let type:string = "";

  let innerPadding: string;
  $: innerPadding = paddings[padding];
  let innerYpadding: string;
  $: innerYpadding = yPaddings[padding];

  let cardClass: string;
  // $: cardClass = twMerge('ms-card flex w-full', sizes[size], reverse ? 'flex-col-reverse' : 'flex-col', horizontal && (reverse ? 'md:flex-row-reverse' : 'md:flex-row'), $$restProps.href && 'hover:bg-gray-100 dark:hover:bg-gray-700',  $$props.class, $$restProps.hoverTransform && "hover");
  $: cardClass = twMerge('flex w-full ', reverse ? 'flex-col-reverse' : 'flex-col', $$props.class, innerPadding);

	let duration;
	let paused = true;
  let videoElement:HTMLAudioElement;


	function format(seconds:number):string {
		if (isNaN(seconds)) return '...';

		const minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
    let formattedSeconds:string = seconds < 10 ? `0${seconds}` : `${seconds}`;

		return `${minutes}:${formattedSeconds}`;
	}

  function toggleVideo(){
    if (paused) {
      videoElement.play();
      paused = false;
    }
    else {
      videoElement.pause();
      paused = true;
    }
  }

  function  enterFullscreen() {
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if ((videoElement as any).mozRequestFullScreen) { /* Firefox */
      (videoElement as any).mozRequestFullScreen();
    } else if ((videoElement as any).webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      (videoElement as any).webkitRequestFullscreen();
    } else if ((videoElement as any).msRequestFullscreen) { /* IE/Edge */
      (videoElement as any).msRequestFullscreen();
    }
  }
  // onMount(()=>{
  //   console.log($$restProps)
  // })
</script>

<Frame {...$$restProps} class={cardClass}>
  <div class={videoClass}>
    <div class="relative table h-fit">
      <div>
        <video
          poster={thumnailURL}
          src={yutubeURL}
          bind:duration
          bind:paused
          bind:this={videoElement} 
        >
          <source src={yutubeURL} {type}/>
          <track kind="captions">
        </video>
      </div>
      <div class="absolute play" style="margin-top:-6px" >
        <button on:click={toggleVideo}>
          {#if paused}
          <svg height="30" width="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path fill="rgba(0, 0, 0, 0.6)" d="M0 16C0 7.163 7.163 0 16 0s16 7.163 16 16-7.163 16-16 16S0 24.837 0 16Z"></path>
            <path fill="#fff" d="M13 10.92v10.16a1 1 0 0 0 1.573.819l7.257-5.08a1 1 0 0 0 0-1.638l-7.256-5.08a1 1 0 0 0-1.574.82Z"></path>
          </svg>
          {:else}
          <svg height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="rgba(0, 0, 0, 0.6)" d="M0 16C0 7.163 7.163 0 16 0s16 7.163 16 16-7.163 16-16 16S0 24.837 0 16Z"></path>
            <path d="M11,11 V21 H15 V11 Z M18,11 V21 H22 V11 Z" fill="white" />
          </svg>
          {/if}
        <button>
      </div>
      <div class="tool absolute">
        <div class="absolute duration"><span>{format(duration)}</span></div>
        <div class="absolute expand">
          <button on:click={enterFullscreen}>
            <span>
              <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="#fff" d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class={innerYpadding}>
    <slot/>
  </div>
</Frame>

<style>
  @import '../css/main.css';
	video {
		width: 100%;
	}

  .tool {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin:8px;
  }
  .tool .duration {
    border-radius: 16px;
    font-family: arial, sans-serif-medium, sans-serif;

    line-height: 12px;
    padding-block: 5px;
    padding-inline: 12px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    fill: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .tool .duration span {
    font-family: arial, sans-serif-medium, sans-serif;
    font-size: 10px;
    line-height: 12px;
  }
  .tool .expand {
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 14px;
    padding: 3px;
    position: absolute;
    top: 0;
    right: 0;
    z-index:2;
  }
  .tool .expand span {   
    width: 24px;
    height: 24px;
    line-height: 14px;
    display: block;
    height: 100%;
    width: 100%;
  }
  .tool .expand span svg {
    display: block;
    height: 100%;
    width: 100%;
    transform: rotate(45deg);
  }
  .play {
    left:calc(50% - 15px);
    top:calc(50% - 15px);
    z-index:2;
  }
</style>
