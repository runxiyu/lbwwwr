---
title: BSD Operating Systems
---

This guide pertains to x86 hosts with the GRUB or SeaBIOS payload , and does
not cover supported CrOS/ARM Chromebooks. For ARM targets, you should refer to
U-Boot documentation.

Libreboot is capable of booting many BSD systems. This section mostly documents
the peculiarities of libreboot as it pertains to BSD; you can otherwise refer
to the official documentation for whatever BSD system you would like to use.

## Use SeaBIOS

GRUB can technically boot BSD kernels but it's unreliable and poorly
maintained. Although GRUB-on-BIOS can chainload BSD bootloaders, it cannot do
so on bare metal (i.e., as a coreboot payload).

Therefore you should boot in text mode with SeaBIOS (as opposed to corebootfb),
and follow the official installation guide for your BSD system. SeaBIOS
chainloaded from GRUB should work too.

## OpenBSD and corebootfb

It's still recommended to use SeaBIOS in text mode, but OpenBSD can work with
SeaBIOS booting in a coreboot framebuffer with SeaVGABIOS when on a MBR
partitioning table. In Libreboot ROM images, this would be SeaBIOS images with
`corebootfb` in the file name.

## Graphical usage

One important peculiarity of most Libreboot systems is that VGA mode support
exists if booting with corebootfb (coreboot's own framebuffer &mdash; direct
memory framebuffer with many quirks, not technically a VGA mode) and the
SeaVGABIOS option ROM is used in the SeaBIOS payload; however, the ability to
switch modes is absent, which means that coreboot will stay in framebuffer or
INT10H text mode (whichever is set), unless KMS is used to change the mode.

The BSD bootloaders on x86 BIOS systems, typically expect text mode startup. It
is not possible to set the console to higher VGA modes on most coreboot systems
with native video initialisation used. If you see any BSD documentation
pertaining to VESA modes, ignore it entirely unless you're using the
proprietary VGA ROM for your device.

This would otherwise mean no X11/Wayland: If you start in corebootfb mode with
SeaVGABIOS, you won't get a display in BSD bootloaders, and if you boot in text
mode, you can't set VESA modes from BSD. However, At least OpenBSD and FreeBSD
(possibly others) all have excellent KMS (kernel mode setting) support
nowadays; and it's often loaded by default. kernel set modes directly. It is
based on KMS drivers that the BSD projects ported over from the Linux kernel.
With this, you can use X11/Wayland.

For example: on FreeBSD, you can install `graphics/drm-kmod` as a package or
from ports, and (for Intel GPUs) do `sysrc kld_list+="i915kms"`. Make sure
`/etc/rc.conf` has `kld_list="i915kms"`. On FreeBSD it is also recommended that
you switch to KMS on the console/TTY; add `kern.vty=vt` `/boot/loader.conf` so
that you can still use the console after terminating Xorg.

You should not rely on the above instruction (for FreeBSD), because the exact
step might change, and it does not go into full detail either. Refer to the
documentation provided by your system, to know how KMS is configured.

**tl;dr:** Just try it out to see if KMS is loaded by default. If not, look up
how to enable KMS.
