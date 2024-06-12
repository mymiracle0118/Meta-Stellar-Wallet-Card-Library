<script lang="ts">
	import { onDestroy, onMount, type ComponentProps} from 'svelte';
	import {Card} from "flowbite-svelte";
	import {} from 'svelte';

	import Axios from 'axios'

	// defined whether mouse track is recorded or not
	export let isMouseTrackRecord: boolean = false;
	export let intervalData: number | undefined = undefined;
	export let dataURL: string | undefined = undefined;

	interface $$Props extends ComponentProps<Card> {
    isMouseTrackRecord?: boolean;
		dataURL?: string;
		intervalData?: number;
  }

	let _intervalId: any;

	type MouseTrackDataType = {
		point: { x: number; y: number };
		timestamp: number;
	};
	let _mouseTrackData: MouseTrackDataType[] = [];

	let _timer = 0;
	$: if (isMouseTrackRecord && intervalData != undefined && _timer != 0 && (_timer % intervalData == 0)) {
		sendMouseTrackData();
	}

	function clearMouseTrackData() {
		_mouseTrackData = [];
	};

	function getCurrentTimeStamp(): number {
		const dNow = new Date();
		return dNow.valueOf(); // 1673445066359
	};

	async function sendMouseTrackData () {
		if (dataURL == undefined || _mouseTrackData.length == 0) return;
		console.log('_mouseTrackData', _mouseTrackData);
		try {
			console.log('dataURL', dataURL);
			console.log('data', _mouseTrackData);
			const res = await Axios.post(dataURL, {
				data: _mouseTrackData
			});
			
			clearMouseTrackData();
		} catch (e) {
			console.log('request error', e);
			clearMouseTrackData();
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
				_mouseTrackData = [
					..._mouseTrackData,
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
		if (isMouseTrackRecord && intervalData && intervalData > 0) {
			_intervalId = setInterval(() => {
				_timer++;
				console.log('timer', _timer);
			}, 1000);
		}
	};

	function init() {
		if (_intervalId != null) {
			clearInterval(_intervalId);
		}
		if (isMouseTrackRecord) {
			sendMouseTrackData();
		}
	}

	function handleMouseLeave () {
		init();
	};

	onDestroy(() => {
		init();
	});
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div 
  on:mouseenter={handleMouseEnter} 
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseLeave}>
	<Card {...$$restProps}>
			<slot />
	</Card>
</div>
