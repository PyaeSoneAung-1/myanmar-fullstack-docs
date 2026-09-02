---
title: "Node.js နဲ့ Data Fetching"
description: "Undici နဲ့ Fetch API အသုံးပြုပုံ — GET/POST request များ၊ fetch options စိတ်ကြိုက်ပြင်ဆင်ခြင်း (Ollama ဥပမာ), Pool သုံးပြီး connection ပြန်သုံးခြင်းနဲ့ streaming responses"
order: 29
source: "https://nodejs.org/en/learn/getting-started/fetch"
status: translated
updated: 2026-09-02
---

## နိဒါန်း

**Undici** ဆိုတာ Node.js ထဲက **fetch API** ကို အားဖြည့်ပေးနေတဲ့ HTTP client library ပါ။ သူ့ကို ဘာမှ အခြေခံမယူဘဲ ကနဦးကစပြီး ရေးထားတာဖြစ်လို့ — Node.js ထဲက built-in HTTP client ကို မမှီခိုပါဘူး။ High-performance application တွေအတွက် သင့်တော်စေတဲ့ feature တွေ အများကြီး ပါဝင်ပါတယ်။

Undici ရဲ့ specification လိုက်နာမှု အသေးစိတ်ကို [Undici documentation](https://undici.nodejs.org/#/?id=specification-compliance-1) မှာ ကြည့်နိုင်ပါတယ်။

## Basic GET Request

Browser ထဲက fetch API လိုပဲ — ပုံမှန် (default) method က **GET** ပါ။ URL တစ်ခုကို `fetch()` လုပ်ပြီး response ရဲ့ `.json()` ကို ခေါ်ရင် JSON data ရပါတယ်:

```js
async function main() {
  // Like the browser fetch API, the default method is GET
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  console.log(data);
  // returns something like:
  //   {
  //   userId: 1,
  //   id: 1,
  //   title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  //   body: 'quia et suscipit\n' +
  //     'suscipit recusandae consequuntur expedita et cum\n' +
  //     'reprehenderit molestiae ut ut quas totam\n' +
  //     'nostrum rerum est autem sunt rem eveniet architecto'
  // }
}

main().catch(console.error);
```

## Basic POST Request

Data ပို့ချင်ရင် `method: 'POST'` ထည့်ပြီး — `headers` နဲ့ `body` ကို သတ်မှတ်ပေးရပါတယ်။ Body ကို string အနေနဲ့ ပို့ရတာမို့ object ဆိုရင် `JSON.stringify()` လုပ်ပေးရပါတယ်:

```js
// Data sent from the client to the server
const body = {
  title: 'foo',
  body: 'bar',
  userId: 1,
};

async function main() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'User-Agent': 'undici-stream-example',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
  // returns something like:
  // { title: 'foo', body: 'bar', userId: 1, id: 101 }
}

main().catch(console.error);
```

## Undici နဲ့ Fetch API ကို စိတ်ကြိုက်ပြင်ဆင်ခြင်း

Undici က `fetch` function ဆီ option တွေ ထည့်ပေးခြင်းအားဖြင့် Fetch API ကို စိတ်ကြိုက် ပြင်ဆင်ခွင့် ပေးပါတယ် — ဥပမာ custom headers ထည့်တာ၊ request method သတ်မှတ်တာ၊ request body ထည့်တာ စသဖြင့်ပါ။

[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) function က argument နှစ်ခု ယူပါတယ် — ဖတ်ယူမယ့် URL နဲ့ [options object](https://undici.nodejs.org/#/docs/api/Dispatcher?id=parameter-requestoptions) ပါ။ Options object ကို သုံးပြီး request ကို စိတ်ကြိုက် ပြင်ဆင်နိုင်ပြီး — function က [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) တစ်ခု ပြန်ပေးကာ အဲဒီ promise က [Response](https://undici.nodejs.org/#/docs/api/Dispatcher?id=parameter-responsedata) object အဖြစ် resolve ပါတယ်။

အောက်က ဥပမာမှာတော့ JSON payload နဲ့ **Ollama API** ဆီ POST request ပို့ပြထားပါတယ်။ Ollama ဆိုတာ LLM (Large Language Models) တွေကို ကိုယ့် local machine ပေါ်မှာ run လို့ရတဲ့ CLI tool ပါ — [ဒီနေရာကနေ](https://ollama.com/download) download လုပ်နိုင်ပါတယ်:

```bash
ollama run mistral
```

ဒီ command က `mistral` model ကို download လုပ်ပြီး ကိုယ့် local machine ပေါ်မှာ run ပေးပါလိမ့်မယ်။

**Pool** ကို သုံးရင် server တစ်ခုတည်းဆီကို connection တွေ ပြန်သုံးနိုင်လို့ performance တိုးတက်စေပါတယ်။ ဒီမှာ Undici နဲ့ pool သုံးပုံ ဥပမာပါ — prompt တစ်ခုရဲ့ completion ကို Ollama API ကနေ stream လုပ်ပြတာပါ:

```js
import { Pool } from 'undici';

const ollamaPool = new Pool('http://localhost:11434', {
  connections: 10,
});

/**
 * Stream the completion of a prompt using the Ollama API.
 * @param {string} prompt - The prompt to complete.
 * @link https://github.com/ollama/ollama/blob/main/docs/api.md
 **/
async function streamOllamaCompletion(prompt) {
  const { statusCode, body } = await ollamaPool.request({
    path: '/api/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, model: 'mistral' }),
  });

  // You can read about HTTP status codes here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
  // 200 means the request was successful.
  if (statusCode !== 200) {
    // consuming the response body is mandatory: https://undici.nodejs.org/#/?id=garbage-collection
    await body.dump();
    throw new Error(`Ollama request failed with status ${statusCode}`);
  }

  let partial = '';

  const decoder = new TextDecoder();
  for await (const chunk of body) {
    partial += decoder.decode(chunk, { stream: true });
    console.log(partial);
  }

  console.log('Streaming complete.');
}

try {
  await streamOllamaCompletion('What is recursion?');
} catch (error) {
  console.error('Error calling Ollama:', error);
} finally {
  console.log('Closing Ollama pool.');
  ollamaPool.close();
}
```

ဒီဥပမာမှာ — `ollamaPool.request()` က response တစ်ခု ပြန်ပေးပြီး၊ status code `200` မဟုတ်ရင် error လုပ်ပါတယ်။ အောင်မြင်ရင် response body ကို `for await...of` နဲ့ chunk လိုက် ဖတ်ကာ — partial ရလာတဲ့ text ကို console မှာ တစ်ဆင့်ချင်း ပြပါတယ်။ နောက်ဆုံး `finally` ထဲမှာ pool ကို ပိတ်ပေးပါတယ် — resource တွေ ယိုစိမ့်မှု မရှိအောင် လုပ်တာပါ။

## Undici နဲ့ Streaming Responses

**Streams** ဆိုတာ Node.js ရဲ့ feature တစ်ခုဖြစ်ပြီး — data တွေကို chunk အလိုက် ဖတ်/ရေး လုပ်နိုင်တဲ့ သဘောတရားပါ ([Stream API](https://nodejs.org/docs/v22.14.0/api/stream.html#stream) အကြောင်း ဒီမှာ ကြည့်ပါ)။ Undici ရဲ့ `stream()` method က response တွေကို streaming နဲ့ လက်ခံချင်တဲ့အခါ သုံးပါတယ်:

```js
import { Writable } from 'node:stream';

import { stream } from 'undici';

async function fetchGitHubRepos() {
  const url = 'https://api.github.com/users/nodejs/repos';

  await stream(
    url,
    {
      method: 'GET',
      headers: {
        'User-Agent': 'undici-stream-example',
        Accept: 'application/json',
      },
    },
    res => {
      let buffer = '';

      return new Writable({
        write(chunk, encoding, callback) {
          buffer += chunk.toString();
          callback();
        },
        final(callback) {
          try {
            const json = JSON.parse(buffer);
            console.log(
              'Repository Names:',
              json.map(repo => repo.name)
            );
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
          console.log('Stream processing completed.');
          console.log(`Response status: ${res.statusCode}`);
          callback();
        },
      });
    }
  );
}

fetchGitHubRepos().catch(console.error);
```

ဒီမှာတော့ GitHub API ကနေ Node.js organization ရဲ့ repository တွေကို fetch လုပ်ပြီး — ရလာတဲ့ data chunk တွေကို buffer ထဲ စုကာ — response ပြည့်စုံတဲ့အခါ `final()` ထဲမှာ JSON parse လုပ်ပြီး repository နာမည်တွေကို ထုတ်ပြပါတယ်။ Streams အကြောင်း ပိုလေ့လာချင်ရင် [Streams အသုံးပြုခြင်း](/docs/nodejs/how-to-use-streams) guide ကို ဖတ်ကြည့်ပါ။

## ဆက်ဖတ်ရန်

- [Streams အသုံးပြုခြင်း](/docs/nodejs/how-to-use-streams) — chunk လိုက် data ကိုင်တွယ်ခြင်း
- [Async Programming](/docs/nodejs/async-programming) — async/await နဲ့ promise အခြေခံ
- [Node.js မှာ Folders တွေနဲ့ အလုပ်လုပ်ခြင်း](/docs/nodejs/working-with-folders) — file/folder operations
