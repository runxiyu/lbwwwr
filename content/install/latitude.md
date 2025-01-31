---
title: Flashing Libreboot on Dell Latitude laptops
x-toc-enable: true
---

All of the Dell Latitude models can be flashed internally, which means that
you do not need to disassemble them. You can do it from Linux/BSD, using the
instructions on this page.

Disable security before flashing
================================

**[PLEASE READ THESE INSTRUCTIONS BEFORE INSTALLING](ivy_has_common), OR
YOU MAY BRICK YOUR MACHINE!! - Please click the link and follow the instructions
there, before flashing. For posterity,
[here is the link again](ivy_has_common).**

Please also [disable /dev/mem protection](devmem), otherwise flashprog
and dell-flash-unlock won't work. You can re-enable the protections after
flashing.

Please also disable SecureBoot, if you're using a UEFI-based Dell Latitude.
Note that Libreboot does not currently implement UEFI on x86 platforms, but
you can set up [Secure libreBoot](../linux/grub_hardening) after flashing.

MAC address
===========

Make sure to set your own MAC address in the ROM image before flashing.
Please read the [nvmutil manual](nvmutil) which says how to do this.

Thermal safety
==============

**Thermal safety**: this machine shuts down very quickly, when the machine
exceeds 80c CPU temperature, which is far more conservative than on most
laptops (non-Dell ones), so you should make sure that your thermals are
excellent. More info available [here](../install/dell_thermal). This is a
known bug, but otherwise the machine will be mostly stable.

Machine-specific notes
======================

Latitude E6400
--------------

Vendor files not required for Dell Latitude E6400 if you have the Intel GPU.

If you have the Nvidia model, please use the `e6400nvidia_4mb` target, and
make sure to run the [inject script](ivy_has_common) prior to flashing.

E6400 nvidia issues
-------------------

See [issue 14](https://codeberg.org/libreboot/lbmk/issues/14#issuecomment-907758).

If using Linux on Nvidia GPU variants of E6400, please boot using `nomodeset`.
The `nv` drivers on BSD systems generally work, but can have severe performance
issues; use of a tiling window manager is recommended, on BSD systems, because
moving windows around can literally lag a lot otherwise, on most window managers.

dGPU variants
-------------

On everything except E6400, Libreboot only supports the variant with an Intel
GPU. Therefore, you must *only* purchase a Dell Latitude that has the Intel
graphics; even on E6400, this is good advice, due to issues with the Nvidia
GPU on E6400, documented later in this guide.

Internal flashing
=================

You can simply boot Linux/BSD, on the Dell Latitude you wish to flash, and
run `flashprog` from there, for Libreboot installation. Certain other steps
are also required, documented in the steps below:

You can flash Libreboot directly from the vendor (Dell) BIOS, without taking
the machine apart. It can be done entirely from Linux/BSD.

**NOTE (15 October 2023): The util is now called `dell-flash-unlock`, but it
was previously called `e6400-flash-unlock`. Links have been updated.**

Check `util/dell-flash-unlock` in the `lbmk.git` repository, or in release
archives for Libreboot releases from 20230423 onwards.

Go in there:

	cd util/dell-flash-unlock
	make

**With this program, you can unlock the flash in such a way where everything
is writeable. Information about how to use it is in the `README.md` file which
is included in that program's directory, or you can [read it online](https://browse.libreboot.org/lbmk.git/plain/util/dell-flash-unlock/README.md)**

**Please make sure that you do fully read the README, because it contains
useful information.**

Literally just run that program, and do what it says. You run it once, and shut
down, and when you do, the system brings itself back up automatically; on some
systems, you have to boot the machine back up manually, after power down.  Then
you run it and flash it unlocked. Then you run it again. The source code is
intuitive enough that you can easily get the gist of it; it's writing some EC
commands and changing some chipset config bits. The EC on this machine is
hooked up to the `GPIO33` signal, sometimes called `HDA_DOCK_EN`, which sets
the flash descriptor override thus disabling any flash protection by the IFD.
It also bypasses the SMM BIOS lock protection by disabling SMIs, and Dell's
BIOS doesn't set any other type of protection either such as writing to
Protected Range registers.

MAKE SURE to back up the original firmware image first:

	flashprog -p internal -r factory.rom

When you flash it, you can use this command:

	flashprog -p internal -w libreboot.rom

Where `libreboot.rom` is your Dell Latitude ROM. *Make sure* it's the right
one. If flashprog complains about multiple flash chips detected, just pick one of them (doesn't matter which one). On *most* Dell machines, the most correct
would probably be this option in flashprog: `-c MX25L3205D/MX25L3208D`.

So:

	flashprog -p internal -w libreboot.rom -c MX25L3205D/MX25L3208D

When you see flashprog say `VERIFIED` at the end, that means the flash was
successful. If you don't see that, or you're unsure, please [contact the
Libreboot project via IRC](../../contact).

External flashing
=================

General guidance
----------------

Machine-specific disassembly instructions not provided, but you can find
the hardware maintenance manual for your Latitude module online. Just search
for it. The flash chips(s) is/are usually under the keyboard/palmrest. Near
to the PCH/southbridge.

Note that you often have to provide a high current for VCC, because the flash
chip will share a common voltage rail with other power-hungry ICs on the
board, or the flash ICs will share a common MISO/MOSI line without resistance,
with chip selects controlled by PCH, and/or the PCH itself might be live while
flashing - so you need to set the drive strength high.

Take stock of the above advice, which is also mentioned on the external SPI
flashing guide.

Please read the [external SPI flash guide](spi)

External flashing is usually not required, on these machines.

Chip size guidance
------------------

SOme Dell Latitudes use a single flash chip, so you can
just use the ROM images as-is.

If there are two flash chips, you must split the ROM images. Check the silk
screen on the board, and the first chip might be labelled something like SPI1,
second one SPI2. Figure out which one is first.

Look at the part number on the chip and find the flash size for it. For example:
a 10MB flash might be 2MB for SPI1 and 8MB for SPI2, so you would do:

	dd if=libreboot.rom of=spi1.rom bs=1M count=2
	dd if=libreboot.rom of=spi2.rom bs=1M skip=2

Adapt accordingly, to the exact flash configuration on your machine. 16MB is
likely one chip. 12MB is usually SPI1 8MB and SPI2 4MB so you would do:

	dd if=libreboot.rom of=spi1.rom bs=1M count=8
	dd if=libreboot.rom of=spi2.rom bs=1M skip=8

If in doubt, just ask on Libreboot IRC.
