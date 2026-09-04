---
title: "Geometric Functions and Operators (ဂျီဩမေတြီ လုပ်ဆောင်ချက်များနှင့် operator များ)"
description: "PostgreSQL ရဲ့ geometric types — point, line, lseg, box, path, polygon, circle — များအတွက် native operators နှင့် functions များအကြောင်း"
order: 78
source: "https://www.postgresql.org/docs/current/functions-geometry.html"
status: translated
updated: 2026-09-04
---

## 9.11. Geometric Functions and Operators (ဂျီဩမေတြီ လုပ်ဆောင်ချက်များနှင့် operator များ)

Geometric types တွေဖြစ်တဲ့ `point`, `box`, `lseg`, `line`, `path`, `polygon` နဲ့ `circle` တွေမှာ — native (ဇာတိ) အနေနဲ့ ထောက်ပံ့ပေးထားတဲ့ function နဲ့ operator အစုအဝေး များစွာ ရှိပြီး — အဲဒါတွေကို ဇယား 9.36, ဇယား 9.37 နဲ့ ဇယား 9.38 တွေမှာ ပြထားပါတယ်။

**ဇယား 9.36. Geometric Operators (ဂျီဩမေတြီ operator များ)**

| Operator | ဖော်ပြချက် | ဥပမာ |
| --- | --- | --- |
| geometric_type + point → geometric_type | ပထမ argument ထဲက point (အမှတ်) တစ်ခုချင်းစီရဲ့ coordinates (ကိုဩဒိနိတ်) တွေကို ဒုတိယ point ရဲ့ coordinates တွေနဲ့ ပေါင်းပေးပါတယ် — ဒါကြောင့် translation (နေရာရွှေ့ခြင်း) ကို လုပ်ဆောင်ပေးပါတယ်။ point, box, path, circle တွေအတွက် ရနိုင်ပါတယ်။ | box '(1,1),(0,0)' + point '(2,0)' → (3,1),(2,0) |
| path + path → path | Open path (ဖွင့်ထားသော path) နှစ်ခုကို ဆက်စပ်ပေးပါတယ် (path တစ်ခုခုက closed (ပိတ်ထားသော) ဖြစ်နေရင် NULL ပြန်ပေးပါတယ်)။ | path '[(0,0),(1,1)]' + path '[(2,2),(3,3),(4,4)]' → [(0,0),(1,1),(2,2),(3,3),(4,4)] |
| geometric_type - point → geometric_type | ပထမ argument ထဲက point (အမှတ်) တစ်ခုချင်းစီရဲ့ coordinates (ကိုဩဒိနိတ်) တွေကနေ ဒုတိယ point ရဲ့ coordinates တွေကို နုတ်ပေးပါတယ် — ဒါကြောင့် translation (နေရာရွှေ့ခြင်း) ကို လုပ်ဆောင်ပေးပါတယ်။ point, box, path, circle တွေအတွက် ရနိုင်ပါတယ်။ | box '(1,1),(0,0)' - point '(2,0)' → (-1,1),(-2,0) |
| geometric_type * point → geometric_type | ပထမ argument ထဲက point (အမှတ်) တစ်ခုချင်းစီကို ဒုတိယ point နဲ့ မြှောက်ပေးပါတယ် (point တစ်ခုကို — real နဲ့ imaginary အပိုင်းတွေ ပါဝင်တဲ့ — complex number တစ်ခုအနေနဲ့ သတ်မှတ်ပြီး — standard complex multiplication (complex မြှောက်ခြင်း) ကို လုပ်ဆောင်ပါတယ်)။ ဒုတိယ point ကို vector တစ်ခုအနေနဲ့ အဓိပ္ပာယ်ဖွင့်မယ်ဆိုရင် — ဒါက object ရဲ့ အရွယ်အစားနဲ့ origin (မူလအမှတ်) ကနေ အကွာအဝေးကို vector ရဲ့ အလျားနဲ့အညီ အချိုးကျ ချဲ့ပေးပြီး — vector က x axis (x ဝင်ရိုး) နဲ့ ပြုလုပ်တဲ့ ထောင့်အတိုင်း origin ကို ဗဟိုပြုပြီး နာရီလက်တံ ပြောင်းပြန် (counterclockwise) လှည့်ပေးတာနဲ့ ညီမျှပါတယ်။ point, box,[a] path, circle တွေအတွက် ရနိုင်ပါတယ်။ | path '((0,0),(1,0),(1,1))' * point '(3.0,0)' → ((0,0),(3,0),(3,3)) path '((0,0),(1,0),(1,1))' * point(cosd(45), sind(45)) → ((0,0),​(0.7071067811865475,0.7071067811865475),​(0,1.414213562373095)) |
| geometric_type / point → geometric_type | ပထမ argument ထဲက point (အမှတ်) တစ်ခုချင်းစီကို ဒုတိယ point နဲ့ စားပေးပါတယ် (point တစ်ခုကို — real နဲ့ imaginary အပိုင်းတွေ ပါဝင်တဲ့ — complex number တစ်ခုအနေနဲ့ သတ်မှတ်ပြီး — standard complex division (complex စားခြင်း) ကို လုပ်ဆောင်ပါတယ်)။ ဒုတိယ point ကို vector တစ်ခုအနေနဲ့ အဓိပ္ပာယ်ဖွင့်မယ်ဆိုရင် — ဒါက object ရဲ့ အရွယ်အစားနဲ့ origin (မူလအမှတ်) ကနေ အကွာအဝေးကို vector ရဲ့ အလျားနဲ့အညီ အချိုးကျ ချုံ့ပေးပြီး — vector က x axis (x ဝင်ရိုး) နဲ့ ပြုလုပ်တဲ့ ထောင့်အတိုင်း origin ကို ဗဟိုပြုပြီး နာရီလက်တံအတိုင်း (clockwise) လှည့်ပေးတာနဲ့ ညီမျှပါတယ်။ point, box,[a] path, circle တွေအတွက် ရနိုင်ပါတယ်။ | path '((0,0),(1,0),(1,1))' / point '(2.0,0)' → ((0,0),(0.5,0),(0.5,0.5)) path '((0,0),(1,0),(1,1))' / point(cosd(45), sind(45)) → ((0,0),​(0.7071067811865476,-0.7071067811865476),​(1.4142135623730951,0)) |
| @-@ geometric_type → double precision | စုစုပေါင်း အလျား (length) ကို တွက်ပေးပါတယ်။ lseg, path တွေအတွက် ရနိုင်ပါတယ်။ | @-@ path '[(0,0),(1,0),(1,1)]' → 2 |
| @@ geometric_type → point | Center point (ဗဟိုအမှတ်) ကို တွက်ပေးပါတယ်။ box, lseg, polygon, circle တွေအတွက် ရနိုင်ပါတယ်။ | @@ box '(2,2),(0,0)' → (1,1) |
| # geometric_type → integer | Point (အမှတ်) အရေအတွက်ကို ပြန်ပေးပါတယ်။ path, polygon တွေအတွက် ရနိုင်ပါတယ်။ | # path '((1,0),(0,1),(-1,0))' → 3 |
| geometric_type # geometric_type → point | ဆုံမှတ် (intersection point) ကို တွက်ပေးပါတယ် — မရှိဘူးဆိုရင် NULL ပြန်ပေးပါတယ်။ lseg, line တွေအတွက် ရနိုင်ပါတယ်။ | lseg '[(0,0),(1,1)]' # lseg '[(1,0),(0,1)]' → (0.5,0.5) |
| box # box → box | Box နှစ်ခု ထပ်ဆင့်နေတဲ့ ဧရိယာ (intersection) ကို တွက်ပေးပါတယ် — မရှိဘူးဆိုရင် NULL ပြန်ပေးပါတယ်။ | box '(2,2),(-1,-1)' # box '(1,1),(-2,-2)' → (1,1),(-1,-1) |
| geometric_type ## geometric_type → point | ဒုတိယ object ပေါ်မှာ ပထမ object နဲ့ အနီးဆုံး point (အမှတ်) ကို တွက်ပေးပါတယ်။ အောက်ပါ type အတွဲတွေအတွက် ရနိုင်ပါတယ်: (point, box), (point, lseg), (point, line), (lseg, box), (lseg, lseg), (line, lseg)။ | point '(0,0)' ## lseg '[(2,0),(0,2)]' → (1,1) |
| geometric_type <-> geometric_type → double precision | Object တွေကြားက အကွာအဝေး (distance) ကို တွက်ပေးပါတယ်။ Geometric type ခုနစ်မျိုးလုံး အတွက်၊ point ကို တခြား geometric type တစ်ခုခုနဲ့ တွဲထားတဲ့ ပေါင်းစပ်မှု အားလုံး အတွက်၊ ပြီးတော့ အောက်ပါ ထပ်ဆောင်း type အတွဲတွေ အတွက်လည်း ရနိုင်ပါတယ်: (box, lseg), (lseg, line), (polygon, circle) (commutator cases — ဘယ်ညာ အနေအထား လှန်ထားတဲ့ အတွဲတွေ — အပါအဝင်)။ | circle '<(0,0),1>' <-> circle '<(5,0),1>' → 3 |
| geometric_type @> geometric_type → boolean | ပထမ object ထဲမှာ ဒုတိယ object ပါဝင်နေသလား? အောက်ပါ type အတွဲတွေအတွက် ရနိုင်ပါတယ်: (box, point), (box, box), (path, point), (polygon, point), (polygon, polygon), (circle, point), (circle, circle)။ | circle '<(0,0),2>' @> point '(1,1)' → t |
| geometric_type <@ geometric_type → boolean | ပထမ object က ဒုတိယ object ထဲမှာ သို့မဟုတ် ၎င်းပေါ်မှာ ပါဝင်နေသလား? အောက်ပါ type အတွဲတွေအတွက် ရနိုင်ပါတယ်: (point, box), (point, lseg), (point, line), (point, path), (point, polygon), (point, circle), (box, box), (lseg, box), (lseg, line), (polygon, polygon), (circle, circle)။ | point '(1,1)' <@ circle '<(0,0),2>' → t |
| geometric_type && geometric_type → boolean | ဒီ objects တွေ တစ်ခုနဲ့တစ်ခု ထပ်နေသလား (overlap)? (Point (အမှတ်) တစ်ခု တူညီနေရင်လည်း true ပါ။) box, polygon, circle တွေအတွက် ရနိုင်ပါတယ်။ | box '(1,1),(0,0)' && box '(2,2),(0,0)' → t |
| geometric_type << geometric_type → boolean | ပထမ object က ဒုတိယ object ရဲ့ ဘယ်ဘက်မှာ လုံးဝ (strictly) ရှိနေသလား? point, box, polygon, circle တွေအတွက် ရနိုင်ပါတယ်။ | circle '<(0,0),1>' << circle '<(5,0),1>' → t |
| geometric_type >> geometric_type → boolean | ပထမ object က ဒုတိယ object ရဲ့ ညာဘက်မှာ လုံးဝ (strictly) ရှိနေသလား? point, box, polygon, circle တွေအတွက် ရနိုင်ပါတယ်။ | circle '<(5,0),1>' >> circle '<(0,0),1>' → t |
| geometric_type &< geometric_type → boolean | ပထမ object က ဒုတိယ object ရဲ့ ညာဘက်ကို ကျော်လွန် မရောက်ဘူးလား? box, polygon, circle တွေအတွက် ရနိုင်ပါတယ်။ | box '(1,1),(0,0)' &< box '(2,2),(0,0)' → t |
| geometric_type &> geometric_type → boolean | ပထမ object က ဒုတိယ object ရဲ့ ဘယ်ဘက်ကို ကျော်လွန် မရောက်ဘူးလား? box, polygon, circle တွေအတွက် ရနိုင်ပါတယ်။ | box '(3,3),(0,0)' &> box '(2,2),(0,0)' → t |
| geometric_type <<\| geometric_type → boolean | ပထမ object က ဒုတိယ object ရဲ့ အောက်ဘက်မှာ လုံးဝ (strictly) ရှိနေသလား? point, box, polygon, circle တွေအတွက် ရနိုင်ပါတယ်။ | box '(3,3),(0,0)' <<\| box '(5,5),(3,4)' → t |
| geometric_type \|>> geometric_type → boolean | ပထမ object က ဒုတိယ object ရဲ့ အပေါ်ဘက်မှာ လုံးဝ (strictly) ရှိနေသလား? point, box, polygon, circle တွေအတွက် ရနိုင်ပါတယ်။ | box '(5,5),(3,4)' \|>> box '(3,3),(0,0)' → t |
| geometric_type &<\| geometric_type → boolean | ပထမ object က ဒုတိယ object ရဲ့ အပေါ်ဘက်ကို ကျော်လွန် မရောက်ဘူးလား? box, polygon, circle တွေအတွက် ရနိုင်ပါတယ်။ | box '(1,1),(0,0)' &<\| box '(2,2),(0,0)' → t |
| geometric_type \|&> geometric_type → boolean | ပထမ object က ဒုတိယ object ရဲ့ အောက်ဘက်ကို ကျော်လွန် မရောက်ဘူးလား? box, polygon, circle တွေအတွက် ရနိုင်ပါတယ်။ | box '(3,3),(0,0)' \|&> box '(2,2),(0,0)' → t |
| box <^ box → boolean | ပထမ object က ဒုတိယ object ရဲ့ အောက်မှာ ရှိသလား (အနားတွေ ထိလည်း ရပါတယ်)? | box '((1,1),(0,0))' <^ box '((2,2),(1,1))' → t |
| box >^ box → boolean | ပထမ object က ဒုတိယ object ရဲ့ အပေါ်မှာ ရှိသလား (အနားတွေ ထိလည်း ရပါတယ်)? | box '((2,2),(1,1))' >^ box '((1,1),(0,0))' → t |
| geometric_type ?# geometric_type → boolean | ဒီ objects တွေ တစ်ခုနဲ့တစ်ခု ဖြတ်ကျော်ဆုံနေသလား (intersect)? အောက်ပါ type အတွဲတွေအတွက် ရနိုင်ပါတယ်: (box, box), (lseg, box), (lseg, lseg), (lseg, line), (line, box), (line, line), (path, path)။ | lseg '[(-1,0),(1,0)]' ?# box '(2,2),(-2,-2)' → t |
| ?- line → boolean ?- lseg → boolean | Line (မျဉ်း) က အလျားလိုက် (horizontal) ဖြစ်နေသလား? | ?- lseg '[(-1,0),(1,0)]' → t |
| point ?- point → boolean | Points တွေ အလျားလိုက် ညီနေသလား (ဆိုလိုတာက y coordinate တူညီနေသလား)? | point '(1,0)' ?- point '(0,0)' → t |
| ?\| line → boolean ?\| lseg → boolean | Line (မျဉ်း) က ဒေါင်လိုက် (vertical) ဖြစ်နေသလား? | ?\| lseg '[(-1,0),(1,0)]' → f |
| point ?\| point → boolean | Points တွေ ဒေါင်လိုက် ညီနေသလား (ဆိုလိုတာက x coordinate တူညီနေသလား)? | point '(0,1)' ?\| point '(0,0)' → t |
| line ?-\| line → boolean lseg ?-\| lseg → boolean | Lines တွေ တစ်ခုနဲ့တစ်ခု ထောင့်မှန် ဖြတ်နေသလား (perpendicular)? | lseg '[(0,0),(0,1)]' ?-\| lseg '[(0,0),(1,0)]' → t |
| line ?\|\| line → boolean lseg ?\|\| lseg → boolean | Lines တွေ တစ်ခုနဲ့တစ်ခု အပြိုင် (parallel) ဖြစ်နေသလား? | lseg '[(-1,0),(1,0)]' ?\|\| lseg '[(-1,2),(1,2)]' → t |
| geometric_type ~= geometric_type → boolean | ဒီ objects တွေ တစ်ခုနဲ့တစ်ခု တူညီနေသလား? point, box, polygon, circle တွေအတွက် ရနိုင်ပါတယ်။ | polygon '((0,0),(1,1))' ~= polygon '((1,1),(0,0))' → t |

---

[a] ဒီ operators တွေနဲ့ box တစ်ခုကို “လှည့်” တာက ၎င်းရဲ့ ထောင့်စွန်း point တွေကိုပဲ ရွှေ့ပေးတာပါ: box ရဲ့ အနားတွေက axes (ဝင်ရိုးများ) တွေနဲ့ အပြိုင် ရှိနေဆဲပဲ လို့ သတ်မှတ်ပါတယ်။ ဒါကြောင့် — အစစ်အမှန် rotation (လှည့်ခြင်း) လုပ်သလိုမျိုး — box ရဲ့ အရွယ်အစားကို ထိန်းသိမ်း မပေးပါဘူး။

> **သတိပြုရန်:** “same as” operator ဖြစ်တဲ့ `~=` က `point`, `box`, `polygon` နဲ့ `circle` types တွေအတွက် သာမန် equality (တူညီမှု) အဓိပ္ပာယ်ကို ကိုယ်စားပြုတယ်ဆိုတာ သတိပြုပါ။ Geometric types တချို့မှာ `=` operator လည်း ရှိပေမယ့် — `=` က ဧရိယာ (area) တူညီမှုကိုပဲ နှိုင်းယှဉ်ပါတယ်။ ဒီ types တွေအတွက် ရနိုင်တဲ့ တခြား scalar comparison operators တွေ (`<=` စသည်) ကလည်း — အလားတူပဲ — ဧရိယာတွေကို နှိုင်းယှဉ်ပါတယ်။

> **မှတ်ချက်:** PostgreSQL 14 မတိုင်ခင် က — point အတွက် strictly below/above (အောက်/အပေါ်မှာ လုံးဝ ရှိခြင်း) comparison operators တွေဖြစ်တဲ့ `point` `<<|` `point` နဲ့ `point` `|>>` `point` တွေကို `<^` နဲ့ `>^` လို့ အသီးသီး ခေါ်ခဲ့ပါတယ်။ ဒီ နာမည်တွေက အခုထိ သုံးလို့ ရသေးပေမယ့် — deprecated (အသုံးပြုမှု ရပ်ဆိုင်းရန် သတ်မှတ်ထားသော) ဖြစ်ပြီး — နောက်ဆုံးမှာ ဖယ်ရှားခံရမှာ ဖြစ်ပါတယ်။

**ဇယား 9.37. Geometric Functions (ဂျီဩမေတြီ function များ)**

| Function | ဖော်ပြချက် | ဥပမာ |
| --- | --- | --- |
| area ( geometric_type ) → double precision | ဧရိယာ (area) ကို တွက်ပေးပါတယ်။ box, path, circle တွေအတွက် ရနိုင်ပါတယ်။ Path input က closed (ပိတ်ထားသော) ဖြစ်ရပါမယ် — မဟုတ်ရင် NULL ပြန်ပေးပါတယ်။ ဒါ့အပြင် — path က ကိုယ့်ကိုယ်ကို ဖြတ်ကျော်နေတယ်ဆိုရင် (self-intersecting) — ရလဒ်က အဓိပ္ပာယ် မရှိနိုင်ပါဘူး။ | area(box '(2,2),(0,0)') → 4 |
| center ( geometric_type ) → point | Center point (ဗဟိုအမှတ်) ကို တွက်ပေးပါတယ်။ box, circle တွေအတွက် ရနိုင်ပါတယ်။ | center(box '(1,2),(0,0)') → (0.5,1) |
| diagonal ( box ) → lseg | Box ရဲ့ ထောင့်ဖြတ်မျဉ်း (diagonal) ကို line segment (မျဉ်း အပိုင်းအစ) အနေနဲ့ ထုတ်ယူပါတယ် (lseg(box) နဲ့ အတူတူပါ)။ | diagonal(box '(1,2),(0,0)') → [(1,2),(0,0)] |
| diameter ( circle ) → double precision | Circle (စက်ဝိုင်း) ရဲ့ အချင်း (diameter) ကို တွက်ပေးပါတယ်။ | diameter(circle '<(0,0),2>') → 4 |
| height ( box ) → double precision | Box ရဲ့ ဒေါင်လိုက် (vertical) အရွယ်အစားကို တွက်ပေးပါတယ်။ | height(box '(1,2),(0,0)') → 2 |
| isclosed ( path ) → boolean | Path က closed (ပိတ်ထားသော) ဖြစ်နေသလား? | isclosed(path '((0,0),(1,1),(2,0))') → t |
| isopen ( path ) → boolean | Path က open (ဖွင့်ထားသော) ဖြစ်နေသလား? | isopen(path '[(0,0),(1,1),(2,0)]') → t |
| length ( geometric_type ) → double precision | စုစုပေါင်း အလျား (length) ကို တွက်ပေးပါတယ်။ lseg, path တွေအတွက် ရနိုင်ပါတယ်။ | length(path '((-1,0),(1,0))') → 4 |
| npoints ( geometric_type ) → integer | Point (အမှတ်) အရေအတွက်ကို ပြန်ပေးပါတယ်။ path, polygon တွေအတွက် ရနိုင်ပါတယ်။ | npoints(path '[(0,0),(1,1),(2,0)]') → 3 |
| pclose ( path ) → path | Path ကို closed (ပိတ်ထားသော) ပုံစံအဖြစ် ပြောင်းပေးပါတယ်။ | pclose(path '[(0,0),(1,1),(2,0)]') → ((0,0),(1,1),(2,0)) |
| popen ( path ) → path | Path ကို open (ဖွင့်ထားသော) ပုံစံအဖြစ် ပြောင်းပေးပါတယ်။ | popen(path '((0,0),(1,1),(2,0))') → [(0,0),(1,1),(2,0)] |
| radius ( circle ) → double precision | Circle (စက်ဝိုင်း) ရဲ့ radius (အချင်းဝက်) ကို တွက်ပေးပါတယ်။ | radius(circle '<(0,0),2>') → 2 |
| slope ( point, point ) → double precision | Point (အမှတ်) နှစ်ခုကို ဖြတ်ပြီး ဆွဲထားတဲ့ line (မျဉ်း) ရဲ့ slope (စောင်းမှု) ကို တွက်ပေးပါတယ်။ | slope(point '(0,0)', point '(2,1)') → 0.5 |
| width ( box ) → double precision | Box ရဲ့ အလျားလိုက် (horizontal) အရွယ်အစားကို တွက်ပေးပါတယ်။ | width(box '(1,2),(0,0)') → 1 |

**ဇယား 9.38. Geometric Type Conversion Functions (ဂျီဩမေတြီ type ပြောင်းလဲရေး function များ)**

| Function | ဖော်ပြချက် | ဥပမာ |
| --- | --- | --- |
| box ( circle ) → box | Circle (စက်ဝိုင်း) အတွင်းမှာ အံကိုက်ဖြစ်တဲ့ (inscribed) box ကို တွက်ပေးပါတယ်။ | box(circle '<(0,0),2>') → (1.414213562373095,1.414213562373095),​(-1.414213562373095,-1.414213562373095) |
| box ( point ) → box | Point ကို empty box (အလွတ် box) အဖြစ် ပြောင်းပေးပါတယ်။ | box(point '(1,0)') → (1,0),(1,0) |
| box ( point, point ) → box | ထောင့်စွန်း (corner) point နှစ်ခုကို box အဖြစ် ပြောင်းပေးပါတယ်။ | box(point '(0,1)', point '(1,0)') → (1,1),(0,0) |
| box ( polygon ) → box | Polygon ရဲ့ bounding box (ဝန်းရံအကွက်) ကို တွက်ပေးပါတယ်။ | box(polygon '((0,0),(1,1),(2,0))') → (2,1),(0,0) |
| bound_box ( box, box ) → box | Box နှစ်ခုလုံးကို ဝန်းရံထားတဲ့ bounding box (ဝန်းရံအကွက်) ကို တွက်ပေးပါတယ်။ | bound_box(box '(1,1),(0,0)', box '(4,4),(3,3)') → (4,4),(0,0) |
| circle ( box ) → circle | Box ကို ဝန်းရံထားတဲ့ အသေးဆုံး circle (စက်ဝိုင်း) ကို တွက်ပေးပါတယ်။ | circle(box '(1,1),(0,0)') → <(0.5,0.5),0.7071067811865476> |
| circle ( point, double precision ) → circle | Center (ဗဟို) နဲ့ radius (အချင်းဝက်) ကနေ circle (စက်ဝိုင်း) ကို တည်ဆောက်ပါတယ်။ | circle(point '(0,0)', 2.0) → <(0,0),2> |
| circle ( polygon ) → circle | Polygon ကို circle (စက်ဝိုင်း) အဖြစ် ပြောင်းပေးပါတယ်။ Circle ရဲ့ center က polygon ရဲ့ points တွေ တည်ရှိရာ နေရာတွေရဲ့ ပျမ်းမျှ (mean) ဖြစ်ပြီး — radius ကတော့ polygon ရဲ့ points တွေရဲ့ အဲဒီ center ကနေ ပျမ်းမျှ အကွာအဝေး ဖြစ်ပါတယ်။ | circle(polygon '((0,0),(1,3),(2,0))') → <(1,1),1.6094757082487299> |
| line ( point, point ) → line | Point (အမှတ်) နှစ်ခုကို သူတို့ကို ဖြတ်သွားတဲ့ line (မျဉ်း) အဖြစ် ပြောင်းပေးပါတယ်။ | line(point '(-1,0)', point '(1,0)') → {0,-1,0} |
| lseg ( box ) → lseg | Box ရဲ့ ထောင့်ဖြတ်မျဉ်း (diagonal) ကို line segment (မျဉ်း အပိုင်းအစ) အနေနဲ့ ထုတ်ယူပါတယ်။ | lseg(box '(1,0),(-1,0)') → [(1,0),(-1,0)] |
| lseg ( point, point ) → lseg | Endpoint (အစွန်းအမှတ်) နှစ်ခုကနေ line segment (မျဉ်း အပိုင်းအစ) ကို တည်ဆောက်ပါတယ်။ | lseg(point '(-1,0)', point '(1,0)') → [(-1,0),(1,0)] |
| path ( polygon ) → path | Polygon ကို — point (အမှတ်) စာရင်း အတူတူ ပါဝင်တဲ့ — closed path (ပိတ်ထားသော path) အဖြစ် ပြောင်းပေးပါတယ်။ | path(polygon '((0,0),(1,1),(2,0))') → ((0,0),(1,1),(2,0)) |
| point ( double precision, double precision ) → point | Point (အမှတ်) ကို ၎င်းရဲ့ coordinates (ကိုဩဒိနိတ်) တွေကနေ တည်ဆောက်ပါတယ်။ | point(23.4, -44.5) → (23.4,-44.5) |
| point ( box ) → point | Box ရဲ့ center (ဗဟို) ကို တွက်ပေးပါတယ်။ | point(box '(1,0),(-1,0)') → (0,0) |
| point ( circle ) → point | Circle (စက်ဝိုင်း) ရဲ့ center (ဗဟို) ကို တွက်ပေးပါတယ်။ | point(circle '<(0,0),2>') → (0,0) |
| point ( lseg ) → point | Line segment (မျဉ်း အပိုင်းအစ) ရဲ့ center (ဗဟို) ကို တွက်ပေးပါတယ်။ | point(lseg '[(-1,0),(1,0)]') → (0,0) |
| point ( polygon ) → point | Polygon ရဲ့ center (ဗဟို) ကို တွက်ပေးပါတယ် (polygon ရဲ့ points တွေ တည်ရှိရာ နေရာတွေရဲ့ ပျမ်းမျှ)။ | point(polygon '((0,0),(1,1),(2,0))') → (1,0.3333333333333333) |
| polygon ( box ) → polygon | Box ကို point ၄ ခု ပါဝင်တဲ့ polygon အဖြစ် ပြောင်းပေးပါတယ်။ | polygon(box '(1,1),(0,0)') → ((0,0),(0,1),(1,1),(1,0)) |
| polygon ( circle ) → polygon | Circle (စက်ဝိုင်း) ကို point ၁၂ ခု ပါဝင်တဲ့ polygon အဖြစ် ပြောင်းပေးပါတယ်။ | polygon(circle '<(0,0),2>') → ((-2,0),​(-1.7320508075688774,0.9999999999999999),​(-1.0000000000000002,1.7320508075688772),​(-1.2246063538223773e-16,2),​(0.9999999999999996,1.7320508075688774),​(1.732050807568877,1.0000000000000007),​(2,2.4492127076447545e-16),​(1.7320508075688776,-0.9999999999999994),​(1.0000000000000009,-1.7320508075688767),​(3.673819061467132e-16,-2),​(-0.9999999999999987,-1.732050807568878),​(-1.7320508075688767,-1.0000000000000009)) |
| polygon ( integer, circle ) → polygon | Circle (စက်ဝိုင်း) ကို point n ခု ပါဝင်တဲ့ polygon အဖြစ် ပြောင်းပေးပါတယ်။ | polygon(4, circle '<(3,0),1>') → ((2,0),​(3,1),​(4,1.2246063538223773e-16),​(3,-1)) |
| polygon ( path ) → polygon | Closed path (ပိတ်ထားသော path) ကို — point (အမှတ်) စာရင်း အတူတူ ပါဝင်တဲ့ — polygon အဖြစ် ပြောင်းပေးပါတယ်။ | polygon(path '((0,0),(1,1),(2,0))') → ((0,0),(1,1),(2,0)) |

`point` တစ်ခုရဲ့ component ဂဏန်း နှစ်ခုကို — point က index 0 နဲ့ 1 ရှိတဲ့ array တစ်ခုလိုမျိုး — ဝင်ရောက် ကြည့်ရှုလို့ ရပါတယ်။ ဥပမာ — `t.p` က `point` column တစ်ခုဆိုရင် — `SELECT p[0] FROM t` က X coordinate ကို ထုတ်ယူပေးပြီး — `UPDATE t SET p[1] = ...` က Y coordinate ကို ပြောင်းလဲပေးပါတယ်။ အလားတူပဲ — `box` သို့မဟုတ် `lseg` type တန်ဖိုး တစ်ခုကို `point` values နှစ်ခု ပါတဲ့ array တစ်ခုအနေနဲ့လည်း သတ်မှတ် ကိုင်တွယ်လို့ ရပါတယ်။
