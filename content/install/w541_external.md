---
title: ThinkPad W541/W540 external flashing
x-toc-enable: true
---

NOTE: The same image for W541 also works on the W540, as the motherboard is
identical.

Introduction
============

**NOTE: Libreboot standardises on [flashprog](https://flashprog.org/wiki/Flashprog)
now, as of 27 January 2024, which is a fork of flashrom.
The reason why was explained, in
the [Libreboot 20240225 release](../../news/libreboot20240225.md#flashprog-now-used-instead-of-flashrom)**

**[PLEASE READ THESE INSTRUCTIONS BEFORE INSTALLING](ivy_has_common), OR
YOU MAY BRICK YOUR MACHINE!! - Please click the link and follow the instructions
there, before flashing. For posterity,
[here is the link again](ivy_has_common).**

Read the [Ivybridge/Haswell common guide](/docs/install/ivy_has_common.html) if you want more information.
All of the following instructions assume that you've cloned lbmk and are operating from the
root of that project. To do so, run

	git clone https://codeberg.org/libreboot/lbmk
	cd lbmk

You can now follow the rest of the instructions.

Preparing a release Rom
-----------------------

**Please follow this prior to flashing, or you may brick your machine.**

Please [inject vendor files](ivy_has_common) prior to flashing. You can also
use this guide to change the built-in MAC address for your Intel Gigabit
Ethernet device; doing so is advisable, because otherwise you will have a
default, generic MAC address.

Splitting The Rom
-----------------

You can use `dd` to easily split your rom into the two separate portions for
external flashing.

	dd if=libreboot.rom of=top.rom bs=1M skip=8
	dd if=libreboot.rom of=bottom.rom bs=1M count=8

Flash the top chip with top.rom, and tho bottom chip with bottom.rom.
Don't worry about knowing which chip is which on a standard setup; flashprog will let you know if the 
image size is incorrect for the chip you're flashing.

Disassembly
-----------

No disassembly pics yet. The [W540/T540p hardware maintenance manual](https://thinkpads.com/support/hmm/hmm_pdf/t540p_w540_hmm_en_sp40a26003_01.pdf)
also applies to W541.

This shows disassembly. When you disassemble, and get to flashing, please note:

MOSI/MISO lines are linked between the two flash ICs, at zero ohms. This is OK
for internal flashing and normal operation, because the PCH turns each chip on
or off as needed, by controlling each IC's own *chip select* pin, which is
pin 1.

When you wire the clip, to flash one of the ICs, the same voltage rail also
turns on the other IC and the other IC's own chip-select is in a *floating*
state, which in practise means *random logic state*; in other words, the other
flash may or may not be active, randomly.

This means that external flashing would not ordinarily work, unless you use
the following trick:

Use a *test hook* wired to VCC (+3.3v), to pull the other flash's chip-select
high. So: when flashing one of the two ICs, the other chip must have pin 1
connected to VCC. You can do this with the same 3.3v power source that you use
on pin 8 of the chip that you're flashing. Ideally you should pull the other
chip select high via 47ohm resistor, which should be enough to prevent damage
in the case of accidentally shorting the wrong pin.

Doing this means that you *disable* the chip fou're not flashing. It's very
important that you ensure only the one you want to flash is active, when using
an external flasher.

**This is not required for internal flashing. It is only required for
external flashing.**

If you do it right, the chips should flash reliably. This same trick must be
used when flashing either of the chips.

You can now proceed to [flashing](/docs/install/spi.html) this machine.

`thinkpad_acpi` issues {#thinkpad-acpi}
---------------------------------------

It has been reported by a user that `thinkpad_acpi` does not load correctly on
the T440p. Since the W541/W540/T540p are also haswell machines, you may be
affected by this issue.

If you encounter this, check [this page](../../faq.md#thinkpad-acpi)
for details as to how to fix this.

Errata
======

NOTE: As of Libreboot releases from May 2024 onward, the Intel MRC is no longer
included for Haswell; MRC is a blob for raminit, but we now provide libre
raminit. The following targets no longer exist in the build system:

* `t440pmrc_12mb` (use `t440plibremrc_12mb` instead)
* `t440pbmrc_12mb` (use `t440plibremrc_12mb` instead)
* `w541mrc_12mb` (use `w541_12mb` instead)
* `w541bmrc_12mb` (use `w541_12mb` instead)
* `dell9020sff_12mb` (use `dell9020sff_nri_12mb` instead)
* `dell9020sffbmrc` (use `dell9020sff_nri_12mb` instead)
* `dell9020mt_12mb` (use `dell9020mt_nri_12mb` instead)
* `dell9020mtbmrc` (use `dell9020mt_nri_12mb` instead)

This is written as errata because some users may still be using older release
images but on the newer build system from May 2024 onward; you must use the
Libreboot 20240225 release if you want to inject MRC and so on, for these older
targets.

Libreboot's [binary blob reduction policy](../../news/policy) is very strict,
and states: if a blob can be avoided, it must be avoided. Therefore, the MRC
is removed on Haswell and Libreboot will only use the libre raminit (called
NRI, short for Native Ram Initialisation).
