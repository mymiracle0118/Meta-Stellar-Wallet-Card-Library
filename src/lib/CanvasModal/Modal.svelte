<script lang='ts'>
    import TestData from './TestData';
    import type {Point} from '$lib/types.js';
    

    export let showModal:boolean;
    export let drawData:Point[][] = TestData;
    export let canvasWidth = 500;
    export let canvasHeight = 500;
    export let autoScaleWidth = false;
    export let autoScaleHeight = false;
    export let styleString:string = "";
    export let backgroundImage:string = "";

    let dialog:HTMLDialogElement; // HTMLDialogElement
    let canvas:HTMLCanvasElement;
    let ctx:CanvasRenderingContext2D;

    function normalizeData(data:Point[][], width:number, height?:number, offsetX?:number, offsetY?:number):Point[][]{

        if(!height){
            height = -1; //auto scale height
        }
        if(!offsetX){
            offsetX = 0;
        }
        if(!offsetY){
            offsetY = 0;
        }
        let smallestX = Number.MAX_VALUE;
        let bigestX = Number.MIN_VALUE;
        let smallestY = Number.MAX_VALUE;
        let bigestY = Number.MIN_VALUE;
        let outputData:Point[][] = [];
        for(let line of data){
            for(let point of line){
                if(point.x < smallestX){
                    smallestX = point.x;
                }
                if(point.x > bigestX){
                    bigestX = point.x;
                }
                if(point.y < smallestY){
                    smallestY = point.y;
                }
                if(point.y > bigestY){
                    bigestY = point.y;
                }
            }
        }

        let defaultWidth = bigestX - smallestX;
        let defaultHeight = bigestY - smallestY;
        let ratio = defaultWidth / defaultHeight;
        console.log("width", width);
        console.log("height", height);
        if(height < 2 && width < 2){
            height = defaultHeight;
            width = defaultWidth;
        }
        if(height < 2){
            height = width / ratio;
        }
        if(width < 2){
            width = height * ratio;
        }
        for(let line of data){
            let newLine:Point[] = [];
            for(let point of line){
                point.x = (((point.x - smallestX) / (bigestX - smallestX)) * width) + offsetX;
                point.y = (((point.y - smallestY) / (bigestY - smallestY)) * height) + offsetY;
                newLine.push(point);
            }
            outputData.push(newLine);
        }
        return outputData;
    }

    function renderCanvas(drawData:Point[][]){
        console.log(drawData);
        if(ctx){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            for(let line of drawData){
                ctx.beginPath();
                console.log(line[0]);
                ctx.moveTo(line[0].x, line[0].y);
                for(let i = 1; i < line.length; i++){
                    ctx.lineTo(line[i].x, line[i].y);
                }
                ctx.stroke();
            }
        }

    }


    function handleOpen(isOpen:boolean){
        if(isOpen){
            console.log("here")
            ctx = canvas.getContext('2d');
            console.log(ctx);
            let width = canvas.width-20;
            let height = canvas.height-20;
            if(autoScaleWidth){
                width = -1;
            }
            if(autoScaleHeight){
                height = -1;
            }
            drawData = normalizeData(drawData, width, height, 10, 10);
            console.log(drawData);
            renderCanvas(drawData);
        }
    }

 
	$: if (dialog && showModal){dialog.showModal()}

    $: if (dialog && showModal){handleOpen(showModal)}
</script>



<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => {showModal = false; dialog.close()}}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation>
		<slot name="header" />
		<hr />
        <div style={styleString}>
            <slot>
            
            </slot>
            <canvas bind:this={canvas} width={canvasWidth} height={canvasHeight}></canvas>
        </div>
        
		
		<hr />
		<!-- svelte-ignore a11y-autofocus -->
		<button autofocus on:click={() => dialog.close()}>close modal</button>
	</div>
</dialog>

<style>
	dialog {
		
		border-radius: 0.2em;
		border: none;
		padding: 10px;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
