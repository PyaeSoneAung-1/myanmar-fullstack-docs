---
title: "GitHub Actions သုံးပြီး CI/CD workflows တွေမှာ Postman CLI commands တွေ run လုပ်ခြင်း"
description: "Postman CLI GitHub Action နဲ့ GitHub CI/CD workflows တွေမှာ collection runs, monitors နဲ့ Spec Hub validation တွေ run လုပ်နည်း — inputs, outputs နဲ့ YAML ဥပမာများ"
order: 163
source: "https://learning.postman.com/docs/postman-cli/postman-cli-github-actions/"
status: translated
updated: 2026-09-03
---

Postman CLI GitHub Action နဲ့ဆိုရင် — custom actions တွေ ဖန်တီးပြီး ထိန်းသိမ်းစရာ မလိုဘဲ — ကိုယ့် GitHub CI/CD workflows တွေထဲမှာ [Postman CLI](/docs/postman/postman-cli-overview) commands တွေကို တိုက်ရိုက် run လုပ်နိုင်ပါတယ်။ ဒီ action က collection runs, monitors, syntax checks, governance validation နဲ့ နောက်ထပ်တွေကို ထောက်ပံ့ပေးပါတယ်။ Regressions နဲ့ configuration issues တွေကို စောစောစီးစီး ဖမ်းမိခြင်းဖြင့် — deployment တစ်ခုကို ဆက်လုပ်သင့်လား ဒါမှမဟုတ် roll back လုပ်သင့်လားဆိုတာကို ယုံကြည်စိတ်ချစွာ ဆုံးဖြတ်နိုင်ပါတယ်။

Postman CLI GitHub Action အကြောင်း ပိုသိချင်ရင် — [GitHub Marketplace](https://github.com/marketplace/actions/postman-cli) ကို ကြည့်ပါ။

## Postman CLI GitHub Action ကို သုံးခြင်း

ကိုယ့် CI/CD workflows တွေထဲမှာ run ချင်တဲ့ Postman CLI commands တွေကို သတ်မှတ်ပါ။ Command တစ်ခုချင်းစီအတွက် — Postman CLI version စတဲ့ ကိုယ့် API project နဲ့ ကိုက်ညီအောင် inputs တွေကို customize လုပ်နိုင်ပါတယ်။ Command တစ်ခုချင်းစီက ရလဒ်တွေ အောင်မြင်လား ကျဆုံးလားဆိုတာ စစ်ဆေးဖို့ သုံးလို့ရတဲ့ exit code output တစ်ခုကို ပြန်ပေးပါတယ်။

```yaml
name: API Tests

on: push

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Run Postman Collection
        uses: postmanlabs/postman-cli-action@v1
        with:
          command: 'collection run 12345678-collection-id'
          api-key: ${{ secrets.POSTMAN_API_KEY }}
```

Postman CLI GitHub Action က အောက်ပါ inputs တွေကို လက်ခံပါတယ်:

| Name                    | Description                                                                                                                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api-key`               | Authentication အတွက် သုံးတဲ့ ကိုယ့် [Postman API key](https://learning.postman.com/docs/reference/postman-api/authentication/#generate-a-postman-api-key) ကို သတ်မှတ်ပါ။ Postman cloud ကို ဝင်ရောက်နေရင် လိုအပ်ပါတယ်။ Local files တွေကို ဝင်ရောက်နေရင်တော့ ထည့်စရာမလိုပါဘူး။ |
| `command`               | (မဖြစ်မနေ) Run လုပ်ချင်တဲ့ [Postman CLI command](https://learning.postman.com/docs/postman-cli/postman-cli-options/) နဲ့ ၎င်းရဲ့ options တွေကို သတ်မှတ်ပါ။                                                                                                                                    |
| `postman-cli-version`   | Install လုပ်မယ့် Postman CLI version ကို သတ်မှတ်ပါ။ ဥပမာ — `1.27.0`။ (Default: `latest`)                                                                                                                                    |
| `region`                | [Postman EU Data Residency plan](https://learning.postman.com/docs/administration/enterprise/about-eu-data-residency/) တစ်ခု ဝယ်ထားရင် — ကိုယ့် Postman instance က EU region မှာ hosted ဖြစ်ကြောင်း သတ်မှတ်ပါ။ `eu` ကို လက်ခံပါတယ်။                                                          |
| `working-directory`     | Command ကို run မယ့် directory ကို သတ်မှတ်ပါ။ (Default: `.`)                                                                                                                                                                 |

Postman CLI commands တွေက အောက်ပါ outputs တွေကို ပြန်ပေးပါတယ်:

| Name         | Description                                                                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `exit-code`  | Postman CLI command က အောင်မြင်စွာ ပြီးဆုံးတဲ့အခါ exit code `0` ကို ပြန်ပေးပါတယ်။ Failure တစ်ခု တွေ့ရှိရတဲ့အခါ non-zero exit code ကို ပြန်ပေးပါတယ်။ |

## Collections တွေ run လုပ်ခြင်း

Collection ဆိုတာ — [API requests](/docs/postman/quick-start) တွေ၊ [workflow](/docs/postman/building-workflows) တစ်ခု ဒါမှမဟုတ် [test suite](/docs/postman/test-scripts) တစ်ခုရဲ့ အစုအဝေးတစ်ခုပါ။ HTTP collections တွေကို run လုပ်ပြီး run results တွေကို Postman cloud ဆီ ပို့ဖို့ Postman CLI ကို သုံးနိုင်ပါတယ်။ [Collections](https://learning.postman.com/docs/use/use-collections/overview/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

```yaml
# Local file
- uses: postmanlabs/postman-cli-action@v1
  with:
    command: 'collection run tests/collection.json --environment tests/environment.json'

# Cloud resources
- uses: postmanlabs/postman-cli-action@v1
  with:
    command: 'collection run 12345678-collection-id --environment 87654321-environment-id'
    api-key: ${{ secrets.POSTMAN_API_KEY }}
```

ဒီ command ကို configure လုပ်ဖို့ သုံးနိုင်တဲ့ [collection run options](https://learning.postman.com/docs/postman-cli/postman-cli-collections/#postman-collection-run) တွေအကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Monitors တွေ run လုပ်ခြင်း

[Monitors](/docs/postman/intro-monitors) တွေက ကိုယ့် APIs တွေရဲ့ ကျန်းမာရေးနဲ့ performance ကို ပုံမှန် စစ်ဆေးနိုင်စေပါတယ်။ Monitor runs တွေကို trigger လုပ်ပြီး — run results တွေကို Postman cloud ဆီ ပို့ဖို့ Postman CLI ကို သုံးနိုင်ပါတယ်။ ကိုယ့် CI/CD workflow အတွက် [monitor တစ်ခု configure လုပ်ခြင်း](https://learning.postman.com/docs/postman-cli/postman-cli-run-monitor/) အကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

```yaml
- uses: postmanlabs/postman-cli-action@v1
  with:
    command: 'monitor run 12345678-monitor-id'
    api-key: ${{ secrets.POSTMAN_API_KEY }}
```

ဒီ command ကို configure လုပ်ဖို့ သုံးနိုင်တဲ့ [monitor run options](https://learning.postman.com/docs/postman-cli/postman-cli-monitoring/#postman-monitor-run) တွေအကြောင်း ပိုလေ့လာနိုင်ပါတယ်။

## Spec Hub ထဲမှာ specifications တွေကို validate လုပ်ခြင်း

[Spec Hub](/docs/postman/specifications-overview) ထဲက API specifications တွေအပေါ် — syntax validation နဲ့ governance rule checks တွေကို run လုပ်ပါ။ ဒီ command က OpenAPI 2.0, 3.0 ဒါမှမဟုတ် 3.1 format နဲ့ API specifications တွေအတွက် ထောက်ပံ့ပေးပါတယ်။

```yaml
# Local file
- uses: postmanlabs/postman-cli-action@v1
  with:
    command: 'spec lint specs/openapi.yaml --fail-severity ERROR'

# Cloud resources
- uses: postmanlabs/postman-cli-action@v1
  with:
    command: 'spec lint 12345678-spec-id --output json --fail-severity ERROR'
    api-key: ${{ secrets.POSTMAN_API_KEY }}
```

ဒီ command ကို configure လုပ်ဖို့ သုံးနိုင်တဲ့ [specification validation options](https://learning.postman.com/docs/postman-cli/postman-cli-governance/#postman-spec-lint) တွေအကြောင်း ပိုလေ့လာနိုင်ပါတယ်။
