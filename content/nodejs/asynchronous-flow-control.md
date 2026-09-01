---
title: "Asynchronous Flow Control"
description: "callback နဲ့ flow control — initiator/middleware/terminator ပုံစံ၊ state management နည်းလမ်းများ၊ in series / limited in series / full parallel ဆိုတဲ့ pattern ၃ မျိုး"
order: 24
source: "https://nodejs.org/en/learn/asynchronous-work/asynchronous-flow-control"
status: translated
updated: 2026-09-01
---

## Asynchronous Flow Control

ဒီ post ရဲ့ အကြောင်းအရာကို [Mixu's Node.js Book](http://book.mixu.net/node/ch7.html) ကနေ အများကြီး မှီငြမ်းထားပါတယ်။

အဓိကအားဖြင့် JavaScript က "main" thread ပေါ်မှာ non-blocking ဖြစ်အောင် ဒီဇိုင်းထုတ်ထားပါတယ် — ဒီ thread ပေါ်မှာပဲ views တွေကို render လုပ်ပါတယ်။ ဒီရဲ့ အရေးပါမှုကို browser မှာ စိတ်ကူးကြည့်လို့ ရပါတယ်။ Main thread block ဖြစ်သွားတဲ့အခါ — end users တွေ ကြောက်ရွံ့ကြတဲ့ နာမည်ကြီး "freezing" (ပိတ်သွားခြင်း) ဖြစ်ပေါ်ပြီး — တခြား events တွေ dispatch မလုပ်နိုင်တော့ဘဲ — ဥပမာ data acquisition တွေ ဆုံးရှုံးသွားနိုင်ပါတယ်။

ဒါက functional ပုံစံ programming နဲ့ပဲ ဖြေရှင်းလို့ရတဲ့ ထူးခြားတဲ့ ကန့်သတ်ချက်တွေကို ဖန်တီးပေးပါတယ်။ ဒီနေရာမှာပဲ callbacks တွေက မြင်ကွင်းထဲ ဝင်လာပါတယ်။

ဒါပေမယ့် — ပိုရှုပ်ထွေးတဲ့ လုပ်ငန်းစဉ်တွေမှာ callbacks တွေကို ကိုင်တွယ်ရတာ စိန်ခေါ်မှုတွေ ဖြစ်လာနိုင်ပါတယ်။ ဒါက မကြာခဏ "callback hell" ကို ဖြစ်စေပြီး — callbacks တွေပါတဲ့ functions တွေ အသိုက်အမြုံ များပြားလာတာကြောင့် code ကို ဖတ်ရတာ၊ debug လုပ်ရတာ၊ စုစည်းရတာ ပိုခက်ခဲလာစေပါတယ်။

```js
async1(function (input, result1) {
  async2(function (result2) {
    async3(function (result3) {
      async4(function (result4) {
        async5(function (output) {
          // do something with output
        });
      });
    });
  });
});
```

တကယ့် လက်တွေ့ ဘဝမှာတော့ `result1`၊ `result2` စတာတွေကို ကိုင်တွယ်ဖို့ နောက်ထပ် code lines တွေ ရှိနိုင်ခြေ များပါတယ် — ဒါကြောင့် ဒီပြဿနာရဲ့ ရှည်လျားမှုနဲ့ ရှုပ်ထွေးမှုက အပေါ်က ဥပမာထက် အများကြီး ပိုရှုပ်ပွတဲ့ code ကို ဖြစ်စေလေ့ ရှိပါတယ်။

**ဒီနေရာမှာ *functions* တွေက အရမ်း အသုံးဝင်လာပါတယ်။ ပိုရှုပ်ထွေးတဲ့ operations တွေက functions အများကြီးနဲ့ ဖွဲ့စည်းထားပါတယ်:**

- initiator style / input

- middleware

- terminator

**"Initiator style / input" က sequence ထဲက ပထမဆုံး function ပါ။ ဒီ function က operation အတွက် မူရင်း input (ရှိရင်) ကို လက်ခံပါတယ်။ Operation ဆိုတာက execute လုပ်လို့ရတဲ့ functions စီးရီးတစ်ခုဖြစ်ပြီး — မူရင်း input က အဓိကအားဖြင့်:**

- global environment ထဲက variables တွေ

- arguments ပါတာ မပါတာ နဲ့ တိုက်ရိုက် invocation (ခေါ်ဆိုခြင်း)

- file system ဒါမှမဟုတ် network requests တွေကနေ ရရှိတဲ့ တန်ဖိုးတွေ

Network requests တွေက — အပြင်က network တစ်ခုကနေ စတင်တဲ့ incoming requests တွေ၊ network တစ်ခုတည်းပေါ်က တခြား application တစ်ခုကနေ စတင်တာတွေ ဒါမှမဟုတ် network တစ်ခုတည်း ဒါမှမဟုတ် အခြား network ပေါ်က app ကိုယ်တိုင်ကနေ စတင်တာတွေ ဖြစ်နိုင်ပါတယ်။

Middleware function တစ်ခုက တခြား function တစ်ခုကို return ပြန်ပေးပြီး — terminator function တစ်ခုက callback ကို invoke လုပ်ပါတယ်။ အောက်မှာတော့ network ဒါမှမဟုတ် file system requests တွေဆီ စီးဆင်းပုံကို ဖော်ပြထားပါတယ်။ ဒီမှာ latency က 0 ပါ — ဘာလို့လဲဆိုတော့ ဒီတန်ဖိုးတွေအားလုံးက memory ထဲမှာ ရနေလို့ပါ။

```js
function final(someInput, callback) {
  callback(`${someInput} and terminated by executing callback `);
}

function middleware(someInput, callback) {
  return final(`${someInput} touched by middleware `, callback);
}

function initiate() {
  const someInput = 'hello this is a function ';
  middleware(someInput, function (result) {
    console.log(result);
    // requires callback to `return` result
  });
}

initiate();
```

## State Management

Functions တွေက state ပေါ် မူတည်တာလည်း ရှိနိုင်သလို — မမူတည်တာလည်း ရှိနိုင်ပါတယ်။ Function တစ်ခုရဲ့ input ဒါမှမဟုတ် တခြား variable တစ်ခုက အပြင်က function တစ်ခုအပေါ် မှီခိုနေတဲ့အခါ — state dependency ဖြစ်ပေါ်လာပါတယ်။

**ဒီလိုနည်းနဲ့ state management အတွက် အဓိက နည်းလမ်း နှစ်မျိုး ရှိပါတယ်:**

- variables တွေကို function တစ်ခုဆီ တိုက်ရိုက် ပို့ပေးတာ၊ နဲ့

- cache၊ session၊ file၊ database၊ network ဒါမှမဟုတ် တခြား အပြင်က အရင်းအမြစ်တစ်ခုကနေ variable တစ်ခုရဲ့ တန်ဖိုးကို ရယူတာ

သတိပြုပါ — ကျွန်တော်က global variable ကို မပြောခဲ့ပါဘူး။ Global variables တွေနဲ့ state ကို စီမံခန့်ခွဲတာက မကြာခဏ ရှုပ်ပွပြီး — state ကို အာမခံဖို့ ခက်ခဲစေတဲ့ (ဒါမှမဟုတ် မဖြစ်နိုင်စေတဲ့) anti-pattern တစ်ခုပါ။ ရှုပ်ထွေးတဲ့ programs တွေမှာ global variables တွေကို တတ်နိုင်သမျှ ရှောင်သင့်ပါတယ်။

## Control Flow

Object တစ်ခုက memory ထဲမှာ ရနေရင် — iteration လုပ်လို့ ရနိုင်ပြီး — control flow မှာ ပြောင်းလဲမှု ရှိမှာ မဟုတ်ပါဘူး:

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    _song += `${i} beers on the wall, you take one down and pass it around, ${
      i - 1
    } bottles of beer on the wall\n`;
    if (i === 1) {
      _song += "Hey let's get some more beer";
    }
  }

  return _song;
}

function singSong(_song) {
  if (!_song) {
    throw new Error("song is '' empty, FEED ME A SONG!");
  }

  console.log(_song);
}

const song = getSong();
// this will work
singSong(song);
```

ဒါပေမယ့် — data က memory ရဲ့ အပြင်ဘက်မှာ ရှိနေရင်တော့ — iteration က အလုပ်မလုပ်တော့ပါဘူး:

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    setTimeout(function () {
      _song += `${i} beers on the wall, you take one down and pass it around, ${
        i - 1
      } bottles of beer on the wall\n`;
      if (i === 1) {
        _song += "Hey let's get some more beer";
      }
    }, 0);
  }

  return _song;
}

function singSong(_song) {
  if (!_song) {
    throw new Error("song is '' empty, FEED ME A SONG!");
  }

  console.log(_song);
}

const song = getSong('beer');
// this will not work
singSong(song);
// Uncaught Error: song is '' empty, FEED ME A SONG!
```

ဘာလို့ ဒီလို ဖြစ်သွားတာလဲ? `setTimeout` က CPU ကို — ညွှန်ကြားချက်တွေကို bus ပေါ်က တခြားနေရာတစ်ခုမှာ သိမ်းထားဖို့ ပြောပြီး — data ကို နောက်မှ လာယူဖို့ စီစဉ်ထားကြောင်း ပြောပါတယ်။ 0 millisecond အမှတ်မှာ function က နောက်တစ်ခါ ပြန်ထိမခင် — CPU cycles ထောင်ပေါင်းများစွာ ဖြတ်သန်းသွားပြီး — CPU က bus ကနေ ညွှန်ကြားချက်တွေကို ပြန်ယူပြီး execute လုပ်ပါတယ်။ ပြဿနာက — song ('') ကို cycles ထောင်ပေါင်းများစွာ အလိုမှာ ပြန်ပေးပြီးသား ဖြစ်နေခဲ့လို့ပါ။

File systems နဲ့ network requests တွေကို ကိုင်တွယ်ရာမှာလည်း အလားတူ အခြေအနေမျိုး ဖြစ်ပေါ်ပါတယ်။ Main thread ကို အချိန် မသတ်မှတ်နိုင်တဲ့ ကာလတစ်ခုအထိ ရိုးရိုးရှင်းရှင်း block လုပ်ထားလို့ မရပါဘူး — ဒါကြောင့် code တွေရဲ့ execution ကို အချိန်နဲ့အမျှ ထိန်းချုပ်ပြီး စီစဉ်ဖို့ callbacks တွေကို သုံးပါတယ်။

အောက်ပါ pattern ၃ မျိုးနဲ့ — သင့်ရဲ့ operations တွေ အားလုံးနီးပါးကို လုပ်ဆောင်နိုင်မှာ ဖြစ်ပါတယ်:

- **In series:** functions တွေက တင်းကျပ်တဲ့ sequential order အတိုင်း execute လုပ်ပါမယ် — ဒါက `for` loops တွေနဲ့ အဆင်ဆုံး ဆင်တူပါတယ်။

```js
// operations defined elsewhere and ready to execute
const operations = [
  { func: function1, args: args1 },
  { func: function2, args: args2 },
  { func: function3, args: args3 },
];

function executeFunctionWithArgs(operation, callback) {
  // executes function
  const { args, func } = operation;
  func(args, callback);
}

function serialProcedure(operation) {
  if (!operation) {
    process.exit(0); // finished
  }

  executeFunctionWithArgs(operation, function (result) {
    // continue AFTER callback
    serialProcedure(operations.shift());
  });
}

serialProcedure(operations.shift());
```

- **Limited in series:** functions တွေက တင်းကျပ်တဲ့ sequential order အတိုင်း execute လုပ်ပေမယ့် — executions အရေအတွက်ကို ကန့်သတ်ချက် တစ်ခု ထားပါတယ်။ စာရင်းကြီးတစ်ခုကို လုပ်ဆောင်ဖို့ လိုပေမယ့် — အောင်မြင်စွာ လုပ်ဆောင်လို့ရတဲ့ items အရေအတွက်ကို မျက်နှာကျက် (cap) သတ်မှတ်ထားချင်တဲ့အခါ အသုံးဝင်ပါတယ်။

```js
let successCount = 0;

function final() {
  console.log(`dispatched ${successCount} emails`);
  console.log('finished');
}

function dispatch(recipient, callback) {
  // `sendMail` is a hypothetical SMTP client
  sendMail(
    {
      subject: 'Dinner tonight',
      message: 'We have lots of cabbage on the plate. You coming?',
      smtp: recipient.email,
    },
    callback
  );
}

function sendOneMillionEmailsOnly() {
  getListOfTenMillionGreatEmails(function (err, bigList) {
    if (err) {
      throw err;
    }

    function serial(recipient) {
      if (!recipient || successCount >= 1000000) {
        return final();
      }

      dispatch(recipient, function (_err) {
        if (!_err) {
          successCount += 1;
        }

        serial(bigList.pop());
      });
    }

    serial(bigList.pop());
  });
}

sendOneMillionEmailsOnly();
```

- **Full parallel:** order အရေးမကြီးတဲ့အခါ — ဥပမာ လက်ခံသူ ၁,၀၀၀,၀၀၀ ပါတဲ့ စာရင်းကို email ပို့တာမျိုးမှာ သုံးပါတယ်။

```js
let count = 0;
let success = 0;
const failed = [];
const recipients = [
  { name: 'Bart', email: 'bart@tld' },
  { name: 'Marge', email: 'marge@tld' },
  { name: 'Homer', email: 'homer@tld' },
  { name: 'Lisa', email: 'lisa@tld' },
  { name: 'Maggie', email: 'maggie@tld' },
];

function dispatch(recipient, callback) {
  // `sendMail` is a hypothetical SMTP client
  sendMail(
    {
      subject: 'Dinner tonight',
      message: 'We have lots of cabbage on the plate. You coming?',
      smtp: recipient.email,
    },
    callback
  );
}

function final(result) {
  console.log(`Result: ${result.count} attempts \
      & ${result.success} succeeded emails`);
  if (result.failed.length) {
    console.log(`Failed to send to: \
        \n${result.failed.join('\n')}\n`);
  }
}

recipients.forEach(function (recipient) {
  dispatch(recipient, function (err) {
    if (!err) {
      success += 1;
    } else {
      failed.push(recipient.name);
    }
    count += 1;

    if (count === recipients.length) {
      final({
        count,
        success,
        failed,
      });
    }
  });
});
```

Pattern တစ်ခုချင်းစီမှာ ကိုယ်ပိုင် use cases တွေ၊ အကျိုးကျေးဇူးတွေနဲ့ ပြဿနာတွေ ရှိပါတယ် — သင်ကိုယ်တိုင် စမ်းသပ်ပြီး အသေးစိတ် ဖတ်ရှုနိုင်ပါတယ်။ အရေးအကြီးဆုံးကတော့ — သင့် operations တွေကို module ပုံစံ ခွဲထုတ်ပြီး callbacks တွေကို သုံးဖို့ သတိရပါ! သံသယ ဖြစ်မိရင် — အရာအားလုံးကို middleware လိုပဲ သဘောထားလိုက်ပါ!
