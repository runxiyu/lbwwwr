---
title: U-Boot payload (x86 specific)
---

Introduction
============

<img tabindex=1 class="r" src="https://av.vimuser.org/uboot.png" /><span class="f"><img src="https://av.vimuser.org/uboot.png" /></span>

U-Boot is available as a coreboot payload, in Libreboot 20241206 and later,
on x86 boards; on ARM it has been available since late 2022 Libreboot releases.

Please read <https://www.u-boot.org/>, especially the full U-Boot documentation
available there.

**NOTE: This documentation refers only to x86. For ARM, please refer back to
the [main U-Boot page](index).**

More documentation about this will be written at a later date, but just before
the Libreboot 20241206 release in December 2024, U-Boot support was added as
a payload on x86 machines, both 32- and 64-bit. This is using the excellent work
done by Simon Glass and others, on making U-Boot run as a generic x86 coreboot
payload. It has several boot methods but the most interesting (in an x86
context) is UEFI. U-Boot provides a very sensible UEFI implementation that can
reliably boot many Linux and BSD systems.

Availability
------------

Do this in lbmk.git (Libreboot's build system) to check whether your board has
U-Boot enabled:

	git grep payload_uboot_amd64
	git grep payload_uboot_i386

In `target.cfg` files for each coreboot board, you will find this option if
it's enabled. You also need either `u-boot/i386coreboot`
or `u-boot/amd64coreboot` in the `build_depend` variable for a given board, for
it to automatically compile at build time.

Not every board has it yet. U-Boot is still experimental on x86. Libreboot has
made several modifications to the default *bootflow* menu, used for selecting
an EFI application at boot (e.g. installed GRUB bootloader for e.g. Debian).
For example, upstream didn't implement an auto-boot timeout for the first
selected boot item, so this was implemented. Libreboot also themed it to look
more like an official Libreboot bootloader.

Here is an example of what it looks like on the boot menu:

<https://mas.to/@libreleah/113596262378713418>

Errors
------

If you see error `-25` in the bootflow menu, it's because there's nothing
installed that i t can use e.g. EFI bootloader such as GRUB.

If you see error `-2` it's likely that you have tried to boot a USB drive
automatically; sometimes you have to do it manually (see the section below
about using the bootflow command manually, via `bootflow select`).

Boot Linux/BSD installer (USB)
---------------------------

Just stick your formatted USB stick in. U-Boot should detect it. Sometimes some
USB flash drives are broken, because many of them violate specifications and
U-Boot doesn't properly hack around that like Linux does (buggy USB mass storage
implementation) - also, xhci suppport is still a bit unstable, on machines that
don't have EHCI controllers (e.g. Haswell setups and beyond).

If your USB drive is detected at boot, a menu might appear, showing it and you
can select it, sometimes it doesn't and you could instead do in the U-Boot shell:

	bootflow list
	bootflow select X

Where `X` is the number of the boot device, as shown by the output of the list
command.

After selecting the device, you can do:

	bootflow boot

Booting installed system
------------------------

It should just work. If all is well, it'll show the bootflow menu. Simply
select your device. If you see error, perhaps try:

	bootefi bootmgr

Tested operating systems
========================

Linux/BSD
---------

Arch Linux, Debian Linux and OpenBSD have been tested.

Some GRUB setups that use the *console* output mode end up using the U-Boot
console driver, which is buggy in UEFI GRUB, so menus can get quite messed up
indeed; text in the wrong place, countdown timers mangled, etc. E.g. the Arch
Linux installer is completely broken, but you can hit enter to boot Linux which
then uses KMS and the installed system uses it (and you could install another
bootloader in the installed system).

EFI-based GRUB menus like in the Debian installer seemed to work just fine,
that is: setups that use the EFI framebuffer instead of a text console.

Windows
-------

Windows was tested, and doesn't work yet. Simon Glass maintains the x86
coreboot payload, and has informed me that he still has some work to do
there.

SecureBoot
==========

Supported by U-Boot, though U-Boot does not currently have a robust way of
storing EFI variables, and Libreboot disables SecureBoot by default. However,
you can enable it. Information is available in U-Boot's official documentation.

If you want real boot security, don't use UEFI. Libreboot's GRUB payload can
be heavily hardened, by following the [GRUB hardening](../linux/grub_hardening)
guide; this means using the GRUB payload instead of U-Boot.

UEFI SecureBoot with a Linux UKI could achieve similar results in a security
sense to Libreboot's GRUB hardening setup, though the latter is more flexible,
albeit not widely used by the mainstream, but it does work (I use it myself!).

ThinkPad X60/T60
================

The 32-bit U-Boot payload is only useful for 32-bit setups, and 32-bit UEFI
isn't really that common on x86; the 64-bit U-Boot payload is much more useful,
in this context.

Most ThinkPad X60/T60 have 32-bit-only CPUs in them, so the 32-bit U-Boot
payload is used. If you have a 64-bit CPU (Core 2 Duo instead of Core Duo),
namely Core 2 Duo L9400, T5600 or T7200, you might be able to use the 64-bit
payload instead, for full 64-bit UEFI, but this is currently not tested and it
is not configured.

To enable this, on compatible CPUs, make the following modifications to the
build system and compile a custom image:

Check `config/coreboot/x60/target.cfg` (change `x60` to what you use if it
differs), and you'll find something like this:

	build_depend="seabios/default grub/default u-boot/i386coreboot"
	payload_uboot_i386="y"

In the above example, you would change it to:

	build_depend="seabios/default grub/default u-boot/amd64coreboot"
	payload_uboot_amd64="y"

You can then re-compile the image, using
standard [build instructions](../build/). For example on X60 you would use
the following build target:

	./mk -b coreboot x60

Using a full UEFI setup on such old hardware is quite novel and might be
interesting in the future, as more distros stop supporting BIOS-based methods,
or where the latter may become untested in the future.

Bugs
====

Limited testing, at least as of 6 December 2024, but some issues that appeared
included:

* Haswell: USB support very flaky. E.g. some keyboards work, some don't, some
  USB drives work, some don't.
* ThinkPad T480: U-Boot simply boot loops endlessly, but sometimes boots and
  shows a menu: SATA doesn't work, but NVMe SSDs do, and you can boot just
  fine, but you might not be able to boot with the bootflow menu;
  the `bootefi` command can be used.
* Certain ivybridge laptops eg. Dell Latitude: EFI framebuffer got completely
  b0rked.

The good news is that a few systems were tested that seemed to work well.
Haswell machines mostly work OK (with a few bugs), some Kaby Lake machines work
but some don't very well; the GM45 machines work well, e.g. a ThinkPad X200 was
tested.

Mitigating instability
=======================

U-Boot is not a primary payload on any board where it's enabled. It's instead
chainloaded from SeaBIOS on 64-bit x86, and from GRUB on 32-bit x86. You select
it in the SeaBIOS menu (ESC menu), or you can use a ROM image that
has `seauboot` in the name, where SeaBIOS auto-boots U-Boot unless interrupted
via the ESC prompt.

So if U-Boot is unstable on your board, you can press ESC in SeaBIOS and boot a
device in SeaBIOS, or select the available GRUB payload from SeaBIOS.

Please do report any failures or successes with your testing, if you want to
try out U-Boot.

**TODO: A lot more documentation and testing notes should be written here over
time, and lots more bug fixes are needed for U-Boot to become stable. It is
the intention of Libreboot that U-Boot become the DEFAULT payload on x86
in a future release.**
