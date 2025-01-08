---
title: AMD Pitfalls
---

<!-- TODO -->
Many of these are a few years out of date.


Nowadays there's openSIL <https://github.com/openSIL/openSIL> - it's AMD's
attempt to provide some source code again, that projects like coreboot can use,
but AMD is still problematic; the PSP for example (see below) cannot be
"neutered" (nothing like `me_cleaner`, or `psp_cleaner`) exists yet.


## AMD Platform Security Processor

This is basically AMD's own version of the [Intel Management
Engine](../intel_pitfalls). It has all of the same basic security and freedom
issues, although the implementation is wildly different.

The Platform Security Processor (PSP) is built in on the AMD CPUs whose
[architecture](https://en.wikipedia.org/wiki/List_of_AMD_CPU_microarchitectures) is Late Family 16h (Puma), Zen 17h or later (and also on
the AMD GPUs which are GCN 5th gen (Vega) or later). On the CPUs, a PSP
controls the main x86 core startup. PSP firmware is cryptographically
signed with a strong key similar to the Intel ME. If the PSP firmware
is not present, or if the AMD signing key is not present, the x86 cores
will not be released from reset, rendering the system inoperable.

The PSP is an ARM core with TrustZone technology, built onto the main
CPU die. As such, it has the ability to hide its own program code,
scratch RAM, and any data it may have taken and stored from the
lesser-privileged x86 system RAM (kernel encryption keys, login data,
browsing history, keystrokes, who knows!). To make matters worse, the
PSP theoretically has access to the entire system memory space (AMD
either will not or cannot deny this, and it would seem to be required to
allow the DRM "features" to work as intended), which means that it has
at minimum MMIO-based access to the network controllers and any other
PCI/PCIe peripherals installed on the system.

In theory any malicious entity with access to the AMD signing key would
be able to install persistent malware that could not be eradicated
without an external flasher and a known good PSP image. Furthermore,
multiple security vulnerabilities have been demonstrated in AMD firmware
in the past, and there is every reason to assume one or more zero day
vulnerabilities are lurking in the PSP firmware. Given the extreme
privilege level (ring -2 or ring -3) of the PSP, said vulnerabilities
would have the ability to remotely monitor and control any PSP enabled
machine completely outside of the user's knowledge.

Much like with the Intel Boot Guard (an application of the Intel
Management Engine), AMD's PSP can also act as a tyrant by checking
signatures on any boot firmware that you flash, making replacement boot
firmware (e.g. libreboot, coreboot) impossible on some boards. Early
anecdotal reports indicate that AMD's boot guard counterpart will be
used on most OEM hardware, disabled only on so-called "enthusiast"
CPUs.

## AMD IMC firmware

Read <https://www.coreboot.org/AMD_IMC>.

## AMD SMU firmware

Handles some power management for PCIe devices (without this, your
laptop will not work properly) and several other power management
related features.

The firmware is signed, although on older AMD hardware it is a symmetric
key, which means that with access to the key (if leaked) you could sign
your own modified version and run it. Rudolf Marek (coreboot hacker)
found out how to extract this key [in this video
demonstration](https://media.ccc.de/v/31c3_-_6103_-_en_-_saal_2_-_201412272145_-_amd_x86_smu_firmware_analysis_-_rudolf_marek),
and based on this work, Damien Zammit (another coreboot hacker)
[partially replaced it](https://github.com/zamaudio/smutool/) with free
firmware, but on the relevant system (ASUS F2A85-M) there were still
other such files present (Video BIOS, and others).

## AMD AGESA firmware

This is responsible for virtually all core hardware initialization on
modern AMD systems. In 2011, AMD started cooperating with the coreboot
project, releasing this as source code under a free license. In 2014,
they stopped releasing source code and started releasing AGESA as vendor
blobs instead. This makes AGESA now equivalent to [Intel FSP](#fsp).
