---
title: Libreboot installation guides
x-toc-enable: true
---

This article will teach you how to install Libreboot, on any of the supported
laptop, desktop and server motherboards.

**ALWAYS remember to make a backup of the current flash, when overwriting it,
regardless of what firmware you currently have and what firmware you're
re-flashing it with; this includes updates between Libreboot releases. Use
the `-r` option in flashprog instead `-w`, to read from the flash.**

**SAFETY WARNING!**
====================================================================

**[PLEASE READ THESE INSTRUCTIONS BEFORE INSTALLING](ivy_has_common.md), OR
YOU MAY BRICK YOUR MACHINE!! - Please click the link and follow the instructions
there, before flashing. For posterity,
[here is the link again](ivy_has_common.md).**

**If you're using release ROMs, some files may be missing inside them, and must
be added. See: [Inserting Vendor Files](ivy_has_common.md).**

If you're [building from source](../build/), you can ignore the above guidance.

Install Libreboot via external flashing
=================

Refer to the following article:\
[Externally rewrite 25xx NOR flash via SPI protocol](spi.md)

You are strongly advised to *have* an external flashing setup, and make sure
it works, before attempting internal flashing. This, in addition to making
a backup of the current flash contents, prior to flashing, whether you dump
externally or internally - if only external flashing is available, then it's
usually the case that only external dumping is available too.

Need help?
==========

Help is available on [Libreboot IRC](../../contact.md) and other channels.

If you want professional installation, Minifree Ltd sells [Libreboot
pre-installed](https://minifree.org/) on select hardware, and it also provides
a [Libreboot preinstall service](https://minifree.org/product/installation-service/)
if you want to send your machine in to have Libreboot installed for you.

Leah Rowe, the founder and lead developer of Libreboot, also owns and
operates Minifree Ltd; sales provide funding for the Libreboot project.

Which systems are supported by Libreboot?
========================================

Before actually reading the installation guides, please ensure that your
system is fully supported by Libreboot. More information about the Libreboot
build system can be found in the [lbmk maintenance manual](../maintain/),
and information about porting new systems in
the [porting manual](../maintain/porting.md).

With x86 machines, you can use the SeaBIOS or GNU GRUB payloads. On ARM
systems, you can use the U-Boot payload (coreboot still initialises hardware).

Libreboot currently supports the following systems:

Games consoles
--------------

-   [Sony Playstation](playstation.md) (PS1/PSX)

Servers (AMD, x86)
------------------

-   [ASUS KFSN4-DRE motherboard](kfsn4-dre.md)
-   [ASUS KGPE-D16 motherboard](kgpe-d16.md)

Desktops (AMD, Intel, x86)
--------------------------

-   **[Dell OptiPlex 7020/9020 MT and SFF](dell9020.md) - Also [available to buy
    with Libreboot preinstalled](https://minifree.org/product/libreboot-9020/)** - Dell OptiPlex XE2 MT/SFF also known to work
-   [Acer G43T-AM3](acer_g43t-am3.md)
-   Apple iMac 5,2
-   [ASUS KCMA-D8 motherboard](kcma-d8.md)
-   Dell OptiPlex 7010 **MT** (known to work, using the T1650 ROM, but more
    research is needed) - 9010 also known to work. No GPIO changes, so it should
    be safe to flash.
-   [Dell OptiPlex 780 variants e.g. MT, USFF](dell780.md)
-   [Dell OptiPlex 3050 Micro](dell3050.md)
-   [Dell OptiPlex 7010/9010 SFF](dell7010.md) **(for MT, please use the T1650 image)**
-   Dell Precision T1700 (use the same ROM as 9020 MT, but it won't have ECC support)
-   [Dell Precision T1650](t1650.md) **(the same ROM works on 7010/9010 MT variant)**
-   [Gigabyte GA-G41M-ES2L motherboard](ga-g41m-es2l.md)
-   [HP Elite 8200 SFF/MT](hp8200sff.md) (HP 6200 Pro Business probably works too)
-   [HP Elite 8300 USDT](hp8300usdt.md)
-   Intel D510MO and D410PT motherboards
-   [Intel D945GCLF](d945gclf.md)

Laptops (Intel, x86)
--------------------

-   [Lenovo ThinkPad T480 and ThinkPad T480s](t480.md)
-   **Lenovo ThinkPad T440p - Also [available
    to buy with Libreboot preinstalled](https://minifree.org/product/libreboot-t440p/)**
-   **Lenovo ThinkPad W541 - Also [available to
    buy with Libreboot preinstalled](https://minifree.org/product/libreboot-w541/)** - NOTE: W540 also compatible (same mainboard, so flash the same ROM)
-   Lenovo ThinkPad X230 - *Also* available on Minifree: <https://minifree.org/product/libreboot-x230/>
-   [Apple MacBook1,1 and MacBook2,1](macbook21.md)
-   [Dell Latitude E4300, E6400, E6400 XFR and E6400 ATG, all with Nvidia or Intel
    GPU](latitude.md)
-   [Dell Latitude E5420, E5520, E5530, E6420, E6430, E6520, E6530, E6230, E6330, E6220](latitude.md)
    (Intel GPU variants only)
-   [HP EliteBook 2170p](hp2170p.md)
-   [HP EliteBook 2560p](hp2560p.md)
-   [HP EliteBook 2570p](hp2570p.md)
-   [HP EliteBook 820 G2](hp820g2.md)
-   [HP EliteBook 8460p](hp8460p.md)
-   [HP EliteBook 8470p](hp8470p.md)
-   [HP EliteBook 8560w](hp8560w.md)
-   [HP EliteBook Folio 9470m](hp9470m.md)
-   [Lenovo ThinkPad R400](r400.md)
-   Lenovo ThinkPad R500
-   [Lenovo ThinkPad T400 / T400S](t400.md)
-   Lenovo Thinkpad T420 / T420S
-   Lenovo ThinkPad T430 (**but not the T430S**)
-   [Lenovo ThinkPad T500 / W500](t500.md)
-   Lenovo ThinkPad T520
-   Lenovo ThinkPad T530
-   Lenovo ThinkPad T60, X60, X60S, X60 Tablet (with Intel GPU)
-   [Lenovo ThinkPad X200 / X200S / X200 Tablet](x200.md)
-   Lenovo Thinkpad X220 / X200 Tablet
-   [Lenovo Thinkpad X230 / X230 Tablet](x230_external.md)

Laptops (ARM, with U-Boot payload)
----------------------------------

-   [ASUS Chromebook Flip C101 (gru-bob)](chromebooks.md)
-   [Samsung Chromebook Plus (v1) (gru-kevin)](chromebooks.md)

Emulation
---------

-   [Qemu x86 and arm64](../misc/emulation.md)

**Disable security before flashing**
================================

**Before internal flashing, you must first disable `/dev/mem` protections. Make
sure to re-enable them after you're finished.**

**See: [Disabling /dev/mem protection](devmem.md)**

ROM image file names
====================

Libreboot ROM images are named like
this: `payload_board_inittype_displaytype_keymap.rom`

The `payload` option can be SeaBIOS, SeaGRUB or U-Boot. If GRUB is available
on a given board, in flash, both SeaBIOS and SeaGRUB are provided; SeaBIOS
images still have GRUB available via the SeaBIOS menu, and SeaGRUB means that
SeaBIOS automatically loads GRUB from flash first (but you can still choose
something else, by pressing ESC in SeaBIOS when prompted).

Inittype can be `libgfxinit`, `vgarom` or `normal`. The `libgfxinit` option
means coreboot provides native video initialisation, for onboard graphics.
The `vgarom` option means coreboot executes a VGA option ROM for video
initialisation. The `normal` option means coreboot provides no video
initialisation, via VGA ROM or native code.

Displaytype can be `txtmode` or `corebootfb` - if inittype is `normal`, this
is ignored because `txtmode` is assumed.

If `payload` is `seabios` instead of `seagrub`, no keymaps are inserted into
flash and only US QWERTY is assumed, otherwise the keymap refers to what is used
in GRUB on `seagrub` payload setups.

If you use a libgfxinit image on a desktop machine, you can still insert a
graphics card and it'll work just fine; its own VGA option ROM will be
executed instead, if the primary payload is SeaBIOS, whether that be pure
SeaBIOS or a SeaGRUB setup.

EC firmware updates
===================

Obviously, free EC firmware would be preferable, but it is not the case on
all machine. We would like to have free EC firmware on more machines, but for
now, we must rely on the vendor in a lot of cases. The EC is usually on a
separate flash, so you wouldn't think about it unless you knew it was there;
this is exactly why it's mentioned, so that you think about it,
[because proprietary software is bad](../../news/policy.md).

In many cases, the EC firmware must be updated on a separate IC to the main
boot flash, and this can usually only be done with the vendor's own tool,
running from the vendor boot firmware, and usually only on Windows, because
they provide EC and BIOS/UEFI updates in the same utility. Find out what you
need to do for your machine before installing Libreboot.

It is recommended that you update to the latest EC firmware version. The
[EC firmware](../../faq.md#ec-embedded-controller-firmware)

Updating the EC can sometimes provide benefit depending on the vendor. For
example, they might fix power issues that could then enhance battery life.

ThinkPads
---------

See: <http://www.thinkwiki.org/wiki/BIOS_update_without_optical_disk>

Otherwise, check the Lenovo website to find the update utility for your
mainboard.

HP EliteBooks
-------------

EC firmware is required in the main boot flash, but Libreboot's build system
automatically downloads this from HP for each machine, and inserts it, so
you don't have to worry. Just make sure that [vendor files are
inserted](ivy_has_common.md) if using release images.

Other
-----

The same wisdom applies to other laptop vendors.

Non-laptops typically do not have embedded controllers in them.

Libreboot installation instructions
===================================

In general, if Libreboot is already running, you can skip
towards the final section on this page, which provides general internal
flashing instructions. Internal flashing is when you flash the target machine
from the target machine, inside an operating system running on it.

Some boards require special steps, even if Libreboot is already running,
for example if you [locked down the flash](../linux/grub_hardening.md), or
as another example, [SureStart on HP EliteBook 820 G2](hp820g2.md)

Therefore, before following generic guides, make sure to check first whether
your board has special instructions, otherwise use the generic guide at the
end of this article.

Intel GbE MAC address (IFD-based systems)
---------------------------------------

On all Intel platforms except X4X (e.g. Gigabyte GA-G41M-ES2L) and i945
ones (e.g. ThinkPad X60, ThinkPad T60, MacBook2,1), an Intel Flash Descriptor is
used. If the board has Intel gigabit ethernet, the MAC address is included in
flash, and can (must) be changed prior to installation.

You can use [nvmutil](nvmutil.md) to change the MAC address. You will perform
this modification to the ROM image, before flashing it.

Flash lockdown / boot security
-------------------

This is referred to informally as *Secure libreBoot*.

Full flash lockdown is possible, with cryptographic verification of your
Linux kernel and other files, using special features in the GRUB payload.

See: [GRUB hardening / Secure libreBoot](../linux/grub_hardening.md)

If you already did this, it's possible that you may no longer be able to
flash internally. If that is the case, you must [flash externally](spi.md).

Updating an existing installation
---------------------------------

Unless otherwise stated, in sections pertaining to each mainboard below,
an existing Libreboot installation can be updated via internal flashing,
without any special steps; simply follow the general internal flashing
guide, in the final section further down this page.

If you have an existing Libreboot installation but you *locked down the flash*,
updating it will require external flashing.

If you currently have the factory firmware, you probably need to flash
externally; on *some* machines, internal flashing is possible, usually with
special steps required that differ from updating an existing installation.

The next sections will pertain to specific mainboards, where indicated,
followed by general internal flashing instructions where applicable.

HP EliteBook 820 G2 (internal and external)
-------------------

See: [HP EliteBook 820 G2 flashing guide](hp820g2.md)

The flashprog command is identical, except programmer selection, on external
and internal flashing; internal is only possible if you already have Libreboot.

HP EliteBook 8560w (vendor BIOS)
--------------------

If you have the factory
firmware: [HP 8560w external flashing guide](hp8560w.md)

Dell Latitude laptops (vendor BIOS)
---------------------

See: [Dell Latitude flashing guide](latitude.md)

This applies to all supported Dell Latitude models. Remember to [update the
MAC address with nvmutil](nvmutil.md), before flashing.

ThinkPad X200/T400/T500/W500/R400/R500
--------------------------------------

If you're running one of these with Lenovo BIOS, you must externally flash
Libreboot, because the original firmware restricts writes to the flash.

There machines all use SOIC8/SOIC16 flash ICs. Refer to pages specifically for
each machine:

* [ThinkPad X200](x200.md)
* [ThinkPad T400](t400.md)
* [ThinkPad R400](r400.md)
* [ThinkPad T500/W500](t500.md) (R500 is similar)

NOTE: T400S, X200S and X200 Tablet require different steps, because these have
WSON8 flash ICs on them, which will require some soldering. Please read
the [external flashing guide](spi.md) in the section pertaining to WSON.

You can find WSON8 probes online, that are similar to a SOIC8/SOIC16 clip. Your
mileage may very, but WSON8 has the same pinout as SOIC8 so you might have some
luck with that.

Intel D510MO/D410PT (vendor BIOS)
-----------------------

See: [External flashing guide](spi.md) - both boards are compatible with
the same image.

Gigabyte GA-G41M-ES2L (vendor BIOS)
---------------------

Internal flashing is possible, from factory BIOS to Libreboot, but special
steps are required.

See: [Gigabyte GA-G41M-ES2L installation guide](ga-g41m-es2l.md)

Acer G43T-AM3 (vendor BIOS)
--------------------

See: [Acer G43T-AM3](acer_g43t-am3.md)

MacBook 1,1 / 2,1 / iMac 5,2 (vendor BIOS)
-------------------------

MacBook *1,1* requires [external flashing](spi.md). MacBook *2,1* can always
be flashed internally. iMac 5,2 can be flashed internally.

Also check the [Macbook2,1 hardware page](macbook21.md)

ASUS KCMA-D8 / KGPE-D16 (vendor BIOS)
--------------------------

[You must flash it externally](spi.md) (DIP-8 section) - also look at
the [KGPE-D16 hardware page](kgpe-d16.md).

Further information is available on the [KCMA-D8 page](kcma-d8.md).

KGPE-D16 installation is essentially the same, with the same type of flash
IC (DIP-8). Refer to the external flashing guide.

ASUS KFSN4-DRE (vendor BIOS)
-------------------------

This board uses LPC flash in a PLCC32 socket. This coreboot page shows an
example of the push pin as a proof of concept:
<http://www.coreboot.org/Developer_Manual/Tools#Chip_removal_tools>

See: [ASUS KFSN4-DRE guide](kfsn4-dre.md)

Hot-swap the flash IC with another one while it's running, and flash it
internally.

Intel D945GCLF (vendor BIOS)
---------------------------------

See: [Intel D945GCLF flashing guide](d945gclf.md)

Dell OptiPlex 3050 Micro (vendor BIOS)
---------------------

Refer to the [3050 Micro page](dell3050.md). Internal flashing also possible.
This has the Intel Boot Guard, but Libreboot uses the *deguard* utility to
disable the Boot Guard on this Intel 7th gen board.

Dell OptiPlex 7010/9010 SFF (vendor BIOS)
---------------------

Refer to the [7010/9020 SFF page](dell7010.md). Internal flashing also possible.
NOTE: If you have the *MT* variant, read the sections below instead (the SFF
ROM is only for SFF).

Dell OptiPlex 7010/9010 MT (vendor BIOS)
---------------------

This board is essentially identical to the Dell Precision T1650, except that
it does not support ECC memory. Same wiring.

You can flash the T1650 image on this machine. NOTE: This applies to the MT
variant, specifically. Do not flash T1650 images on the 7010/9010 *SFF*.

Dell Precision T1650 desktop
------------------------------------

Refer to the [T1650 hardware page](t1650.md). External flashing
required, or you can set the Service Mode jumper and flash internally (from
vendor firmware, to Libreboot).

Dell OptiPlex 7020/9020/XE2 SFF/MT / Precision T1700
------------------------------------

Refer to the [7020/9020 hardware page](dell9020.md). Internal
flashing (from vendor firmware to Libreboot) is possible if you set the Service
Mode jumper.

HP EliteBook laptops (vendor BIOS)
--------------------

Refer to the [hardware page]() for info about HP laptops, and
read the [external flashing guide](spi.md).

Links to specific HP laptop pages:

* [HP EliteBook 2170p](hp2170p.md)
* [HP EliteBook 2560p](hp2560p.md)
* [HP EliteBook 2570p](hp2570p.md)
* [HP EliteBook 820 G2](hp820g2.md)
* [HP EliteBook 8460p](hp8460p.md)
* [HP EliteBook 8470p](hp8470p.md)
* [HP EliteBook Folio 9470m](hp9470m.md)

These pages provide more info about external flashing. You must remember
to [insert vendor files](ivy_has_common.md), if you're using release ROMs.

HP Elite 8200 SFF (vendor BIOS)
-------------------------

See: [HP Elite 8200 SFF install guide](hp8200sff.md)

HP Elite 8300 USDT (vendor BIOS)
----------------------------

See: [HP Elite 8200 USDT install guide](hp8300usdt.md)

ThinkPad X220/X220T/T420/T420s/T520
-----------------------------------

T420/T520: [T420 flash instructions](t420_external.md)

T420s/T520 are similar, in terms of assembly/disassembly.

Now, as for X220/X220:

X220/X220 Tablet is essentially the same as the X230, but cannot be flashed
internally; you must use [an external flasher](spi.md).

Otherwise, look at [X230 disassembly](x230_external.md). Note that the X220
has a single 8MB flash, instead of 8MB and 4MB.

ThinkPad X230/T430/T530/W530/X230T
----------------------------------

Internal flashing from vendor BIOS to Libreboot is possible, but not
recommended. See: [IvyBridge ThinkPad internal flashing](ivy_internal.md).

External flashing recommended, but only documented for X230.
See: [ThinkPad X230 install guide](x230_external.md).

Otherwise, refer to [external SPI flashing](spi.md).

ThinkPad T60/X60/X60Tablet/X60S
-------------------------------

Only the Intel GPU is compatible. Do not flash the ATI GPU models.

External flashing guides:

* [ThinkPad X60](x60_unbrick.md)
* [ThinkPad X60 Tablet](x60tablet_unbrick.md)
* [ThinkPad T60](t60_unbrick.md)

These machines can also be flashed internally, by exploiting a bug
in the original Lenovo BIOS. If there's a BIOS password at boot, you should
just flash externally.

Internal flashing instructions:

First, please ensure that your CR2032/CMOS battery is working. This is what
powers the SRAM containing BIOS settings, and it powers the real-time clock.
It also holds the BUC.TS value - this is what we need.

BUC (Backup Control) register contains a bit called Top Swap (TS). The 64KB
bootblock at the top of flash is complemented by a backup Top Swap just above
it. The one at the end can't be flashed internally while Lenovo BIOS is running,
but the rest of it can be flashed (everything above the main bootblock).

By setting the TS bit, you can make the machine boot from the backup bootblock.

Download the Libreboot 20160907 utils archive, and in there you will find
these binaries:

* `flashrom`
* `flashrom_i945_sst`
* `flashrom_i945_mx`

You'll also find the bucts tool. Run it as root:

	./bucts 1

Now run both of these as root:
	
	./flashrom_i945_sst -p internal -w coreboot.rom
	./flashrom_i945_mx -p internal -w coreboot.rom

You'll see a lot of errors. This is normal. You should see something like:

```
Reading old flash chip contents... done.
Erasing and writing flash chip... spi_block_erase_20 failed during command execution at address 0x0
Reading current flash chip contents... done. Looking for another erase function.
spi_block_erase_52 failed during command execution at address 0x0
Reading current flash chip contents... done. Looking for another erase function.
Transaction error!
spi_block_erase_d8 failed during command execution at address 0x1f0000
Reading current flash chip contents... done. Looking for another erase function.
spi_chip_erase_60 failed during command execution
Reading current flash chip contents... done. Looking for another erase function.
spi_chip_erase_c7 failed during command execution
Looking for another erase function.
No usable erase functions left.
FAILED!
Uh oh. Erase/write failed. Checking if anything has changed.
Reading current flash chip contents... done.
Apparently at least some data has changed.
Your flash chip is in an unknown state.
```

If you see this, rejoice! It means that the flash was successful. Please do not
panic. Shut down now, and wait a few seconds, then turn back on again.

The main bootblock still isn't flashed, but you can shut down, wait a few
seconds and boot up again. When you do, you'll have Libreboot. Please make
sure to flash a second time, like so:
	
	flashprog -p internal -w coreboot.rom

Libreboot recommends `flashprog` now, which is a fork of flashrom, but we used
flashrom in the 2016 release. The macronix/ssh flashrom binaries there are
specifically patched; check the Libreboot 20160907 source code for the actual
patches. The patches modify some flash chip definitions in flashrom, to exploit
the bug in Lenovo BIOS enabling internal flashing.

You must ensure that the second flash is performed, upon reboot, because
otherwise if the CR2032 battery dies, bucts will be reset and it will no
longer boot.

When you've done the second flash, which includes overwriting the main
bootblock, set bucts back to zero:

	./bucts 0

The second flash can be done by simply following the general internal flashing
guide further down on this page.

ThinkPad T480/T480S (vendor BIOS)
----------------------

See:

* [ThinkPad T480/T480S](t480.md)

Thinkpad T440p/W541 (vendor BIOS)
---------------------

Guides:

* [ThinkPad T440p flashing guide](t440p_external.md)
* [ThinkPad W541 flashing guide](w541_external.md)

HP EliteBook laptops (vendor BIOS)
-------------------------

Each machine has it's own guide:

* [HP EliteBook 2170p](hp2170p.md)
* [HP EliteBook 2560p](hp2560p.md)
* [HP EliteBook 2570p](hp2570p.md)
* [HP EliteBook 820 G2](hp820g2.md)
* [HP EliteBook 8460p](hp8460p.md)
* [HP EliteBook 8470p](hp8470p.md)
* [HP EliteBook 8560w](hp8560w.md)
* [HP EliteBook Folio 9470m](hp9470m.md)

HP Elite desktops (vendor BIOS)
-------------------------

Each machine has it's own guide:

* [HP Elite 8200 SFF/MT](hp8200sff.md) (HP 6200 Pro Business probably works too)
* [HP Elite 8300 USDT](hp8300usdt.md)

ARM-based Chromebooks
---------------------

See: [Chromebook flashing instructions](chromebooks.md)

NOTE: The generic flashing instructions (later on this page) apply only to
the x86 machines, because the Chromebooks still use flashrom with
the `-p host` argument instead of `-p internal` when flashing, and you typically
need to flash externally, due to Google's security model.

QEMU (arm64 and x86)
--------------------

Libreboot can be used on QEMU (virtual machine), which is useful for debugging
payloads and generally trying out Libreboot, without requiring real hardware.

See: [Libreboot QEMU guide](../misc/emulation.md)

Install via host CPU (internal flashing)
========================================

NOTE: This mainly applies to the x86 machines.

Please check other sections listed above, to see if there is anything
pertaining to your mainboard. Internal flashing means that you boot Linux or
BSD on the target machine, and run `flashprog` there, flashing the machine
directly.

**If you can't flash internally, you must [flash externally](spi.md).**

Internal flashing is often unavailable with the factory firmware, but it is
usually possible when Libreboot is running (barring special circumstances).

Run flashprog on host CPU
------------------------

**Always remember to [insert vendor files](ivy_has_common.md), when using
release images. Otherwise, these files are added automatically at build
time, when building from source (but they are not present in release images).**

### Flash chip size

Use this to find out:

	flashprog -p internal

In the output will be information pertaining to your boot flash.

### Howto: read/write/erase the boot flash

How to read the current chip contents:

	sudo flashprog -p internal:laptop=force_I_want_a_brick,boardmismatch=force -r dump.bin

You should still make several dumps, even if you're flashing internally, to
ensure that you get the same checksums. Check each dump using `sha1sum`

How to erase and rewrite the chip contents:

	sudo flashprog -p internal:laptop=force_I_want_a_brick,boardmismatch=force -w libreboot.rom

NOTE: `force_I_want_a_brick` is not scary. Do not be scared! This merely disables
the safety checks in flashprog. Flashrom and coreboot change a lot, over the years,
and sometimes it's necessary to use this option. If you're scared, then just
follow the above instructions, but remove that option. So, just use `-p internal`.
If that doesn't work, next try `-p internal:boardmismatch=force`. If that doesn't
work, try `-p internal:boardmismatch=force,laptop=force_I_want_a_brick`. So long
as you *ensure* you're using the correct ROM for your machine, it will be safe
to run flashprog. These extra options just disable the safetyl checks in flashprog.
There is nothing to worry about.

If successful, it will either say `VERIFIED` or it will say that the chip
contents are identical to the requested image.

NOTE: there are exceptions where the above is not possible. Read about them in
the sections below:

Removed boards
==============

These boards were in Libreboot, but have been removed with the intention of
re-adding them at a later date. They were removed due to issues. List:

-   [Acer Chromebook 13 (CB5-311, C810) (nyan-big)](chromebooks.md)
-   [ASUS Chromebit CS10 (veyron-mickey)](chromebooks.md)
-   [ASUS Chromebook C201PA (veyron-speedy)](c201.md)
-   [ASUS Chromebook Flip C100PA (veyron-minnie)](chromebooks.md)
-   [Hisense Chromebook C11 and more (veyron-jerry)](chromebooks.md)
-   [HP Chromebook 11 G1 (daisy-spring)](chromebooks.md)
-   [HP Chromebook 14 G3 (nyan-blaze)](chromebooks.md)
-   [Samsung Chromebook 2 11" (peach-pit)](chromebooks.md)
-   [Samsung Chromebook 2 13" (peach-pi)](chromebooks.md)
-   [Samsung Chromebook XE303 (daisy-snow)](chromebooks.md)
-   Lenovo ThinkPad X301 (still in lbmk, but with `release="n"`)

NOTES about removed boards
--------------------------

**WARNING: veyron speedy boards (e.g. C201) have non-functional video init as
of 19 February 2023, and no fix is yet available on that date. See:
<https://notabug.org/libreboot/lbmk/issues/136> - the last tested revision
from 2021.01 is known to work, for u-boot on this board. See:\
<https://wiki.postmarketos.org/wiki/ASUS_Chromebook_C201_(google-veyron-speedy)>
(alpernebbi on IRC is looking into this, to bisect uboot and update the latest
revisions) - for now, ROM images deleted from the Libreboot 20221214
and 20230319 releases.**

**WARNING: daisy- and peach- boards require a BL1 bootloader firmware, but the
one from coreboot 3rdparty is a fake/placeholder file. We need logic in the
Libreboot build system for properly fetching/extracting these, plus docs to
cover it. For now, assume that these are broken - ROM images are excluded,
for now, and have been deleted from the Libreboot 20221214 and 20230319
releases. - see: <https://review.coreboot.org/plugins/gitiles/blobs/+/4c0dcf96ae73ba31bf9aa689768a5ecd47bac19e>
and <https://review.coreboot.org/plugins/gitiles/blobs/+/b36cc7e08f7337f76997b25ee7344ab8824e268d>**

d945gclf: Doesn't boot at all, according to last report. D510MO is still in
lbmk but still was reported problematic; other boards should be fine (see list
above).

WARNING: Support for ARM chromebooks is at a proof-of-concept stage. Refer
to [docs/uboot/](../uboot/) for more info about the U-Boot payload.
