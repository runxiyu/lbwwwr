---
title: Home
---

## About this site

The official documentation is at [libreboot.org](https://libreboot.org).

The one you're reading right now is [Runxi Yu](https://runxiyu.org)'s unofficial
attempt to document Libreboot with language that they personally consider to be
more accessible. This version of the documentation is not currently supported
by the upstream project, but we currently do plan to merge in the future when
it's ready.

## Introduction

Libreboot provides [mostly](freedom_status/) [free, libre, and
open source](https://writefreesoftware.org/) boot firmware based on coreboot,
replacing proprietary BIOS/UEFI firmware for supported motherboards. It
initialises the hardware (e.g. memory controller, CPU, peripherals) and starts
a bootloader for your operating system. [Linux](docs/linux/) and
[BSD](docs/bsd/) are well-supported.

You can also buy Libreboot preinstalled from [Minifree
Ltd](https://minifree.org), on select hardware, as well as sending your
compatible hardware for Libreboot installation. The founder and lead developer
of Libreboot, Leah Rowe, also owns and operates Minifree; sales provide funding
for Libreboot.

## Latest release

Libreboot releases are named after the release date, and may come with
amendments called "revisions". You may wish to read [the release
schedule](../release_schedule/).

The latest release is [Libreboot 20241206](releases/20241206/). This release
adds support for the U-boot payload, and the following boards: Lenovo ThinkPad
T480, Lenovo ThinkPad T480S, Dell OptiPlex 780 USFF, Dell OptiPlex 780 MT.

The latest amendment is [Libreboot 20241206 revision 8](releases/20241206rev8/).

## Technical overview

Libreboot provides [coreboot](https://coreboot.org/) for machine
initialisation, which then jumps to a payload in the boot flash; coreboot works
with many payloads, but Libreboot specifically provides SeaBIOS, GNU GRUB and
U-Boot as options, depending on the board. The payload is the program in flash
that provides the early user interface, for booting an operating system. This
*payload* infrastructure means you can run whatever you want from the boot
flash. More payloads (e.g. Linux kexec) are planned for future releases.

## Not a fork of coreboot

Libreboot is a coreboot distribution, in the same way that [Alpine
Linux](https://alpinelinux.org) is a Linux distribution. Libreboot makes
coreboot accessible and easy to use for non-technical users by providing a
fully automated build system and user-friendly installation instructions along
with regular binary releases with pre-compiled ROM images. Building regular
coreboot without Libreboot's automated build system requires significantly more
technical knowledge.

## Why use Libreboot?

* It offers a easy way to configure and install coreboot.
* It gives you freedoms that proprietary boot firmware cannot provide.
* It offers options to improve security such as full disk encryption (including
  the boot partition), GPG-signed kernels and initramfs's, and other options
  via [GRUB hardening](linux/grub_hardening).
* It does not contain backdoors (e.g. the Intel ME and the AMD PSP). <!-- TODO -->
* It is community-oriented.

