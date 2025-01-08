---
title: Dell OptiPlex 780 MT/USFF
x-toc-enable: true
---

Libreboot is compatible with the Dell OptiPlex 780, of variants: MT and USFF.
SFF and DT may be supported in a future revision. These instructions are
identical both the MT and USFF variants.

<div class="specs">
<center>
Dell OptiPlex 780
</center>

| ***Specifications***       |                                                |
|----------------------------|------------------------------------------------|
| **Manufacturer**           | Dell                                           |
| **Name**                   | OptiPlex 780                                |
| **Variants**               | OptiPlex 780 MT, OptiPlex 780 USFF             |
| **Released**               | 2009                                           |
| **Chipset**                | Intel X4X                                     |
| **CPU**                    | Core 2 Duo (e.g. E8400)                         |
| **Graphics**               | Discrete graphics card, or Intel HD Graphics model |
| **Memory**                 | DDR3 DIMMs (max 16GB on MT 4x4GB, 8GB USFF 2x4GB)    |
| **Architecture**           | x86\_64                                         |
| **Original boot firmware** | Dell UEFI firmware                             |
| **Intel ME/AMD PSP**       | Present. Entire ME firmware can be removed.      |
| **Flash chip**             | SOIC-16 and/or SOIC-8 8MiB (64Mbit)           |


```
W+: Works without vendor firmware; 
N: Doesn't work; 
W*: Works with vendor firmware; 
U: Untested; 
P+: Partially works; 
P*: Partially works with vendor firmware
?: UNKNOWN AT THIS TIME
```

| ***Features***                                    |    |
|---------------------------------------------------|----|
| **Internal flashing with original boot firmware** | W+ |
| **Display (if Intel GPU)**                        | W+ |
| **Display (discrete GPU, SeaBIOS payload only)**  | W* |
| **Audio**                                         | W+ |
| **RAM Init**                                      | W+ |

| ***Payloads supported***   |           |
|----------------------------|-----------|
| **GRUB (libgfxinit only)** | Works     |
| **SeaBIOS**                | Works     |
| **SeaBIOS with GRUB**      | Works     |
</div>
Introduction
============

**Unavailable in Libreboot 20240612 or earlier. You must [compile from
source](../build/), or use a version newer than Libreboot 20240612.**

Official information about the computer can be found here:
<https://www.dell.com/support/manuals/en-uk/optiplex-7010-plus-small-ff/opti_7010_sff_plus_om/specifications-of-optiplex-small-form-factor-plus-7010?guid=guid-7c9f07ce-626e-44ca-be3a-a1fb036413f9&lang=en-us>

Build ROM image from source
---------------------------

The build target, when building from source, is thus:

	./mk -b coreboot dell780mt_truncate_8mb
	./mk -b coreboot dell780mt_8mb
	./mk -b coreboot dell780usff_truncate_8mb
	./mk -b coreboot dell780usff_8mb

The `_truncate` image is needed if you're flashing Libreboot internally from
the original Dell firmware. Otherwise, you only need the regular images that
lack `_truncate` in the file name.

100% FREE
=========

This mainboard is entirely free software in the main boot flash. It is using
the Intel X4X / ICH10 platform, same as on the already supported
Gigabyte GA-G41M-ES2L mainboard.

Installation
============

Set MAC address
---------------

This platform uses an Intel Flash Descriptor, and defines an Intel GbE NVM
region. As such, release/build ROMs will contain the same MAC address. To
change the MAC address, please read [nvmutil documentation](../install/nvmutil).

WARNING about CPU/GPU compatibility
-------------------------------

Coreboot has libre initialisation code for Intel graphics, but libre
initialisation code is not available for most graphics cards. This machine can
take any graphics card that fits in the PCI-E slot. When a graphics card is
used, SeaBIOS executes its VGA ROM which provides video init, instead of
coreboot's native Intel video init. GRUB piggybacks off of what SeaBIOS did,
so the GRUB payload will also work.

Flash a ROM image (software)
-----------------

**Always make sure to dump a copy of the current flash first. ALSO: [make
sure /dev/mem protection is disabled](devmem) for the flashing to work!**

If you're already running Libreboot, and you don't have flash protection
turned on, [internal flashing](../install/) is possible.

If you have factory firmware (Dell), you can short the service jumper. It's a
2-pin header located somewhere on the board (no photos available yet).

With the service jumper set, all flash protections are disabled on the first
6MB of the flash; the latter 2MB part is restricted. Because we are using an
Intel Flash Descriptor on this board, the flash will be divided into these
parts:

* Intel Flash Descriptor (basic machine configuration)
* Intel Gigabit Ethernet region (e.g. MAC address configuration)
* BIOS region (contains coreboot)

Before you can use the flash commands, please note that the `_truncate` images
are 6MB in size, but they must be padded to 8MB. Normally a blank part of flash
should ideally be all 0xFF, but here we do:

	dd if=/dev/zero of=2mb.bin bs=2M count=1
	cat libreboot6mb.rom 2mb.bin > libreboot.rom

If you're not using the truncate images, you can ignore the above steps.

The Flash Descriptor can be thought of more like a *partition table* for the
flash, at least in our use-case scenario. The `_truncate` images configure
the flash such that only the first 6MB is used, with the BIOS region ending
at that limit; the upper 2MB is specified as the platform data region, in
Libreboot's configuration. To flash it, do this:

	./flashprog -p internal --ifd -i fd -w libreboot.rom
	./flashprog -p internal --ifd -i gbe -w libreboot.rom
	./flashprog -p internal --ifd -i bios -w libreboot.rom

It's very important to do this in the *exact* order as above, because
the `--ifd` option references the *flashed* IFD, not the one in your image,
so you must flash the IFD first.

If you already have Libreboot running, and you don't have flash protection
enabled, you can omit `--ifd -i REGION` from the flashprog command, and flash
the full image; the one without `_truncate` in the file name uses all of the
flash, with the BIOS region ending at the 8MB limit, so the BIOS region is
therefore 2MB larger on those images.

Flash a ROM image (hardware)
-----------------

For general information, please refer to [25xx NOR flash
instructions](../install/spi) - that page refers to use of socketed flash.

No photos yet available.
