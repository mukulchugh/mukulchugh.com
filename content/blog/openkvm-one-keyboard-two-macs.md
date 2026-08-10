---
title: "One keyboard, two Macs"
slug: "openkvm-one-keyboard-two-macs"
brief: "Universal Control kept breaking on my desk. So I built OpenKVM: a small macOS app that shares one keyboard and mouse between two Macs."
publishedAt: "2026-01-18"
tags: ["macOS", "Swift", "Open Source"]
author: "Mukul Chugh"
---

I keep a work Mac and a personal Mac on the same desk. Apple's Universal Control is supposed to make that setup feel like one machine. For me it didn't: different Apple IDs, flaky Handoff, days where the cursor just refused to cross.

So I built [OpenKVM](https://github.com/mukulchugh/OpenKVM): a menu bar app that grabs the keyboard and mouse on one Mac and replays them on the other over the local network.

The interesting bits were boring in a good way. Keystrokes need a reliable channel (TCP). Mouse movement can drop frames (UDP). Discovery should be Bonjour, not typing IP addresses. And the hotkey that turns forwarding off has to work even when everything else is being sent elsewhere. Otherwise you lock yourself out.

It's not trying to replace a hardware KVM. It's trying to make two Macs feel like one desk again.
