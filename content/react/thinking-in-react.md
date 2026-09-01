---
title: "React အတွေးအခေါ်"
description: "Thinking in React — component hierarchy ခွဲခြင်း၊ static version ဆောက်ခြင်း၊ minimal state ရှာခြင်း၊ state နေရာသတ်မှတ်ခြင်းနဲ့ inverse data flow — ခြေလှမ်း ၅ ခု"
order: 6
source: "https://react.dev/learn/thinking-in-react"
status: translated
updated: 2026-09-01
---

## ခြေလှမ်း ၅ ခု

React နဲ့ UI တစ်ခုကို တည်ဆောက်တဲ့အခါ — နည်းစနစ်ကျတဲ့ လုပ်ငန်းစဉ် **ငါးဆင့်** ရှိပါတယ်။ ဒီစာမျက်နှာမှာ React ရဲ့ official ဥပမာဖြစ်တဲ့ — search box နဲ့ filter လုပ်လို့ရတဲ့ product list (Filterable Product Table) ကို အခြေခံပြီး ခြေလှမ်းတစ်ဆင့်ချင်းစီ လေ့လာပါမယ်။

## အဆင့် ၁ — UI ကို Component Hierarchy အဖြစ် ခွဲပါ

ပထမဆုံး — UI ကို ကြည့်ပြီး **component တွေရဲ့ အဆင့်ဆင့်ဖွဲ့စည်းပုံ (hierarchy)** ကို ဆွဲပါ။ Component တစ်ခုစီက သူ့ရဲ့ job တစ်ခုကို ကိုယ်စားပြုသင့်ပြီး — design ထဲက အပိုင်းတိုင်းကို component အဖြစ် ခွဲခြားပါတယ်။ Product list ရဲ့ hierarchy က ဒီလိုပါ:

```
FilterableProductTable
├── SearchBar
└── ProductTable
    ├── ProductCategoryRow
    └── ProductRow
```

## အဆင့် ၂ — Static Version ကို အရင်ဆောက်ပါ

ဒုတိယ — props တွေနဲ့ UI ကို render လုပ်ပြီး **interaction မပါတဲ့ static version** ကို ဆောက်ပါ။ Component တွေက data ကို props ကနေ လက်ခံပြီး ပြရုံပဲ လုပ်ပါတယ် — ဒီအဆင့်မှာ **state ကို မသုံးရသေးပါဘူး**:

```jsx
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}
```

Static version ကို အောက်ကနေ အပေါ်ကို (row → table → page) ဆောက်ပြီး — data က top-down စီးဆင်းတာမို့ နောက်အဆင့်တွေမှာ ပိုလွယ်ပါတယ်။ ဒီအဆင့်မှာ state မရှိသေးတာမို့ app က မပြောင်းလဲပါဘူး — ဒါပေမယ့် ဒါက အခြေခံအုတ်မြစ်ပါ။ နောက်အဆင့်တွေမှာ state ထည့်တာတွေက ဒီပေါ်မှာ တည်ဆောက်တာပါ။

## အဆင့် ၃ — Minimal State ကို ရှာပါ

တတိယ — UI ကို interactive ဖြစ်စေဖို့ လိုအပ်တဲ့ **state ရဲ့ minimal (အနည်းဆုံး) set** ကို ရှာပါ။ ဒီမေးခွန်း သုံးခု မေးပါ — (၁) အချိန်နဲ့အမျှ ပြောင်းလဲလား? (၂) Parent ဆီက props အနေနဲ့ ရလာလား? (၃) ရှိပြီးသား state ဒါမှမဟုတ် props ကနေ တွက်လို့ရလား? — ဟုတ်ရင် state မဟုတ်ပါဘူး။ ဒီမေးခွန်းတွေ မေးပြီးရင် — Product list မှာ state နှစ်ခုပဲ ကျန်ပါတယ် — `filterText` (search input ရဲ့ တန်ဖိုး) နဲ့ `inStockOnly` (checkbox ဖွင့်ထားလား ဆိုတာ) ပါ။ Product list ကိုယ်တိုင်က props ကနေ ရတာဖြစ်လို့ state မဟုတ်ပါဘူး — user input ကြောင့် ပြောင်းတဲ့ဟာတွေပဲ state ပါ။

## အဆင့် ၄ — State ဘယ်မှာ နေထိုင်မလဲ ဆုံးဖြတ်ပါ

စတုတ္ထ — state တစ်ခုစီအတွက် — အဲဒီ state ကို **သုံးတဲ့ component တွေ အားလုံးရဲ့ ဘုံအပေါ်ဆုံး parent (common parent)** မှာ ထားပါ။ `filterText` ကို `SearchBar` ရော `ProductTable` ပါ သုံးတာဖြစ်လို့ — နှစ်ခုလုံးရဲ့ parent ဖြစ်တဲ့ `FilterableProductTable` မှာ ထားရပါတယ်။ အောက်က code မှာ အဆင့် ၃ ရဲ့ minimal state နှစ်ခုလုံးကို အဲဒီမှာ ထားထားတာကို တွေ့ရပါမယ်:

```jsx
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  // ...filter logic နဲ့ render
}
```

ဒါကို **state lifting** (state ကို အပေါ်ဆီ မြှင့်တင်ခြင်း) လို့ ခေါ်ပါတယ်။

## အဆင့် ၅ — Inverse Data Flow ထည့်ပါ

ငါးခုမြောက် — **inverse data flow** ထည့်ပါ။ State က `FilterableProductTable` မှာ ရှိပြီး user input ကို `SearchBar` က လက်ခံတာဖြစ်လို့ — input တန်ဖိုးကို **state ရှိရာဆီ ပြန်တင်ပေးဖို့** handler function တွေကို prop အဖြစ် အောက်ကို ပို့ပေးရပါတယ်:

```jsx
<SearchBar
  filterText={filterText}
  inStockOnly={inStockOnly}
  onFilterTextChange={setFilterText}
  onInStockOnlyChange={setInStockOnly}
/>
```

`SearchBar` က input ရဲ့ `onChange` မှာ `onFilterTextChange(e.target.value)` ကို ခေါ်ပြီး — `setFilterText` က state ကို update လုပ်တာနဲ့ ပြန် render ဖြစ်ပါတယ်။ ဒီလိုနဲ့ **data က parent → child → parent စီးဆင်းတဲ့ စက်ဝိုင်း** ပြည့်သွားပြီး — ဒါဟာ React မှာ data စီးဆင်းမှုရဲ့ အရေးကြီးဆုံး ပုံစံတစ်ခုပါ။

## နောက်တစ်ဆင့်တွေ

- [State နဲ့ Rendering](/docs/react/state-snapshot) — state update တွေ ဘယ်လို အလုပ်လုပ်သလဲ
- [Event များနဲ့ အပြန်အလှန်](/docs/react/events) — user interaction တွေကို ကိုင်တွယ်ခြင်း
