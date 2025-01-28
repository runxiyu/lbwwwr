---
title: Porting guide for new motherboards
---

**NOTE: Libreboot standardises on [flashprog](https://flashprog.org/wiki/Flashprog)
now, as of 27 January 2024, which is a fork of flashrom.
The reason why was explained, in
the [Libreboot 20240225 release](../../news/libreboot20240225.md#flashprog-now-used-instead-of-flashrom)**

NOTE: This page is largely Intel-centric, at present. It should be revised to
cover more vendors. [Patches welcome!](../../git)

This guide is intended for those with very little knowledge of firmware
in general and coreboot in particular.
Most boards in coreboot can be quite easily ported to libreboot.
You don't need any knowledge of a particular programming language or
technology in general to port a board.
If you want to make more major contributions to the build system,
please read the [main maintenance page.](/docs/maintain/index.html)

You will certainly need flashing equipment if you wish to follow this guide.
See the [flashing guide](/docs/install/spi.html) to find out what you'll need.

Coreboot is replacement firmware for the firmware chips on the printed
circuit board (PCB) of the machine in question.
Libreboot is a *distribution* of Coreboot.
You may be used to referring to your machine as *machine, device, laptop*
or it's name (ex: thinkpad t420).
Because we're targeting chips on the PCB, we refer to all of the above terms
synonymously as `board.`
The rest of this article will refer to the board you wish to port to
libreboot as `board.`

If `board` is not supported in coreboot then you need to start there first.
Libreboot developers will generally not port new boards to coreboot on request.
If you're not sure whether your board is in coreboot check the [coreboot table of hardware.](https://coreboot.org/status/board-status.html)

If you have determined that `board` is supported by coreboot, but is not
supported by libreboot, then follow the rest of this guide to try to port it yourself.
If you're still unable to port the board, or anything in this guide is
unclear, then contact libreboot developers.
The best way to get in touch is via [libreboot irc.](/contact.html#irc-chatroom)

Cloning lbmk
============

Before you try to get any work done, you'll need to clone the lbmk (libreboot make)
project.
To do so, you'll need to have git installed on your machine. You can then clone
the project.

	git clone https://codeberg.org/libreboot/lbmk

If you want more information on building lbmk see [the build instructions.](/docs/build/index.html)

Coreboot Config
===============

Coreboot payloads (GRUB, Seabios, etc) are built separately.
You therefore only need to focus on the coreboot config(s) for `board.`
All of these configs are stored under config/coreboot/`board`

The easiest way to start a new configuration for a given board is to copy an existing
configuration and make the necessary modifications.
For example, if one wanted to port the t420s, then the t420 config would be an excellent
starting point.

	cp -r config/coreboot/t420_12mb/ config/coreboot/t420s_12mb

You can then easily modify the existing coreboot configs for you board via lbmk.

	./mk -m coreboot t420s_12mb

This script will provide a curses interface through which you can easily modify the
necessary variables and settings.
The most important thing to change is `Mainboard.`
You must make sure that the motherboard definition in this config matches `board.`
For example, you would want to change lenovo/t420 to lenovo/t420s.
Selecting `exit` in the curses interface will prompt you to ask if you want to save your
changes, make sure to answer yes.
Note that you will generally have to go through this process twice, since there is
a corebootfb and txtmode config for each board (the script will handle this for you).

Now you can build and test the rom for `board.`
Once you have finished this, you can try flashing the resulting rom to your board as a test.

	./mk -b coreboot t420s_12mb

If you try to flash this rom and it fails, then there are two probable reasons:

1) CBFS size or ROM size is wrong
2) The vendor code (if required) is incompatible

Solutions to these problems follow in the proceeding sections.

Wrong CBFS and or ROM size
==========================

Different boards have different flash chip setups.
Generally, you have one or two flash chips with a combined size of 4-16MB.
Thankfully, flashprog will let you know the size of the flash chip you're flashing.
For example: when flashing an X230, you'll see that one chip is 8192, and the other is 4096.
The total rom size should therefore be set as 12MB.

The CBFS size depends directly on the size of the flash chip selected.
Make sure that your CBFS size is not larger than the maximum for your board.
CBFS sizes are stated as hex values, here is a table showing the correct maximums
for various rom sizes.

| ROM Size | CBFS size |
|:--------:|:---------:|
| 8MB      | 0x7E0000  |
| 12MB     | 0xBE0000  |
| 16MB     | 0xFE0000  |

Getting Help
============

Once you have tried everything above, you might find that the board still doesn't
work.
If that is the case, then you should contact libreboot developers for more help.
You can ping `leah` on irc or submit an issue on git.
In either case, make sure to include a detailed description of everything you
tried, and what exactly happened when you tried to flash the rom.
If your board is not supported in libreboot, then you can assume that our
developers don't have it.
You'll therefore be expected to test roms created by libreboot developers on
your own machine.

In the meantime, you can always externally flash a backup of your vendor rom
to keep your machine working while development progresses on your board.
