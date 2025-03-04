---
title: ThinkPad T440p external flashing
---

Introduction
============

Read the [Ivybridge/Haswell common guide](ivy_has_common) if you want more information.
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

Start by removing the back cover screws and the main battery.\
<img tabindex=1 src="https://av.libreboot.org/board/t440p/t440p_back.jpg" /><span class="f"><img src="https://av.libreboot.org/board/t440p/t440p_back_orig.jpg" /></span>

You can then remove the back cover by sliding it off.
Next you need to:

+ Unplug the cmos battery
+ Unplug and unroute the fan cable
+ Unplug and unroute the black LED cable
+ Remove all visible screws

*Note: the ultrabay screw will loosen, but not come out of the assembly*\
<img tabindex=1 src="https://av.libreboot.org/board/t440p/t440p_nocover.jpg" /><span class="f"><img src="https://av.libreboot.org/board/t440p/t440p_nocover_orig.jpg" /></span>

Now you can pull up around the sides of the bottom assembly to release it.
Pull it upwards and lift it open to the front of the machine like a clamshell.
Make sure not to break the wires connecting the assembly to the rest of the machine.\
<img tabindex=1 src="https://av.libreboot.org/board/t440p/t440p_open.jpg" /><span class="f"><img src="https://av.libreboot.org/board/t440p/t440p_open_orig.jpg" /></span>

You should now be able to see the two flash chips near the RAM.\
<img tabindex=1 src="https://av.libreboot.org/board/t440p/t440p_chipLocation.jpg" /><span class="f"><img src="https://av.libreboot.org/board/t440p/t440p_chipLocation_orig.jpg" /></span>

You can now proceed to [flashing](/docs/install/spi.html) this machine.

`thinkpad_acpi` issues {#thinkpad-acpi}
---------------------------------------

It has been reported by that `thinkpad_acpi` does not load correctly on the T440p.

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
