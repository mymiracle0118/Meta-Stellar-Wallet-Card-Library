<script lang="ts">
  import Card from '$lib/card/Card.svelte'
</script>
<Card img="/images/test.png" isMouseTrackRecord={true} dataURL="http://localhost/api" intervalData={5}>
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Meta stellar card title</h5>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">Meta stellar card content.</p>
</Card>