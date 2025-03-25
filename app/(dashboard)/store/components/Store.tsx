"use client";

import { useEffect } from "react";

export default function Store() {
  useEffect(() => {
    if (document.getElementById("cashcow-script") === null) {
      const scriptTag = document.createElement("script");
      scriptTag.setAttribute("id", "cashcow-script");
      scriptTag.src = "https://media.cashcow.co.il/scripts/cashcowstr.js";
      scriptTag.addEventListener("load", () => {
        const cashcow = (window as any).cashcow;
        cashcow.StoreId = 7466;
        cashcow.Version = 1;
        cashcow.StartAction = {};
        cashcow.Design.ShowBanner = "false";
        cashcow.Design.IsHideAboutUsDetails = "true";
        cashcow.Design.IsShowBuyButtons = "false";
        cashcow.Design.ShowFacebookComments = "false";
        cashcow.Design.ShowRelatedProducts = "false";
        cashcow.Design.BackgroundColor = "transparent";
        cashcow.Design.RightNavBackColor = "transparent";
        cashcow.Design.TopNavBackColor = "transparent";
        cashcow.Design.TopNavColor = "#ffffff";
        cashcow.Design.RightNavColor = "#000000";
        cashcow.Design.RightNavColorSelected = "#2eac68";
        cashcow.Design.RightNavHoverBack = "#2eac68";
        cashcow.Design.CartBackColor = "#2eac68";
        cashcow.Design.ProductsBackColor = "transparent";
        cashcow.Design.BordersColor = "#2eac68";
        cashcow.Design.TitlesColor = "#2eac68";
        cashcow.Design.PriceColor = "#2eac68";
        cashcow.Design.TextColor = "#3c3c3b";
        cashcow.Generate("cc_store_cont");
      });
      document.body.appendChild(scriptTag);
    }
  }, []);

  return (
    <div className="h-full overflow-hidden md:rounded-xl">
      <div id="cc_store_cont" className="h-full overflow-y-auto"></div>
    </div>
  );
}
