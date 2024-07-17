import type { AssetAccount, AssetRaw, AssetStatistics, AssetFlag, AssetMetaData, links, SizeType } from '$lib/types.js';

function convertDataToAssetRaw(_data: any): AssetRaw {
  return {
    _links: _data?._links as links,
    asset_type: _data?.asset_type,
    asset_code: _data?.asset_code,
    asset_issuer: _data?.asset_issuer,
    paging_token: _data?.paging_token,
    contract_id: _data?.contract_id,
    num_accounts: _data?.num_accounts,
    accounts: _data?.accounts as AssetStatistics,
    num_claimable_balances: _data?.num_claimable_balances,
    num_contracts: _data?.num_contracts,
    num_liquidity_pools: _data?.num_liquidity_pools,
    balances: _data?.balances as AssetStatistics,
    num_archived_contracts: _data?.num_archived_contracts,
    claimable_balances_amount: _data?.claimable_balances_amount,
    contracts_amount: _data?.contracts_amount,
    liquidity_pools_amount: _data?.liquidity_pools_amount,
    archived_contracts_amount: _data?.archived_contracts_amount,
    amount: _data?.amount,
    flags: _data?.flags as AssetFlag,
  };
}

function convertDataToAssetMetadata(_data: any): AssetMetaData {
  return {
    code: _data?.code,
    issuer: _data?.issuer,
    decimals: _data?.decimals,
    anchored: _data?.anchored,
    name: _data?.name,
    desc: _data?.desc,
    image: _data?.image,
  };
}

async function fetchToml(request: string, code: string) {
  try {
    const res = await fetch(request);
    if (res.ok) {
      let result = await res.text();
      // result = result.replaceAll(" ", "");
      // console.log(result);
      const assetMetadataArray = result.split('[[CURRENCIES]]')
        .filter(Boolean) // Filter empty elements resulting from splitting
        .slice(1) // Slice away the first element, which includes VERSION and NETWORK_PASSPHRASE
        .map(entry => ({
          code: entry.match(/code\s*=\s*['"]*([^'"]*)['"]*/)?.[1],
          issuer: entry.match(/issuer\s*=\s*['"]*([^'"]*)['"]*/)?.[1],
          anchored: entry.match(/is_asset_anchored\s*=\s*['"]*(\w*)['"]*/)?.[1],
          name: entry.match(/name\s*=\s*['"]*([^'"]*)['"]*/)?.[1],
          desc: entry.match(/desc\s*=\s*['"]*([^'"]*)['"]*/)?.[1],
          image: entry.match(/image\s*=\s*['"]*([^'"]*)['"]*/)?.[1],
          decimals: entry.match(/display_decimals\s*=\s*(\d*[.]*\d*)/)?.[1]
        }));
      // console.log(assetMetadataArray);
      const assetMetadata = assetMetadataArray.filter(entry => !code || entry.code?.includes(code));
      // console.log("assetMetadata", assetMetadata);
      if (assetMetadata == undefined || assetMetadata[0] == undefined) {
        return {
          result: false,
          data: null,
          error: null
        }
      }
      return {
        result: true,
        data: assetMetadata[0],
        error: null
      }
    }
  } catch (error) {
    return {
      result: false,
      data: null,
      error: error
    }
  }
}

export async function getMetadata(baseURL: string, assetAccount: AssetAccount) {
  if (assetAccount == undefined) return;
  let request = baseURL + "assets?asset_code=" + assetAccount.code + "&asset_issuer=" + assetAccount.issuer;
  try {
    const res = await fetch(request);
    if (res.ok) {
      const result = await res.json();
      if (result?._embedded == undefined) {
        return {
          result: false,
          data: null,
          error: null
        };
      }

      const data: AssetRaw = convertDataToAssetRaw(result._embedded.records[0]);
      const metaDataInfo = await fetchToml(data?._links?.toml?.href, assetAccount?.code);
      // console.log("metadata info", metaDataInfo);
      if (metaDataInfo?.result) {
        const metadata: AssetMetaData = convertDataToAssetMetadata(metaDataInfo.data);
        return {
          result: true,
          data: {
            asset_raw: data,
            metadata: metadata
          },
          error: null
        };
      }

      return {
        result: true,
        data: {
          asset_raw: data,
          metadata: null
        },
        error: null
      };
    }
  } catch (e) {
    // console.log('nft metadata request error', e);
    return {
      result: false,
      data: null,
      error: e
    }
  }
}