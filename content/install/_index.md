---
title: Installing Libreboot
toc: true
---

This page will teach you how to install Libreboot, on any of the supported
laptop, desktop and server motherboards.

## Precautions

Please make sure you have backed up the current flash and inserted vendor ROM
files (if applicable) before flashing. Otherwise, **you risk bricking your
machine.**

### Disabling `/dev/mem` protection

You should follow the instructions to [disable `/dev/mem` protection](devmem/).

### Backing up the current flash

You should do this whenever you are overwriting the flash, including when you
update between Libreboot releases.

You just need to use `-r` instead of `-w` in flashprog.

### Inserting vendor ROM files

If you are using a release tarball, please read the instructions to [insert
vendor ROM files](../insert_vendor_files/).

If you are building from source, the build system should insert them
automatically for you.

### Updating EC firmware

It is a good idea to attempt to [update the EC firmware](../ecupdate/) before
installing.

### Intel GbE MAC addresses

On all IFD-bsed Intel platforms except X4X (e.g. Gigabyte GA-G41M-ES2L) and
i945 ones (e.g. ThinkPad X60, ThinkPad T60, MacBook2,1), an Intel Flash
Descriptor is used. If the board has Intel gigabit ethernet, the MAC address is
included in flash, and must be changed prior to installation.

You must use [nvmutil](nvmutil) to change the MAC address to modify the ROM
image before flashing it.

## Prepare to flash externally

Some boards require external flashing. Regardless, you are strongly advised to
*have* an external flashing setup, and make sure it works, before attempting
internal flashing. Refer to [the SPI guide](spi/) to learn about external
flashing.

## Which payloads are supported by Libreboot?

With x86 machines, you can use the SeaBIOS, GNU GRUB, or U-Boot payloads. On
ARM systems, you can use the U-Boot payload (coreboot still initialises
hardware).

## Which boards are supported by Libreboot?

### Games consoles

-   [Sony Playstation](playstation) (PS1/PSX)

### Servers (AMD, x86)

-   [ASUS KFSN4-DRE motherboard](kfsn4-dre)
-   [ASUS KGPE-D16 motherboard](kgpe-d16)

### Desktops (AMD/Intel, x86)

-   [Acer G43T-AM3](acer_g43t-am3)
-   Apple iMac 5,2
-   [ASUS KCMA-D8 motherboard](kcma-d8)
-   [Dell OptiPlex 3050 Micro](dell3050)
-   [Dell OptiPlex 7010/9010 SFF](dell7010) (non-MT)
-   Dell OptiPlex 7010 MT (known to work, using the T1650 ROM, but more research is needed)
-   [Dell OptiPlex 7020/9020 MT and SFF](dell9020)\
    Dell OptiPlex XE2 MT/SFF also known to work
-   Dell OptiPlex 9010 MT is also known to work. No GPIO changes, so it should be safe to flash
-   [Dell OptiPlex 780 variants e.g. MT, USFF](dell780)
-   Dell Precision T1700 (use the same ROM as 9020 MT, but it won't have ECC support)
-   [Dell Precision T1650](t1650)
-   [Gigabyte GA-G41M-ES2L motherboard](ga-g41m-es2l)
-   [HP Elite 8200 SFF/MT](hp8200sff) (HP 6200 Pro Business probably works too)
-   [HP Elite 8300 USDT](hp8300usdt)
-   Intel D510MO and D410PT motherboards
-   [Intel D945GCLF](d945gclf)

### Laptops (Intel, x86)

-   [Apple MacBook1,1 and MacBook2,1](macbook21)
-   [Dell Latitude E4300, E6400, E6400 XFR and E6400 ATG, all with Nvidia or Intel GPU](latitude)
-   [Dell Latitude E5420, E5520, E5530, E6420, E6430, E6520, E6530, E6230, E6330, E6220](latitude) (Intel GPU variants only)
-   [HP EliteBook 2170p](hp2170p)
-   [HP EliteBook 2560p](hp2560p)
-   [HP EliteBook 2570p](hp2570p)
-   [HP EliteBook 820 G2](hp820g2)
-   [HP EliteBook 8460p](hp8460p)
-   [HP EliteBook 8470p](hp8470p)
-   [HP EliteBook 8560w](hp8560w)
-   [HP EliteBook Folio 9470m](hp9470m)
-   [Lenovo ThinkPad R400](r400)
-   Lenovo ThinkPad R500
-   [Lenovo ThinkPad T400 / T400S](t400)
-   [Lenovo ThinkPad T480 and T480S](t480)
-   [Lenovo Thinkpad T420 / T420S / T520](t420_external)
-   Lenovo ThinkPad T430 (not T430S)
-   [Lenovo ThinkPad T500 / W500](t500) (May work for R500 too)
-   Lenovo ThinkPad T530
-   [Lenovo ThinkPad X60](x60_unbrick) ([internal flashing available](xt60_internal/))
-   [Lenovo ThinkPad X60 Tablet](x60tablet_unbrick) ([internal flashing available](xt60_internal/))
-   [Lenovo ThinkPad X200 / X200S / X200 Tablet](x200)
-   [Lenovo Thinkpad X220 / X220 Tablet](x220)
-   [Lenovo ThinkPad T60](t60_unbrick) ([internal flashing available](xt60_internal/))
-   [Lenovo Thinkpad T430 / T530 / W530 / X230 / X230 Tablet](x230_external) ([IvyBridge ThinkPad internal flashing](ivy_internal) available but not recommended)
-   Lenovo ThinkPad W540/[W541](w541_external)
-   [Lenovo ThinkPad T440p](t440p_external)

### Laptops (ARM, with U-Boot payload)

-   [ASUS Chromebook Flip C101 (gru-bob)](chromebooks)
-   [Samsung Chromebook Plus (v1) (gru-kevin)](chromebooks)

### Emulation

-   [QEMU x86 and ARM64](../misc/emulation)

## ROM image file names

They are named like `payload_board_inittype_displaytype_keymap.rom`.

The `payload` option can be SeaBIOS, SeaGRUB or U-Boot. If GRUB is available on
a given board, in flash, both SeaBIOS and SeaGRUB are provided; SeaBIOS images
still have GRUB available via the SeaBIOS menu, and SeaGRUB means that SeaBIOS
automatically loads GRUB from flash first (but you can still choose something
else, by pressing ESC in SeaBIOS when prompted).

Inittype can be `libgfxinit`, `vgarom` or `normal`. The `libgfxinit` option
means coreboot provides native video initialisation, for onboard graphics. The
`vgarom` option means coreboot executes a VGA option ROM for video
initialisation. The `normal` option means coreboot provides no video
initialisation, via VGA ROM or native code.

Displaytype can be `txtmode` or `corebootfb` &mdash; if inittype is `normal`,
this is ignored because `txtmode` is assumed.

If `payload` is `seabios` instead of `seagrub`, no keymaps are inserted into
flash and only US QWERTY is assumed, otherwise the keymap refers to what is
used in GRUB on `seagrub` payload setups.

If you use a libgfxinit image on a desktop machine, you can still insert a
graphics card and it'll work just fine; its own VGA option ROM will be executed
instead, if the primary payload is SeaBIOS, whether that be pure SeaBIOS or a
SeaGRUB setup.

## Updating Libreboot

In general, if Libreboot is already running, you can refer to the [generic
internal flashing instructions](generic_internal/). Most boards require
external flashing when flashing for the first time and are documented in their
own respective pages.

Notwithstanding the above, some boards such as [SureStart on HP EliteBook 820
G2](hp820g2) require special steps, even if Libreboot is already running. This
is also the case if you [locked down the flash](../linux/grub_hardening).

Therefore, before following generic guides, make sure to check first whether
your board has special instructions.

## Removed boards

These boards were in Libreboot, but have been removed with the intention of
re-adding them at a later date. They were removed due to issues. List:

-   [Acer Chromebook 13 (CB5-311, C810) (nyan-big)](chromebooks)
-   [ASUS Chromebit CS10 (veyron-mickey)](chromebooks)
-   [ASUS Chromebook C201PA (veyron-speedy)](c201)
-   [ASUS Chromebook Flip C100PA (veyron-minnie)](chromebooks)
-   [Hisense Chromebook C11 and more (veyron-jerry)](chromebooks)
-   [HP Chromebook 11 G1 (daisy-spring)](chromebooks)
-   [HP Chromebook 14 G3 (nyan-blaze)](chromebooks)
-   [Samsung Chromebook 2 11" (peach-pit)](chromebooks)
-   [Samsung Chromebook 2 13" (peach-pi)](chromebooks)
-   [Samsung Chromebook XE303 (daisy-snow)](chromebooks)
-   Lenovo ThinkPad X301 (still in lbmk, but with `release="n"`)
