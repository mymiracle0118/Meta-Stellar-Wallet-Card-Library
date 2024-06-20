<script lang="ts">
	import './style.css'
	import { onDestroy, type ComponentProps} from 'svelte';
	import {Frame} from "flowbite-svelte";
	import type {MouseTrackDataType} from '$lib/types.js'
  import { twMerge } from 'tailwind-merge';

	// defined whether mouse track is recorded or not
	export let isMouseTrackRecord: boolean = false;
	export let intervalData: number | undefined = undefined;
	export let dataURL: string | undefined = undefined;
	export let hoverTransform: boolean | undefined = undefined;
	export let isMouseEntered:boolean = false;
	export let distanceThreshold: number = 10; 
	export let timeThreshold:number = 500;

	interface $$Props extends ComponentProps<Frame> {
    isMouseTrackRecord?: boolean;
		dataURL?: string;
		intervalData?: number;
		hoverTransform?:boolean;
		distanceThreshold?:number, 
		timeThreshold?:number,
		isMouseEntered?:boolean,
  }

	let intervalId: any;

	let mouseTrackData: MouseTrackDataType[] = [];

	let countTime = 0;
	$: if (isMouseTrackRecord && intervalData != undefined && countTime != 0 && (countTime % intervalData == 0)) {
		sendMouseTrackData();
	}

	function clearMouseTrackData() {
		mouseTrackData = [];
	};

	function getCurrentTimeStamp(): number {
		const dNow = new Date();
		return dNow.valueOf(); 
	};

	async function sendMouseTrackData () {
		if (dataURL == undefined || mouseTrackData.length == 0) return;

		try {
			// console.log('mouse movement track data', mouseTrackData);
			const body = {data: JSON.stringify(mouseTrackData)};
			const res = await fetch(dataURL, {
				method:'post',
				body: JSON.stringify(body)
			});
			console.log(res);
			clearMouseTrackData();
		} catch (e) {
			console.log('request error', e);
		}
	};

	let oldData: MouseTrackDataType = {
		point: {
			x: 0,
			y: 0
		},
		timestamp: getCurrentTimeStamp()
	};

	function  getDistance ({oldData,newData}: {oldData: MouseTrackDataType,newData: MouseTrackDataType;}): number {
		return Math.sqrt(
			Math.pow(Math.abs(oldData.point.x - newData.point.x), 2) +
				Math.pow(Math.abs(oldData.point.y - newData.point.y), 2)
		);
	};

	function getTimeInterval( {oldData,newData }: {oldData: MouseTrackDataType, newData: MouseTrackDataType;}):number {
		return newData.timestamp - oldData.timestamp;
	};

	function recordMouseTrack ( oldData: MouseTrackDataType, event: MouseEvent, distanceThreshold: number, timeThreshold: number, recordingFlag: boolean) {
		if (recordingFlag) {
			const newData = {
				point: {
					x: event.clientX,
					y: event.clientY
				},
				timestamp: getCurrentTimeStamp()
			};

			const distance = getDistance({ oldData, newData });
			const timeInterval = getTimeInterval({ oldData, newData });

			if (distance >= distanceThreshold && timeInterval > timeThreshold) {
				mouseTrackData = [
					...mouseTrackData,
					{
						point: newData.point,
						timestamp: timeInterval
					}
				];
				return newData;
			}
		}
		return oldData;
	};

	let containerRef: HTMLDivElement;

	function handleMouseMove(event: Event) {
		 if (event instanceof MouseEvent ) {
        const mouseEvent = event as MouseEvent;
				if (isMouseTrackRecord) {
					const temp = recordMouseTrack(oldData, mouseEvent, distanceThreshold, timeThreshold, true);
					oldData = { point: temp.point, timestamp: temp.timestamp };
				}
				if (hoverTransform) {
					if (!containerRef || !hoverTransform) return;

					const { left, top, width, height } = containerRef.getBoundingClientRect();
					const x = (-1*(event.clientX - left - width / 2)) / 25;
					const y = (event.clientY - top - height / 2) / 25;
					containerRef.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;    
					console.log(`rotateY(${x}deg) rotateX(${y}deg)`   );
				}
    }
	}

	function handleMouseEnter() {
		// console.log('start recording of mouse movement track.')
		if (isMouseTrackRecord && intervalData && intervalData > 0) {
			intervalId = setInterval(() => {
				countTime++;
			}, 1000);
		}
		
		isMouseEntered = true;
		if (!containerRef) return;
	};

	function _clearInterval() {
		if (intervalId != null) {
			clearInterval(intervalId);
			countTime = 0;
		}
	}

	function handleMouseLeave () {
		// console.log('stop recording of mouse movement track when is out of card.');
		_clearInterval();
		isMouseEntered = false;
		if (!containerRef) return;
		containerRef.style.transform = `rotateY(0deg) rotateX(0deg)`;

	};

	onDestroy(() => {
		// console.log('stop recording of mouse movement track  when is destroyed.');
		_clearInterval();
		if (isMouseTrackRecord) {
			sendMouseTrackData();
		}
	});

	
	
	let containerClass;
	$:containerClass = twMerge('ms-frame inline-block', $$props.rounded && 'rounded-lg', hoverTransform && "hover", )

	let cardClass: string;
  $: cardClass = twMerge(' inline-block ', $$props.class);


</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div 
		class={containerClass}
		bind:this={containerRef} 
		on:mousemove={handleMouseMove}>
		<Frame {...$$restProps} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave} on:click class={cardClass}>
			<slot/>
		</Frame>
	</div>