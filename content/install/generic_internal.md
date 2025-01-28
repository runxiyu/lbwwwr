---
title: Generic Internal Flashing Instructions
---

**This mainly applies to the x86 machines.** Chromebook users should refer to
the [Chromebook](../chromebook/) page.

Please check your motherboard's page for special notes first.

Internal flashing means that you boot Linux or BSD on the target machine, and
run `flashprog` there, flashing the machine directly.

**If you can't flash internally, you must [flash externally with SPI](../spi).**

Internal flashing is often unavailable with the factory firmware, but it is
*usually* possible when Libreboot is running (barring special circumstances).

## Inserting vendor files

Always remember to [insert vendor files](../insert_vendor_files/) when using
release tarballs.

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

