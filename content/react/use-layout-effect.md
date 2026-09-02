---
title: "useLayoutEffect"
description: "Browser က screen ကို repaint (ပြန်လည်ခြယ်သ) မလုပ်ခင် run လုပ်သည့် useEffect ၏ မူကွဲ — browser repaint မလုပ်မီ layout တိုင်းတာခြင်း၊ tooltip နေရာချခြင်း ဥပမာ၊ server rendering ဆိုင်ရာ သတိပြုချက်များ"
order: 54
source: "https://react.dev/reference/react/useLayoutEffect"
status: translated
updated: 2026-09-02
---

> **သတိပြုရန်** — `useLayoutEffect` က performance ကို ထိခိုက်စေနိုင်ပါတယ်။ ဖြစ်နိုင်ရင် — [`useEffect`](/docs/react/use-effect) ကို ဦးစားပေး သုံးပါ။

`useLayoutEffect` ဆိုတာ — browser က screen ကို repaint (ပြန်လည် ခြယ်သခြင်း) မလုပ်ခင်မှာ run လုပ်ပေးတဲ့ — [`useEffect`](/docs/react/use-effect) ၏ မူကွဲ (version) တစ်ခုပါ။

```js
useLayoutEffect(setup, dependencies?)
```

## ရည်ညွှန်းချက် (Reference)

### `useLayoutEffect(setup, dependencies?)`

Browser က screen ကို repaint မလုပ်ခင် — layout တိုင်းတာမှုတွေ (layout measurements) လုပ်ဆောင်ဖို့ `useLayoutEffect` ကို ခေါ်ပါတယ်:

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```

**Parameters (ပါရာမီတာများ)**

- `setup`: သင့် Effect ရဲ့ logic ပါတဲ့ function တစ်ခု။ ဒီ setup function က *cleanup* function တစ်ခုကို option အဖြစ် ပြန်ပေးနိုင်ပါတယ်။ သင့် component က DOM ဆီ [commit ဖြစ်သွားပြီး](https://react.dev/learn/render-and-commit#step-3-react-commits-changes-to-the-dom) — browser က screen ကို repaint မလုပ်ခင်မှာ — React က သင့် setup function ကို run ပါတယ်။ Dependencies ပြောင်းလဲတဲ့ commit တိုင်းပြီးနောက် — React က cleanup function ကို (ပေးထားရင်) တန်ဖိုးအဟောင်းတွေနဲ့ အရင်ဆုံး run ပြီး — ပြီးမှ setup function ကို တန်ဖိုးအသစ်တွေနဲ့ run ပါတယ်။ သင့် component ကို DOM ကနေ မဖယ်ရှားခင် — React က cleanup function ကို run ပေးပါတယ်။
- **optional** `dependencies`: `setup` code ရဲ့ အတွင်းမှာ သုံးထားတဲ့ reactive values တွေအားလုံးရဲ့ စာရင်း။ Reactive values တွေထဲမှာ props၊ state နဲ့ component body ထဲမှာ တိုက်ရိုက် ကြေညာထားတဲ့ variables/functions တွေ ပါဝင်ပါတယ်။ သင့် linter ကို [React အတွက် ပြင်ဆင်ထားရင်](https://react.dev/learn/editor-setup#linting) — reactive value တိုင်းကို dependency အဖြစ် မှန်ကန်စွာ သတ်မှတ်ထားကြောင်း စစ်ဆေးပါလိမ့်မယ်။ Dependency list က item အရေအတွက် မပြောင်းလဲဘဲ `[dep1, dep2, dep3]` လို inline ရေးရပါတယ်။ React က dependency တစ်ခုချင်းစီကို [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) နှိုင်းယှဉ်မှုနဲ့ ယခင်တန်ဖိုးနဲ့ ယှဉ်ပါတယ်။ ဒီ argument ကို ချန်လိုက်ရင် — Effect က component ရဲ့ commit တိုင်းပြီးနောက် ပြန် run ပါလိမ့်မယ်။

**Returns (ပြန်ပေးသည့်တန်ဖိုး)**

- `useLayoutEffect` က `undefined` ကို ပြန်ပေးပါတယ်။

**Caveats (သတိပြုရမည့်အချက်များ)**

- `useLayoutEffect` က Hook တစ်ခုမို့ — သင့် component ရဲ့ **အပေါ်ဆုံးအဆင့်** ဒါမှမဟုတ် ကိုယ်ပိုင် Hooks တွေထဲမှာပဲ ခေါ်လို့ရပါတယ်။ Loops ဒါမှမဟုတ် conditions တွေထဲမှာ ခေါ်လို့ မရပါဘူး။ အဲဒါ လိုအပ်ရင် — component တစ်ခု ခွဲထုတ်ပြီး Effect ကို အဲဒီထဲ ရွှေ့ပါ။
- Strict Mode ဖွင့်ထားရင် — React က ပထမဆုံး real setup မလုပ်ခင် — development-only setup+cleanup cycle တစ်ခုကို **အပိုဆောင်း run** ပါတယ်။ ဒါက သင့် cleanup logic က setup logic ကို "မှန်မှန် ထင်ဟပ်" ပြီး setup လုပ်နေတာကို ရပ်/ပြန်ဖျက်နိုင်ကြောင်း စစ်ဆေးတဲ့ stress-test တစ်ခုပါ။ ပြဿနာ တစ်ခုခု ဖြစ်ရင် — [cleanup function ကို implement လုပ်ပါ](/docs/react/synchronizing-with-effects)။
- Dependencies တချို့က component အတွင်းမှာ သတ်မှတ်ထားတဲ့ objects ဒါမှမဟုတ် functions တွေဆိုရင် — Effect က လိုအပ်တာထက် ပိုပြီး မကြာခဏ ပြန် run နိုင်ပါတယ်။ ဖြေရှင်းဖို့ — မလိုအပ်တဲ့ [object dependencies](/docs/react/use-effect) နဲ့ [function dependencies](/docs/react/use-effect) တွေကို ဖယ်ရှားပါ။ ပြီးတော့ [state updates တွေကို ထုတ်ယူတာ](/docs/react/use-effect) နဲ့ [reactive မဟုတ်တဲ့ logic](/docs/react/use-effect) တွေကို သင့် Effect ရဲ့ အပြင်ဘက်ကို ရွှေ့တာတွေလည်း လုပ်နိုင်ပါတယ်။
- Effects တွေက **client ပေါ်မှာပဲ run ပါတယ်** — server rendering အတွင်းမှာ မပြေးပါဘူး။
- `useLayoutEffect` ထဲက code နဲ့ — အဲဒီကနေ schedule လုပ်လိုက်တဲ့ state updates တွေ အားလုံးက — **browser က screen ကို repaint လုပ်တာကို ပိတ်ဆို့ပါတယ်။** အလွန်အကျွံ သုံးမိရင် — သင့် app ကို နှေးကွေးစေပါတယ်။ ဖြစ်နိုင်ရင် — [`useEffect`](/docs/react/use-effect) ကို ဦးစားပေး သုံးပါ။
- `useLayoutEffect` အတွင်းမှာ state update တစ်ခုကို trigger လုပ်လိုက်ရင် — React က `useEffect` အပါအဝင် ကျန်ရှိနေတဲ့ Effects တွေ အားလုံးကို ချက်ချင်း run လုပ်ပါတယ်။

## အသုံးပြုပုံ (Usage)

### Browser က Screen ကို Repaint မလုပ်ခင် Layout တိုင်းတာခြင်း (Measuring layout before the browser repaints the screen)

Component အများစုက — ဘာကို render လုပ်ရမလဲ ဆုံးဖြတ်ဖို့ — screen ပေါ်က သူတို့ရဲ့ နေရာနဲ့ အရွယ်အစားကို သိဖို့ မလိုပါဘူး။ သူတို့က JSX တချို့ကိုပဲ ပြန်ပေးပြီး — browser က သူတို့ရဲ့ *layout* (နေရာနဲ့ အရွယ်အစား) ကို တွက်ချက်ကာ screen ကို repaint လုပ်ပါတယ်။

တခါတရံမှာတော့ — ဒါ မလုံလောက်ပါဘူး။ Element တစ်ခုရဲ့ အနားမှာ hover လုပ်တဲ့အခါ ပေါ်လာတဲ့ tooltip တစ်ခုကို မြင်ယောင်ကြည့်ပါ။ နေရာ လုံလောက်ရင် — tooltip က element ရဲ့ အပေါ်မှာ ပေါ်သင့်ပြီး — မဆံ့ရင် အောက်မှာ ပေါ်သင့်ပါတယ်။ Tooltip ကို မှန်ကန်တဲ့ နောက်ဆုံး အနေအထားမှာ render လုပ်ဖို့ — သူ့ရဲ့ height (အပေါ်မှာ ဆံ့မဆံ့) ကို သိထားဖို့ လိုပါတယ်။

ဒါကို လုပ်ဖို့ — render ကို နှစ်ခါ (two passes) လုပ်ရပါတယ်:

1. Tooltip ကို ဘယ်နေရာမှာမဆို (နေရာ မှားနေတာတောင်) render လုပ်ပါ။
2. သူ့ရဲ့ height ကို တိုင်းပြီး — tooltip ကို ဘယ်မှာ ထားရမလဲ ဆုံးဖြတ်ပါ။
3. Tooltip ကို မှန်ကန်တဲ့ နေရာမှာ *နောက်တစ်ခါ* render လုပ်ပါ။

**ဒါတွေ အားလုံး — browser က screen ကို repaint မလုပ်ခင်** ဖြစ်ဖို့ လိုပါတယ်။ Tooltip ရွေ့သွားတာကို အသုံးပြုသူ မြင်စေချင်မှာ မဟုတ်ပါဘူး။ Browser က screen ကို repaint မလုပ်ခင် — layout တိုင်းတာမှုတွေ လုပ်ဆောင်ဖို့ `useLayoutEffect` ကို ခေါ်ပါ:

```js
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // တကယ့် height ကို မသိသေးပါဘူး

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // တကယ့် height သိပြီမို့ — အခု re-render လုပ်ပါ
  }, []);

  // ...tooltipHeight ကို အောက်က rendering logic တွေထဲမှာ သုံးပါ...
}
```

ဒီနေရာမှာ ဘယ်လို အလုပ်လုပ်လဲ — အဆင့်လိုက် ကြည့်ရအောင်:

1. `Tooltip` က ကနဦး `tooltipHeight = 0` နဲ့ render လုပ်ပါတယ် (ဒါကြောင့် tooltip က နေရာ မှားနေနိုင်ပါတယ်)။
2. React က သူ့ကို DOM ထဲ နေရာချပြီး — `useLayoutEffect` ထဲက code ကို run လုပ်ပါတယ်။
3. သင့် `useLayoutEffect` က tooltip content ရဲ့ [height ကို တိုင်းတာပြီး](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) — ချက်ချင်း re-render တစ်ခုကို trigger လုပ်ပါတယ်။
4. `Tooltip` က တကယ့် `tooltipHeight` နဲ့ နောက်တစ်ခါ render လုပ်ပါတယ် (ဒါကြောင့် tooltip က မှန်ကန်စွာ နေရာချခံရပါတယ်)။
5. React က သူ့ကို DOM ထဲ update လုပ်ပြီး — browser က နောက်ဆုံးမှ tooltip ကို ပြသပါတယ်။

အောက်က buttons တွေပေါ်မှာ hover လုပ်ပြီး — tooltip က ဆံ့မဆံ့ပေါ် မူတည်ပြီး သူ့ရဲ့ နေရာကို ဘယ်လို ချိန်ညှိလဲ ကြည့်ပါ:

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```
```js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```
```js
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Measured tooltip height: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // အပေါ်မှာ မဆံ့လို့ — အောက်မှာ နေရာချပါ။
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```
```js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```
```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

`Tooltip` component က render ကို နှစ်ခါ လုပ်ရတယ်ဆိုပေမယ့် (ပထမ — `tooltipHeight` ကို `0` နဲ့ စပြီး၊ ဒုတိယ — တိုင်းတာထားတဲ့ တကယ့် height နဲ့) — သင်က နောက်ဆုံး ရလဒ်ကိုပဲ မြင်ရတာ သတိပြုပါ။ ဒါကြောင့်ပဲ — ဒီဥပမာမှာ [`useEffect`](/docs/react/use-effect) အစား `useLayoutEffect` ကို လိုအပ်တာပါ။ ကွာခြားချက်ကို အောက်မှာ အသေးစိတ် ကြည့်ရအောင်။

### `useLayoutEffect` vs `useEffect` — ဘယ်အချိန်မှာ ဘယ်ဟာကို သုံးမလဲ

#### `useLayoutEffect` က browser ကို repaint လုပ်တာကနေ တားဆီးပါတယ် (`useLayoutEffect` blocks the browser from repainting)

`useLayoutEffect` ထဲက code နဲ့ — အဲဒီထဲမှာ schedule လုပ်ထားတဲ့ state updates တွေကို — **browser က screen ကို repaint မလုပ်ခင်** React က ဆောင်ရွက်ပေးမယ်လို့ အာမခံပါတယ်။ ဒါက tooltip ကို render လုပ်၊ တိုင်းတာ၊ ပြီးတော့ နောက်တစ်ခါ re-render လုပ်တာကို — အသုံးပြုသူက ပထမ အပို render ကို သတိမထားမိဘဲ ဖြစ်စေပါတယ်။ တစ်နည်းပြောရရင် — `useLayoutEffect` က browser ကို paint လုပ်တာကနေ တားဆီးထားပါတယ်။

#### `useEffect` က browser ကို မတားဆီးပါဘူး (`useEffect` does not block the browser)

ဒီမှာ အထက်က ဥပမာ တစ်ခုတည်းကိုပဲ — [`useEffect`](/docs/react/use-effect) နဲ့ ပြောင်းသုံးထားတာပါ။ စက်နှေးတဲ့ device တစ်ခုမှာ ဆိုရင် — tooltip က တခါတရံ "flicker" ဖြစ်ပြီး — နေရာမှန်တဲ့ အနေအထား မရောက်ခင် — သူ့ရဲ့ ကနဦး အနေအထားကို ခဏလေး မြင်ရတာ သတိထားမိနိုင်ပါတယ်။

Bug ကို ပိုလွယ်လွယ်နဲ့ ပြန်ထုတ်နိုင်ဖို့ — ဒီ version မှာ rendering အတွင်း အတုအယောင် delay တစ်ခု ထည့်ထားပါတယ်။ `useEffect` အတွင်းက state update ကို မဆောင်ရွက်ခင် — React က browser ကို screen အရင်ဆုံး paint လုပ်ခွင့် ပေးလိုက်လို့ — tooltip က flicker ဖြစ်တာကို မြင်ရပါတယ်:

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```
```js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```
```js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // ဒါက rendering ကို ရည်ရွယ်ချက်ရှိရှိ နှေးစေဖို့ လုပ်ထားတာပါ
  let now = performance.now();
  while (performance.now() - now < 100) {
    // ခဏလေး ဘာမှ မလုပ်ဘဲ နေပါ...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // အပေါ်မှာ မဆံ့လို့ — အောက်မှာ နေရာချပါ။
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```
```js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```
```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

ဒီဥပမာကို `useLayoutEffect` လို့ ပြောင်းကြည့်ရင် — rendering နှေးနေတာတောင် — paint ကို ပိတ်ဆို့ထားတာ တွေ့ရပါလိမ့်မယ်။

> **မှတ်ချက်:** render ကို နှစ်ခါ လုပ်တာနဲ့ browser ကို ပိတ်ဆို့တာက — performance ကို ထိခိုက်စေပါတယ်။ ဖြစ်နိုင်ရင် ရှောင်ပါ။

## ပြဿနာဖြေရှင်းခြင်း (Troubleshooting)

### "`useLayoutEffect` does nothing on the server" ဆိုတဲ့ error ရနေတယ် (I'm getting an error: "`useLayoutEffect` does nothing on the server")

`useLayoutEffect` ရဲ့ ရည်ရွယ်ချက်က — သင့် component ကို rendering အတွက် layout အချက်အလက်တွေ သုံးနိုင်စေဖို့ပါ (အထက်က "Browser က Screen ကို Repaint မလုပ်ခင် Layout တိုင်းတာခြင်း" အပိုင်းကို ကြည့်ပါ):

1. ကနဦး content ကို render လုပ်ပါ။
2. *Browser က screen ကို repaint မလုပ်ခင်* layout ကို တိုင်းတာပါ။
3. သင်ဖတ်ထားတဲ့ layout အချက်အလက်တွေနဲ့ နောက်ဆုံး content ကို render လုပ်ပါ။

သင်က (သို့) သင့် framework က [server rendering](https://react.dev/reference/react-dom/server) သုံးနေရင် — သင့် React app က ကနဦး render အတွက် — server ပေါ်မှာ HTML အဖြစ် render လုပ်ပါတယ်။ ဒါက JavaScript code မတင်ခင်မှာ — ကနဦး HTML ကို ပြသနိုင်စေပါတယ်။

ပြဿနာက — server ပေါ်မှာ layout အချက်အလက် ဆိုတာ မရှိပါဘူး။

အထက်က ဥပမာမှာ — `Tooltip` component ထဲက `useLayoutEffect` ခေါ်မှုက — content ရဲ့ height ပေါ် မူတည်ပြီး — ကိုယ့်ကိုယ်ကို မှန်ကန်စွာ (content ရဲ့ အပေါ် ဒါမှမဟုတ် အောက်မှာ) နေရာချနိုင်စေပါတယ်။ `Tooltip` ကို ကနဦး server HTML ရဲ့ အစိတ်အပိုင်းတစ်ခုအနေနဲ့ render လုပ်ကြည့်ရင် — အဲဒါကို ဆုံးဖြတ်ဖို့ မဖြစ်နိုင်ပါဘူး။ Server ပေါ်မှာ layout မရှိသေးပါဘူး! ဒါကြောင့် — server ပေါ်မှာ render လုပ်နိုင်ခဲ့ရင်တောင် — JavaScript load ပြီး run လိုက်တာနဲ့ — client ပေါ်မှာ သူ့ရဲ့ အနေအထားက "ခုန်ပြီး" ပြောင်းသွားနိုင်ပါတယ်။

ပုံမှန်အားဖြင့် — layout အချက်အလက်ပေါ် မှီခိုတဲ့ component တွေက server ပေါ်မှာ render ဖို့ မလိုအပ်ပါဘူး။ ဥပမာ — ကနဦး render အတွင်းမှာ `Tooltip` တစ်ခု ပြဖို့က မအဓိပ္ပာယ်ရှိပါဘူး — သူက client interaction တစ်ခုကြောင့်ပဲ ပေါ်လာတာပါ။

ဒါပေမယ့် — ဒီပြဿနာ ကြုံနေရရင် — ရွေးစရာ နည်းလမ်းတချို့ ရှိပါတယ်:

- `useLayoutEffect` အစား [`useEffect`](/docs/react/use-effect) ကို သုံးပါ။ ဒါက React ကို — "ကနဦး render ရလဒ်ကို paint မပိတ်ဆို့ဘဲ ပြသလိုက်ပါ" လို့ ပြောလိုက်တာပါ (မူရင်း HTML က သင့် Effect run မလုပ်ခင် မြင်ရမှာ ဖြစ်လို့)။
- ဒါမှမဟုတ် — [`use(browser())`](/docs/react/use) နဲ့ ခေါ်ပြီး — component ကို browser-only အဖြစ် မှတ်သားပါ (ဒါက Canary release မှာ ရနိုင်ပါတယ်)။ React က server rendering အတွင်း — သူ့ရဲ့ content ကို အနီးဆုံး [`<Suspense>`](https://react.dev/reference/react/Suspense) boundary အထိ — loading fallback (ဥပမာ — spinner ဒါမှမဟုတ် glimmer) နဲ့ အစားထိုးပါလိမ့်မယ်။
- ဒါမှမဟုတ် — [သင့် component ကို client-only အဖြစ် မှတ်သားပါ](https://react.dev/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)။ ဒါက React ကို — server rendering အတွင်း — သူ့ရဲ့ content ကို အနီးဆုံး `<Suspense>` boundary အထိ — loading fallback နဲ့ အစားထိုးဖို့ ပြောလိုက်တာပါ။
- ဒါမှမဟုတ် — `useLayoutEffect` ပါတဲ့ component ကို hydration ပြီးမှသာ render လုပ်ပါ။ `false` နဲ့ စတင်တဲ့ `isMounted` boolean state တစ်ခု ထားပြီး — `useEffect` ခေါ်မှုတစ်ခုရဲ့ အတွင်းမှာ `true` လို့ သတ်မှတ်ပါ။ သင့် rendering logic က `return isMounted ? <RealContent /> : <FallbackContent />` လိုမျိုး ဖြစ်နိုင်ပါတယ်။ Server ပေါ်မှာရော hydration အတွင်းမှာပါ — အသုံးပြုသူက `useLayoutEffect` မခေါ်တဲ့ `FallbackContent` ကို မြင်ရပြီး — React က ၎င်းကို client ပေါ်မှာပဲ run လုပ်ပြီး `useLayoutEffect` ခေါ်မှုတွေ ပါဝင်နိုင်တဲ့ `RealContent` နဲ့ အစားထိုးပါလိမ့်မယ်။
- သင့် component ကို external data store တစ်ခုနဲ့ ထပ်တူပြုနေပြီး — layout တိုင်းတာတာထက် အခြား အကြောင်းပြချက်တွေနဲ့ `useLayoutEffect` ကို အားကိုးနေရရင် — [server rendering ကို ထောက်ပံ့တဲ့](https://react.dev/reference/react/useSyncExternalStore#adding-support-for-server-rendering) [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore) ကို သုံးဖို့ စဉ်းစားပါ။

Effects တွေနဲ့ ထပ်တူပြုခြင်းအကြောင်း ပိုလေ့လာချင်ရင် — [Effects တွေကို External Systems တွေနဲ့ ထပ်တူပြုခြင်း (Synchronizing with Effects)](/docs/react/synchronizing-with-effects) ကို ကြည့်ပါ။
