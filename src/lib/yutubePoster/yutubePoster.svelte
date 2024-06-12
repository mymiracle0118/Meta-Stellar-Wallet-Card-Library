<script lang="ts">
	import type { ComponentProps} from 'svelte';
  import Card from '$lib/card/card.svelte'
  
  interface $$Props extends ComponentProps<Card> {
    yutubeURL:string;
    thumnailURL:string;
    type:string;
  }

  export let yutubeURL:string = "";
  export let thumnailURL:string = "";
  export let type:string = "";

  let time = 0;
	let duration;
	let paused = true;


	function format(seconds) {
		if (isNaN(seconds)) return '...';

		const minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		if (seconds < 10) seconds = '0' + seconds;

		return `${minutes}:${seconds}`;
	}
  
  let videoElement;
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
    } else if (videoElement.mozRequestFullScreen) { /* Firefox */
      videoElement.mozRequestFullScreen();
    } else if (videoElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) { /* IE/Edge */
      videoElement.msRequestFullscreen();
    }
  }
</script>

<Card {...$$restProps}>
  <div class="relative table">
    <div>
      <video
        poster={thumnailURL}
        src={yutubeURL}
        bind:duration
        bind:paused
        style="border-radius:10px"
        bind:this={videoElement} 
      >
        <source src={yutubeURL} {type}/>
      </video>
    </div>
    <div class="absolute play" style="margin-top:-6px" >
      <button on:click={toggleVideo}>
        {#if paused}
        <svg height="50" width="50" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path fill="rgba(0, 0, 0, 0.6)" d="M0 16C0 7.163 7.163 0 16 0s16 7.163 16 16-7.163 16-16 16S0 24.837 0 16Z"></path>
          <path fill="#fff" d="M13 10.92v10.16a1 1 0 0 0 1.573.819l7.257-5.08a1 1 0 0 0 0-1.638l-7.256-5.08a1 1 0 0 0-1.574.82Z"></path>
        </svg>
        {:else}
        <svg height="50" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  <div class="py-4 sm:py-6">
    <slot/>
  </div>
</Card>

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
    padding-block: 8px;
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
    font-size: 12px;
    line-height: 12px;
  }
  .tool .expand {
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    color: #fff;
    width: 30px;
    height: 30px;
    line-height: 14px;
    padding: 3px;
    position: absolute;
    top: 0;
    right: 0;
    z-index:2;
  }
  .tool .expand span {   
    height: 24px;
    line-height: 14px;
    width: 24px;
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
    left:calc(50% - 25px);
    top:calc(50% - 25px);
    z-index:2;
  }
</style>
