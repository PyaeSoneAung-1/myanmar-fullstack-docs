---
title: "Postman မှာ documentation publish လုပ်ခြင်း (Publish documentation in Postman)"
description: "Collection တစ်ခုရဲ့ documentation ကို public ဖြစ်အောင် publish လုပ်ခြင်း — publication settings တွေ (content, URL, appearance, SEO) ပြင်ဆင်ခြင်း, docs တွေ မျှဝေခြင်း, settings တွေ ပြောင်းလဲခြင်းနဲ့ unpublish လုပ်ခြင်း"
order: 145
source: "https://learning.postman.com/docs/publishing-your-api/publishing-your-docs/"
status: translated
updated: 2026-09-03
---

ကိုယ့် documentation ကို publish လုပ်ခြင်းက — documentation ရဲ့ လင့်ခ်ရှိတဲ့ ဘယ်သူမဆို ကြည့်ရှုနိုင်အောင် public ဖြစ်စေပါတယ်။ ကမ္ဘာပေါ်က လူတွေ ကိုယ့် collection ကို ဘယ်လို သုံးရမလဲ ဒါမှမဟုတ် ကိုယ့် public API နဲ့ ဘယ်လို interact လုပ်ရမလဲ ဆိုတာ လေ့လာနိုင်ဖို့ ကိုယ့် documentation ကို publish လုပ်ပါ။

Public documentation မှာ — published collection ထဲက request ဒါမှမဟုတ် endpoint တစ်ခုချင်းစီအတွက် အသေးစိတ်တွေ — client language အမျိုးမျိုးနဲ့ sample code တွေနဲ့အတူ — အလိုအလျောက် ပါဝင်ပါတယ်။ Collection ကို update လုပ်တဲ့အခါ — published documentation ကလည်း ကိုယ့် နောက်ဆုံး အပြောင်းအလဲတွေနဲ့ အလိုအလျောက် sync ဖြစ်နေပါတယ်။ အပြောင်းအလဲတွေ လုပ်ပြီးတိုင်း documentation ကို နောက်တစ်ကြိမ် publish ပြန်လုပ်စရာ မလိုပါဘူး။

#### အကြံပြုချက်

ကိုယ့် public documentation မှာ [**Run in Postman** button](https://learning.postman.com/docs/publishing-your-api/run-in-postman/introduction-run-button/) လည်း ပါဝင်တာမို့ — users တွေက ကိုယ့် collection ဒါမှမဟုတ် API ကို Postman ထဲမှာ တိုက်ရိုက် interact လုပ်နိုင်ပါတယ်။ ဥပမာတစ်ခုအနေနဲ့ — Postman Collection တစ်ခုကနေ publish လုပ်ထားတဲ့ [Postman API documentation](https://documenter.getpostman.com/view/12959542/UV5XjJV8) ကို ကြည့်နိုင်ပါတယ်။

## ကိုယ့် documentation တွေကို public ဖြစ်အောင် လုပ်ခြင်း

[Documentation](https://learning.postman.com/docs/publishing-your-api/document-a-collection/) တစ်ခုကို publish လုပ်ဖို့ — အဲဒါက collection တစ်ခုရဲ့ အစိတ်အပိုင်း ဖြစ်နေရပါမယ်။ ကိုယ် ဖန်တီးထားတဲ့ ဒါမှမဟုတ် တည်းဖြတ်ခွင့် (permission to edit) ရှိတဲ့ collection တိုင်းရဲ့ documentation ကို publish လုပ်နိုင်ပါတယ်။

#### မှတ်ချက်

HTTP requests တွေပါတဲ့ collections တွေအတွက်သာ publishing ကို ပံ့ပိုးပေးပါတယ်။

Collection တစ်ခုရဲ့ documentation ကို publish လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး — **Collections** ကို ချဲ့ကာ collection တစ်ခုကို ရွေးပါ။
2. Workbench ထဲက collection ရဲ့ **Overview** tab မှာ — **View complete documentation** ကို နှိပ်ပါ။
3. ![Publish icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-publish-stroke.svg#icon) **Publish docs** ကို နှိပ်ပြီး — **Postman** ကို ရွေးပါ။
4. **Publish Documentation** interface ဆီ သွားဖို့ — **Publish** ကို နှိပ်ပါ။

   ![Publish documentation](https://assets.postman.com/postman-docs/v12/documentation-publish-button-v12-01.png)

## Publication settings တွေ update လုပ်ခြင်း

**Publish Documentation** interface ထဲမှာ — လိုအပ်သလို publication settings တွေကို ပြောင်းလဲနိုင်ပါတယ်။

### Content (ထုတ်ဝေမည့် အကြောင်းအရာ)

ကိုယ့် docs တွေနဲ့အတူ publish လုပ်ချင်တဲ့ content တွေကို ရွေးပါ:

* **Version** — ဒါက default အနေနဲ့ **CURRENT** ဖြစ်ပါတယ်။ Postman v10 နဲ့ ၎င်းနောက်ပိုင်းမှာ collections တွေအတွက် versions ဒါမှမဟုတ် releases တွေ ဖန်တီးလို့ မရတော့ပါဘူး။
* **Environment** — ကိုယ့် documentation နဲ့အတူ environment variables တွေ publish လုပ်ဖို့ [environment](https://learning.postman.com/docs/publishing-your-api/document-a-collection/#associate-environments-with-documentation) တစ်ခုကို ရွေးပါ။

  #### သတိပြုရန်

  Variable တွေရဲ့ shared values တွေ အားလုံးက ကိုယ့် documentation နဲ့အတူ publish ဖြစ်သွားတာမို့ — passwords ဒါမှမဟုတ် tokens လို sensitive အချက်အလက်တွေ မပါအောင် သေချာစစ်ပါ။

### URL (လင့်ခ်လိပ်စာ)

ကိုယ့် documentation ကို publish လုပ်ချင်တဲ့ **Custom domain** dropdown list ထဲကနေ [custom domain](/docs/postman/custom-doc-domains) တစ်ခုကို ရွေးပါ။

### Appearance (အသွင်အပြင်)

ကိုယ့် published docs တွေအတွက် appearance settings တွေကို ရွေးပါ။ Docs တွေ publish မလုပ်ခင် ဒီ section ထဲက sample layouts တွေမှာ ကိုယ့် ပြောင်းလဲမှုတွေကို ကြိုကြည့်နိုင်ပါတယ်။

* **Default layout** — ကိုယ့် documentation အတွက် default layout style တစ်ခု ရွေးပါ။ **Double column** က documentation ဘေးမှာ sample code ကို column တစ်ခုနဲ့ ပြသပြီး — **Single column** က request တစ်ခုချင်းစီရဲ့ အောက်မှာ sample code ကို inline အနေနဲ့ ပြသပါတယ်။ ရွေးထားတဲ့ layout ကို ကိုယ့် documentation မှာ default အနေနဲ့ သုံးပေမယ့် — users တွေက ကိုယ့် published documentation ကို ကြည့်တဲ့အခါ သူတို့ ကြိုက်တဲ့ layout style ကို ရွေးနိုင်ပါတယ်။
* **Default Theme** — ကိုယ့် documentation အတွက် light ဒါမှမဟုတ် dark theme တစ်ခု ရွေးပါ။ System theme ကို သုံးဖို့လည်း ရွေးနိုင်ပါတယ်။ ရွေးထားတဲ့ theme ကို ကိုယ့် documentation မှာ default အနေနဲ့ သုံးပေမယ့် — users တွေက themes တွေကြား ပြောင်းနိုင်ပါတယ်။
* **Logo** — ပုံမှန်အားဖြင့် public documentation က ကိုယ့် [team logo](https://learning.postman.com/docs/administration/managing-your-team/team-settings/#customize-your-branding) ကို သုံးပါတယ်။ ကိုယ် publish လုပ်တဲ့ collection တစ်ခုချင်းစီအတွက် logo မတူညီအောင် သုံးနိုင်ပါတယ်။ Logos တွေက 2 MB ဒါမှမဟုတ် ဒီထက်နည်းရပြီး — JPEG ဒါမှမဟုတ် PNG format ဖြစ်ရပါမယ်။ Logo က aspect ratio ဘယ်လိုမျိုးမဆို (square ဒါမှမဟုတ် rectangle) ဖြစ်နိုင်ပါတယ်။ Theme တစ်ခုချင်းစီအတွက် (light နဲ့ dark) custom logo တစ်ခုစီလည်း ရွေးနိုင်ပါတယ်။
  * Logo တစ်ခု ထည့်ဖို့ — ![Edit icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-edit-stroke.svg#icon) ကို နှိပ်ပြီး — **Upload** ကို နှိပ်ပါ။ ပုံဖိုင်တစ်ခုကို ဆွဲချပြီး ချလို့ရသလို — ပုံဖိုင်တစ်ခုကို ရွေးလို့လည်း ရပါတယ်။ ပြသချင်တဲ့ ပုံရဲ့ အစိတ်အပိုင်းကို ချိန်ညှိဖို့ handles တွေကို ဆွဲပြီး — **Upload** ကို ရွေးပါ။
  * Logo တစ်ခုကို ဖျက်ဖို့ — ![Edit icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-action-edit-stroke.svg#icon) ကို နှိပ်ပြီး — **Delete** ကို ရွေးပါ။
* **Colors** — Light နဲ့ dark themes တွေအတွက် colors တွေကို (hex format နဲ့) customize လုပ်နိုင်ပါတယ်:
  * **Header background** — Documentation window ရဲ့ ထိပ်မှာရှိတဲ့ header အတွက် color တစ်ခု သတ်မှတ်ပါ။
  * **Code background** — Sample code blocks တွေအတွက် color တစ်ခု သတ်မှတ်ပါ။
  * **Highlight** — Hyperlinks တွေအတွက် color တစ်ခု သတ်မှတ်ပါ။

### SEO (search engine optimization)

Web ပေါ်မှာ ပိုပြီး ရှာတွေ့နိုင်အောင် ကိုယ့် documentation ကို metadata တွေ ထည့်ပါ။

* **Title** — ကိုယ့် documentation အတွက် ခေါင်းစဉ်တစ်ခု ထည့်ပါ (စာလုံး 60 ဒါမှမဟုတ် ဒီထက်နည်းရပါမယ်)။ ဒီခေါင်းစဉ်က web searches တွေနဲ့ browser tabs တွေထဲမှာ ပေါ်လာပါတယ်။
* **Description** — ကိုယ့် documentation က ဘာအကြောင်းလဲ ဆိုတာ users တွေ သိအောင် ဖော်ပြချက် အတိုတစ်ခု ထည့်ပါ (စာလုံး 160 ဒါမှမဟုတ် ဒီထက်နည်းရပါမယ်)။ Web မှာ ရှာဖွေတဲ့အခါ users တွေ ကိုယ့် documentation ကို ရှာတွေ့နိုင်အောင် သက်ဆိုင်တဲ့ keywords တွေလည်း ထည့်နိုင်ပါတယ်။

### ကိုယ့် documentation ကို ကြိုကြည့်ခြင်း (Preview)

လက်ရှိ settings တွေနဲ့ ကိုယ့် documentation ကို ကြိုကြည့်ဖို့ — **Preview Documentation** ကို နှိပ်ပါ။ Settings တွေ ပြောင်းလိုက်တိုင်း preview က အလိုအလျောက် update ဖြစ်ပါတယ်။

#### မှတ်ချက်

Sensitive ဖြစ်နိုင်တဲ့ token တစ်ခု ဒါမှမဟုတ် တခြား secret တစ်ခုကို Postman က တွေ့ရှိရင် — preview window ရဲ့ ထိပ်မှာ သတိပေးချက် (warning) တစ်ခု ပေါ်လာပါတယ်။ Publish မလုပ်ခင် documentation ထဲကနေ ဖယ်ရှားနိုင်အောင် Postman က token ကိုလည်း highlight လုပ်ပေးပါတယ်။

### ကိုယ့် documentation ကို publish လုပ်ခြင်း

ကိုယ့် documentation ရဲ့ settings တွေကို ပြောင်းလဲပြီးသွားတဲ့အခါ — **Publish** ကို နှိပ်ပြီး publish လုပ်ပါ။

* **Postman Free, Solo နဲ့ Team plans** — Collection ကို ရွှေ့ဖို့ [public workspace](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/public-workspaces/) တစ်ခုကို ရွေးချယ်နိုင်ပါတယ်။ ဒါက collection ကို [Postman API Network](https://www.postman.com/explore) ပေါ်မှာ ရှာတွေ့နိုင်အောင် လုပ်ပေးပါတယ်။ အဆင်သင့်ဖြစ်တဲ့အခါ — **Publish** ကို နှိပ်ပါ။ ပေးထားတဲ့ URL မှာ ကိုယ့် public documentation ကို ကြည့်ရှုနိုင်ပါတယ်။
* **Postman Enterprise plans** — ကိုယ့် [Community Manager](https://learning.postman.com/docs/administration/roles-and-permissions/#team-roles) က ကိုယ့် team က public လုပ်တဲ့ Postman elements တွေကို ထိန်းချုပ်ပါတယ်။ ကိုယ့် Community Manager အတွက် note တစ်ခု ရိုက်ထည့်ပြီး — **Request Publish** ကို နှိပ်ပါ။ Request ကို approve လုပ်လိုက်တဲ့အခါ — public documentation ဆီ လင့်ခ်ပါတဲ့ email notification တစ်ခုကို ရပါလိမ့်မယ်။ ကိုယ့် publish request ကို ပြန်ရုတ်သိမ်းချင်ရင် — [မဆုံးဖြတ်ရသေးတဲ့ (pending) publication settings တွေကို ပြောင်းပြီး](#publication-settings-တွေ-ပြောင်းလဲခြင်း) **Retract request** ကို နှိပ်ပါ။

## ကိုယ့် public docs တွေကို မျှဝေခြင်း

ကိုယ့် public documentation ကို မျှဝေဖို့ — published URL ကို ကိုယ့် team members တွေ, တခြား users တွေ ဒါမှမဟုတ် community ဆီ မျှဝေပါ။ ကိုယ့် published documentation ရဲ့ URL ရဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး — **Collections** ကို ချဲ့ကာ published documentation ရှိတဲ့ collection တစ်ခုကို ရွေးပါ။
2. Workbench ထဲက collection ရဲ့ **Overview** tab မှာ — **View complete documentation** ကို နှိပ်ပါ။
3. ![Published icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-state-published-stroke.svg#icon) **Docs published** ကို နှိပ်ပြီး — **Copy published link** ကို ရွေးပါ။

ကိုယ့် collection က public workspace တစ်ခုထဲမှာ ရှိနေရင် — တခြားသူတွေက [Postman API Network](https://www.postman.com/explore) ပေါ်မှာ ကိုယ့် collection ကို ၎င်းရဲ့ documentation နဲ့အတူ ရှာဖွေတွေ့ရှိနိုင်ပါတယ်။ Collection ကို public workspace တစ်ခုဆီ မရွှေ့ရသေးဘူးဆိုရင် — [publication settings တွေကို ပြောင်းပြီး](#publication-settings-တွေ-ပြောင်းလဲခြင်း) အချိန်မရွေး ရွှေ့နိုင်ပါတယ်။

#### အကြံပြုချက်

ကိုယ့် documentation ကို Postman API Network နဲ့ မျှဝေခြင်းက — Postman community ထဲက consumers တွေ ပိုများများဆီ ကိုယ့် API ကို မြင်နိုင်စေပါတယ်။ [Public workspaces](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/public-workspaces/) အကြောင်း ပိုလေ့လာပါ။

## Publication settings တွေ ပြောင်းလဲခြင်း

ကိုယ့် documentation ရဲ့ publication settings တွေကို ပြောင်းပြီး — documentation ရဲ့ ပုံစံကို update လုပ်နိုင်သလို ကိုယ့် collection ကို public လည်း ဖြစ်အောင် လုပ်နိုင်ပါတယ်။ Documentation ကို publish လုပ်ပြီးတဲ့ နောက်မှာ publication settings တွေကို အချိန်မရွေး ပြောင်းလဲနိုင်ပါတယ်။ Publication settings တွေ update လုပ်ဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး — **Collections** ကို ချဲ့ကာ published documentation ရှိတဲ့ collection တစ်ခုကို ရွေးပါ။
2. Workbench ထဲက collection ရဲ့ **Overview** tab မှာ — **View complete documentation** ကို နှိပ်ပါ။
3. ![Published icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-state-published-stroke.svg#icon) **Docs published** ကို နှိပ်ပြီး — **Publication Settings** interface ဆီ သွားဖို့ **Edit published documentation** ကို ရွေးပါ။
4. **Edit settings** ကို နှိပ်ပြီး — လိုအပ်သလို [publication settings](#ကိုယ့်-documentation-တွေကို-public-ဖြစ်အောင်-လုပ်ခြင်း) တွေကို ပြောင်းပါ။
5. **Save and republish** ကို နှိပ်ပါ။

## ကိုယ့် docs တွေကို unpublish လုပ်ခြင်း

ကိုယ့် documentation ကို public အနေနဲ့ ဆက်မထားချင်တော့ဘူးဆိုရင် — unpublish လုပ်နိုင်ပါတယ်။

1. ![Items icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-descriptive-items-stroke.svg#icon) **Items** ကို နှိပ်ပြီး — **Collections** ကို ချဲ့ကာ published documentation ရှိတဲ့ collection တစ်ခုကို ရွေးပါ။
2. Workbench ထဲက collection ရဲ့ **Overview** tab မှာ — **View complete documentation** ကို နှိပ်ပါ။
3. ![Published icon](https://assets.postman.com/postman-docs/aether-icons/v12/icon-state-published-stroke.svg#icon) **Docs published** ကို နှိပ်ပြီး — **Publication Settings** interface ဆီ သွားဖို့ **Edit published documentation** ကို ရွေးပါ။
4. **Unpublish** ကို နှိပ်ပါ။

စိတ်ပြောင်းသွားခဲ့ရင် — [ကိုယ့် documentation ကို](#ကိုယ့်-documentation-တွေကို-public-ဖြစ်အောင်-လုပ်ခြင်း) အချိန်မရွေး ပြန် publish လုပ်နိုင်ပါတယ်။
