
import { openModal } from 'svelte-modals'
import CanvasModal from './Modal.svelte';
import type {Point, DrawData} from '$lib/types.ts';



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
export { normalizeData, renderCanvas};