---
title: "API requests များမှ code snippets များ generate လုပ်ခြင်း"
description: "API request တစ်ခုကနေ code snippet generate လုပ်နည်း — language/framework ရွေးချယ်ခြင်း, Postman က support လုပ်တဲ့ languages နဲ့ client libraries စာရင်း"
order: 84
source: "https://learning.postman.com/docs/use/send-requests/create-requests/generate-code-snippets/"
status: translated
updated: 2026-09-02
---

Postman က API request တစ်ခုကို code snippet တစ်ခုအဖြစ် ပြောင်းလဲပေးနိုင်ပါတယ်။ ပြီးရင် — API တစ်ခုဆီ calls တွေ လုပ်ဖို့ generated code snippet ကို ကိုယ့်ရဲ့ front-end application ထဲမှာ သုံးနိုင်ပါတယ်။ Postman က Postman CLI, C#, JavaScript, NodeJS အပါအဝင် programming languages နဲ့ client libraries အမျိုးမျိုးအတွက် code snippets တွေ generate လုပ်နိုင်ပါတယ်။

## Postman မှာ code snippets generate လုပ်ခြင်း

1. Code snippet တစ်ခုအတွက် သုံးချင်တဲ့ request ကို ဖွင့်ပြီး — ညာဘက် sidebar ထဲမှာ **Code** ကို နှိပ်ပါ။
2. Dropdown list ကနေ [language ဒါမှမဟုတ် framework](#supported-languages-နဲ့-client-libraries) တစ်ခုကို ရွေးပါ။
3. Code snippet ကို clipboard ဆီ copy လုပ်ဖို့ **Copy snippet** ကို နှိပ်ပါ။
4. Indentation type နဲ့ count လို configuration options တွေ ပိုလိုချင်ရင် — dropdown list ဘေးမှာ ရှိတဲ့ **Code settings** ကို နှိပ်ပါ။ Settings တွေက ရွေးထားတဲ့ language ဒါမှမဟုတ် framework ပေါ်မူတည်ပြီး ကွဲပြားပါတယ်။

## Supported languages နဲ့ client libraries

Postman က အောက်ပါ languages နဲ့ client libraries တွေကို support လုပ်ပါတယ်:

| ဘာသာစကား (Language) | Framework                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| C#                    | HttpClient                                                                                                                      |
| C#                    | [RestSharp](http://restsharp.dev/)                                                                                              |
| cURL                  | [cURL](https://curl.se/)                                                                                                        |
| Dart                  | [Dio](https://pub.dev/packages/dio)                                                                                             |
| Dart                  | HTTP                                                                                                                            |
| Go                    | [http package](https://pkg.go.dev/net/http)                                                                                     |
| HTTP                  | (Raw HTTP request)                                                                                                              |
| Java                  | [OkHttp](https://github.com/square/okhttp)                                                                                      |
| Java                  | [Unirest](https://github.com/Kong/unirest-java)                                                                                 |
| JavaScript            | [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)                                                             |
| JavaScript            | [jQuery](https://api.jquery.com/jquery.ajax/)                                                                                   |
| JavaScript            | [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)                                                          |
| Kotlin                | [OkHttp](https://square.github.io/okhttp/)                                                                                      |
| C                     | [LibCurl](https://curl.se/libcurl/c/)                                                                                           |
| NodeJS                | [Axios](https://github.com/axios/axios)                                                                                         |
| NodeJS                | [Native](https://nodejs.org/api/http.html)                                                                                      |
| NodeJS                | [Request](https://github.com/request/request)                                                                                   |
| NodeJS                | [Unirest](https://github.com/Kong/unirest-nodejs)                                                                               |
| Objective-C           | [NSURLSession](https://developer.apple.com/documentation/foundation/urlsession)                                                 |
| OCaml                 | [Cohttp](https://github.com/mirage/ocaml-cohttp)                                                                                |
| PHP                   | [cURL](https://www.php.net/manual/en/ref.curl.php)                                                                              |
| PHP                   | [Guzzle](https://docs.guzzlephp.org/en/stable/)                                                                                 |
| PHP                   | [Http_Request2](https://www.php.net/manual/en/reserved.variables.request.php)                                                   |
| PHP                   | [pecl_http](https://mdref.m6w6.name/http)                                                                                       |
| Postman CLI           | [Postman CLI](https://learning.postman.com/docs/postman-cli/postman-cli-requests/#postman-request)                              |
| PowerShell            | [RestMethod](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-restmethod?view=powershell-7) |
| Python                | [http.client](https://docs.python.org/3/library/http.client.html) (Python 3)                                                    |
| Python                | [Requests](https://www.w3schools.com/python/module_requests.asp)                                                                |
| R                     | [httr](https://cran.r-project.org/web/packages/httr/index.html)                                                                 |
| R                     | [RCurl](https://cran.r-project.org/web/packages/RCurl/index.html)                                                               |
| Ruby                  | [NET::Http](https://docs.ruby-lang.org/en/2.0.0/Net/HTTP.html)                                                                  |
| Rust                  | [reqwest](https://docs.rs/reqwest/latest/reqwest/)                                                                              |
| Shell                 | [Httpie](https://github.com/httpie/httpie)                                                                                      |
| Shell                 | [wget](https://www.gnu.org/software/wget/)                                                                                      |
| Swift                 | [URLSession](https://developer.apple.com/documentation/foundation/urlsession)                                                   |

Language ဒါမှမဟုတ် setting အသစ်တစ်ခု ထည့်ချင်ရင် — Postman ရဲ့ [open-source project](https://github.com/postmanlabs/postman-code-generators) ကို ပံ့ပိုးကူညီနိုင်ပါတယ်။
