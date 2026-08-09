---
title: "Ferry: Apple Watch as a Mac mic"
slug: "ferry-apple-watch-mac-mic"
brief: "I already wear a Watch. Ferry turns it into a system-wide microphone for the Mac on my desk."
publishedAt: "2025-11-15"
tags: ["macOS", "watchOS", "Swift"]
author: "Mukul Chugh"
---

AirPods are great when they're on. Continuity Microphone helps some setups. My day looks different: Watch already on, Mac already open, no appetite for another Bluetooth device mid-call.

[Ferry](https://github.com/mukulchugh/ferry) is a small experiment that treats the Watch as a **system-wide Mac microphone**. Capture on watchOS, stream to the Mac, present as a real input so Zoom and Voice Memos just work.

The hard parts aren't the demo path — they're battery, latency, and sample-rate mismatches after an OS update. If the Watch dies by lunch because you used it as a mic, the idea failed.

I'm not replacing a studio mic. I'm using the mic that's already on my wrist.
