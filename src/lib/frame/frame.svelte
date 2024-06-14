<script lang="ts">
	import { onDestroy, type ComponentProps} from 'svelte';
	import {Frame} from "flowbite-svelte";
	import type {MouseTrackDataType} from '$lib/types.js'

	// defined whether mouse track is recorded or not
	export let isMouseTrackRecord: boolean = false;
	export let intervalData: number | undefined = undefined;
	export let dataURL: string | undefined = undefined;

	interface $$Props extends ComponentProps<Frame> {
    isMouseTrackRecord?: boolean;
		dataURL?: string;
		intervalData?: number;
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
			console.log('mouse movement track data', mouseTrackData);
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

	function handleMouseMove(event: Event) {
		 if (event instanceof MouseEvent && isMouseTrackRecord) {
        const mouseEvent = event as MouseEvent;

        const temp = recordMouseTrack(oldData, mouseEvent, 10, 500, true);
        oldData = { point: temp.point, timestamp: temp.timestamp };
    }
	}

	function handleMouseEnter() {
		console.log('start recording of mouse movement track.')
		if (isMouseTrackRecord && intervalData && intervalData > 0) {
			intervalId = setInterval(() => {
				countTime++;
			}, 1000);
		}
	};

	function _clearInterval() {
		if (intervalId != null) {
			clearInterval(intervalId);
			countTime = 0;
		}
	}

	function handleMouseLeave () {
		console.log('stop recording of mouse movement track when is out of card.');
		_clearInterval()
	};

	onDestroy(() => {
		console.log('stop recording of mouse movement track  when is destroyed.');
		_clearInterval();
		if (isMouseTrackRecord) {
			sendMouseTrackData();
		}
	});
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="inline-block"  on:mousemove={handleMouseMove}>
	<Frame  {...$$restProps} rounded shadow border  on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave} on:click>
		<slot/>
	</Frame>
</div>
