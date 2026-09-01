---
title: "Third-party Libraries (ပြင်ပ Library များ)"
description: "Zustand ရဲ့ feature set ကို တိုးချဲ့ပေးနိုင်တဲ့ community က ဖန်တီးထားတဲ့ third-party libraries များစာရင်း"
order: 17
source: "https://zustand.docs.pmnd.rs/reference/integrations/third-party-libraries"
status: translated
updated: 2026-09-01
---

Zustand က state management အတွက် "bear necessities" (လိုအပ်ချက်အခြေခံတွေ) ကို ပံ့ပိုးပေးပါတယ်။ Project အများစုအတွက် အကောင်းဆုံး ဖြစ်ပေမယ့် — တချို့ သုံးစွဲသူတွေက library ရဲ့ feature set ကို ထပ်တိုးချင်ကြပါတယ်။ ဒါကို community က ဖန်တီးထားတဲ့ third-party libraries တွေနဲ့ လုပ်နိုင်ပါတယ်။

> **သတိပြုရန်:** ဒီ libraries တွေမှာ bugs တွေ၊ ပြုပြင်ထိန်းသိမ်းမှု အကန့်အသတ်တွေ ဒါမှမဟုတ် တခြား ကန့်သတ်ချက်တွေ ရှိနိုင်ပြီး — pmndrs ဒါမှမဟုတ် Zustand maintainers တွေက တရားဝင် အကြံပြုထားတာ မဟုတ်ပါဘူး။ ဒီစာရင်းက Zustand ရဲ့ feature set ကို တိုးချဲ့ချင်သူတွေအတွက် စတင်ဖို့ ကောင်းတဲ့ နေရာတစ်ခု ဖြစ်စေဖို့ ရည်ရွယ်ပါတယ်။

- [@colorfy-software/zfy](https://colorfy-software.gitbook.io/zfy/) — 🧸 React နဲ့ Zustand သုံးပြီး state management လုပ်ရာမှာ အသုံးဝင်တဲ့ helper များ။
- [@csark0812/zustand-expo-devtools](https://github.com/csark0812/zustand-expo-devtools) — 🧭 Official Expo DevTools plugin system ကို သုံးပြီး Expo + React Native မှာ Zustand ကို Redux DevTools နဲ့ ချိတ်ဆက်ပေးတာပါ။
- [@csark0812/zustand-getters](https://github.com/csark0812/zustand-getters) — 🔄 Zustand stores တွေမှာ JavaScript object getters တွေကို reactive ဖြစ်အောင် လုပ်ပေးပါတယ် — `get propertyName()` နဲ့ derived values တွေကို သတ်မှတ်ပြီး access လုပ်လိုက်တာနဲ့ subscription updates တွေကို အလိုအလျောက် trigger လုပ်ပေးပါတယ်။
- [@davstack/store](https://www.npmjs.com/package/@davstack/store) — get/set/use methods တွေပါတဲ့ selectors တွေကို အလိုအလျောက် ထုတ်ပေးပြီး inferred types တွေကို ထောက်ပံ့ပေးကာ global / local state management ကို လွယ်ကူစေတဲ့ zustand store factory တစ်ခုပါ။
- [@dhmk/zustand-lens](https://github.com/dhmk083/dhmk-zustand-lens) — Zustand အတွက် Lens support ပါ။
- [@hpkv/zustand-multiplayer](https://github.com/hpkv-io/zustand-multiplayer/tree/main/packages/zustand-multiplayer) — Realtime collaborative applications တွေ တည်ဆောက်ဖို့ HPKV multiplayer middleware ပါ။
- [@liveblocks/zustand](https://github.com/liveblocks/liveblocks/tree/main/packages/liveblocks-zustand) — Application ကို multiplayer ဖြစ်အောင် လုပ်ပေးတဲ့ Liveblocks middleware ပါ။
- [@prncss-xyz/zustand-optics](https://github.com/prncss-xyz/zustand-optics) — [optics-ts](https://github.com/akheron/optics-ts) အတွက် adapter တစ်ခုပါ။
- [auto-zustand-selectors-hook](https://github.com/Albert-Gao/auto-zustand-selectors-hook) — TypeScript support နဲ့ Zustand hooks တွေကို အလိုအလျောက် ထုတ်ပေးတာပါ။
- [derive-zustand](https://github.com/zustandjs/derive-zustand) — တခြား Zustand stores တွေကနေ derived Zustand store တစ်ခုကို ဖန်တီးပေးတဲ့ function တစ်ခုပါ။
- [geschichte](https://github.com/BowlingX/geschichte) — Query parameters တွေကို စီမံဖို့ Zustand နဲ့ Immer အခြေခံတဲ့ hook တစ်ခုပါ။
- [leiten-zustand](https://github.com/hecmatyar/leiten-zustand) — Requests တွေနဲ့ data transformation အတွက် boilerplate တွေကနေ store ကို ရှင်းလင်းပေးပါတယ်။
- [leo-query](https://github.com/steaks/leo-query) — Async queries တွေကို Zustand stores တွေနဲ့ ချိတ်ဆက်ပေးတဲ့ ရိုးရှင်းတဲ့ library တစ်ခုပါ။
- [mobz](https://github.com/2A5F/Mobz) — Zustand ပုံစံ MobX API တစ်ခုပါ။
- [ngx-zustand](https://github.com/JoaoPauloLousada/ngx-zustand) — Angular အတွက် Zustand adapter တစ်ခုပါ။
- [persist-and-sync](https://github.com/mayank1513/persist-and-sync) — Tabs/windows/iframes များကြားမှာ same origin နဲ့ Zustand state တွေကို အလွယ်တကူ persist လုပ်ပြီး sync လုပ်ပေးတဲ့ Zustand middleware ပါ။
- [shared-zustand](https://github.com/Tom-Julux/shared-zustand) — Zustand အတွက် cross-tab state sharing ပါ။
- [simple-zustand-devtools](https://github.com/beerose/simple-zustand-devtools) — 🐻⚛️ React DevTools ထဲမှာ သင့် Zustand store ကို စစ်ဆေးကြည့်ရှုနိုင်ပါတယ်။
- [solid-zustand](https://github.com/wobsoriano/solid-zustand) — Solid မှာ Zustand သုံးပြီး state management လုပ်ခြင်းပါ။
- [treeshakable](https://github.com/react18-tools/treeshakable) — Library creators တွေ အတွက် ထပ်ခါထပ်ခါ store ဖန်တီးမှုတွေ ရှောင်ရှားနိုင်အောင် လုပ်ပေးတဲ့ wrapper တစ်ခုပါ။
- [use-broadcast-ts](https://github.com/Romainlg29/use-broadcast) — Tabs များကြားမှာ state ကို မျှဝေပေးတဲ့ Zustand middleware ပါ။
- [use-post-message-ts](https://github.com/paulschoen/use-post-message) — Browser ရဲ့ postMessage method ကတစ်ဆင့် cross-origin iframes များကြားမှာ state မျှဝေပေးတဲ့ Zustand middleware ပါ။
- [use-zustand](https://github.com/zustandjs/use-zustand) — Zustand vanilla store ကို သုံးဖို့ နောက်ထပ် custom hook တစ်ခုပါ။
- [vue-zustand](https://github.com/wobsoriano/vue-zustand) — Zustand ကို အခြေခံထားတဲ့ Vue အတွက် state management solution တစ်ခုပါ။
- [zoov](https://github.com/InfiniteXyy/zoov) — Module နဲ့ဆင်တဲ့ (Module-like) API တစ်ခုပါတဲ့ Zustand အခြေခံ state management solution တစ်ခုပါ။
- [zubridge](https://github.com/goosewobbler/zubridge) — Cross-platform apps တွေမှာ Zustand ကို ချောမွေ့စွာ သုံးနိုင်အောင် လုပ်ပေးပါတယ်။ Electron & Tauri တို့ကို ထောက်ပံ့ပေးပါတယ်။
- [zukeeper](https://github.com/oslabs-beta/Zukeeper) — State နဲ့ action tracking, diffing, tree display နဲ့ time travel ပါတဲ့ native devtools တစ်ခုပါ။
- [zundo](https://github.com/charkour/zundo) — 🍜 Zustand အတွက် undo နဲ့ redo middleware — apps တွေမှာ time-travel လုပ်နိုင်အောင် လုပ်ပေးပါတယ်။
- [zustand-ards](https://github.com/ivoilic/zustand-ards) — 💁 ဥပမာအနေနဲ့ alternative selector formats တွေနဲ့ default shallow hooks တွေအတွက် ရိုးရှင်းပြီး opinionated utilities တွေပါ။
- [zustand-async-slice](https://github.com/mym0404/zustand-async-slice) — Async Slice ဖန်တီးဖို့ ရိုးရှင်းတဲ့ Zustand utility တစ်ခုပါ။ TypeScript ကို အပြည့်အဝ ထောက်ပံ့ပေးပါတယ် 🖖
- [zustand-boilerplate](https://github.com/sagiereder/zustand-boilerplate) — သင့် zustand store အတွက် getters, setters နဲ့ အခြားအရာတွေကို အလိုအလျောက် ထုတ်ပေးတဲ့ tool တစ်ခုပါ။
- [zustand-computed](https://github.com/chrisvander/zustand-computed) — Computed states တွေ ဖန်တီးဖို့ Zustand middleware တစ်ခုပါ။
- [zustand-computed-state](https://github.com/yasintz/zustand-computed-state) — Computed states တွေ ထည့်ဖို့ ရိုးရှင်းတဲ့ middleware တစ်ခုပါ။
- [zustand-constate](https://github.com/ntvinhit/zustand-constate) — Zustand ကို အခြေခံပြီး Constate ရဲ့ အကြံဉာဏ်တွေကို ယူထားတဲ့ context-based state management တစ်ခုပါ။
- [zustand-context](https://github.com/fredericoo/zustand-context) — React Context ထဲမှာ initial value ပါတဲ့ zustand store ကို ဖန်တီးပေးပြီး — components တွေထဲမှာ isolated, mockable instances တွေနဲ့ သုံးနိုင်အောင် လုပ်ပေးပါတယ်။
- [zustand-create-setter-fn](https://www.npmjs.com/package/zustand-create-setter-fn) — React ပုံစံ `setState` functions တွေကို သုံးပြီး state update လုပ်ဖို့ လွယ်ကူစေတဲ့ (framework agnostic, React မလို) fully type safe Zustand utility တစ်ခုပါ။
- [zustand-devtools-bridge](https://github.com/KubaOpoczka/zustand-devtools) — Registered-store inspection, searchable action timelines, safe time travel, path-level diffs နဲ့ redacted Trace Session export တွေပါတဲ့ သီးသန့် Chrome DevTools panel အတွက် bridge တစ်ခုပါ။
- [zustand-di](https://github.com/charkour/zustand-di) — Zustand stores တွေကို init လုပ်ဖို့ react props တွေကို သုံးပါတယ်။
- [zustand-forms](https://github.com/Conduct/zustand-forms) — Zustand stores အဖြစ် မြန်ဆန်ပြီး type safe ဖြစ်တဲ့ form states တွေပါ။
- [zustand-hash-storage](https://github.com/MartinGamesCZ/zustand-hash-storage) — State ကို URL hash ထဲကို b64 encoded (configure လုပ်လို့ရတဲ့) ပုံစံနဲ့ debounce timer ပါပြီး သိမ်းပေးတဲ့ Zustand middleware ပါ။
- [zustand-injectors](https://github.com/zustandjs/zustand-injectors) — Slices တွေကို lazy load လုပ်ဖို့ ချိုမြိန်တဲ့ နည်းလမ်းတစ်ခုပါ။
- [zustand-interval-persist](https://www.npmjs.com/package/zustand-interval-persist) — Store ရဲ့ state ကို ပုံမှန် interval တစ်ခုမှာ သတ်မှတ်ထားတဲ့ storage ထဲကို အလိုအလျောက် သိမ်းပေးနိုင်စေတဲ့ zustand အတွက် enhancement တစ်ခုပါ။
- [zustand-lit](https://github.com/ennjin/zustand-lit) — lit.js (LitElement) အတွက် zustand adapter တစ်ခုပါ။
- [zustand-middleware-computed-state](https://github.com/cmlarsen/zustand-middleware-computed-state) — Zustand ကို computed state ထည့်ဖို့ အလွန်ရိုးရှင်းတဲ့ middleware တစ်ခုပါ။
- [zustand-middleware-xstate](https://github.com/biowaffeln/zustand-middleware-xstate) — XState state machines တွေကို global Zustand store တစ်ခုထဲ ထည့်ဖို့ middleware တစ်ခုပါ။
- [zustand-middleware-yjs](https://github.com/joebobmiles/zustand-middleware-yjs) — Zustand stores တွေကို Yjs နဲ့ sync လုပ်ပေးတဲ့ middleware တစ်ခုပါ။
- [zustand-mmkv-storage](https://github.com/1mehdifaraji/zustand-mmkv-storage) — React Native မှာ zustand persist middleware အတွက် မြန်ဆန်၊ ပေါ့ပါးတဲ့ MMKV storage adapter တစ်ခုပါ။
- [zustand-multi-persist](https://github.com/mooalot/zustand-multi-persist) — State ကို storage engines အများကြီးထဲမှာ persist လုပ်ပြီး rehydrate လုပ်ပေးတဲ့ middleware တစ်ခုပါ။
- [zustand-mutable](https://github.com/zustandjs/zustand-mutable) — Immer နဲ့ဆင်တဲ့ mutable updates တွေကို သုံးဖို့ ချိုမြိန်တဲ့ နည်းလမ်းတစ်ခုပါ။
- [zustand-namespaces](https://github.com/mooalot/zustand-namespaces) — အားလုံးကို အုပ်ချုပ်မယ့် store တစ်ခုပါ။ Namespaced Zustand stores တွေပါ။
- [zustand-persist](https://github.com/roadmanfong/zustand-persist) — State ကို persist လုပ်ပြီး rehydrate လုပ်ပေးတဲ့ middleware တစ်ခုပါ။
- [zustand-pub](https://github.com/AwesomeDevin/zustand-pub) — React/Vue အတွက် zustand နဲ့ zustand-vue ကို အခြေခံတဲ့ cross-application/cross-framework state management နဲ့ sharing တစ်ခုပါ။
- [zustand-querystring](https://github.com/nitedani/zustand-querystring) — Store ကို querystring နဲ့ sync လုပ်ပေးတဲ့ Zustand middleware တစ်ခုပါ။
- [zustand-rx](https://github.com/patdx/zustand-rx) — Store တစ်ခုကို RxJS Observable အဖြစ် subscribe လုပ်နိုင်အောင် လုပ်ပေးတဲ့ Zustand middleware တစ်ခုပါ။
- [zustand-saga](https://github.com/Nowsta/zustand-saga) — Redux-saga အတွက် (redux မလိုဘဲ) Zustand middleware တစ်ခုပါ။
- [zustand-slices](https://github.com/zustandjs/zustand-slices) — Zustand အတွက် slice utility တစ်ခုပါ။
- [zustand-store-addons](https://github.com/Diablow/zustand-store-addons) — React state management အတွက် Zustand addons တွေပါ။
- [zustand-sync-tabs](https://github.com/mayank1513/zustand-sync-tabs) — Tabs/windows/iframes များကြားမှာ same origin နဲ့ Zustand state တွေကို အလွယ်တကူ sync လုပ်ပေးတဲ့ Zustand middleware ပါ။
- [zustand-utils](https://www.npmjs.com/package/zustand-utils) — Zustand အတွက် utilities တွေပါ — `createContext` အစားထိုးတစ်ခု၊ devtools wrapper တစ်ခုနဲ့ store-updater factory function တစ်ခုပါ။
- [zustand-valtio](https://github.com/zustandjs/zustand-valtio) — Zustand နဲ့ Valtio တို့ရဲ့ ချိုမြိန်တဲ့ ပေါင်းစပ်မှုတစ်ခုပါ။
- [zustand-vue](https://github.com/AwesomeDevin/zustand-vue) — Zustand ကို အခြေခံတဲ့ Vue (Vue3 / Vue2) အတွက် state management တစ်ခုပါ။
- [zustand-x](https://github.com/udecode/zustand-x) — Developer experience အကောင်းဆုံးဖြစ်အောင် လုပ်ပေးတဲ့ Zustand store factory တစ်ခုပါ။
- [zustand-xs](https://github.com/zustandjs/zustand-xs) — XState/store နဲ့ လိုက်ဖက်တဲ့ (compatible) Zustand middleware တစ်ခုပါ။
- [zustand-yjs](https://github.com/tandem-pt/zustand-yjs) — Yjs structures တွေအတွက် Zustand stores တွေပါ။
- [zusteller](https://github.com/timkindberg/zusteller) — သင့်ရဲ့ global state ကို ကယ်တင်ပေးမယ့်သူပါ။ "Just hooks" + Zustand ပေါင်းစပ်မှုပါ။
- [zustorm](https://github.com/mooalot/zustorm) — Zustand အတွက် ရိုးရှင်းပြီး အားကောင်းတဲ့ form library တစ်ခုပါ။
- [zusty](https://github.com/oslabs-beta/Zusty) — Time travel, action logs, state snapshots, store view, render time metrics နဲ့ state component tree တွေနဲ့ debugging ကို အကူအညီပေးတဲ့ Zustand tool တစ်ခုပါ။
