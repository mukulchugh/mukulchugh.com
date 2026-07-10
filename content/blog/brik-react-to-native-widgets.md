---
title: "Widgets, Live Activities, and Dynamic Island — from a single React codebase"
slug: "brik-react-to-native-widgets"
brief: "Widgets and Live Activities are where React Native traditionally gives up and hands you a Swift file. Brik is my attempt to keep you in JSX — compiling components down to SwiftUI and Jetpack Compose. Here's why that's hard and why it's worth it."
publishedAt: "2026-06-18"
tags: ["React Native", "iOS", "Open Source"]
author: "Mukul Chugh"
---

Every React Native app hits the same wall eventually: you want a home-screen widget, a Lock Screen Live Activity, or something living in the Dynamic Island — and suddenly you're writing SwiftUI in an Xcode extension target, by hand, in a language half your team doesn't use. The JS ecosystem has patched around this with bridges and community modules, but the widget itself is still native code you maintain twice.

[Brik](https://github.com/mukulchugh/brik) is my take on closing that gap: write the widget once in JSX/TSX, and compile it down to **SwiftUI (WidgetKit)** on iOS and **Jetpack Compose (Glance)** on Android. No hand-written Swift or Kotlin for the common cases.

## Why widgets resist the usual RN tricks

Normal React Native renders into a view hierarchy your JS controls at runtime. Widgets don't work that way. A [Live Activity](https://developer.apple.com/documentation/activitykit) or home-screen widget runs in a **separate process** with a tight memory budget, rendered by the OS on its own schedule — not by your app, and often when your app isn't even running. There's no JS runtime in there. WidgetKit expects a static-ish SwiftUI view it can render whenever it wants.

So you can't just ship your React tree into the widget. You have to produce **actual native view code** ahead of time. That reframes the problem from "render at runtime" to "compile at build time."

## The pipeline: JSX → IR → platform code

Brik treats your widget components as a description, not a live tree:

```
JSX/TSX  →  typed IR (validated with Zod)  →  SwiftUI  +  Jetpack Compose
```

1. Parse the component into an intermediate representation — a typed tree of layout, text, images, and bindings.
2. Validate that IR (Zod catches unsupported props before they become a cryptic Swift compiler error).
3. Emit SwiftUI for iOS and Glance/Compose for Android from the same IR.

The IR is the whole game. Get it right and the surface API can stay small and React-shaped while the backends do the platform-specific work. It also makes the system **agent-friendly**: deterministic codegen from a typed schema is exactly the kind of thing an LLM can target reliably.

```tsx
<LiveActivity>
  <HStack>
    <Image system="cup.and.saucer.fill" />
    <Text>{order.status}</Text>
    <ProgressBar value={order.progress} />
  </HStack>
</LiveActivity>
```

That compiles to a real WidgetKit view on iOS and a Glance composable on Android.

## What 2026 makes easier — and what it doesn't

The timing helps. React Native's new architecture — Fabric, Turbo Modules, Codegen — has normalized the idea that RN generates native code from typed definitions, and [Nitro modules and codegen](https://www.callstack.com/events/react-and-react-native-the-year-kick-off) push that further. There are now solid libraries for Live Activities specifically, like [software-mansion-labs/expo-live-activity](https://github.com/software-mansion-labs/expo-live-activity). The ecosystem agrees this should be possible.

What's still hard is **coverage**. SwiftUI and Compose are large, and the moment you support one more layout primitive you owe it on both platforms plus the IR plus the validation. The honest scope is: nail the surfaces that actually matter — Home Screen widgets, Lock Screen, Live Activities, Dynamic Island — and be explicit about what isn't supported yet, rather than pretending to be all of SwiftUI.

## The principle underneath

The reason this is worth building isn't "avoid learning Swift." It's **single source of truth**. A widget that drifts from your app's design system because it lives in a separate language, maintained by a different person, is a real, recurring cost. Compile it from the same components and it stays honest.

Brik is beta and open source (MIT). If you build React Native apps and you've ever maintained a widget in two languages, [take a look](https://github.com/mukulchugh/brik) — feedback and breakage reports welcome.
