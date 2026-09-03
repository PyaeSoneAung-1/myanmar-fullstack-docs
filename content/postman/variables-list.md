---
title: "Dynamic variables တွေကို သုံးပြီး random data တွေ ပြန်ထုတ်ပေးခြင်း (Use dynamic variables to return randomly generated data)"
description: "Postman ရဲ့ dynamic variables တွေရဲ့ စာရင်းအပြည့်အစုံ — $guid, $timestamp စတဲ့ variables တွေက request run တဲ့အခါ ကျပန်း sample data (နာမည်, email, လိပ်စာ, ငွေကြေး, ရက်စွဲ စသဖြင့်) တွေကို ဘယ်လို ထုတ်ပေးလဲဆိုတာ အမျိုးအစားအလိုက် ဇယားတွေနဲ့ ဖော်ပြထားခြင်း"
order: 123
source: "https://learning.postman.com/docs/tests-and-scripts/write-scripts/variables-list/"
status: translated
updated: 2026-09-03
---

[Faker](https://www.npmjs.com/package/@faker-js/faker) library က Postman မှာ predefined variables တွေ သုံးပြီး sample data တွေ ထုတ်လုပ်နိုင်စေပါတယ်။ ဒီ variables တွေကို Postman ထဲက တခြား variable တွေလိုပဲ သုံးနိုင်ပါတယ်။ သူတို့ရဲ့ တန်ဖိုးတွေက request run လုပ်တဲ့အခါ ထုတ်ပေးပြီး — နာမည်တွေက `$` symbol နဲ့ စတင်ပါတယ်။ ဥပမာ — `$guid` ဒါမှမဟုတ် `$timestamp`။

![Collections icon](https://assets.postman.com/postman-docs/Collections.png#icon) Dynamic variables တွေကို သုံးပြီး randomized mock data တွေ ဘယ်လို ဖန်တီးလဲ ကြည့်ပါ။ ဒီ collection template ကို စမ်းသုံးပြီး [fake test data တွေ ထုတ်လုပ်ကြည့်နိုင်ပါတယ်](https://www.postman.com/templates/collections/generate-fake-test-data/)။

Pre-request ဒါမှမဟုတ် post-response scripts တွေထဲမှာ dynamic variables တွေ သုံးဖို့ — `pm.variables.replaceIn()` ကို သုံးပြီး အောက်က variable နာမည်တွေကို double curly braces တွေနဲ့ ဝိုင်းထားပါ။ ဥပမာ — random first name တစ်ခု ထည့်ဖို့ `pm.variables.replaceIn('{{$randomFirstName}}')` ကို သုံးပါ။ Variable နာမည်တွေက case-sensitive (စာလုံးအကြီး/အသေး ခွဲခြားမှု ရှိ) တာ သတိပြုပါ။

အောက်မှာ ဖော်ပြထားတာတွေက request/collection run အတွင်း ကျပန်း (random) ထုတ်ပေးတဲ့ တန်ဖိုးတွေ ရှိတဲ့ dynamic variables တွေရဲ့ စာရင်း ဖြစ်ပါတယ်။

## Common (အသုံးများ)

| **Variable နာမည်**      | **ဖော်ပြချက်**                                  | **ဥပမာများ**                            |
| ------------------------ | ------------------------------------------------ | ---------------------------------------- |
| **`$guid`**              | `uuid-v4` ပုံစံ guid တစ်ခု                        | `"611c2e81-2ccb-42d8-9ddc-2d0bfa65c1b4"` |
| **`$timestamp`**         | လက်ရှိ UNIX timestamp (စက္ကန့်နဲ့)                 | `1562757107`, `1562757108`, `1562757109` |
| **`$isoTimestamp`**      | zero UTC မှာ ရှိတဲ့ လက်ရှိ ISO timestamp          | `2020-06-09T21:10:36.177Z`               |
| **`$randomUUID`**        | ကျပန်း စာလုံး ၃၆ လုံး UUID တစ်ခု                  | `"6929bb52-3ab2-448a-9796-d6480ecad36b"` |

## Text, numbers နဲ့ colors (စာသား၊ ဂဏန်းနဲ့ အရောင်များ)

| **Variable နာမည်**           | **ဖော်ပြချက်**                              | **ဥပမာများ**                      |
| ----------------------------- | -------------------------------------------- | --------------------------------- |
| **`$randomAlphaNumeric`**     | ကျပန်း alphanumeric စာလုံးတစ်လုံး             | `6`, `"y"`, `"z"`                 |
| **`$randomBoolean`**          | ကျပန်း boolean တန်ဖိုးတစ်ခု                   | `true`, `false`                   |
| **`$randomInt`**              | 0 နဲ့ 1000 ကြား ကျပန်း integer တစ်ခု          | `802`, `494`, `200`               |
| **`$randomColor`**            | ကျပန်း အရောင်တစ်မျိုး                          | `"red"`, `"fuchsia"`, `"grey"`    |
| **`$randomHexColor`**         | ကျပန်း hex တန်ဖိုးတစ်ခု                        | `"#47594a"`, `"#431e48"`, `"#106f21"` |
| **`$randomAbbreviation`**     | ကျပန်း အတိုကောက် (abbreviation) တစ်ခု         | `SQL`, `PCI`, `JSON`              |

## Internet နဲ့ IP addresses

| **Variable နာမည်**        | **ဖော်ပြချက်**                                    | **ဥပမာများ**                                                                               |
| -------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **`$randomIP`**            | ကျပန်း IPv4 address တစ်ခု                           | `241.102.234.100`, `216.7.27.38`                                                           |
| **`$randomIPV6`**          | ကျပန်း IPv6 address တစ်ခု                           | `dbe2:7ae6:119b:c161:1560:6dda:3a9b:90a9`                                                  |
| **`$randomMACAddress`**    | ကျပန်း MAC address တစ်ခု                            | `33:d4:68:5f:b4:c7`, `1f:6e:db:3d:ed:fa`                                                   |
| **`$randomPassword`**      | ကျပန်း စာလုံး ၁၅ လုံး alphanumeric password တစ်ခု   | `t9iXe7COoDKv8k3`, `QAzNFQtvR9cg2rq`                                                       |
| **`$randomLocale`**        | ကျပန်း စာလုံးနှစ်လုံး language code (ISO 639-1) တစ်ခု | `"ny"`, `"sr"`, `"si"`                                                                     |
| **`$randomUserAgent`**     | ကျပန်း user agent တစ်ခု                              | `Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.9.8; rv:15.6) Gecko/20100101 Firefox/15.6.6` |
| **`$randomProtocol`**      | ကျပန်း internet protocol တစ်ခု                       | `"http"`, `"https"`                                                                        |
| **`$randomSemver`**        | ကျပန်း semantic version နံပါတ်တစ်ခု                 | `7.0.5`, `2.5.8`, `6.4.9`                                                                  |

## Names (နာမည်များ)

| **Variable နာမည်**       | **ဖော်ပြချက်**                     | **ဥပမာများ**                                        |
| ------------------------- | ----------------------------------- | ---------------------------------------------------- |
| **`$randomFirstName`**    | ကျပန်း first name တစ်ခု              | `Ethan`, `Chandler`, `Megane`                        |
| **`$randomLastName`**     | ကျပန်း last name တစ်ခု               | `Schaden`, `Schneider`, `Willms`                     |
| **`$randomFullName`**     | ကျပန်း first နဲ့ last name တစ်ခု     | `Connie Runolfsdottir`, `Sylvan Fay`, `Jonathon Kunze` |
| **`$randomNamePrefix`**   | ကျပန်း name prefix တစ်ခု             | `Dr.`, `Ms.`, `Mr.`                                  |
| **`$randomNameSuffix`**   | ကျပန်း name suffix တစ်ခု             | `I`, `MD`, `DDS`                                     |

## Profession (အလုပ်အကိုင်)

| **Variable နာမည်**          | **ဖော်ပြချက်**              | **ဥပမာများ**                           |
| ---------------------------- | ---------------------------- | --------------------------------------- |
| **`$randomJobArea`**         | ကျပန်း job area တစ်ခု        | `Mobility`, `Intranet`, `Configuration` |
| **`$randomJobDescriptor`**   | ကျပန်း job descriptor တစ်ခု | `Forward`, `Corporate`, `Senior`        |
| **`$randomJobTitle`**        | ကျပန်း job title တစ်ခု      | `International Creative Liaison`,       |
| **`$randomJobType`**         | ကျပန်း job type တစ်ခု       | `Supervisor`, `Manager`, `Coordinator`  |

## Phone, address နဲ့ location (ဖုန်း၊ လိပ်စာနဲ့ တည်နေရာ)

| **Variable နာမည်**           | **ဖော်ပြချက်**                                                | **ဥပမာများ**                                                |
| ----------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------ |
| **`$randomPhoneNumber`**      | ကျပန်း ဂဏန်း ၁၀ လုံး ဖုန်းနံပါတ်တစ်ခု                          | `700-008-5275`, `494-261-3424`, `662-302-7817`               |
| **`$randomPhoneNumberExt`**   | extension ပါတဲ့ ကျပန်း ဖုန်းနံပါတ် (ဂဏန်း ၁၂ လုံး)            | `27-199-983-3864`, `99-841-448-2775`                         |
| **`$randomCity`**             | ကျပန်း မြို့အမည်တစ်ခု                                          | `Spinkahaven`, `Korbinburgh`, `Lefflerport`                  |
| **`$randomStreetName`**       | ကျပန်း လမ်းအမည်တစ်ခု                                           | `Kuhic Island`, `General Street`, `Kendrick Springs`         |
| **`$randomStreetAddress`**    | ကျပန်း လမ်းလိပ်စာတစ်ခု                                          | `5742 Harvey Streets`, `47906 Wilmer Orchard`                |
| **`$randomCountry`**          | ကျပန်း နိုင်ငံတစ်ခု                                             | `Lao People's Democratic Republic`, `Kazakhstan`, `Austria`  |
| **`$randomCountryCode`**      | ကျပန်း စာလုံးနှစ်လုံး country code (ISO 3166-1 alpha-2) တစ်ခု  | `CV`, `MD`, `TD`                                             |
| **`$randomLatitude`**         | ကျပန်း latitude coordinate တစ်ခု                                | `55.2099`, `27.3644`, `-84.7514`                             |
| **`$randomLongitude`**        | ကျပန်း longitude coordinate တစ်ခု                               | `40.6609`, `171.7139`, `-159.9757`                           |

## Images (ပုံများ)

| **Variable နာမည်**           | **ဖော်ပြချက်**                             | **ဥပမာများ**                                                       |
| ----------------------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| **`$randomAvatarImage`**      | ကျပန်း avatar ပုံတစ်ပုံ                      | `https://avatars.githubusercontent.com/u/30218384`                   |
| **`$randomImageUrl`**         | ကျပန်း ပုံတစ်ပုံရဲ့ URL                     | `http://lorempixel.com/640/480`                                     |
| **`$randomAbstractImage`**    | ကျပန်း abstract ပုံတစ်ပုံရဲ့ URL            | `http://lorempixel.com/640/480/abstract`                            |
| **`$randomAnimalsImage`**     | ကျပန်း တိရစ္ဆာန်ပုံတစ်ပုံရဲ့ URL             | `http://lorempixel.com/640/480/animals`                             |
| **`$randomBusinessImage`**    | ကျပန်း stock business ပုံတစ်ပုံရဲ့ URL      | `http://lorempixel.com/640/480/business`                            |
| **`$randomCatsImage`**        | ကျပန်း ကြောင်ပုံတစ်ပုံရဲ့ URL              | `http://lorempixel.com/640/480/cats`                                |
| **`$randomCityImage`**        | ကျပန်း မြို့ပုံတစ်ပုံရဲ့ URL                | `http://lorempixel.com/640/480/city`                                |
| **`$randomFoodImage`**        | ကျပန်း အစားအစာပုံတစ်ပုံရဲ့ URL             | `http://lorempixel.com/640/480/food`                                |
| **`$randomNightlifeImage`**   | ကျပန်း ညဘက်ဖျော်ဖြေရေးပုံတစ်ပုံရဲ့ URL      | `http://lorempixel.com/640/480/nightlife`                           |
| **`$randomFashionImage`**     | ကျပန်း ဖက်ရှင်ပုံတစ်ပုံရဲ့ URL              | `http://lorempixel.com/640/480/fashion`                             |
| **`$randomPeopleImage`**      | ကျပန်း လူတစ်ယောက်ရဲ့ပုံတစ်ပုံရဲ့ URL         | `http://lorempixel.com/640/480/people`                              |
| **`$randomNatureImage`**      | ကျပန်း သဘာဝပုံတစ်ပုံရဲ့ URL                | `http://lorempixel.com/640/480/nature`                              |
| **`$randomSportsImage`**      | ကျပန်း အားကစားပုံတစ်ပုံရဲ့ URL              | `http://lorempixel.com/640/480/sports`                              |
| **`$randomTransportImage`**   | ကျပန်း သယ်ယူပို့ဆောင်ရေးပုံတစ်ပုံရဲ့ URL     | `http://lorempixel.com/640/480/transport`                           |
| **`$randomImageDataUri`**     | ကျပန်း image data URI တစ်ခု                | `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F...` |

## Finance (ဘဏ္ဍာရေး)

| **Variable နာမည်**            | **ဖော်ပြချက်**                                                       | **ဥပမာများ**                                                                    |
| ------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **`$randomBankAccount`**       | ကျပန်း ဂဏန်း ၈ လုံး bank account နံပါတ်တစ်ခု                          | `09454073`, `65653440`, `75728757`                                              |
| **`$randomBankAccountName`**   | ကျပန်း bank account နာမည်တစ်ခု                                        | `Home Loan Account`, `Checking Account`, `Savings Account`. `Auto Loan Account` |
| **`$randomCreditCardMask`**    | ကျပန်း masked credit card နံပါတ်တစ်ခု                                 | `3622`, `5815`, `6257`                                                          |
| **`$randomBankAccountBic`**    | ကျပန်း BIC (Bank Identifier Code) တစ်ခု                                | `EZIAUGJ1`, `KXCUTVJ1`, `DIVIPLL1`                                              |
| **`$randomBankAccountIban`**   | ကျပန်း စာလုံး ၁၅-၃၁ လုံး IBAN (International Bank Account Number) တစ်ခု | `MU20ZPUN3039684000618086155TKZ`                                                |
| **`$randomTransactionType`**   | ကျပန်း transaction type တစ်ခု                                         | `invoice`, `payment`, `deposit`                                                 |
| **`$randomCurrencyCode`**      | ကျပန်း စာလုံး ၃ လုံး currency code (ISO-4217) တစ်ခု                   | `CDF`, `ZMK`, `GNF`                                                             |
| **`$randomCurrencyName`**      | ကျပန်း currency နာမည်တစ်ခု                                            | `CFP Franc`, `Cordoba Oro`, `Pound Sterling`                                    |
| **`$randomCurrencySymbol`**    | ကျပန်း currency symbol တစ်ခု                                          | `$`, `£`                                                                        |
| **`$randomBitcoin`**           | ကျပန်း bitcoin address တစ်ခု                                          | `3VB8JGT7Y4Z63U68KGGKDXMLLH5`                                                   |

## Business (စီးပွားရေး)

| **Variable နာမည်**          | **ဖော်ပြချက်**                    | **ဥပမာများ**                          |
| ---------------------------- | ---------------------------------- | ------------------------------------- |
| **`$randomCompanyName`**     | ကျပန်း ကုမ္ပဏီအမည်တစ်ခု             | `Johns - Kassulke`, `Grady LLC`       |
| **`$randomCompanySuffix`**   | ကျပန်း ကုမ္ပဏီနာမည်နောက်ဆက် တစ်ခု     | `Inc`, `LLC`, `Group`                 |
| **`$randomBs`**              | ကျပန်း business-speak စကားစုတစ်ခု    | `killer leverage schemas`,            |
| **`$randomBsAdjective`**     | ကျပန်း business-speak နာမဝိသေသန တစ်ခု | `viral`, `24/7`, `24/365`             |
| **`$randomBsBuzz`**          | ကျပန်း business-speak buzzword တစ်ခု | `repurpose`, `harness`, `transition`  |
| **`$randomBsNoun`**          | ကျပန်း business-speak နာမ် တစ်ခု      | `e-services`, `markets`, `interfaces` |

## Catchphrases (ကြွေးကြော်ချက်များ)

| **Variable နာမည်**                  | **ဖော်ပြချက်**                            | **ဥပမာများ**                                        |
| ------------------------------------ | ------------------------------------------ | ---------------------------------------------------- |
| **`$randomCatchPhrase`**             | ကျပန်း catchphrase တစ်ခု                    | `Future-proofed heuristic open architecture`,        |
| **`$randomCatchPhraseAdjective`**    | ကျပန်း catchphrase နာမဝိသေသန တစ်ခု          | `Self-enabling`, `Business-focused`, `Down-sized`    |
| **`$randomCatchPhraseDescriptor`**   | ကျပန်း catchphrase descriptor တစ်ခု         | `bandwidth-monitored`, `needs-based`, `homogeneous`  |
| **`$randomCatchPhraseNoun`**         | ကျပန်း catchphrase နာမ် တစ်ခု ထုတ်ပေးသည်     | `secured line`, `superstructure`,`installation`      |

## Databases (ဒေတာဘေ့စ်များ)

| **Variable နာမည်**              | **ဖော်ပြချက်**                      | **ဥပမာများ**                                        |
| -------------------------------- | ------------------------------------ | ---------------------------------------------------- |
| **`$randomDatabaseColumn`**      | ကျပန်း database column နာမည်တစ်ခု    | `updatedAt`, `token`, `group`                        |
| **`$randomDatabaseType`**        | ကျပန်း database type တစ်ခု           | `tinyint`, `text`                                    |
| **`$randomDatabaseCollation`**   | ကျပန်း database collation တစ်ခု      | `cp1250_bin`, `utf8_general_ci`, `cp1250_general_ci` |
| **`$randomDatabaseEngine`**      | ကျပန်း database engine တစ်ခု         | `MyISAM`, `InnoDB`, `Memory`                         |

## Dates (ရက်စွဲများ)

| **Variable နာမည်**       | **ဖော်ပြချက်**                 | **ဥပမာများ**                                               |
| ------------------------- | ------------------------------- | ----------------------------------------------------------- |
| **`$randomDateFuture`**   | ကျပန်း အနာဂတ် datetime တစ်ခု    | `Tue Mar 17 2025 13:11:50 GMT+0530 (India Standard Time)`,  |
| **`$randomDatePast`**     | ကျပန်း အတိတ် datetime တစ်ခု      | `Sat Mar 02 2019 09:09:26 GMT+0530 (India Standard Time)`,  |
| **`$randomDateRecent`**   | ကျပန်း မကြာသေးခင်က datetime တစ်ခု | `Tue Jul 09 2023 23:12:37 GMT+0530 (India Standard Time)`,  |
| **`$randomWeekday`**      | ကျပန်း ရက်သတ္တပတ်နေ့တစ်ခု          | `Thursday`, `Friday`, `Monday`                              |
| **`$randomMonth`**        | ကျပန်း လတစ်ခု                    | `February`, `May`, `January`                                |

## Domains, emails နဲ့ usernames

| **Variable နာမည်**         | **ဖော်ပြချက်**                                      | **ဥပမာများ**                                                                 |
| --------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| **`$randomDomainName`**     | ကျပန်း domain name တစ်ခု                             | `gracie.biz`, `armando.biz`, `trevor.info`                                    |
| **`$randomDomainSuffix`**   | ကျပန်း domain suffix တစ်ခု                          | `org`, `net`, `com`                                                           |
| **`$randomDomainWord`**     | ကျပန်း unqualified domain name တစ်ခု                | `gwen`, `jaden`, `donnell`                                                    |
| **`$randomEmail`**          | ကျပန်း email address တစ်ခု                          | `Pablo62@gmail.com`, `Ruthe42@hotmail.com`, `Iva.Kovacek61@hotmail.com`        |
| **`$randomExampleEmail`**   | "example" domain ကနေ ကျပန်း email address တစ်ခု     | `Talon28@example.com`, `Quinten_Kerluke45@example.net`, `Casey81@example.net`  |
| **`$randomUserName`**       | ကျပန်း username တစ်ခု                               | `Jarrell.Gutkowski`, `Lottie.Smitham24`, `Alia99`                             |
| **`$randomUrl`**            | ကျပန်း URL တစ်ခု                                    | `https://anais.net`, `https://tristin.net`, `http://jakob.name`               |

## Files နဲ့ directories (ဖိုင်များနဲ့ ဖိုင်တွဲများ)

| **Variable နာမည်**           | **ဖော်ပြချက်**                                              | **ဥပမာများ**                          |
| ----------------------------- | ------------------------------------------------------------ | ------------------------------------- |
| **`$randomFileName`**         | ကျပန်း file name (အသုံးနည်းတဲ့ extensions တွေ ပါဝင်သည်)     | `neural_sri_lanka_rupee_gloves.gdoc`,  |
| **`$randomFileType`**         | ကျပန်း file type (အသုံးနည်းတဲ့ file types တွေ ပါဝင်သည်)     | `model`, `application`, `video`        |
| **`$randomFileExt`**          | ကျပန်း file extension (အသုံးနည်းတဲ့ extensions တွေ ပါဝင်သည်) | `war`, `book`, `fsc`                   |
| **`$randomCommonFileName`**   | ကျပန်း file name တစ်ခု                                      | `well_modulated.mpg4`,                 |
| **`$randomCommonFileType`**   | ကျပန်း အသုံးများတဲ့ file type တစ်ခု                          | `application`, `audio`                 |
| **`$randomCommonFileExt`**    | ကျပန်း အသုံးများတဲ့ file extension တစ်ခု                     | `m2v`, `wav`, `png`                    |
| **`$randomFilePath`**         | ကျပန်း file path တစ်ခု                                       | `/home/programming_chicken.cpio`,      |
| **`$randomDirectoryPath`**    | ကျပန်း directory path တစ်ခု                                  | `/usr/bin`, `/root`, `/usr/local/bin`  |
| **`$randomMimeType`**         | ကျပန်း MIME type တစ်ခု                                       | `audio/vnd.vmx.cvsd`,                  |

## Stores (စတိုးများ)

| **Variable နာမည်**             | **ဖော်ပြချက်**                             | **ဥပမာများ**                                 |
| ------------------------------- | ------------------------------------------- | ---------------------------------------------- |
| **`$randomPrice`**              | 0.00 နဲ့ 1000.00 ကြား ကျပန်း ဈေးနှုန်းတစ်ခု  | `531.55`, `488.76`, `511.56`                   |
| **`$randomProduct`**            | ကျပန်း ကုန်ပစ္စည်းတစ်ခု                      | `Towels`, `Pizza`, `Pants`                     |
| **`$randomProductAdjective`**   | ကျပန်း ကုန်ပစ္စည်း နာမဝိသေသနတစ်ခု             | `Unbranded`, `Incredible`, `Tasty`             |
| **`$randomProductMaterial`**    | ကျပန်း ကုန်ပစ္စည်း ပစ္စည်းအမျိုးအစားတစ်ခု      | `Steel`, `Plastic`, `Frozen`                   |
| **`$randomProductName`**        | ကျပန်း ကုန်ပစ္စည်း နာမည်တစ်ခု                | `Handmade Concrete Tuna`, `Refined Rubber Hat` |
| **`$randomDepartment`**         | ကျပန်း commerce အမျိုးအစားတစ်ခု               | `Tools`, `Movies`, `Electronics`               |

## Grammar (သဒ္ဒါ)

| **Variable နာမည်**      | **ဖော်ပြချက်**                          | **ဥပမာများ**                                                                |
| ------------------------ | ---------------------------------------- | ---------------------------------------------------------------------------- |
| **`$randomNoun`**        | ကျပန်း နာမ် (noun) တစ်လုံး                | `matrix`, `bus`, `bandwidth`                                                 |
| **`$randomVerb`**        | ကျပန်း ကြိယာ (verb) တစ်လုံး               | `parse`, `quantify`, `navigate`                                              |
| **`$randomIngverb`**     | `-ing` နဲ့ ဆုံးတဲ့ ကျပန်း ကြိယာတစ်လုံး     | `synthesizing`, `navigating`, `backing up`                                   |
| **`$randomAdjective`**   | ကျပန်း နာမဝိသေသန (adjective) တစ်လုံး      | `auxiliary`, `multi-byte`, `back-end`                                        |
| **`$randomWord`**        | ကျပန်း စကားလုံးတစ်လုံး                    | `withdrawal`, `infrastructures`, `IB`                                        |
| **`$randomWords`**       | ကျပန်း စကားလုံးတချို့                     | `Samoa Synergistic sticky copying Grocery`,                                  |
|                          |                                          | `Corporate Springs`,                                                         |
|                          |                                          | `Christmas Island Ghana Quality`                                             |
| **`$randomPhrase`**      | ကျပန်း စကားစုတစ်ခု                       | `You can't program the monitor without navigating the mobile XML program!`,  |

## Lorem ipsum (Lorem ipsum စာသား)

| **Variable နာမည်**            | **ဖော်ပြချက်**                              | **ဥပမာများ**                                                              |
| ------------------------------ | -------------------------------------------- | --------------------------------------------------------------------------- |
| **`$randomLoremWord`**         | Lorem ipsum စာသား ကျပန်း စကားလုံးတစ်လုံး      | `est`                                                                       |
| **`$randomLoremWords`**        | Lorem ipsum စာသား ကျပန်း စကားလုံးတချို့       | `vel repellat nobis`                                                        |
| **`$randomLoremSentence`**     | Lorem ipsum စာသား ကျပန်း ဝါကျတစ်ကြောင်း       | `Molestias consequuntur nisi non quod.`                                     |
| **`$randomLoremSentences`**    | Lorem ipsum စာသား ကျပန်း ဝါကျ ၂ ကြောင်းမှ ၆ ကြောင်း | `Et sint voluptas similique iure amet perspiciatis vero sequi atque. Ut porro sit et hic. Neque aspernatur vitae fugiat ut dolore et veritatis. Ab iusto ex delectus animi. Voluptates nisi iusto. Impedit quod quae voluptate qui.` |
| **`$randomLoremParagraph`**    | Lorem ipsum စာသား ကျပန်း စာပိုဒ်တစ်ပိုဒ်        | `Ab aliquid odio iste quo voluptas voluptatem dignissimos velit. Recusandae facilis qui commodi ea magnam enim nostrum quia quis. Nihil est suscipit assumenda ut voluptatem sed. Esse ab voluptas odit qui molestiae. Rem est nesciunt est quis ipsam expedita consequuntur.` |
| **`$randomLoremParagraphs`**   | Lorem ipsum စာသား ကျပန်း စာပိုဒ် ၃ ပိုဒ်        | `Voluptatem rem magnam aliquam ab id aut quaerat. Placeat provident possimus voluptatibus dicta velit non aut quasi. Mollitia et aliquam expedita sunt dolores nam consequuntur. Nam dolorum delectus ipsam repudiandae et ipsam ut voluptatum totam. Nobis labore labore recusandae ipsam quo.` `Voluptatem occaecati omnis debitis eum libero. Veniam et cum unde. Nisi facere repudiandae error aperiam expedita optio quae consequatur qui. Vel ut sit aliquid omnis. Est placeat ducimus. Libero voluptatem eius occaecati ad sint voluptatibus laborum provident iure.` `Autem est sequi ut tenetur omnis enim. Fuga nisi dolor expedita. Ea dolore ut et a nostrum quae ut reprehenderit iste. Numquam optio magnam omnis architecto non. Est cumque laboriosam quibusdam eos voluptatibus velit omnis. Voluptatem officiis nulla omnis ratione excepturi.` |
| **`$randomLoremText`**         | Lorem ipsum စာသား ကျပန်း ပမာဏတစ်ခု             | `Quisquam asperiores exercitationem ut ipsum. Aut eius nesciunt. Et reiciendis aut alias eaque. Nihil amet laboriosam pariatur eligendi. Sunt ullam ut sint natus ducimus. Voluptas harum aspernatur soluta rem nam.` |
| **`$randomLoremSlug`**         | Lorem ipsum စာသား ကျပန်း URL slug တစ်ခု        | `eos-aperiam-accusamus`, `beatae-id-molestiae`, `qui-est-repellat`          |
| **`$randomLoremLines`**        | Lorem ipsum စာသား ကျပန်း စာကြောင်း ၁ ကြောင်းမှ ၅ ကြောင်း | `Ducimus in ut mollitia.` `A itaque non.` `Harum temporibus nihil voluptas.` `Iste in sed et nesciunt in quaerat sed.` |
