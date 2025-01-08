---
title: HP Compaq Elite 8300 USDT
x-toc-enable: true
---

**[PLEASE READ THESE INSTRUCTIONS BEFORE INSTALLING](ivy_has_common), OR
YOU MAY BRICK YOUR MACHINE!! - Please click the link and follow the instructions
there, before flashing. For posterity,
[here is the link again](ivy_has_common).**

<div class="specs">
<center>
<img tabindex=1 alt="HP Compaq Elite 8300 USDT" class="p" src="https://av.libreboot.org/hp8300usdt/hp8300usdt.jpg" /><span class="f"><img src="https://av.libreboot.org/hp8300usdt/hp8300usdt.jpg" /></span>
</center>

| ***Specifications***      |                                             |
|---------------------------|---------------------------------------------|
| **Manufacturer**          | HP                                          |
| **Name**                  | Compaq 8300 Elite USDT                      |
| **Released**              | 2012                                        |
| **Chipset**               | Intel Q77                                   |
| **CPU**                   | Intel Sandy/Ivy Bridge (65W max.)           |
| **Graphics**              | Intel HD Graphics or MXM graphics card      |
| **Memory**                | Up to 16GB (2x8GB)                          |
| **Architecture**          | x86_64                                      |
| **Intel ME/AMD PSP**      | Present, neutered                           |
| **Flash chip**            | SOIC-16 16MiB                               |

Disable security before flashing
================================

Before internal flashing, you must first disable `/dev/mem` protections. Make
sure to re-enable them after you're finished.

See: [Disabling /dev/mem protection](../install/devmem)

# Introduction

This is a small but powerful desktop using Sandy or Ivy Bridge CPUs
(of up to 65W TDP).
It has a slot for a discrete MXM graphics card as well.
Some cards work while others don't. Your mileage will vary.

Libreboot has support for this, in the Git repository and
release versions after (but not including) 20230423.

These features are tested and confirmed working:

* Native raminit with both DIMMs (up to 2x8GB)
* Libgfxinit textmode and framebuffer on both DisplayPorts and VGA
* SeaBIOS and GRUB payloads
* External USB2 and USB3 ports: they all work
* USB 3.0 SuperSpeed on Linux-libre (rear, 4 ports)
* Ethernet
* Mini-PCIe WLAN
* SATA: 2.5" disk (6Gbps), mSATA (3Gbps), and optical drive bay
* PS/2 keyboard and mouse
* S3 suspend and resume, wake using USB keyboard
* Headphone output, line out, internal speaker
* Wake on LAN
* Rebooting

# Installation

## Internal flashing

Internal flashing is possible. OEM BIOS versions 2.87 and 2.90 are confirmed
compatible with this guide. BIOS 2.05 is confirmed **not** to work.

If you have some other BIOS version, please do tell about it on
[IRC](https://libreboot.org/contact.html) or comment on this
[issue](https://codeberg.org/libreboot/lbwww/issues/73),
so this guide can be updated.

The jumper labelled "FDO" (for Flash Descriptor Override) needs to be shorted.
That removes all write protections on this board.

We can borrow a shunt from another header on the board: PSWD. It is right
next to the SO-DIMM RAM slots. Move it to the FDO header between the quartz
crystal (small metal cylinder) and the power cable for the optical drive.

![](https://av.libreboot.org/hp8300usdt/jumper_to_fdo.jpg)

Boot into an OS of your choice (that has flashprog support).

**NOTE: Libreboot standardises on [flashprog](https://flashprog.org/wiki/Flashprog)
now, as of 27 January 2024, which is a fork of flashrom.
The reason why was explained, in
the [Libreboot 20240225 release](../../news/libreboot20240225.md#flashprog-now-used-instead-of-flashrom)**

The BIOS should no longer impose any write-protections.
You can now use `flashprog -p internal` freely.

Take a backup of the original BIOS:

	flashprog -p internal -r oem_bios

This is an Ivy Bridge board which means that a neutered ME image
is required if you wish to flash the ME region. Libreboot's
build system automatically downloads, neuters (using me_cleaner)
and inserts this if compiling from source.

If you're using Libreboot release ROM images, the ME image has been
scrubbed and you must re-insert it.
Use the information on this guide to know how to do that:

[Insert vendor files on Intel Sandybridge/Ivybridge/Haswell
platforms](../install/ivy_has_common)

You can now flash libreboot:

	flashprog -p internal -w libreboot.rom

You can now move the jumper back to its original place.
By default, Libreboot applies no write-protection, so
updating it can be done without the jumper anyway.

## External flashing

Unbricking is possible by external flashing. You first need to remove
the optical disk drive and 2.5" HDD/SSD and the metal bracket that
supports them. This requires you to open one torx (T15) screw in total.

The SOIC-16 flash chip is located on the edge of the board
near the group of yellow cubes. Follow the
[general SPI flashing guide](../install/spi.html).

![](https://av.libreboot.org/hp8300usdt/chip+header.jpg)

You might need to power the board by plugging it in. In that case,
do not connect the Vcc (3v3) pin of the flash chip.
Also make sure the board doesn't fully power on (that is, boot).

If you don't have a suitable clip, you can also use the ROM_RCVRY header
right next to the flash chip. By default only the footprint is present,
so you have to solder a pin header of your own. End result can be seen
and the pinout can be seen in the photo earlier. Consult the HP service
manual (page 241) on how to remove the motherboard from the chassis.

<http://web.archive.org/web/20210305234331/https://h10032.www1.hp.com/ctg/Manual/c03612798.pdf>

If you do this, you have to reapply thermal paste.
That might be a good idea anyway, considering how old these are getting
