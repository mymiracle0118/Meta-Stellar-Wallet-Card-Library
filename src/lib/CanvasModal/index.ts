
import { openModal } from 'svelte-modals'
import Modal from './Modal.svelte';
import type {Point, DrawData} from '$lib/types.ts';



export function openCanvasModal(Title:string, messege:string, drawData:DrawData) {
  openModal(Modal, {title: Title, messege: messege, drawData: drawData});
}