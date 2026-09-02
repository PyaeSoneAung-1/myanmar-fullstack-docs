---
title: "Request Response များ၏ နမူနာများ ဖန်တီးခြင်း (Examples of Request Responses)"
description: "Postman examples တွေ ဆိုတာ ဘာလဲ — response ကို example အဖြစ် သိမ်းခြင်း၊ custom example ဖန်တီးခြင်း၊ example တွေကို စမ်းသုံး/တည်းဖြတ်/share/comment/duplicate/delete လုပ်ခြင်းနဲ့ documentation မှာ သုံးခြင်း"
order: 20
source: "https://learning.postman.com/docs/use/send-requests/response-data/examples/"
status: translated
updated: 2026-09-02
---

*Examples* (နမူနာများ) တွေက ကိုယ့် API endpoints တွေ လက်တွေ့မှာ ဘယ်လို အလုပ်လုပ်လဲဆိုတာ ပြသပေးပြီး — requests နဲ့ responses တွေ ဘယ်လို အလုပ်လုပ်သလဲဆိုတာကို အသေးစိတ် နားလည်စေပါတယ်။ Response တစ်ခုကို သိမ်းခြင်းအားဖြင့် request တစ်ခုထဲကို example ထည့်နိုင်သလို — သီးခြား use case (အသုံးပြုမှု အခြေအနေ) တစ်ခုကို ဖော်ပြဖို့ custom response (ကိုယ်ပိုင် response) တစ်ခုနဲ့လည်း example ဖန်တီးနိုင်ပါတယ်။ Examples တွေ ဖန်တီးပြီးတာနဲ့ — mock server တစ်ခု setup လုပ်ဖို့ ဒါမှမဟုတ် ကိုယ့် API documentation ထဲမှာ အသေးစိတ် ပိုထည့်ဖို့ သုံးနိုင်ပါတယ်။

## Examples တွေအကြောင်း နားလည်ခြင်း

Postman မှာ example တစ်ခုဆိုတာ — *request* တစ်ခုနဲ့ သူနဲ့ ဆက်စပ်တဲ့ *response* တစ်ခုကို တွဲထားတဲ့ အတွဲတစ်ခု ဖြစ်ပါတယ်။ Example တစ်ခုစီမှာ request အပိုင်း (method, URL, parameters, headers နဲ့ body) နဲ့ response အပိုင်း (status code, body နဲ့ headers) တွေ ပါဝင်ပါတယ်။ Collections တွေထဲက requests တွေထဲကို examples တွေ ထည့်နိုင်ပြီး — request တစ်ခုမှာ examples အများအပြား ရှိနိုင်ပါတယ်။

Request တစ်ခုအတွက် examples အများကြီး ထားခြင်းက — endpoint တစ်ခုက request တစ်ခုကို နည်းအမျိုးမျိုးနဲ့ ဘယ်လို response ပြန်နိုင်လဲဆိုတာ ဖော်ပြဖို့ အသုံးဝင်ပါတယ်။ Status code အမျိုးမျိုး (၂၀၀ ဒါမှမဟုတ် ၄၀၄ လိုမျိုး) နဲ့ response ပြန်တဲ့ examples တွေ ဒါမှမဟုတ် — data အမျိုးမျိုး (ဒါမှမဟုတ် data လုံးဝမရှိ) ပြန်တဲ့ examples တွေ ထားနိုင်ပါတယ်။

Examples တွေက နည်းလမ်းများစွာနဲ့ အသုံးဝင်ပါတယ်။ Developer တွေနဲ့ tester တွေက — endpoint တစ်ခုက အခြေအနေအမျိုးမျိုးမှာ ဘယ်လို လုပ်ဆောင်လဲ ပိုနားလည်ဖို့ examples တွေကို ကိုးကားနိုင်ပါတယ်။ API မပြီးသေးခင် developer တွေနဲ့ tester တွေ ကိုယ့် API ကို မှီပြီး [code စရေးနိုင်အောင်](/docs/postman/testing) — examples တွေကို [mock servers တွေ setup လုပ်ဖို့](https://learning.postman.com/docs/design-apis/mock-apis/set-up-mock-servers/)လည်း သုံးနိုင်ပါတယ်။ ဒါ့အပြင် — ကိုယ့် API ကို သုံးတဲ့ ဘယ်သူမဆို အကျိုးရှိစေဖို့ — examples တွေကို ကိုယ့် API ရဲ့ [public documentation](https://learning.postman.com/docs/publishing-your-api/publishing-your-docs/) ထဲမှာလည်း ထည့်သွင်းနိုင်ပါတယ်။

## Example တစ်ခု ထည့်ခြင်း

Example တစ်ခုက အမြဲတမ်း [collection](https://learning.postman.com/docs/use/send-requests/create-requests/intro-to-collections/) တစ်ခုထဲက [request](/docs/postman/create-requests) တစ်ခုနဲ့ ဆက်စပ်နေပြီး — request တစ်ခုမှာ example တစ်ခုထက်ပိုပြီး ရှိနိုင်ပါတယ်။ Request တစ်ခုထဲ example ထည့်ဖို့ — request ကို ပို့ပြီး response ကို example အဖြစ် သိမ်းပါ။ ဒါမှမဟုတ် — request တစ်ခုထဲ example တစ်ခုကို ကိုယ်တိုင် ထည့်ကာ custom response တစ်ခု သတ်မှတ်နိုင်ပါတယ်။ နည်းတစ်နည်းနဲ့ ပဲ ထည့်ထည့် — example ကို ဘယ်အချိန်မဆို တည်းဖြတ်နိုင်ပါတယ်။

Postman ရဲ့ စွမ်းဆောင်ရည် ကောင်းစေဖို့ — example responses တွေက 5 MB ထက် ငယ်ရပါမယ်။

### Response တစ်ခုကို example အဖြစ် သိမ်းခြင်း

Postman မှာ [response](https://learning.postman.com/docs/use/send-requests/response-data/responses/) တစ်ခုကို သိမ်းတဲ့အခါ — example အဖြစ် သိမ်းဖို့ option ရှိပါတယ်။

1. Sidebar ထဲက **Items** tab ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပါ။
3. Request တစ်ခုကို ဖွင့်ပြီး **Send** ကို နှိပ်ပါ။
4. Response pane ထဲမှာ **Save Response** ကို နှိပ်ပါ။

Streaming methods ပါတဲ့ [gRPC examples](https://learning.postman.com/docs/use/send-requests/protocols/grpc/using-grpc-examples/) တွေမှာတော့ — response/message stream ကို example အဖြစ် မသိမ်းခင် stream ကို အရင် အဆုံးသတ်ရပါမယ်။

### Custom example တစ်ခု ထည့်ခြင်း

Custom example တစ်ခုနဲ့ဆိုရင် — [request](/docs/postman/create-requests) ရော [response](https://learning.postman.com/docs/use/send-requests/response-data/responses/) ပါ ပုံစံကို — status code နဲ့ response body အပါအဝင် — ကိုယ်တိုင် သတ်မှတ်နိုင်ပါတယ်။

1. Sidebar ထဲက **Items** tab ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပါ။
3. Request တစ်ခုဘေးက **View more actions** ကို နှိပ်ပြီး **Add example** ကို ရွေးပါ။
4. Example အတွက် နာမည်တစ်ခု ထည့်ပါ။
5. Example ရဲ့ request အပိုင်းကို တည်းဖြတ်ပါ:

   * လိုအပ်တဲ့ parameters ဒါမှမဟုတ် headers တွေ ထည့်ပါ။
   * Request body ကို ရိုက်ထည့်ပြီး content type တစ်ခု ရွေးပါ။

6. Example ရဲ့ response အပိုင်းကို တည်းဖြတ်ပါ:

   * **Status Code** တစ်ခု (ဥပမာ — `200` ဒါမှမဟုတ် `404`) ထည့်ပါ။
   * Response body ကို ရိုက်ထည့်ပြီး content type တစ်ခု ရွေးပါ။
   * လိုအပ်တဲ့ headers တွေ ထည့်ပါ။

7. **Save** ကို နှိပ်ပါ။

## Example တစ်ခုကို စမ်းသုံးခြင်း

Examples တွေကို ဆက်စပ်နေတဲ့ requests တွေနဲ့အတူ collection ထဲမှာ သိမ်းထားပါတယ်။ Example တစ်ခုကို tab အသစ်တစ်ခုမှာ request တစ်ခုအနေနဲ့ ဖွင့်ပြီး စမ်းသုံးနိုင်ပါတယ်။

1. Sidebar ထဲက **Items** tab ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပါ။
3. Request တစ်ခုကို ရွေးပြီး — ဖွင့်ဖို့ example တစ်ခုကို ရွေးပါ။
4. **Try** ကို နှိပ်ရင် — example နဲ့ ဆက်စပ်နေတဲ့ request ကို ဖွင့်ပေးပါတယ်။ Request က tab အသစ်တစ်ခုမှာ — example ရဲ့ request အသေးစိတ်တွေ အပြည့်ဖြည့်ထားတဲ့ အနေနဲ့ ဖွင့်ပါတယ်။

   စမ်းသုံးနေတဲ့ example ရဲ့ နာမည်ကို workbench ထဲမှာ request နာမည်ရဲ့ ဘေးမှာ ပြပါတယ်။ Example နာမည်ကို နှိပ်ရင် — tab သီးခြားတစ်ခုမှာ ဖွင့်ပေးပါတယ်။

5. Request ပို့ပြီး response ကြည့်ဖို့ **Send** ကို နှိပ်ပါ။
6. Request နဲ့ response အသေးစိတ်တွေကို ပြန်လည် သုံးသပ်ပါ။
7. (Optional) Request အသစ်ကို ကိုယ့် workspace ထဲက collection အသစ် ဒါမှမဟုတ် ရှိပြီးသား collection တစ်ခုထဲ သိမ်းဖို့ **Save** ကို နှိပ်နိုင်ပါတယ်။
8. Request အသစ် သိမ်းမယ့် နေရာတစ်ခု ရွေးပြီး **Save** ကို နှိပ်ပါ။

## Example တစ်ခုကို တည်းဖြတ်ခြင်း

Example တစ်ခုကို ဘယ်အချိန်မဆို တည်းဖြတ်နိုင်ပါတယ် — sensitive tokens တွေ ဖယ်ရှားခြင်း၊ status code ပြောင်းခြင်း ဒါမှမဟုတ် တခြား ပြင်ဆင်မှုတွေ လုပ်နိုင်ပါတယ်။

Example တစ်ခုကို တည်းဖြတ်ဖို့:

1. Sidebar ထဲက **Items** tab ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပါ။
3. Request တစ်ခုကို ရွေးပြီး ဖွင့်ဖို့ example တစ်ခုကို နှိပ်ပါ။
4. Example ရဲ့ request ဒါမှမဟုတ် response မှာ ပြောင်းလဲမှုတွေ လုပ်ပါ။
5. **Save** ကို နှိပ်ပါ။

Example ကို စမ်းသုံးပြီးမှ တည်းဖြတ်ချင်ရင်:

1. Sidebar ထဲက **Items** tab ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပါ။
3. Request တစ်ခုကို ရွေးပြီး ဖွင့်ဖို့ example တစ်ခုကို ရွေးပါ။
4. Example ကို tab အသစ်တစ်ခုမှာ request တစ်ခုအနေနဲ့ ဖွင့်ဖို့ **Try** ကို နှိပ်ပါ။
5. Request အသစ်မှာ ပြောင်းလဲမှုတွေ လုပ်ပါ။
6. **Send** ကို နှိပ်ပါ။
7. Response pane ထဲမှာ **Save Response** ကို နှိပ်ပါ။

   Request အသစ်ကို အလိုအလျောက် သိမ်းပေးမှာ မဟုတ်ပါဘူး။

Request အသစ်ကို ကိုယ့် workspace ထဲက collection အသစ် ဒါမှမဟုတ် ရှိပြီးသား collection တစ်ခုထဲ သိမ်းဖို့ **Save** ကို နှိပ်နိုင်ပါတယ်။ ပြီးရင် — request အသစ် သိမ်းမယ့် နေရာတစ်ခု ရွေးပြီး **Save** ကို နှိပ်ပါ။

## Example တစ်ခုကို share လုပ်ခြင်း

Sidebar ထဲမှာ share လုပ်ချင်တဲ့ example ကို ရွေးပြီး — collaborators တွေနဲ့ examples တွေကို share လုပ်နိုင်ပါတယ်။ Share လုပ်ချင်တဲ့ example ဘေးက **View more actions** ကို နှိပ်ပြီး **Share** ကို ရွေးပါ။

Examples တွေ share လုပ်ခြင်းအကြောင်း အသေးစိတ်အတွက် — [Postman မှာ ကိုယ့်အလုပ်တွေကို share လုပ်ခြင်း](https://learning.postman.com/docs/collaborating-in-postman/sharing/) ကို ကြည့်ပါ။

## Example တစ်ခုထဲ comment ထည့်ခြင်း

ပိုပြီး နားလည်စေဖို့ context တွေ ဒါမှမဟုတ် မေးခွန်းတွေ ထည့်ဖို့ — example တစ်ခုထဲမှာ comments တွေ ထည့်နိုင်ပါတယ်။ Comments တွေကို collection ကို ဝင်ရောက်ခွင့်ရှိတဲ့ ဘယ်သူမဆို မြင်နိုင်ပါတယ်။

Comment ထည့်ဖို့:

1. ညာဘက် sidebar ထဲက **Comments** ကို ရွေးပြီး ကိုယ့် comment ကို ရိုက်ထည့်ပါ။
2. Comment ထည့်ဖို့ **Comment** ကို နှိပ်ပါ။

[Examples တွေပေါ်မှာ comments တွေသုံးပြီး ပူးပေါင်းလုပ်ဆောင်ခြင်း](https://learning.postman.com/docs/collaborating-in-postman/comments/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Example တစ်ခုကို duplicate လုပ်ခြင်း

ရှိပြီးသား example တစ်ခုကို အခြေခံပြီး example အသစ်တစ်ခု ထည့်ချင်ရင် — duplicate လုပ်နိုင်ပါတယ်။ ပြီးရင် — copy လုပ်ထားတဲ့ example ရဲ့ နာမည်, status code ဒါမှမဟုတ် request/response ရဲ့ ဘယ်အပိုင်းကိုမဆို တည်းဖြတ်နိုင်ပါတယ်။

Example တစ်ခုကို duplicate လုပ်ဖို့:

1. Sidebar ထဲက **Items** tab ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပါ။
3. Example တစ်ခုဘေးက **View more actions** ကို နှိပ်ပြီး **Duplicate** ကို ရွေးပါ။
4. Example ရဲ့ request ဒါမှမဟုတ် response မှာ ပြောင်းလဲမှုတွေ လုပ်ပါ။
5. **Save** ကို နှိပ်ပါ။

## Example တစ်ခုကို ဖျက်ခြင်း

Example တစ်ခုကို ဖျက်လိုက်ရင် — collection နဲ့ ဆက်စပ်နေတဲ့ API documentation ကနေ ဖယ်ရှားသွားပါတယ်။ Setup လုပ်ထားတဲ့ mock servers တွေကလည်း response ပြန်ပို့ဖို့ အဲဒီ example ကို နောက်ထပ် သုံးလို့ မရတော့ပါဘူး။

Example တစ်ခုကို ဖျက်ဖို့:

1. Sidebar ထဲက **Items** tab ကို နှိပ်ပါ။
2. **Collections** ကို နှိပ်ပါ။
3. Example တစ်ခုဘေးက **View more actions** ကို နှိပ်ပြီး **Delete** ကို ရွေးပါ။
4. အတည်ပြုဖို့ **Delete** ကို နှိပ်ပါ။

## Documentation ထဲမှာ examples တွေ သုံးခြင်း

Postman က သင်ဖန်တီးလိုက်တဲ့ collection တိုင်းအတွက် [documentation ကို အလိုအလျောက် ဖန်တီးပေးပါတယ်](https://learning.postman.com/docs/publishing-your-api/document-a-collection/)။ Generated documentation ထဲမှာ — collection ထဲ ထည့်ထားတဲ့ [examples တွေ ပါဝင်ပါတယ်](https://learning.postman.com/docs/publishing-your-api/authoring-your-documentation/#including-examples)။ Example တစ်ခုကို တည်းဖြတ်လိုက်ရင် — documentation ထဲမှာလည်း အလိုအလျောက် update ဖြစ်သွားပါတယ်။

Examples တွေက ကိုယ့် API အတွက် အသေးစိတ်နဲ့ ရှင်းလင်းချက် ပိုပေးပြီး — API development မှာ team အတူတကွ အလုပ်လုပ်နိုင်အောင် ကူညီပေးပါတယ်။ Front-end developers, back-end developers နဲ့ testers တွေ အားလုံး — documentation ထဲက examples တွေကို လမ်းညွှန်အဖြစ် ဒါမှမဟုတ် [mock servers](https://learning.postman.com/docs/design-apis/mock-apis/set-up-mock-servers/) တွေ setup လုပ်ဖို့ သုံးပြီး — အပြိုင် (parallel) အလုပ်လုပ်နိုင်ပါတယ်။

Examples တွေကို ကမ္ဘာပေါ်က ဘယ်သူမဆို အများပြည်သူ မြင်နိုင်အောင် — [ကိုယ့် documentation ကို publish လုပ်နိုင်ပါတယ်](https://learning.postman.com/docs/publishing-your-api/publishing-your-docs/)။

## နောက်ထပ် ဆောင်ရွက်စရာများ

Examples တွေကို သုံးပြီး mock server တစ်ခု setup လုပ်နိုင်သလို — ကိုယ့် documentation ကိုလည်း မြှင့်တင်နိုင်ပါတယ်။

* Mock server တစ်ခု setup လုပ်ဖို့ examples တွေ သုံးနည်း လေ့လာရန် — [Mock server တစ်ခု deploy လုပ်ခြင်း](https://learning.postman.com/docs/design-apis/mock-apis/set-up-mock-servers/) ကို သွားပါ။
* ကိုယ့် API documentation ထဲ examples တွေ ထည့်သွင်းနည်း လေ့လာရန် — [Postman မှာ collection တစ်ခုကို document လုပ်ခြင်း](https://learning.postman.com/docs/publishing-your-api/document-a-collection/) ကို သွားပါ။
