<script lang='ts'>
    import {Search,  Button, Listgroup, ListgroupItem, Rating} from "flowbite-svelte";
    import {xlm_display} from '$lib/constants.js';
    import * as StellarSdk from '@stellar/stellar-sdk';
    import type {DispAsset} from '$lib/types.js';
    export let ownedAssets:Array<DispAsset> = [];
    export let selectedAsset:StellarSdk.Asset | undefined = undefined;
    export let selectedAssetDisp:DispAsset = xlm_display;
    export let network:'testnet'|'mainnet' = 'mainnet';
    export let onlyOwnedAssets = false;
    export let onSelected:Function = ()=>{};
    const stellarImage = "https://upload.wikimedia.org/wikipedia/commons/5/56/Stellar_Symbol.png";
    let DropdownOpen = false;
    let assetSelected = false;
    let preventClose = false;
    if(selectedAssetDisp){
        assetSelected = true;
    }
    
    let currentSearch:string = "";
    

    let assetResults:Array<DispAsset> = [...ownedAssets, xlm_display]
    function getAssetDisp(asset:any){
        let image:string;
        let code:string;
        let domain:string;
        let assetId: string;
        let supply: number;
        let price: Array<number[]>;
        // console.log("getAssetDisp", asset);
        if(asset.tomlInfo !== undefined){
            image = asset.tomlInfo.image;
            code = asset.tomlInfo.code;
        }
        else{
            image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQErufEdC325ECfUANYh7lzYRbsQxI67-xbjj3kfbovEQ&s"
            code = asset.asset.split('-')[0];
        }
        // console.log("asset selector asset is");
        // console.log("get asset", asset);
        domain = asset.domain;
        assetId = asset.asset.split('-')[1];
        supply = asset.supply;
        price = asset.price7d;
        
        return {image, code, domain, asset:assetId, price:price, supply:supply, score:asset.rating.trustlines}
    }

    async function search_asset(search:string, network:"mainnet"|"testnet"|'public'){
        if(network === 'mainnet'){
            network = 'public';
        }
        const url = 'https://api.stellar.expert/explorer/';
        // console.log("here in search asset");
        if(onlyOwnedAssets){
            return [];
        }
        const res = await fetch(url+`${network}/asset?search=${search}&limit=8&sort=trustlines`);
        console.log(res);
        const results:any = []

        console.log(results);
        if(res.ok){
            const json =  await res.json();
            console.log(json);
            const asset_list = json._embedded.records as Array<any>;
            console.log(asset_list);
            results.push(...asset_list);
            console.log(results);
            return results;
        }
    }
    function handleSearchComplete(results:any){
        let outputArray = [xlm_display]
        for(let asset of results){
            outputArray.push(getAssetDisp(asset));
        }
        outputArray.push(...ownedAssets);
        // console.log("search complete setting output array");
        DropdownOpen = true
        assetResults = outputArray;
        console.log(outputArray);
        console.log(assetResults);
    }
    function handleInputChange(){
        console.log("inputchange");
        search_asset(currentSearch, network).then(handleSearchComplete)
    }
    function assetSelectFactory(assetdisp:DispAsset){
        const handleAssetSelect =  function(e:any){
            console.log(e);
            e.preventDefault();
            e.stopPropagation();
            // console.log("asset is: ");
            console.log(assetdisp.asset)
            console.log(assetdisp);
            selectedAsset = new StellarSdk.Asset(assetdisp.code, assetdisp.asset)
            console.log(selectedAsset);
            assetSelected = true;
            selectedAssetDisp = assetdisp;
            DropdownOpen = false;
            console.log(selectedAsset);
            currentSearch = "";
            onSelected(selectedAsset, assetdisp);
        }
        return handleAssetSelect
    }
</script>


<div class="relative">
<div class="flex flex-row w-full">

    {#if assetSelected}
    <div style="flex:3;">
        <button class="button" color="light" style="width:100%;">
            <div class="flex flex-row space-x-4">
            <img height="20" width="20" alt={selectedAssetDisp.code+" logo"} src={selectedAssetDisp.image}/>
            <p>{selectedAssetDisp.code}</p>
            </div>
        </button>
    </div>
    {/if}
    <div style="flex:1;">
        <input class="input w-full"  placeholder="search by address, name, or domain"  on:focus={()=>{assetSelected = false; DropdownOpen=true;}} on:keyup={handleInputChange} bind:value={currentSearch} on:blur={()=>preventClose?null:DropdownOpen=false}/>
    </div>
</div>
{#if DropdownOpen}

    <div class="w-full flex-col absolute h-48 pb-4 bg-slate-300 rounded popup">
    <ul class="list absolute w-full h-44 z-10 overflow-y-scroll">
    {#each assetResults as assetdisp}
        <li style="text-align:left;">
            <button color="light" type="button" class="button z-10" on:mouseenter={()=>preventClose=true} on:mouseleave={()=>preventClose=false} on:click={assetSelectFactory(assetdisp)}>
            <div class='flex-col justify-start'>
                <div class='flex space-x-4'>
                    <img height="20" width="20" src={assetdisp.image}/>
                    <p>{assetdisp.code}</p>
                    <Rating id="example-1" total={10} count size={20} rating={Number.parseFloat(assetdisp.score.toFixed(1))} />
                </div>
                <p style="text-align:left;">{assetdisp.domain}</p>
            </div>
            </button>
        </li>
    {/each}
    <ul/>
    </div>

{/if}
</div>

<style>
   @import '../css/main.css';
   /**^^^^^   Universal CSS librarys ^^^^**/
   /**local css**/
   input{
        flex-grow:3;
        height: 100%;
   }

</style>