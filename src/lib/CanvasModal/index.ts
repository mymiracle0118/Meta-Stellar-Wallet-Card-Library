
import { openModal } from 'svelte-modals'
import CanvasModal from './Modal.svelte';
import type {Point, DrawData} from '$lib/types.ts';



const openCanvasModal = function(Title:string, messege:string) {
  console.log("openCanvasModal");
  console.log("function called");
  openModal(CanvasModal, {title: Title, messege: messege});
}

export { openCanvasModal, CanvasModal};