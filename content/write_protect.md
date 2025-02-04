---
title: Flash write protection
toc: true
---

Flash write protection will prevent anyone except you from overwriting the
flash without permission. This is important, because you don't want some
malicious software running as root from overwriting your flash, thus removing
any of the above protections.

Build-time write protect
---------------------------

Let's assume your board is `x200_8mb`, do:

	./mk -m coreboot x200_8mb

Find this section: Security -> Boot media protection mechanism

In the above example, I found:

* Lock boot media using the controller
* Lock boot media using the chip

Which one to pick depends on your board. Let's pick "controller".

Now we can see: Security -> Boot media protected regions

In there, there is the option to ban writes, or to ban both reads and writes.
Banning reads may be desirable, for example if you have a salt hashed password
stored in `grub.cfg`.

You'll have to play around with this yourself. These options are not enabled
by default, because Libreboot images are supposed to allow writes by default,
when booted. You have to enable such security yourself, because the design of
Libreboot is to be as easy to use as possible by default, which include updates,
thus implying read-write flash permissions.

This example was for `x200_8mb`, but other boards may look different in config.
Anyway, when you're done, save the config and then build it from source in lbmk.

See: [build from source](../build/)

IFD-based flash protection
--------------------------

**NOTE: This CAN cause bricks on a lot of machines. You should use this with
care. The FLILL and/or PRx based methods are more reliable - also SMM methods.
You can reconfigure coreboot and enable the chipset-based flash protection there
which accomplishes the same result, and the benefit is that it can't easily
be overridden by an evel maid attack e.g. can't simply set the service jumper
on desktops.**

The simplest way is to just do this:

	ifdtool --lock libreboot.rom -O libreboot.rom

If you did the step before, to compile `cbfstool`, you can find ifdtool in
the `elf/` directory, e.g. `elf/ifdtool/default/ifdtool`. Use the ifdtool
version matching the coreboot tree for your motherboard.

Note that this only works for Intel-based systems that use an Intel Flash
Descriptor, which is actually most Intel systems that Libreboot supports.

Other facts
-----------

Strapping `HDA_SDO` or `HDA_DOCK_EN` requires physical access, because you have
to short a pin on the HDA chip on the motherboard, or there will be a header
for this on the board (e.g. "service mode" jumper). If you strap those pins,
it disables descriptor-based flash protections.

On *Dell Latitude* laptops specifically, the EC can unlock flash by setting
the SDO/DOCK\_EN signal as described, and this is in fact what
the `dell-flash-unlock` utility does, so you can consider IFD locking there
to be basically useless.

In addition to the above, you may also consider `/dev/mem` protection.
Enable `CONFIG_STRICT_DEVMEM` in your Linux kernel, or set `securelevel` above
zero on your BSD setup (but BSD cannot be booted with GRUB very easily so
it's a moot point).

FLILL
-----

On Intel Flash Descriptor, you can insert up to four (4) commands on a list
within, called *FLILL*; not yet documented, but any SPI command listed here
would no longer work during internal flash operations. For example, you could
use it to disable certain erase/write commands. You could also use it to
disable *reads*.

PRx registers
-------------

Protected Range registers are available on Intel platforms, to disable flash
writes. This is not yet documented, and it varies per platform.
