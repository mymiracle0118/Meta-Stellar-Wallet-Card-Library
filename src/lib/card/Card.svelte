<script lang="ts">
	import { onDestroy} from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	import {} from 'svelte';

	import Axios from 'axios'

	interface $$Props extends HTMLAnchorAttributes {
		isMouseTrackRecord?: boolean;
		dataURL?: string;
		intervalData?: number;
	}
	
	// defined whether mouse track is recorded or not
	export let isMouseTrackRecord: boolean = false;
	export let intervalData: number | undefined = undefined;
	export let dataURL: string | undefined = undefined;

	let _intervalId: any;

	type MouseTrackDataType = {
		point: { x: number; y: number };
		timestamp: number;
	};
	let _mouseTrackData: MouseTrackDataType[] = [];

	let _timer = 0;
	$: if (isMouseTrackRecord && intervalData != undefined && _timer != 0 && (_timer % intervalData == 0)) {
		console.log('call request send function');
		sendMouseTrackData();
	}

	const clearMouseTrackData = () => {
		_mouseTrackData = [];
	};

	const getCurrentTimeStamp = (): number => {
		const dNow = new Date();
		return dNow.valueOf(); // 1673445066359
	};

	const sendMouseTrackData = async () => {
		if (dataURL == undefined || _mouseTrackData.length == 0) return;
		
		try {
			console.log('dataURL', dataURL);
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

	const getDistance = ({
		oldData,
		newData
	}: {
		oldData: MouseTrackDataType;
		newData: MouseTrackDataType;
	}): number => {
		return Math.sqrt(
			Math.pow(Math.abs(oldData.point.x - newData.point.x), 2) +
				Math.pow(Math.abs(oldData.point.y - newData.point.y), 2)
		);
	};

	const getTimeInterval = ({
		oldData,
		newData
	}: {
		oldData: MouseTrackDataType;
		newData: MouseTrackDataType;
	}) => {
		return newData.timestamp - oldData.timestamp;
	};

	const recordMouseTrack = (
		oldData: MouseTrackDataType,
		event: MouseEvent,
		distanceThreshold: number,
		timeThreshold: number,
		recordingFlag: boolean
	): MouseTrackDataType => {
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

	function handleMouseMove(event: MouseEvent): void {
		if (isMouseTrackRecord) {
			const temp = recordMouseTrack(oldData, event, 10, 500, true);
			oldData = { point: temp.point, timestamp: temp.timestamp };
		}
	}

	const handleMouseEnter = () => {
		if (isMouseTrackRecord && intervalData && intervalData > 0) {
			_intervalId = setInterval(() => {
				_timer++;
				console.log('timer', _timer);
				console.log('_mouseTrackData', _mouseTrackData);
			}, 1000);
		}
	};

	const init = () => {
		
		if (_intervalId != null) {
			console.log('clear interval when init');
			clearInterval(_intervalId);
		}
		if (isMouseTrackRecord) {
			console.log('send mouse track when init');
			sendMouseTrackData();
		}
	}

	const handleMouseLeave = () => {
		init();
	};

	onDestroy(() => {
		init();
	});
</script>

<svelte:element this="div" 
  on:click  
  on:mouseenter={handleMouseEnter} 
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseLeave}>
	  <slot />
</svelte:element>
