---
title: Gigabyte GA-G41M-ES2L Desktop
---

<div class="specs">
<center>
GA-G41M-ES2L
</center>

| ***Specifications***       |                                                |
|----------------------------|------------------------------------------------|
| **Manufacturer**           | Gigabyte                                       |
| **Name**                   | GA-G41M-ES2L                                   |
| **Released**               | 2009                                           |
| **Chipset**                | Intel G41                                      |
| **CPU**                    | Intel Core 2 Extreme/Quad/Duo, 
                                        Pentium Extreme/D/4 Extreme/4/Celeron |
| **Graphics**               | Integrated                                     |
| **Display**                | None.                                          |
| **Memory**                 | Up to 8GB (2x4GB DDR2-800)                     |
| **Architecture**           | x86_64                                         |
| **Original boot firmware** | AWARD BIOS                                     |
| **Intel ME/AMD PSP**       | Present. Can be disabled                       |
| **Flash chip**             | 2x8Mbit                                        |

```
W+: Works without vendor firmware; 
N: Doesn't work; 
W*: Works with vendor firmware; 
U: Untested; 
P+: Partially works; 
P*: Partially works with vendor firmware
```

| ***Features*** |                                       |
|----------------|---------------------------------------|
| **Internal flashing with original boot firmware** | W+ |
| **Display**                                       | -  |
| **Audio**                                         | W+ |
| **RAM Init**                                      | P+ |
| **External output**                               | P+ |
| **Display brightness**                            | -  |

| ***Payloads supported***  |       |
|---------------------------|-------|
| **GRUB**              | Slow! |
| **SeaBIOS**               | Works |
| **SeaBIOS with GRUB** | Works |
</div>

## Introduction

This is a desktop board using intel hardware (circa \~2009, ICH7
southbridge, similar performance-wise to the ThinkPad X200. It can make
for quite a nifty desktop. Powered by libreboot.

As of Libreboot release 20221214, only SeaBIOS payload is provided in ROMs
for this board. According to user reports, they work quite well. GRUB was
always buggy on this board, so it was removed from lbmk.

IDE on the board is untested, but it might be possible to use a SATA HDD
using an IDE SATA adapter. The SATA ports do work, but it's IDE emulation. The
emulation is slow in DMA mode sia SeaBIOS, so SeaBIOS is configured to use PIO
mode on this board. This SeaBIOS configuration does not affect the Linux kernel.

You need to set a custom MAC address in Linux for the NIC to work.
In /etc/network/interfaces on debian-based systems like Debian or
Devuan, this would be in the entry for your NIC:\
hwaddress ether macaddressgoeshere

Alternatively:

	cbfstool libreboot.rom extract -n rt8168-macaddress -f rt8168-macaddress

Modify the MAC address in the file `rt8168-macaddress` and then:

	cbfstool libreboot.rom remove -n rt8168-macaddress
	cbfstool libreboot.rom add -f rt8168-macaddress -n rt8168-macaddress -t raw

Now you have a different MAC address hardcoded. In the above example, the ROM
image is named `libreboot.rom` for your board. You can find cbfstool
under `cbutils/` after running the following command
in the build system:

	./mk -d coreboot TREENAME

You can learn more about using the build system, lbmk, here:\
[libreboot build instructions](../build/)

## RAM

**This board is very picky with RAM. If it doesn't boot, try an EHCI debug
dongle, serial usb adapter and null modem cable, or spkmodem, to get a
coreboot log to see if it passed raminit.**

Kingston 8 GiB Kit  KVR800D2N6/8G with Elpida Chips E2108ABSE-8G-E

this is a 2x4GB setup and these work quite well, according to a user on IRC.

Nanya NT2GT64U8HD0BY-AD with 2 GiB of NT5TU128M8DE-AD chips works too.

Many other modules will probably work just fine, but raminit is very picky on
this board. Your mileage *will* fluctuate, wildly.

## MAC ADDRESS

NOTE: due to a bug in the hardware, the MAC address is hardcoded in
coreboot. Therefore, you must set your own MAC address in your
operating system.

Use [macchanger](http://www.gnu.org/software/macchanger) in your
distro, to set a valid MAC address. By doing this, your NIC should
work nicely.

## Flash chip size {#flashchips}

Use this to find out:

	flashprog -p internal

## Flashing instructions {#clip}

Refer to [spi.md](spi) for how to set up an SPI programmer for
external flashing. *You can only externally reprogram one of the chips
at a time, and you need to disable the chip that you're not flashing,
by connecting 3v3 to /CS of that chip, so you will actually need second test
clip or IC pin mini grabber.*

NOTE: on GA-G41M-ES2L, the flash shares a common voltage plane with the
southbridge, which draws a lot of current. This will cause under-voltage on
most SPI flashers, so do not use the 3.3V rail from your flasher. Do not
connect +3.3V to the chip. Instead, turn the board on and then turn it off by
holding the power button. With the board powered down, but plugged in, there
will be a 3.3V supply from the ATX PSU. You can then flash, but DO NOT connect
the +3.3V supply from your SPI flasher!

NOTE: You should use a resistor in series, between 1K to 10K ohms, for the 3.3v
connection to the CS pin. This is to protect from over-current.

Here is an image of the flash chip:\
![](https://av.libreboot.org/ga-g41m-es2l/ga-g41m-es2l.jpg)

Internal flashing is possible. Boot with the proprietary BIOS and
Linux. There are 2 flash chips (one is backup).

Flash the first chip:

	./flashprog -p internal:dualbiosindex=0 -w libreboot.rom

Flash the second chip:

	./flashprog -p internal:dualbiosindex=1 -w libreboot.rom

NOTE: you can still boot the system with just the main flash chip
connected, after desoldering the backup chip. This has been tested while
libreboot was already installed onto the main chip.

NOTE: If you don't flash both chips, the recovery program from the default
factory BIOS will kick in and your board will be soft bricked. Make sure that
you flash both chips!

