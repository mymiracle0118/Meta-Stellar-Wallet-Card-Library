<script>
    export let title = "metastellar";
</script>
<div>
<div class="container">
    <h1>Metastellar.io</h1>
    <div class="content">
        <slot></slot>
    </div>
</div>
<hr>
</div>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Playwrite+NG+Modern:wght@100..400&family=Raleway:ital,wght@0,100..900;1,100..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap');
     
    .container{

        
        padding: 0.4em;
    }

    h1{
        font-size: 4em;
        font-family: "Raleway", sans-serif;
        font-optical-sizing: auto;
        font-weight: 500;
        font-style: normal;
    }

    .content{
        font-size: 2em;
        
        
        font-family: "Work Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 300;
        font-style: normal;
        
        
    }


</style>