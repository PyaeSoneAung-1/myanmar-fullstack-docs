---
title: "macOS, Ubuntu နဲ့ Windows တွေမှာ Newman ကို Docker နဲ့ run လုပ်ခြင်း (Run Newman with Docker on macOS, Ubuntu, and Windows)"
description: "Docker container တစ်ခုထဲမှာ Newman သုံးပြီး Postman Collections တွေ run လုပ်ခြင်း — macOS, Ubuntu နဲ့ Windows အတွက် အဆင့်ဆင့် လမ်းညွှန်ချက်"
order: 154
source: "https://learning.postman.com/docs/reference/newman-cli/newman-with-docker/"
status: translated
updated: 2026-09-03
---

[Docker](https://www.docker.com/) က virtual environment တစ်ခုထဲမှာ applications တွေကို တည်ဆောက်ပြီး run လုပ်ဖို့အတွက် platform တစ်ခုပါ။ [Newman](/docs/postman/newman-command-line) ကို သုံးပြီး — သင့် Postman Collections တွေကို Docker container တစ်ခုထဲမှာ run လုပ်နိုင်ပါတယ်။ Collections တွေကို Docker ထဲမှာ run တဲ့အခါ — Newman ရဲ့ command options တွေ အားလုံးကို သုံးနိုင်ပြီး local collection files တွေကိုလည်း run လို့ရပါတယ်။

## macOS နဲ့ Ubuntu တွေမှာ Newman ကို Docker နဲ့ သုံးခြင်း

macOS ဒါမှမဟုတ် Ubuntu အတွက် Newman ကို Docker နဲ့ သုံးဖို့ အောက်ပါအတိုင်း လုပ်ပါ:

1. Docker က သင့် system မှာ install ဖြစ်ပြီး run နေကြောင်း သေချာပါစေ။ [Get Docker](https://docs.docker.com/get-docker/) ကို သွားပြီး — ကိုယ့် operating system ကို ရွေးကာ ညွှန်ကြားချက်တွေ အတိုင်း လိုက်လုပ်ပါ။

2. Docker installation ကို test လုပ်ဖို့ အောက်ပါ command ကို run ပါ:

   ```bash
   docker run hello-world
   ```

3. Docker hub ကနေ [Newman Docker](https://hub.docker.com/r/postman/newman/) image ကို pull လုပ်ပါ:

   ```bash
   docker pull postman/newman;
   ```

4. Image ပေါ်မှာ Newman commands တွေ run ပါ။ ဥပမာ — [collection](/docs/postman/intro-to-collections) တစ်ခုကို run ဖို့ collection ID နဲ့ သင့် Postman API key ကို သုံးပါ:

   * Collection ID ရဖို့ — sidebar ထဲက collection တစ်ခုကို ရွေးပါ။ Right sidebar ထဲမှာ **Info** ကို နှိပ်ပြီး ID ကို ကူးယူပါ။

   * API key တစ်ခု ရဖို့ — [Postman API key တစ်ခု generate လုပ်ခြင်း](https://learning.postman.com/docs/reference/postman-api/authentication/#generate-a-postman-api-key) ကို ကြည့်ပါ။

   ```bash
   docker run -t postman/newman run "https://api.getpostman.com/collections/<collection-id>?apikey=<your-api-key>"
   ```

Collection က Newman ထဲမှာ run ဖြစ်ပြီး — output က terminal ထဲမှာ ပြသပါတယ်။

Docker image ရဲ့ entry point က Newman ဖြစ်လို့ — Newman command line parameters တွေ အားလုံးကို သုံးနိုင်ပါတယ်။ Local မှာ သိမ်းထားတဲ့ collection files တွေကိုလည်း run လို့ရပါတယ်။ [Newman Docker documentation](https://hub.docker.com/r/postman/newman/) မှာ shared data volumes တွေကို mount လုပ်နည်း အသေးစိတ်ကို ဖော်ပြထားပါတယ်။

## Windows မှာ Newman ကို Docker နဲ့ သုံးခြင်း

Windows မှာ Newman ကို Docker နဲ့ သုံးခြင်းအကြောင်း ပိုလေ့လာချင်ရင် — [Windows ထဲမှာ Newman Docker Image ကို သုံးခြင်း](https://blog.postman.com/using-the-newman-docker-image-in-windows/) ကို သွားပါ။

## နောက်ထပ်အဆင့်များ

Postman Collection runs တွေ run လုပ်ခြင်းအကြောင်း ပိုသိချင်ရင် အောက်ပါတို့ကို ကြည့်ပါ:

* [Collection Runner နဲ့ သင့် API ကို test လုပ်ခြင်း](/docs/postman/intro-to-collection-runs)
* [Imported data သုံးပြီး collections တွေ run လုပ်ခြင်း](/docs/postman/working-with-data-files)
* [Collection run တစ်ခုထဲမှာ request order ကို customize လုပ်ခြင်း](/docs/postman/building-workflows)
* [Newman သုံးပြီး သင့် Postman tests တွေကို Jenkins နဲ့ integrate လုပ်ခြင်း](https://learning.postman.com/docs/reference/newman-cli/integration-with-jenkins/)
* [Newman သုံးပြီး သင့် Postman tests တွေကို Travis CI နဲ့ integrate လုပ်ခြင်း](https://learning.postman.com/docs/reference/newman-cli/integration-with-travis/)
