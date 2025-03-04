---
title: ASUS KCMA-D8 Desktop/Workstation
---

TODO: this page is OLD. check that the info is still valid.

Introduction
============

[Vendor information](https://www.asus.com/uk/Commercial-Servers-Workstations/KCMAD8/)

Quite a nice board; can have up to 16 Opteron 4200/4300 CPU cores, with up to
64GiB of RAM. It holds its own against more modern machines, especially when
compiling large source trees (for compilers, what you want is high RAM and more
CPU cores).

This is a desktop board using AMD hardware (Fam10h *and Fam15h* CPUs
available). It can also be used for building a high-powered workstation.
libreboot also supports it. The coreboot port was done by Timothy Pearson of
Raptor Engineering Inc. and, working with them, merged into libreboot many
years ago.

Note that not all boards are compatible. See [board status](#boardstatus)
below to determine compatibility with your board.

Flashing instructions can be found at
[../install/](../install/) - note that external
flashing is required (e.g. RPi), if the proprietary (ASUS) firmware is
currently installed. If you already have Libreboot or coreboot, by default
it is possible to re-flash using software running in Linux on the kcma-d8,
without using external hardware.

If you currently have the ASUS firmware, please ignore the above link and
instead refer to the section below:

Flashing
========

The default ASUS firmware write-protects the flash, so you have to remove the
chip and re-flash it using external hardware.

It has a 25XX NOR flash (SPI protocol) in a P-DIP 8 socket, which looks like
this:

![](https://av.libreboot.org/dip8/dip8.jpg)

The default chip is a 2MiB one, but we recommend upgrading it to a 16MiB chip.

NOTE: If you're already running libreboot, you probably don't
need to re-flash externally. Refer instead to the generic instructions on
this page: [../install/](../install/)

Refer to the following guide:\
[Externally rewrite 25xx NOR flash via SPI protocol](../install/spi)

PCI option ROMs
===============

Unlike Libreboot 20160907, Libreboot in newer releases now supports finding and
loading PCI option ROMs automatically, both in GRUB and SeaBIOS on this machine.
This was inherited by libreboot, when the Libreboot project was forked.

So for example, if you wish to use an add-on graphics card, you can! It's no
problem, and should work just fine.

CPU coolers
===========

With some creativity, standard AM3+ coolers will work fine.

2 x Socket C32 (LGA1207) available, so you can use 2 CPUs. (up to 32GiB per CPU)

CPU compatibility
=================

- Opteron 4100 series: Incompatible
- Opteron 4200 series: Compatible
- Opteron 4300 series: Compatible

Board status (compatibility) {#boardstatus}
============================

There are two ways to identify a supported KCMA-D8 board:

1. Serial number (sticker attached to the 24-pin ATX power connector)
2. BIOS version (sticker next to CPU slot 1, last four digits)

Supported boards begin with a serial number of **B9S2xxxxxxxx** or above where
the first character refers to the year of manufacture (A = 2010, B = 2011, etc.)
and the following character the month in hexadecimal (1...9, A, B, C). Thus, any
board produced September 2011 *or later* are compatible with libreboot. Boards
originally shipped with BIOS version **2001** or higher are also compatible.

For help locating these identifying markers, see [ASUS documentation for determining Opteron 4200 series compatibility](https://web.archive.org/web/20200710022605/https://dlcdnets.asus.com/pub/ASUS/mb/SocketC%281027%29/KCMA-D8/Manual&QVL/How_to_identify_MB_supporting_Opteron_4200_CPU.pdf)
[Detailed information regarding the coreboot port](https://raptorengineeringinc.com/coreboot/kcma-d8-status.php)

Form factor {#formfactor}
===========

This board is ATX form factor. While the [ATX standard, version 2.2](https://web.archive.org/web/20120725150314/http://www.formfactors.org/developer/specs/atx2_2.pdf)
specifies board dimensions 305mm x 244mm, this board measures 305mm x 253mm;
please ensure that your case supports this extra ~cm in width.

IPMI iKVM module add-on {#ipmi}
=======================

Don't use it. It uses proprietary firmware and adds a backdoor (remote
out-of-band management chip, similar to the [Intel Management
Engine](../../faq.md#intelme). Fortunately, the firmware is
unsigned (possible to replace) and physically separate from the
motherboard since it's on the add-on module, which you don't have to
install.

Flash chips {#flashchips}
===========

2MiB flash chips are included by default, on these boards. It's on a
P-DIP 8 slot (SPI chip). The flash chip can be upgraded to higher sizes:
4MiB, 8MiB or 16MiB. With at least 8MiB, you could feasibly fit a
compressed linux+initramfs image (BusyBox+Linux system) into CBFS and
boot that, loading it into memory (and nowadays there is LinuxBoot, for which
we would recommend a 16MiB boot flash)

*DO NOT hot-swap the chip with your bare hands. Use a P-DIP 8 [chip
extractor](http://www.coreboot.org/Developer_Manual/Tools#Chip_removal_tools).
These can be found online.


Ideally, you should not hot-swap. Only remove the IC when the system is
powered down and disconnected from mains.

Native graphics initialization {#graphics}
==============================

Only text-mode is known to work, but linux(kernel) can initialize the
framebuffer display (if it has KMS - kernel mode setting).

NOTE: This section relates to the onboard ASpeed GPU. You *can* use an add-on
PCI-E GPU in one of the available slots on the motherboard. Nvidia GTX 780 cards
are what libreboot recommends; it has excellent support in Nouveau (free Linux
kernel / mesa driver for Nvidia cards) and generally works well; however, the
performance won't be as high in Nouveau, compared to the non-free Nvidia driver
because the Nouveau driver can't increase the GPU clock (it doesn't know how,
as of 18 March 2021).

Current issues {#issues}
==============

-   Opteron 4100 series CPUs are currently incompatible
-   LRDIMM memory modules are currently incompatible
	(use UDIMMs please) - NOTE: might actually work nowadays.
-   Memory initialization is still problematic for some modules. We
    recommend avoiding Kingston and Super Talent modules for this reason.

The coreboot wiki has some information about RAM compatibility. The wiki is
deprecated but the info on it is still correct for this board. Some other
considerations:

-   SeaBIOS lacked serial console support out-of-the-box in release 20160907
    and as such a workaround using SGABIOS is necessary. You can find
    instructions on how to do this on the
    [Notabug issue tracker](http://web.archive.org/web/20210416011941/https://notabug.org/libreboot/libreboot/issues/736)
    TODO: test whether this is still the case in libreboot, which uses a newer
    version of coreboot nowadays)
-   SAS (via PIKE 2008 module) requires non-free option ROM (and
    SeaBIOS) to boot from it (theoretically possible to replace, but you
    can put a kernel in CBFS or on SATA and boot from that, which
    can be on a SAS drive. The linux kernel can use those SAS drives
    (via PIKE module) without an option ROM).
    NOTE: SeaBIOS can load PCI-E option ROMs, and by default it will do so in
    libreboot, so you could use it. However, you could *also* simply
    install 16MiB NOR flash with linuxboot payload in it, and use linuxboot
    which has the Linux kernel, which can use SAS drives without needing that
    option ROM; then it can kexec another linux kernel, which in turn also can
    can use those drives. Or just put a standard linux kernel and initramfs
    in cbfs and chainload that from GRUB, with the right parameters.
-   IPMI iKVM module (optional add-on card) uses proprietary firmware.
    Since it's for remote out-of-band management, it's theoretically a
    backdoor similar to the Intel Management Engine. Fortunately, unlike
    the ME, this firmware is unsigned which means that a free
    replacement is theoretically possible. For now, the libreboot
    project recommends not installing the module. [This
    project](https://github.com/facebook/openbmc) might be interesting
    to derive from, for those who want to work on a free replacement. In
    practise, out-of-band management isn't very useful anyway (or at
    the very least, it's not a major inconvenience to not have it).
-   Graphics: only text-mode works. See [\#graphics](#graphics)

Hardware specifications {#specifications}
-----------------------

Check the ASUS website.

