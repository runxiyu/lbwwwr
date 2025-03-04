---
title: Generic Internal Flashing Instructions
toc: true
---

This applies to the x86 machines. Chromebook users should refer to the
[Chromebook](../chromebook/) page.

Internal flashing means that you boot Linux or BSD on the target machine, and
run `flashprog` there, flashing the machine directly. This is usually only
possible if you are already running Libreboot and you have not enabled flash
write protection. If you can't flash internally, you must [flash externally
with SPI](../spi).

All commands presented below shall be run as root (e.g. via `sudo`).

## Do these first

* [Check your motherboard's page](../install/#which-boards-are-supported-by-libreboot) 
  for special notes.
* Always remember to [insert vendor files](../insert_vendor_files/) when using
  release tarballs.
* [Disable `/dev/mem` protections](../devmem/) first.

## Finding the correct ROM image

Find the corresponding ROMs for your motherboard and chosen payload.
If they come in multiple sizes (e.g. `8mb` and `12mb`, use `flashprog
-p internal` to determine the size of your chip and use the
corresponding one.)

<!-- TODO: Document what to do for boards with multiple chips. -->

## Dumping the current flash contents to a file

You should usually back up your flash contents first so you could
restore it later if needed:

```
flashprog -p internal:laptop -r dump_before_flashing.bin
```

It is also a good idea to make multiple dumps and compare them, just
to make sure that you have a reliable connection to your flash chip.
Assuming a POSIX-compatible shell:

```
for i in $(seq 3)
do
	flashprog -p internal:laptop -r dump_before_flashing_"$i".bin
done
sha512sum dump_before_flashing_?.bin
```

If any of the checksums are mismatched, you have an unreliable connection
to your flash chip and should **not** flash.

## Writing a ROM file to the flash

```
flashprog -p internal:laptop -w the_file_you_want_to_flash.rom 
```

## Troubleshooting: flashprog safety checks

**Please first ensure that you are using the correct ROM file for your
machine and that you have correctly [inserted vendor
files](../insert_vendor_files/) if your board requires so.** If you are
indeed sure, then:

```
flashprog -p internal:laptop=force_I_want_a_brick,boardmismatch=force -w the_file_you_want_to_flash.rom
```

Sometimes this is necessary because flashprog and coreboot change a lot
and there are falase alarms in their safety checks.

## Having other issues?

If your ROM has been written incompletely/unsuccessfully, **do not
reboot**. You may try to join our community channels for help.
