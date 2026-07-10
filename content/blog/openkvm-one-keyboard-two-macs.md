---
title: "One keyboard, two Macs: what it actually takes to build a software KVM"
slug: "openkvm-one-keyboard-two-macs"
brief: "Universal Control is supposed to make sharing a keyboard between two Macs effortless. It isn't, for a lot of people. Here's what I learned building OpenKVM to fix it — HID capture, event injection, and the modifier bug that nearly broke everything."
publishedAt: "2026-07-02"
tags: ["macOS", "Swift", "Open Source"]
author: "Mukul Chugh"
---

I have a work Mac and a personal Mac on my desk. Apple ships Universal Control to make exactly this setup pleasant — one keyboard and trackpad gliding between machines. On paper it's magic. In practice it broke for me constantly: different Apple IDs, a flaky network, Handoff quietly toggled off on one machine. So I built [OpenKVM](https://github.com/mukulchugh/OpenKVM), a small macOS menu bar app that forwards one keyboard and mouse to another Mac over the local network.

I'm not the first to want this. [Deskflow](https://github.com/deskflow/deskflow) (the successor to Barrier and Synergy), [Input Leap](https://github.com/input-leap/input-leap), and [lan-mouse](https://github.com/feschber/lan-mouse) all do "software KVM" — a KVM switch without the video. But I wanted something Mac-native, hotkey-driven, and dead simple. Here's what the problem actually involves.

## Capturing input without becoming a keylogger

The first job is reading the physical keyboard and mouse before macOS does anything with them. On macOS that means the IOKit HID Manager. You open the HID Manager, match on the specific external keyboard and mouse (never the built-in trackpad — that way lies madness), and register a callback for input reports.

The trick is being surgical. You do **not** want to grab every HID device on the system; you want one external keyboard and one external mouse, so the machine's own trackpad and keyboard keep working locally. That local escape hatch matters: the toggle hotkey has to work even when everything else is being forwarded, or you can lock yourself out of your own computer.

```swift
let manager = IOHIDManagerCreate(kCFAllocatorDefault, IOOptionBits(kIOHIDOptionsTypeNone))
// Match only the external keyboard + mouse, not the built-in ones.
IOHIDManagerSetDeviceMatchingMultiple(manager, matchingCriteria as CFArray)
IOHIDManagerRegisterInputValueCallback(manager, inputCallback, context)
```

This needs **Input Monitoring** permission, and the receiving side needs **Accessibility** — macOS is (rightly) strict about anything that reads or synthesizes input.

## Sending events: two channels, not one

Once you've captured an event, you serialize it and send it to the other Mac, which replays it with `CGEvent`. The interesting decision is the transport.

Keystrokes and button clicks are **discrete and ordered** — you cannot drop or reorder a keydown, or you'll get stuck modifiers and phantom characters. Mouse movement and scroll are **continuous and disposable** — if you drop one of a hundred move deltas, nobody notices.

So OpenKVM uses two channels:

- **TCP** for keys and button presses — reliable, in-order, `TCP_NODELAY` so there's no Nagle latency.
- **UDP** for mouse move and scroll — fire-and-forget, coalesced into a steady stream so a 1000Hz mouse doesn't flood the link.

Discovery is [Bonjour](https://developer.apple.com/bonjour/) (`_openkvm._tcp`), so the two Macs find each other on the LAN without you typing IP addresses. Everything is length-prefixed JSON with a pairing token, so a random device on your coffee-shop network can't start typing into your laptop.

## The modifier-flags bug that nearly broke it

Here's the part I didn't expect to lose a day to. When you inject a synthetic key event with `CGEvent`, macOS does **not** infer modifier state from the shift/command keys you sent earlier. Each event carries its own `flags` field, and if you don't set it correctly, capital letters come out lowercase, `⌘C` does nothing, and shortcuts silently fail.

The naive approach — track modifier keydowns/keyups yourself and stamp the current flags onto every event — mostly works, but drifts. If a modifier keyup gets lost, or the app loses focus mid-chord, your tracked state and the real state disconnect, and now every keystroke has a stuck ⌘.

Deskflow solved this years ago, and I ended up porting their approach: derive the authoritative modifier state from the event stream itself and reconcile it on every event, rather than trusting a counter. Once mouse events also carried the correct flags, ⌘-click and shift-drag started working. It's the kind of bug that's invisible until you try to actually *use* the thing.

## What Universal Control gets right (and why I still built this)

If Universal Control works for you, use it — it's free and built in. It fails specifically when:

- your two Macs are on **different Apple IDs** (a work Mac and a personal Mac);
- your network is **flaky, on a VLAN, or a guest network**;
- Handoff or iCloud is off; or
- you just want an **explicit hotkey** instead of shoving your cursor off the exact right screen edge.

OpenKVM is more setup than Universal Control when Universal Control works, and more reliable when it doesn't. That's the whole pitch.

## Takeaways

Building it taught me that "share a keyboard" is deceptively deep: it's HID capture, permission models, two different network reliability guarantees, and a modifier-state machine that has to survive lost packets and focus changes. The hard part was never the happy path — it was the fifth edge case.

The code is open source and MIT-licensed. If you've got two Macs and Universal Control has let you down, [give it a try](https://github.com/mukulchugh/OpenKVM) — or come break it.
