---
title: "Shipping OpenKVM: sharing one keyboard across two Macs"
slug: "shipping-openkvm"
brief: "How I built OpenKVM — a menubar app that forwards HID events from one Mac to another over TCP — and what I learned about macOS input capture along the way."
publishedAt: "2026-05-15"
tags: ["Engineering", "macOS", "OpenSource"]
author: "Mukul Chugh"
---

> **Starter post** — this is placeholder content. Replace it with your real write-up whenever you're ready.

I run two Macs side by side. For a while I used Universal Control, Apple's built-in solution for sharing a keyboard and mouse across devices. It works well — until it doesn't. The reconnection flow is unpredictable, it requires iCloud sign-in on both machines, and it occasionally just stops working after a sleep cycle.

So I built OpenKVM.

## What OpenKVM does

OpenKVM is a small macOS menubar app. One machine runs as the "server" and captures all keyboard and mouse input at the HID (Human Interface Device) level. The other machine runs as the "client" and receives those events over a local TCP connection, replaying them as if you typed them locally.

Switch between machines by moving your cursor to the screen edge — the same mental model as Universal Control, without the iCloud dependency.

### The pieces involved

- **HID event capture**: `CGEventTap` to intercept keyboard and mouse events before they reach the active app
- **Network transport**: A simple TCP socket with a length-prefixed binary protocol
- **Event replay**: `CGEventPost` on the receiving end to inject events into the local input stream
- **Modifier flag synchronization**: A known edge case — modifier keys (Shift, Command, Option) have to be sent as separate state updates, not just as flags on other events

## The hard part: HID capture on the main thread

The first version captured HID events on the main thread. This worked, but introduced noticeable latency during heavy UI work — the event tap was competing with AppKit for main-thread time.

The fix was moving the event tap to a dedicated `CFRunLoop` on a background thread:

```swift
let tapThread = Thread {
    let runLoop = CFRunLoopGetCurrent()
    CFRunLoopAddSource(runLoop, tapSource, .commonModes)
    CFRunLoopRun()
}
tapThread.start()
```

Latency dropped from ~20ms spikes to consistently under 5ms.

## Modifier flags: the subtle bug

macOS sends modifier key changes as `flagsChanged` events, not as flags on `keyDown` events. If you only forward `keyDown` and `keyUp`, the receiving machine never learns that Command is held. This produces the classic symptom: keyboard shortcuts stop working across the connection.

The fix is straightforward once you know the cause:

```swift
// In the event tap callback, handle both event types
if type == .flagsChanged {
    forwardEvent(event) // send modifier state separately
    return nil          // don't consume — let local apps see it too
}
```

### Things that still don't work

- **Audio routing** — completely out of scope for HID-only forwarding
- **Drag and drop** — the protocol handles coordinates and button events, but OS-level drag state doesn't transfer
- **Non-USB peripherals** — Bluetooth devices occasionally miss reconnection events

## What I'd do differently

The TCP transport is fine for a local network, but a Unix domain socket would be faster for machines on the same desk sharing a Thunderbolt hub. Worth exploring for v2.

The binary protocol is also hand-rolled and brittle. If I were starting today, I'd use a small protobuf schema — the serialization overhead is negligible and the schema serves as documentation.

## Get it

OpenKVM is open source. The repo is at [github.com/mukulchugh/OpenKVM](https://github.com/mukulchugh/OpenKVM). Build it yourself or grab a release from the releases page.

```bash
git clone https://github.com/mukulchugh/OpenKVM
open OpenKVM.xcodeproj
```

Grant Accessibility and Input Monitoring permissions in System Settings, and you're running.
