import type { DispAsset, SizeType } from "$lib/types.js";

export const xlm_display: DispAsset = {
  image:
    "https://upload.wikimedia.org/wikipedia/commons/5/56/Stellar_Symbol.png",
  asset: "native",
  code: "XLM",
  domain: "stellar.org",
  score: 10,
  supply: "28271090270",
};

export const paddings: Record<SizeType | "none", string> = {
  none: "",
  xs: "p-2",
  sm: "p-4",
  md: "p-4 sm:p-5",
  lg: "p-4 sm:p-6",
  xl: "p-4 sm:p-8",
};

export const sizes: Record<SizeType | "none", string> = {
  none: "",
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-screen-xl",
};