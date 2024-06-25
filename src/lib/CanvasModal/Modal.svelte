<script lang='ts'>
    import {closeModal} from 'svelte-modals';
    import {onMount} from 'svelte';
    

    export let isOpen;
    export let title;
    export let message;
    export let drawData:Point[][];

    export let canvasWidth = 500;
    export let canvasHeight = 500;

    let canvas:HTMLCanvasElement;

    function normalizeData(data:Point[][], width:number, height:number, offsetX:number, offsetY:number):Point[][]{
        let smallestX = Number.MAX_VALUE;
        let bigestX = Number.MIN_VALUE;
        let smallestY = Number.MAX_VALUE;
        let bigestY = Number.MIN_VALUE;
        let outputData = [];
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
        for(let line of data){
            let newLine:Point[] = [];
            for(let point of line){
                point.x = ((point.x - smallestX) / (bigestX - smallestX) * width) + offsetX;
                point.y = ((point.y - smallestY) / (bigestY - smallestY) * height) + offsetY;
            }
            outputData.push(newLine);
        }
        return outputData;
    }

    onMount(()=>{
        let ctx = canvas.getContext('2d');
        drawData = normalizeData(drawData, canvas.width, canvas.height, 10, 10);
        if(ctx){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            for(let line of drawData){
                ctx.beginPath();
                ctx.moveTo(line[0].x, line[0].y);
                for(let i = 1; i < line.length; i++){
                    ctx.lineTo(line[i].x, line[i].y);
                }
                ctx.stroke();
            }
        }
    })

</script>
{#if isOpen}
<div role="dialog" class="modal">
    <div class="contents">
    <h2>{title}</h2>
    <p>{message}</p>
    <canvas bind:this={canvas} width="500" height="500"></canvas>
    <div class="actions">
        <button on:click={closeModal}>OK</button>
    </div>
    </div>
</div>
{/if}