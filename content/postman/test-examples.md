---
title: "Postman Test Script နမူနာများ (Test Script Examples)"
description: "API testing အခြေအနေအမျိုးမျိုးအတွက် post-response script နမူနာများ — status code, response time, metadata, headers, cookies, response body, parsing, JSON Schema စစ်ဆေးခြင်း စသည်"
order: 29
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-examples/"
status: translated
updated: 2026-09-02
---

ကိုယ့်ရဲ့ test logic နဲ့ ရလဒ်တွေကို ဘယ်လို ရယူချင်လဲဆိုတာပေါ် မူတည်ပြီး — test script တစ်ခုထဲမှာ test assertions တွေကို ပုံစံအမျိုးမျိုးနဲ့ ရေးလို့ရပါတယ်။ ဒီစာမျက်နှာမှာ Postman ထဲက API testing အခြေအနေအမျိုးမျိုးအတွက် post-response script နမူနာတွေ ပေးထားပါတယ်။ ဒီ post-response scripts တွေကို ကိုယ့် request ထဲမှာ သုံးပြီး — response data တွေကို parse လုပ်ကာ assertions တွေ လုပ်နိုင်ပါတယ်။ Response တည်ဆောက်ပုံကို validate လုပ်ခြင်းနဲ့ အများသုံး test errors တွေကို troubleshoot လုပ်ဖို့အတွက်လည်း ဒီ scripts တွေကို သုံးနိုင်ပါတယ်။

ဒီ section မှာ assertion တွေ ရေးတဲ့ နည်းလမ်းအများသုံးတချို့ ပါဝင်ပြီး — [pm.\* APIs](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/overview/) ကို သုံးပြီး tests တွေ ဘယ်လို ရေးလဲ ရှင်းပြတဲ့ နမူနာစာရင်းတစ်ခုလည်း ပါပါတယ်။ ဒီ tests တွေကို စမ်းကြည့်ချင်ရင် — Postman မှာ request တစ်ခု ဖွင့်ပြီး **Scripts > Post-response** tab ကို ရွေးကာ ဥပမာထဲက JavaScript code တွေကို ရိုက်ထည့်ပါ။

## Status code တစ်ခုကို test လုပ်ခြင်း

Response ရဲ့ status code ကို test လုပ်ဖို့ — [pm.response](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-response/) ပေါ်က `statusCode` property ကို သုံးနိုင်ပါတယ်။

```js
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});
```

ဒီ code က `pm` library ရဲ့ `test` method ကို run လုပ်ပါတယ်။ Text string က test output ထဲမှာ ပေါ်ပါလိမ့်မယ်။ Test ထဲက function က assertion တစ်ခုကို ကိုယ်စားပြုပြီး — ဒီနမူနာမှာတော့ `to.have` chain ကို သုံးပြီး assertion ကို ဖော်ပြထားပါတယ်။

ဒီ test က API က ပြန်ပေးတဲ့ response code ကို စစ်ဆေးပါတယ်။ Response code က `200` ဆိုရင် test က pass ဖြစ်ပြီး — မဟုတ်ရင် fail ဖြစ်ပါတယ်။

![Test output](https://assets.postman.com/postman-docs/v12/example-test-assertion-result.png)

Tests တွေ pass ဒါမှမဟုတ် fail ဖြစ်တဲ့အခါ test results တွေ ဘယ်လိုပုံစံ ရှိလဲ ကြည့်ချင်ရင် — assertion code ထဲက status code ကို ပြောင်းပြီး request ကို ပြန်ပို့ကြည့်ပါ။

အဲဒီအတိုင်းပဲ — [pm.expect](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-test-expect/) method ကိုလည်း သုံးပြီး ဒီအတိုင်း assert လုပ်နိုင်ပါတယ်။

```js
pm.test("Status code is 200", () => {
  pm.expect(pm.response.code).to.eql(200);
});
```

Status code က 0 ဟုတ်မဟုတ် စစ်ဖို့ — `pm.response.to.be.ok` ကို shorthand အနေနဲ့ သုံးနိုင်ပါတယ်။

Assertion syntax options တွေရဲ့ အပြည့်အစုံကို — [Chai Assertion Library Docs](https://www.chaijs.com/api/bdd/) မှာ ကြည့်နိုင်ပါတယ်။

### Response time တွေကို test လုပ်ခြင်း

Response time က သတ်မှတ်ထားတဲ့ အကွာအဝေး (range) ထဲမှာ ရှိမရှိ test လုပ်ဖို့:

```js
pm.test("Response time is less than 200ms", () => {
  pm.expect(pm.response.responseTime).to.be.below(200);

  // ဒါမှမဟုတ်
  pm.response.to.have.responseTime.not.above(200);

  // pm.expect သုံးပြီး
  pm.expect(pm.response.responseTime).to.be.below(300);
});
```

Streaming methods သုံးထားတဲ့ requests တွေအတွက် — `pm.response.responseTime` က request တစ်ခုလုံး run ဖို့ ကြာတဲ့ total duration ကို ဖော်ပြပါတယ်။

## Metadata ကို test လုပ်ခြင်း

Response metadata ရှိမရှိ စစ်ဆေးဖို့:

```javascript
pm.test('"content-type" is present in response metadata', () => {
  pm.response.to.have.metadata('content-type');

  // pm.expect သုံးပြီး
  pm.expect(pm.response.metadata.has('content-type')).to.be.true;
});
```

Metadata ရဲ့ တန်ဖိုးကိုလည်း assert လုပ်နိုင်ပါတယ်:

```javascript
pm.test('"content-type" response metadata is "application/grpc"', () => {
  pm.response.to.have.metadata('content-type', 'application/grpc');

  // pm.expect သုံးပြီး
  pm.expect(pm.response.metadata.get('content-type')).to.equal('application/grpc');
});
```

Request metadata တွေအတွက်လည်း — [pm.request](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-request/) object ကို သုံးပြီး အလားတူ assertions တွေ ရေးနိုင်ပါတယ်။

## Response trailers တွေကို test လုပ်ခြင်း

Response trailer တစ်ခု ပါမပါ စစ်ဆေးဖို့:

```javascript
pm.test('"grpc-status-details-bin" is present in response trailers', () => {
  pm.response.to.have.trailer('grpc-status-details-bin');

  // pm.expect သုံးပြီး
  pm.expect(pm.response.trailers.has('grpc-status-details-bin')).to.be.true;
});
```

Trailer ရဲ့ တန်ဖိုးကိုလည်း assert လုပ်နိုင်ပါတယ်:

```javascript
pm.test('"grpc-status-details-bin" response trailer is "dummy-value"', () => {
  pm.response.to.have.trailer('grpc-status-details-bin', 'dummy-value');

  // pm.expect သုံးပြီး
  pm.expect(pm.response.trailers.get('grpc-status-details-bin')).to.equal('dummy-value');
});
```

## Response messages တွေကို test လုပ်ခြင်း

Bidirectional streaming method လိုမျိုး — response message အများကြီး ပြန်ပေးတဲ့ requests တွေအတွက် ဒီ section ထဲက tests တွေက message အားလုံးကို ပေးထားတဲ့ assertion နဲ့ စစ်ပါတယ်။ Unary ဒါမှမဟုတ် client streaming method တွေလိုမျိုး — response message တစ်ခုတည်းပဲ ပြန်ပေးတဲ့ requests တွေအတွက်ကတော့ assertion ကို အဲဒီ message တစ်ခုပေါ်မှာပဲ test လုပ်ပါတယ်။

`pm.response.messages.to.*` ကို သုံးပြီး assertions တွေ ရေးတဲ့အခါ — message content တွေရဲ့ array တစ်ခုကို assert လုပ်နေတာ ဖြစ်ပြီး — [pm.response](https://learning.postman.com/docs/tests-and-scripts/write-scripts/postman-sandbox-reference/pm-response/) message object တစ်ခုလုံးကို မဟုတ်ပါဘူး။

ဒီ section ထဲက assertions တွေကို `pm.request` object သုံးပြီး — request messages တွေပေါ်မှာလည်း test လုပ်နိုင်ပါတယ်။

### Message တစ်ခု ရှိမရှိ test လုပ်ခြင်း

Response message တစ်ခုရဲ့ တည်ရှိမှုကို (တိကျစွာ — strictly) test လုပ်ဖို့:

```javascript
pm.test('Correct user details are received', () => {
  pm.response.to.have.message({
    userId: '123',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-555-555-5555',
    age: 30,
    company: 'XYZ'
  });
});
```

### Property တစ်ခုပါတဲ့ message ကို test လုပ်ခြင်း

ပေးထားတဲ့ object ရဲ့ properties တွေက — response အနေနဲ့ ရလာတဲ့ message တစ်ခုခုရဲ့ subset ဖြစ်မဖြစ် assert လုပ်နိုင်ပါတယ်:

```javascript
pm.test('User details are updated successfully', () => {
  pm.response.messages.to.include({
    action: 'update-user-details',
    status: 'success'
  });
});
```

`pm.response.messages.to.include()` က default အနေနဲ့ `.deep` ကို သုံးပါတယ်။

### Message အားလုံးမှာ တူညီတဲ့ property ရှိမရှိ test လုပ်ခြင်း

ရလာတဲ့ message တွေအားလုံးမှာ common property တစ်ခု ရှိမရှိ စစ်ဆေးဖို့:

```javascript
pm.test('All users have "company" in their profile', () => {
  pm.response.messages.to.have.property('isActive');
});
```

Common property ရဲ့ တန်ဖိုးကိုလည်း assert လုပ်နိုင်ပါတယ်:

```javascript
pm.test('All users are in same company', () => {
  pm.response.messages.to.have.property('company', 'XYZ');
});
```

`pm.response.messages.to.have.property()` က default အနေနဲ့ `.deep` နဲ့ `.nested` နှစ်ခုလုံးကို သုံးပါတယ်။

### Messages တွေကို JSON Schema နဲ့ နှိုင်းယှဉ် test လုပ်ခြင်း

ရလာတဲ့ messages တွေက ပေးထားတဲ့ JSON Schema နဲ့ ကိုက်ညီမညီ assert လုပ်နိုင်ပါတယ်:

```javascript
const schema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      pattern: "^[a-z0-9_-]{3,16}$"
    }
  }
};

pm.test('All response messages have correct username', () => {
  pm.response.messages.to.have.jsonSchema(schema);
});

pm.test('Assert on a specific message', () => {
  pm.expect(pm.response.messages.idx(10).data).to.have.jsonSchema(schema);
});
```

## Message stream တစ်ခုနဲ့ အလုပ်လုပ်ခြင်း

အောက်က နမူနာတွေက message stream တစ်ခုနဲ့ ဘယ်လို အလုပ်လုပ်ပြီး assertions တွေ ရေးလဲ ပြပါတယ်။

```javascript
pm.test('Should receive keep-alive message roughly every 5 seconds', () => {
  const keepAliveMessage = pm.response.messages.filter({
    data: {
      type: 'keep-alive'
    }
  });

  for (let i = 1; i < keepAliveMessage.length; i++) {
    const time1 = keepAliveMessage[i-1].timestamp;
    const time2 = keepAliveMessage[i].timestamp;

    pm.expect(time2-time1).to.be.within(4800, 5200);
  }
});
```

```javascript
pm.test('Every request message should have a corresponding response message', () => {
  pm.request.messages.each((reqMsg) => {
    pm.response.messages.to.include({ id: reqMsg.data.id });
  });
});
```

## Assertions အများအပြား တွဲသုံးခြင်း

Test တစ်ခုထဲမှာ assertions အများကြီး ထည့်နိုင်ပြီး — ဆက်စပ်နေတဲ့ assertions တွေကို အုပ်စုဖွဲ့ဖို့ သုံးနိုင်ပါတယ်:

```js
pm.test("The response has all properties", () => {
    // response JSON ကို parse လုပ်ပြီး property သုံးခုကို test လုပ်ခြင်း
    const responseJson = pm.response.json();
    pm.expect(responseJson.type).to.eql('vip');
    pm.expect(responseJson.name).to.be.a('string');
    pm.expect(responseJson.id).to.have.lengthOf(1);
});
```

အထဲမှာ ပါတဲ့ assertion တစ်ခုခု fail ဖြစ်ရင် — test တစ်ခုလုံး fail ဖြစ်ပါတယ်။ Test pass ဖြစ်ဖို့ဆိုရင် assertions အားလုံး အောင်မြင်ရပါမယ်။

## Response body data ကို parse လုပ်ခြင်း

ကိုယ့် responses တွေပေါ်မှာ assertions လုပ်ဖို့ — အရင်ဆုံး data တွေကို assertions တွေမှာ သုံးလို့ရတဲ့ JavaScript object တစ်ခုအနေနဲ့ parse လုပ်ရပါမယ်။

JSON data တွေကို parse လုပ်ဖို့ အောက်ပါ syntax ကို သုံးပါ:

```js
const responseJson = pm.response.json();
```

XML parse လုပ်ဖို့ — [xml2js](https://www.npmjs.com/package/xml2js) library ကို [`require` method](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/#use-external-libraries-in-packages) နဲ့ သုံးပါ:

```js
var parseString = require('xml2js').parseString;
parseString(pm.response.text(), function (err, result) {
    console.log(result);
});
```

Complex ဖြစ်တဲ့ XML responses တွေနဲ့ အလုပ်လုပ်နေရင် — [Console logging](https://learning.postman.com/docs/use/send-requests/response-data/troubleshooting-api-requests/#debugging-in-the-console) က အသုံးဝင်ပါတယ်။

CSV parse လုပ်ဖို့ — [CSV parse (csv-parse/lib/sync)](https://csv.js.org/parse/) utility ကို သုံးပါ:

```js
const parse = require('csv-parse/lib/sync');
const responseJson = parse(pm.response.text());
```

HTML parse လုပ်ဖို့ — [cheerio](https://cheerio.js.org/) ကို [`require` method](https://learning.postman.com/docs/tests-and-scripts/write-scripts/packages/package-library/#use-external-libraries-in-packages) နဲ့ သုံးပါ:

```js
const $ = require('cheerio').load(pm.response.text());
//testing အတွက် html ကို output လုပ်ခြင်း
console.log($.html());
```

### Parse မလုပ်နိုင်တဲ့ responses တွေကို ကိုင်တွယ်ခြင်း

Response body က JSON, XML, HTML, CSV ဒါမှမဟုတ် တခြား parse လို့ရတဲ့ data format တစ်ခုခုအနေနဲ့ မရှိလို့ — JavaScript object အဖြစ် parse မလုပ်နိုင်ရင်တောင် data ပေါ်မှာ assertions လုပ်လို့ရပါသေးတယ်။

Response body ထဲမှာ string တစ်ခု ပါမပါ test လုပ်ခြင်း:

```js
pm.test("Body contains string",() => {
  pm.expect(pm.response.text()).to.include("customer_id");
});
```

ဒါက string ကို ဘယ်နေရာမှာ တွေ့လဲဆိုတာကိုတော့ မပြောပါဘူး — ဘာလို့လဲဆိုတော့ response body တစ်ခုလုံးပေါ်မှာ test လုပ်နေလို့ပါ။ Response က string တစ်ခုနဲ့ ကိုက်ညီမညီ test လုပ်ခြင်း:

```js
pm.test("Body is string", function () {
  pm.response.to.have.body("whole-body-text");
});
```

## HTTP response ပေါ်မှာ assertions လုပ်ခြင်း

ကိုယ့်ရဲ့ tests တွေက request response ရဲ့ ကဏ္ဍအမျိုးမျိုးကို စစ်ဆေးနိုင်ပါတယ် — [body](#response-body-ကို-test-လုပ်ခြင်း), [status codes](#status-codes-တွေကို-test-လုပ်ခြင်း), [headers](#headers-တွေကို-test-လုပ်ခြင်း), [cookies](#cookies-တွေကို-test-လုပ်ခြင်း), [response times](#response-time-တွေကို-test-လုပ်ခြင်း) စတာတွေ အပါအဝင်ပါ။

### Response body ကို test လုပ်ခြင်း

Response body ထဲက တန်ဖိုးတချို့ကို စစ်ဆေးခြင်း:

```js
/* Response ရဲ့ တည်ဆောက်ပုံမှာ အောက်ပါအတိုင်း ဖြစ်သည်:
{
  "name": "Jane",
  "age": 23
},
*/
pm.test("Person is Jane", () => {
  const responseJson = pm.response.json();
  pm.expect(responseJson.name).to.eql("Jane");
  pm.expect(responseJson.age).to.eql(23);
});
```

### Status codes တွေကို test လုပ်ခြင်း

Response ရဲ့ status code ကို test လုပ်ခြင်း:

```js
pm.test("Status code is 201", () => {
  pm.response.to.have.status(201);
});
```

Status code က စာရင်းထဲက တစ်ခုခု ဖြစ်မဖြစ် test ချင်ရင် — ဖြစ်နိုင်တဲ့ codes တွေအားလုံးကို array တစ်ခုထဲ ထည့်ပြီး `oneOf` ကို သုံးပါ:

```js
pm.test("Successful POST request", () => {
  pm.expect(pm.response.code).to.be.oneOf([201,202]);
});
```

Status code ရဲ့ စာသား (name) ကို စစ်ဆေးခြင်း:

```js
pm.test("Status code name has string", () => {
  pm.response.to.have.status("Created");
});
```

### Headers တွေကို test လုပ်ခြင်း

Response header တစ်ခု ပါမပါ စစ်ဆေးခြင်း:

```js
pm.test("Content-Type header is present", () => {
  pm.response.to.have.header("Content-Type");
});
```

Response header တစ်ခုရဲ့ တန်ဖိုးက သတ်မှတ်ချက်နဲ့ ကိုက်ညီမညီ test လုပ်ခြင်း:

```js
pm.test("Content-Type header is application/json", () => {
  pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');
});
```

### Cookies တွေကို test လုပ်ခြင်း

Response ထဲမှာ cookie တစ်ခု ပါမပါ test လုပ်ခြင်း:

```js
pm.test("Cookie isLoggedIn is present", () => {
  pm.expect(pm.cookies.has('isLoggedIn')).to.be.true;
});
```

Cookie တစ်ခုရဲ့ တန်ဖိုးကို သီးခြား စစ်ဆေးခြင်း:

```js
pm.test("Cookie isLoggedIn has value 1", () => {
  pm.expect(pm.cookies.get('isLoggedIn')).to.eql('1');
});
```

## အသုံးများတဲ့ assertion နမူနာများ

အောက်က အသုံးများတဲ့ assertion နမူနာတွေက ကိုယ့် post-response scripts တွေ ရေးရာမှာ အထောက်အကူ ဖြစ်စေနိုင်ပါတယ်။

Assertions တွေထဲမှာ ဘာတွေ ထည့်လို့ရသလဲ ပိုပြီး ကျယ်ကျယ်ပြန့်ပြန့် သိချင်ရင် — [Chai Assertion Library Docs](https://www.chaijs.com/api/bdd/) ကို ကြည့်ပါ။

### Response တန်ဖိုးတစ်ခုကို variable တစ်ခုနဲ့ နှိုင်းယှဉ် assert လုပ်ခြင်း

Response ရဲ့ property တစ်ခုက variable တစ်ခုရဲ့ တန်ဖိုးနဲ့ တူမတူ စစ်ဆေးခြင်း (ဒီနမူနာမှာ environment variable ကို သုံးထားပါတယ်):

```js
pm.test("Response property matches environment variable", function () {
  pm.expect(pm.response.json().name).to.eql(pm.environment.get("name"));
});
```

Post-response scripts တွေထဲမှာ variables တွေ သုံးခြင်းအကြောင်း ပိုသိချင်ရင် — [Variables သုံးခြင်း](/docs/postman/variables) ကို ကြည့်ပါ။

### Value တစ်ခုရဲ့ type ကို assert လုပ်ခြင်း

Response ရဲ့ ဘယ်အစိတ်အပိုင်းမဆို type ကို test လုပ်ခြင်း:

```js
/* Response ရဲ့ တည်ဆောက်ပုံမှာ အောက်ပါအတိုင်း ဖြစ်သည်:
{
  "name": "Jane",
  "age": 29,
  "hobbies": [
    "skating",
    "painting"
  ],
  "email": null
},
*/
const jsonData = pm.response.json();
pm.test("Test data type of the response", () => {
  pm.expect(jsonData).to.be.an("object");
  pm.expect(jsonData.name).to.be.a("string");
  pm.expect(jsonData.age).to.be.a("number");
  pm.expect(jsonData.hobbies).to.be.an("array");
  pm.expect(jsonData.website).to.be.undefined;
  pm.expect(jsonData.email).to.be.null;
});
```

### Array properties တွေကို assert လုပ်ခြင်း

Array တစ်ခု empty ဖြစ်မဖြစ်၊ items တချို့ ပါမပါ စစ်ဆေးခြင်း:

```js
/* Response ရဲ့ တည်ဆောက်ပုံမှာ အောက်ပါအတိုင်း ဖြစ်သည်:
{
  "errors": [],
  "areas": [ "goods", "services" ],
  "settings": [
    {
      "type": "notification",
      "detail": [ "email", "sms" ]
    },
    {
      "type": "visual",
      "detail": [ "light", "large" ]
    }
  ]
},
*/

const jsonData = pm.response.json();
pm.test("Test array properties", () => {
    //errors array က empty ဖြစ်သည်
  pm.expect(jsonData.errors).to.be.empty;
    //areas array ထဲမှာ "goods" ပါဝင်သည်
  pm.expect(jsonData.areas).to.include("goods");
    //notification settings object ကို ရယူခြင်း
  const notificationSettings = jsonData.settings.find
      (m => m.type === "notification");
  pm.expect(notificationSettings)
    .to.be.an("object", "Could not find the setting");
    //detail array ထဲမှာ "sms" ပါဝင်ရမည်
  pm.expect(notificationSettings.detail).to.include("sms");
    //detail array ထဲမှာ ဖော်ပြထားသမျှ အားလုံး ပါဝင်ရမည်
  pm.expect(notificationSettings.detail)
    .to.have.members(["email", "sms"]);
});
```

`.members` ထဲမှာ items တွေ စီထားတဲ့ အစဉ်က test ရလဒ်ကို မထိခိုက်ပါဘူး။

### Object properties တွေကို assert လုပ်ခြင်း

Object တစ်ခုမှာ keys ဒါမှမဟုတ် properties တွေ ရှိမရှိ assert လုပ်ခြင်း:

```js
/* Response ရဲ့ တည်ဆောက်ပုံမှာ အောက်ပါအတိုင်း ဖြစ်သည်:
{
  "a": 1,
  "b": 2
},
*/
pm.expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
pm.expect({a: 1, b: 2}).to.have.any.keys('a', 'b');
pm.expect({a: 1, b: 2}).to.not.have.any.keys('c', 'd');
pm.expect({a: 1}).to.have.property('a');
pm.expect({a: 1, b: 2}).to.be.a('object')
  .that.has.all.keys('a', 'b');
```

Target က `object`, `set`, `array` ဒါမှမဟုတ် `map` ဖြစ်နိုင်ပါတယ်။ `.keys` ကို `.all` ဒါမှမဟုတ် `.any` မပါဘဲ run ရင် — `.all` လို့ သတ်မှတ်ပါတယ်။ `.keys` ရဲ့ အပြုအမူက target ရဲ့ `type` ပေါ်မှာ မူတည်လို့ — `.a` နဲ့ တွဲပြီး `.keys` မသုံးခင် `type` ကို အရင် စစ်ဖို့ အကြံပြုပါတယ်။

### Value တစ်ခုက set တစ်ခုထဲမှာ ရှိမရှိ assert လုပ်ခြင်း

Response တန်ဖိုးတစ်ခုကို ခွင့်ပြုထားတဲ့ options စာရင်းတစ်ခုနဲ့ နှိုင်းယှဉ် စစ်ဆေးခြင်း:

```js
/* Response ရဲ့ တည်ဆောက်ပုံမှာ အောက်ပါအတိုင်း ဖြစ်သည်:
{
  "type": "Subscriber"
},
*/

pm.test("Value is in valid list", () => {
  pm.expect(pm.response.json().type)
    .to.be.oneOf(["Subscriber", "Customer", "User"]);
});
```

### Object တစ်ခု ပါဝင်မပါဝင် assert လုပ်ခြင်း

Object တစ်ခုက parent object ရဲ့ အစိတ်အပိုင်း ဖြစ်မဖြစ် စစ်ဆေးခြင်း:

```js
/* Response ရဲ့ တည်ဆောက်ပုံမှာ အောက်ပါအတိုင်း ဖြစ်သည်:
{
  "id": "d8893057-3e91-4cdd-a36f-a0af460b6373",
  "created": true,
  "errors": []
},
*/

pm.test("Object is contained", () => {
  const expectedObject = {
    "created": true,
    "errors": []
  };
  pm.expect(pm.response.json()).to.deep.include(expectedObject);
});
```

`.deep` assertion က သူ့နောက်မှာ ပါလာတဲ့ `.equal`, `.include`, `.members`, `.keys` နဲ့ `.property` assertions တွေအားလုံးကို — strict (`===`) equality အစား deep equality သုံးဖို့ ပြောင်းပေးပါတယ်။

### လက်ရှိ environment ကို assert လုပ်ခြင်း

Postman ထဲက [active environment](/docs/postman/managing-environments) ကို စစ်ဆေးခြင်း:

```js
pm.test("Check the active environment", () => {
  pm.expect(pm.environment.name).to.eql("Production");
});
```
