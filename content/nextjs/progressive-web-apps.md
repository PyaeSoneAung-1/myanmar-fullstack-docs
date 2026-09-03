---
title: "Progressive Web Apps (PWA) ဆောက်လုပ်ခြင်း"
description: "Next.js နဲ့ Progressive Web Application (PWA) ဆောက်နည်း — web app manifest, web push notifications, Server Actions, VAPID keys, service worker နဲ့ home screen install လုပ်ခြင်း အဆင့်ဆင့်"
order: 230
source: "https://nextjs.org/docs/app/guides/progressive-web-apps"
status: translated
updated: 2026-09-03
---

Progressive Web Applications (PWA) တွေက — web application တွေရဲ့ လက်လှမ်းမီမှု (reach) နဲ့ သုံးစွဲနိုင်မှု (accessibility) ကို native mobile app တွေရဲ့ feature တွေနဲ့ user experience နဲ့ ပေါင်းစပ်ပေးပါတယ်။ Next.js နဲ့ဆိုရင် — codebase အများကြီး (သို့) app store approval တွေ မလိုဘဲ — platform အားလုံးမှာ ချောမွေ့တဲ့၊ app ပုံစံ experience ကို ပေးစွမ်းနိုင်တဲ့ PWA တွေကို ဖန်တီးနိုင်ပါတယ်။

PWA တွေနဲ့ သင်လုပ်နိုင်တာတွေ:

- App store approval ကို မစောင့်ဘဲ update တွေကို ချက်ချင်း deploy လုပ်နိုင်ခြင်း
- Codebase တစ်ခုတည်းနဲ့ cross-platform applications တွေ ဖန်တီးနိုင်ခြင်း
- Home screen မှာ install လုပ်ခြင်းနဲ့ push notifications တွေလို native ပုံစံ feature တွေ ရရှိနိုင်ခြင်း

## Next.js နဲ့ PWA တစ်ခု ဆောက်ခြင်း

### 1. Web App Manifest ဖန်တီးခြင်း

Next.js က App Router ကို သုံးပြီး [web app manifest](/docs/nextjs/manifest) တစ်ခု ဖန်တီးဖို့ built-in support ပေးထားပါတယ်။ Static ဖြစ်ဖြစ် dynamic ဖြစ်ဖြစ် manifest file တစ်ခု ဖန်တီးနိုင်ပါတယ်:

ဥပမာ — `app/manifest.ts` (သို့) `app/manifest.json` file တစ်ခု ဖန်တီးပါ:

```tsx filename="app/manifest.ts" switcher
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js PWA',
    short_name: 'NextPWA',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
```

```jsx filename="app/manifest.js" switcher
export default function manifest() {
  return {
    name: 'Next.js PWA',
    short_name: 'NextPWA',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
```

ဒီ file ထဲမှာ — app ရဲ့ name, icons နဲ့ user ရဲ့ device ပေါ်မှာ icon တစ်ခုအနေနဲ့ ဘယ်လို ပြသမလဲ ဆိုတဲ့ အချက်အလက်တွေ ပါဝင်ရပါမယ်။ ဒါက user တွေ သင့် PWA ကို သူတို့ရဲ့ home screen ပေါ်မှာ install လုပ်နိုင်စေပြီး — native app ပုံစံ experience တစ်ခုကို ပေးပါတယ်။

Icon set အမျိုးမျိုး ဖန်တီးဖို့ [favicon generators](https://realfavicongenerator.net/) လို tools တွေကို သုံးပြီး — generate လုပ်ထားတဲ့ files တွေကို သင့် `public/` folder ထဲမှာ ထားနိုင်ပါတယ်။

### 2. Web Push Notifications အကောင်အထည်ဖော်ခြင်း

Web Push Notifications တွေက browser ခေတ်မီ (modern) အားလုံးမှာ support လုပ်ပါတယ် — ဥပမာ:

- Home screen မှာ install လုပ်ထားတဲ့ applications တွေအတွက် iOS 16.4+
- macOS 13 (သို့) အထက်အတွက် Safari 16
- Chromium based browsers
- Firefox

ဒါက PWA တွေကို native apps တွေရဲ့ အလားအလာရှိတဲ့ အစားထိုးတစ်ခု ဖြစ်စေပါတယ်။ အထူးသဖြင့် — offline support မလိုဘဲနဲ့တောင် install prompts တွေကို trigger လုပ်နိုင်ပါတယ်။

Web Push Notifications တွေက user တွေ သင့် app ကို တက်ကြွစွာ (actively) မသုံးနေတော့တဲ့အခါမှာတောင် — သူတို့ကို ပြန်လည် ထိတွေ့နိုင်ဖို့ (re-engage) လုပ်ပေးနိုင်ပါတယ်။ Next.js application တစ်ခုမှာ ဒါတွေကို ဘယ်လို အကောင်အထည်ဖော်မလဲ ဆိုတာ ကြည့်ရအောင်:

ပထမဆုံး — `app/page.tsx` ထဲမှာ main page component ကို ဖန်တီးပါမယ်။ ပိုပြီး နားလည်လွယ်အောင် အပိုင်းငယ်တွေ ခွဲပြီး ရှင်းပြပါမယ်။ စလို့ — လိုအပ်မယ့် imports နဲ့ utilities တချို့ကို ထည့်ပါမယ်။ ရည်ညွှန်းထားတဲ့ Server Actions တွေက မရှိသေးတာ ရပါတယ်:

```tsx switcher
'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from './actions'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
```

```jsx switcher
'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from './actions'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/\\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
```

အခု — subscribe လုပ်ခြင်း၊ unsubscribe လုပ်ခြင်းနဲ့ push notifications ပို့ခြင်းတွေကို စီမံဖို့ component တစ်ခု ထည့်ပါမယ်။

```tsx switcher
function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
  const [message, setMessage] = useState('')

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register(
      new URL('../lib/service-worker.js', import.meta.url),
      {
        scope: '/',
        updateViaCache: 'none',
      }
    )
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    const serializedSub = JSON.parse(JSON.stringify(sub))
    await subscribeUser(serializedSub)
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message)
      setMessage('')
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={unsubscribeFromPush}>Unsubscribe</button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendTestNotification}>Send Test</button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button onClick={subscribeToPush}>Subscribe</button>
        </>
      )}
    </div>
  )
}
```

```jsx switcher
function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register(
      new URL('../lib/service-worker.js', import.meta.url),
      {
        scope: '/',
        updateViaCache: 'none',
      }
    )
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    await subscribeUser(sub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage('');
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={unsubscribeFromPush}>Unsubscribe</button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendTestNotification}>Send Test</button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button onClick={subscribeToPush}>Subscribe</button>
        </>
      )}
    </div>
  );
}
```

နောက်ဆုံးအနေနဲ့ — iOS device တွေကို home screen မှာ install လုပ်ဖို့ ညွှန်ကြားတဲ့ message ပြပေးမယ့် component တစ်ခု ဖန်တီးပါမယ်။ App က install ဖြစ်ပြီးသားမဟုတ်ရင်တော့ — ဒီ message ကိုပဲ ပြပါမယ်။

```tsx switcher
function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  if (isStandalone) {
    return null // Install ဖြစ်ပြီးသားဆိုရင် install button ကို မပြပါ
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {' '}
            ⎋{' '}
          </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon">
            {' '}
            ➕{' '}
          </span>
          .
        </p>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  )
}
```

```jsx switcher
function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone) {
    return null; // Install ဖြစ်ပြီးသားဆိုရင် install button ကို မပြပါ
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {' '}
            ⎋{' '}
          </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon">
            {' '}
            ➕{' '}
          </span>
          .
        </p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  );
}
```

အခု — ဒီ file က ခေါ်ထားတဲ့ Server Actions တွေကို ဖန်တီးကြည့်ရအောင်။

### 3. Server Actions အကောင်အထည်ဖော်ခြင်း

သင့် actions တွေ ထည့်ဖို့ `app/actions.ts` မှာ file အသစ်တစ်ခု ဖန်တီးပါ။ ဒီ file က subscriptions တွေ ဖန်တီးခြင်း၊ ဖျက်ခြင်းနဲ့ notifications ပို့ခြင်းတွေကို စီမံပါမယ်။

```tsx filename="app/actions.ts" switcher
'use server'

import webpush from 'web-push'

webpush.setVapidDetails(
  '<mailto:your-email@example.com>',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

let subscription: PushSubscription | null = null

export async function subscribeUser(sub: PushSubscription) {
  subscription = sub
  // Production environment မှာတော့ subscription ကို database ထဲမှာ သိမ်းထားချင်ပါလိမ့်မယ်
  // ဥပမာ: await db.subscriptions.create({ data: sub })
  return { success: true }
}

export async function unsubscribeUser() {
  subscription = null
  // Production environment မှာတော့ subscription ကို database ကနေ ဖျက်ပစ်ချင်ပါလိမ့်မယ်
  // ဥပမာ: await db.subscriptions.delete({ where: { ... } })
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('No subscription available')
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}
```

```jsx filename="app/actions.js" switcher
'use server';

import webpush from 'web-push';

webpush.setVapidDetails(
  '<mailto:your-email@example.com>',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

let subscription= null;

export async function subscribeUser(sub) {
  subscription = sub;
  // Production environment မှာတော့ subscription ကို database ထဲမှာ သိမ်းထားချင်ပါလိမ့်မယ်
  // ဥပမာ: await db.subscriptions.create({ data: sub })
  return { success: true };
}

export async function unsubscribeUser() {
  subscription = null;
  // Production environment မှာတော့ subscription ကို database ကနေ ဖျက်ပစ်ချင်ပါလိမ့်မယ်
  // ဥပမာ: await db.subscriptions.delete({ where: { ... } })
  return { success: true };
}

export async function sendNotification(message) {
  if (!subscription) {
    throw new Error('No subscription available');
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
      })
    );
    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}
```

Notification ပို့တာကို — step 5 မှာ ဖန်တီးမယ့် သင့် service worker က စီမံပါလိမ့်မယ်။

Production environment မှာတော့ — server restarts တွေကြားမှာ ဆက်လက် တည်မြဲစေဖို့ (persistence) နဲ့ user အများကြီးရဲ့ subscriptions တွေကို စီမံနိုင်ဖို့ — subscription ကို database ထဲမှာ သိမ်းထားသင့်ပါတယ်။

### 4. VAPID Keys ထုတ်လုပ်ခြင်း

Web Push API ကို သုံးဖို့ [VAPID](https://vapidkeys.com/) keys တွေ generate လုပ်ဖို့ လိုပါတယ်။ အလွယ်ဆုံးနည်းက — web-push CLI ကို တိုက်ရိုက် သုံးတာပါ:

ပထမဆုံး — web-push ကို globally install လုပ်ပါ:

```bash package="pnpm"
pnpm add -g web-push
```

```bash package="npm"
npm install -g web-push
```

```bash package="yarn"
yarn global add web-push
```

```bash package="bun"
bun add -g web-push
```

ဒီ command ကို run ပြီး VAPID keys တွေ generate လုပ်ပါ:

```bash filename="Terminal"
web-push generate-vapid-keys
```

Output ကို copy လုပ်ပြီး — keys တွေကို သင့် `.env` file ထဲမှာ paste လုပ်ပါ:

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

### 5. Service Worker ဖန်တီးခြင်း

သင့် service worker အတွက် `lib/service-worker.js` file တစ်ခု ဖန်တီးပါ:

```js filename="lib/service-worker.js"
self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/icon.png',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')
  event.notification.close()
  event.waitUntil(clients.openWindow('<https://your-website.com>'))
})
```

ဒီ service worker က custom images တွေနဲ့ notifications တွေကို support လုပ်ပါတယ်။ Incoming push events တွေနဲ့ notification clicks တွေကို စီမံပါတယ်။

- `icon` နဲ့ `badge` properties တွေကို သုံးပြီး — notifications တွေအတွက် custom icons တွေ သတ်မှတ်နိုင်ပါတယ်။
- `vibrate` pattern ကို ချိန်ညှိပြီး — support လုပ်တဲ့ devices တွေမှာ custom vibration alerts တွေ ဖန်တီးနိုင်ပါတယ်။
- `data` property နဲ့ — notification ထဲကို နောက်ထပ် ဒေတာ (additional data) တွေ ထည့်နိုင်ပါတယ်။

သင့် service worker ကို device အမျိုးမျိုးနဲ့ browser အမျိုးမျိုးမှာ မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်ဖို့ — သေချာ စမ်းသပ်ဖို့ မမေ့ပါနဲ့။ ပြီးတော့ — `notificationclick` event listener ထဲက `'https://your-website.com'` link ကို သင့် application ရဲ့ သင့်လျော်တဲ့ URL နဲ့ update လုပ်ဖို့လည်း သေချာပါစေ။

### 6. Home Screen မှာ ထည့်သွင်းခြင်း

Step 2 မှာ သတ်မှတ်ထားတဲ့ `InstallPrompt` component က — iOS device တွေကို home screen မှာ install လုပ်ဖို့ ညွှန်ကြားတဲ့ message ကို ပြပေးပါတယ်။

သင့် application ကို mobile home screen မှာ install လုပ်နိုင်ဖို့ — အောက်ပါတွေ ရှိရပါမယ်:

1. Web app manifest တရားဝင် (valid) တစ်ခု (step 1 မှာ ဖန်တီးထားတာ)
2. HTTPS နဲ့ ဆာဗာ ပေးပို့ထားတဲ့ website

ဒီအချက်တွေ ပြည့်မီတဲ့အခါ — ခေတ်မီ browser တွေက user တွေကို installation prompt ကို အလိုအလျောက် ပြပါလိမ့်မယ်။ [`beforeinstallprompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event) နဲ့ custom installation button တစ်ခုကို ပေးနိုင်ပေမယ့် — ဒါက cross browser ရော cross platform ပါ မဟုတ်လို့ (Safari iOS မှာ အလုပ်မလုပ်ပါ) — ဒါကို ကျွန်တော်တို့ အကြံပြုလို့ မရပါဘူး။

### 7. ဒေသတွင်း စမ်းသပ်ခြင်း (Testing Locally)

Notifications တွေကို ဒေသတွင်းမှာ ကြည့်နိုင်ဖို့ — အောက်ပါတွေ သေချာပါစေ:

- [HTTPS နဲ့ ဒေသတွင်း run လုပ်နေတာ](/docs/nextjs/next-cli) ဖြစ်ဖို့ လိုပါတယ်
  - စမ်းသပ်ဖို့ `next dev --experimental-https` ကို သုံးပါ
- သင့် browser (Chrome, Safari, Firefox) မှာ notifications enable လုပ်ထားဖို့ လိုပါတယ်
  - ဒေသတွင်း prompt လာတဲ့အခါ — notifications သုံးဖို့ permissions ကို လက်ခံပါ
  - Browser တစ်ခုလုံးအတွက် notifications ကို globally disable မလုပ်ထားဘူးဆိုတာ သေချာပါစေ
  - Notifications တွေ မမြင်ရသေးရင် — debug လုပ်ဖို့ တခြား browser တစ်ခု စမ်းကြည့်ပါ

### 8. သင့် application ကို လုံခြုံအောင် ပြုလုပ်ခြင်း

Security က web application တိုင်းရဲ့ အရေးကြီးတဲ့ ကဏ္ဍတစ်ခုပါ — အထူးသဖြင့် PWA တွေအတွက်ပါ။ Next.js က `next.config.js` file ကို သုံးပြီး security headers တွေ configure လုပ်နိုင်စေပါတယ်။ ဥပမာ:

```js filename="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ]
  },
}
```

ဒီ options တစ်ခုချင်းစီကို လေ့လာကြည့်ရအောင်:

1. Global Headers (routes အားလုံးမှာ သက်ရောက်တဲ့):
   1. `X-Content-Type-Options: nosniff`: MIME type sniffing ကို တားဆီးပေးပြီး — အန္တရာယ်ရှိတဲ့ file uploads တွေရဲ့ အန္တရာယ်ကို လျှော့ချပေးပါတယ်။
   2. `X-Frame-Options: DENY`: သင့် site ကို iframes တွေထဲမှာ ထည့်သွင်းခြင်းကနေ တားဆီးပြီး — clickjacking attacks တွေကနေ ကာကွယ်ပေးပါတယ်။
   3. `Referrer-Policy: strict-origin-when-cross-origin`: Requests တွေနဲ့အတူ referrer information ဘယ်လောက် ပါဝင်မလဲ ထိန်းချုပ်ပြီး — security နဲ့ functionality ကို ဟန်ချက်ညီအောင် ထားပေးပါတယ်။
2. Service Worker အတွက် သီးသန့် Headers:
   1. `Content-Type: application/javascript; charset=utf-8`: Service worker ကို JavaScript အနေနဲ့ မှန်ကန်စွာ interpret လုပ်ကြောင်း သေချာစေပါတယ်။
   2. `Cache-Control: no-cache, no-store, must-revalidate`: Service worker ကို cache မလုပ်အောင် တားဆီးပြီး — user တွေ နောက်ဆုံး ဗားရှင်းကို အမြဲ ရရှိစေပါတယ်။
   3. `Content-Security-Policy: default-src 'self'; script-src 'self'`: Service worker အတွက် တင်းကျပ်တဲ့ Content Security Policy တစ်ခုကို အကောင်အထည်ဖော်ပြီး — same origin က scripts တွေကိုပဲ ခွင့်ပြုပါတယ်။

Next.js နဲ့ [Content Security Policies](/docs/nextjs/content-security-policy) သတ်မှတ်ခြင်းအကြောင်း ပိုပြီး လေ့လာပါ။

## သင့် PWA ကို ချဲ့ထွင်ခြင်း

1. **PWA Capabilities တွေကို စူးစမ်းခြင်း**: PWA တွေက အဆင့်မြင့် လုပ်ဆောင်ချက်တွေ ပေးဖို့ web APIs အမျိုးမျိုးကို သုံးနိုင်ပါတယ်။ Background sync, periodic background sync (သို့) File System Access API လို features တွေကို စူးစမ်းဖို့ စဉ်းစားကြည့်ပါ။ PWA capabilities တွေအကြောင်း inspiration နဲ့ နောက်ဆုံးရ သတင်းအချက်အလက်တွေအတွက် — [What PWA Can Do Today](https://whatpwacando.today/) လို resources တွေကို ကိုးကားနိုင်ပါတယ်။
2. **Static Exports**: သင့် application က server မလိုဘဲ — files တွေရဲ့ static export တစ်ခုကို သုံးချင်တယ်ဆိုရင် — ဒီအပြောင်းအလဲကို ဖွင့်ဖို့ Next.js configuration ကို update လုပ်နိုင်ပါတယ်။ [Next.js Static Export documentation](/docs/nextjs/static-exports) မှာ ပိုပြီး လေ့လာပါ။ ဒါပေမယ့် — Server Actions တွေကနေ external API တစ်ခုကို ခေါ်တာဆီ ပြောင်းရမယ့်အပြင် — သတ်မှတ်ထားတဲ့ headers တွေကိုလည်း သင့် proxy ဆီ ရွှေ့ရပါမယ်။
3. **Offline Support**: Next.js က connectivity-aware UI တွေနဲ့ — မအောင်မြင်ခဲ့တဲ့ navigation နဲ့ Server Action requests တွေကို အလိုအလျောက် ပြန်စမ်းခြင်းတွေအတွက် — experimental [`useOffline`](/docs/nextjs/use-offline) hook နဲ့ ကိုက်ညီတဲ့ [`experimental.useOffline`](https://nextjs.org/docs/app/api-reference/config/next-config-js/useOffline) config ကို ထောက်ပံ့ပေးပါတယ်။ Service worker အခြေခံ offline caching အပြည့်အစုံအတွက် — [Turbopack](https://github.com/serwist/serwist/tree/main/examples/next-turbo-basic) ရော [webpack](https://github.com/serwist/serwist/tree/main/examples/next-basic) အတွက်ပါ Next.js integration ဥပမာတွေ ပေးထားတဲ့ [Serwist](https://github.com/serwist/serwist) ကို ရွေးချယ်နိုင်ပါတယ်။
4. **Security ထည့်သွင်း စဉ်းစားချက်များ**: သင့် service worker ကို စနစ်တကျ လုံခြုံအောင် ထားပါ။ HTTPS သုံးခြင်း၊ push messages တွေရဲ့ source ကို validate လုပ်ခြင်းနဲ့ error handling မှန်ကန်အောင် အကောင်အထည်ဖော်ခြင်းတွေ ပါဝင်ပါတယ်။
5. **User Experience**: User ရဲ့ browser မှာ PWA feature တချို့ support မလုပ်တဲ့အခါမှာတောင် — သင့် app ကောင်းကောင်း အလုပ်လုပ်ဖို့ progressive enhancement techniques တွေကို အကောင်အထည်ဖော်ဖို့ စဉ်းစားပါ။
