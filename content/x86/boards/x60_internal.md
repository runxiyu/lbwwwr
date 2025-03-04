---
title: ThinkPad X60/X60T/T60 internal flashing
---

There's an exploit that allows flashing internally. Does not work if there's a
BIOS password set at boot.

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

