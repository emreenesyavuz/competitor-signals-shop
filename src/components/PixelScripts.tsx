"use client";

import Script from "next/script";

export default function PixelScripts() {
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const pinterestTagId = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;
  const snapPixelId = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;
  const redditPixelId = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID;

  return (
    <>
      {/* ===== META (FACEBOOK) PIXEL ===== */}
      {metaPixelId && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* ===== TIKTOK PIXEL ===== */}
      {tiktokPixelId && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
              ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;
              ttq._o=ttq._o||{};ttq._o[e]=n||{};
              var a=document.createElement("script");a.type="text/javascript";a.async=!0;a.src=r+"?sdkid="+e+"&lib="+t;
              var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};
              ttq.load('${tiktokPixelId}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}

      {/* ===== PINTEREST TAG ===== */}
      {pinterestTagId && (
        <Script id="pinterest-tag" strategy="afterInteractive">
          {`
            !function(e){if(!window.pintrk){window.pintrk=function(){
            window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
            n=window.pintrk;n.queue=[],n.version="3.0";var
            t=document.createElement("script");t.async=!0,t.src=e;var
            r=document.getElementsByTagName("script")[0];
            r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
            pintrk('load', '${pinterestTagId}');
            pintrk('page');
          `}
        </Script>
      )}

      {/* ===== SNAPCHAT PIXEL ===== */}
      {snapPixelId && (
        <Script id="snap-pixel" strategy="afterInteractive">
          {`
            (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
            {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
            a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
            r.src=n;var u=t.getElementsByTagName(s)[0];
            u.parentNode.insertBefore(r,u);})(window,document,
            'https://sc-static.net/scevent.min.js');
            snaptr('init', '${snapPixelId}', {});
            snaptr('track', 'PAGE_VIEW');
          `}
        </Script>
      )}

      {/* ===== REDDIT PIXEL ===== */}
      {redditPixelId && (
        <Script id="reddit-pixel" strategy="afterInteractive">
          {`
            !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?
            p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};
            p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js";
            t.async=!0;var s=d.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(t,s)}}(window,document);
            rdt('init', '${redditPixelId}');
            rdt('track', 'PageVisit');
          `}
        </Script>
      )}
    </>
  );
}
