---
title: "Native widgets from React, without leaving JSX"
slug: "brik-react-to-native-widgets"
brief: "Home-screen widgets and Live Activities usually mean writing Swift by hand. Brik keeps that surface in React and compiles down to native."
publishedAt: "2025-12-20"
tags: ["React Native", "iOS", "Open Source"]
author: "Mukul Chugh"
---

Every React Native team hits the same wall: you want a widget, a Live Activity, or something in the Dynamic Island — and suddenly you're maintaining SwiftUI in a separate extension target.

[Brik](https://github.com/mukulchugh/brik) is my attempt to keep that work in JSX. You describe the widget once; it compiles to SwiftUI on iOS and Jetpack Compose on Android.

Widgets aren't normal RN views. They run in a tight process on the OS's schedule, often when your app isn't even open. There's no JS runtime in there. So Brik doesn't "render" at runtime — it produces native view code ahead of time.

That tradeoff is the whole product: stay in one language for the common cases, drop to native only when you must.
