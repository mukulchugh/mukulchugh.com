---
title: "What Swiggy-scale mobile actually taught me"
slug: "mobile-lessons-from-swiggy-scale"
brief: "Before startup life, I shipped mobile at Swiggy. Scale changes which bugs matter, and how little your happy path predicts production."
publishedAt: "2025-06-02"
tags: ["Mobile", "React Native", "Engineering"]
author: "Mukul Chugh"
---

Before founding-engineer life, I built mobile products at Swiggy. Different pressure: messy networks, old devices, release trains that don't pause for elegant abstractions.

Three things stuck.

Your happy path is a rounding error. Empty states, double-taps, and degraded modes are the feature.

Abstractions layers earn rent or they die. At scale, every unnecessary layer becomes divergent iOS/Android behavior.

A mobile release isn't a deploy: it lives on people's phones. Flags, staged rollouts, and crash analytics aren't "platform work." They're part of shipping.

Startups don't have that traffic. They still have production. Treat the last 5% as the product, not cleanup after the demo.
