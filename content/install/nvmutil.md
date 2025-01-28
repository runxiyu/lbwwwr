---
title: nvmutil manual
x-toc-enable: true
---

With this software, you can change the MAC address inside GbE regions
on any system that uses an Intel Flash Descriptor.

This is the reference documentation for `nvmutil`, but an automated script
using nvmutil is available for ivy/sandybridge and haswell hardware, when
inserting vendor files, which you can use to change the MAC address. See:

[docs/install/ivy_has_common.md](ivy_has_common)

You can use the documentation below, if you wish to use `nvmutil` manually.
Continue reading...

Introduction
============

This is the manual for `nvmutil`, included in the Libreboot,
build system (lbmk) under `util/nvmutil/`. This program lets you modify
the MAC address, correct/verify/invalidate checksums,
swap/copy and dump regions on Intel PHY NVM images,
which are small binary configuration files that go
in flash, for Gigabit (ethernet) Intel NICs.

**Please [install build dependencies](../build/) before you do this.**

This software is largely targeted at coreboot users,
but it can be used on most modern Intel systems, or
most systems from about 2008/2009 onwards.

NOTE: Libreboot X200/X200T/X200S/T400/T400S/T500/W500/R400
users should know that this software does *not*
replace `ich9gen`, because that program generates entire
ICH9M IFD+GbE regions, in addition to letting you set the
MAC address. *This* program, `nvmutil`, can *also* set
the MAC address on those machines, but it operates on a
single GbE dump that is already created.

This program is operated on dumps of the GbE NVM image,
which normally goes in the boot flash (alongside BIOS/UEFI
or coreboot, IFD and other regions in the flash). The first
half of this README is dedicated to precisely this, telling
you how to dump or otherwise acquire that file; the second
half of this README then tells you how to operate on it,
using `nvmutil`.

Automatic MAC address changer
-----------------------------

**Please [install build dependencies](../build/) before you do this.**

Instead of running nvmutil manually, like below, you can
also use the inject command, like so (examples):

	./mk inject libreboot-RELEASE_targetname.tar.xz
	./mk inject libreboot-RELEASE_targetname.tar.xz setmac
	./mk inject libreboot-RELEASE_targetname.tar.xz setmac 00:1f:16:00:11:22
	./mk inject libreboot-RELEASE_targetname.tar.xz setmac 00:??:16:0?:1?:22
	./mk inject libreboot-RELEASE_targetname.tar.xz setmac restore

This writes the MAC address on the GbE region of the image. You must do this
on the tarball, from the ROM image release archives, and then extract the
archive.

These same commands also [download/insert certain vendor files](ivy_has_common)
if needed, on the given board.

Without argument after the tarball, it behaves the same as `setmac`. If `setmac`
is provided without argument, or no argument is given, the MAC address is
randomised. Otherwise, you can specify an arbitrary address.

The `?` character is random, and you can specify that any of them be random,
while setting others (or all of them) arbitrarily.

The `restore` option restores the original one. The command works by using a
reference GbE image file present in Libreboot's build system, for the given
motherboard.

How to download newer versions
==============================

Simply pull down the latest changes in `lbmk.git`. The `nvmutil`
software is now part of lbmk, since 17 November 2022.

More info about git:

* <https://git-scm.com/>

Context
=======

On many Intel systems with an IFD (Intel Flash Descriptor), the
Intel PHY (Gigabit Ethernet) stores its configuration, binary
encoded, into a special region of the main boot flash, alongside
other flash regions such as: IFD, ME, BIOS.

This includes many configurations, such as your MAC address.
The purpose of nvmutil project, is precisely to allow you to change your
MAC address. Many other useful features are also provided.

Intel defines this as the *Gigabit Ethernet Non-Volative Memory* or
just *NVM* for short. It is a 128-byte section, consisting of 64
words that are 2 bytes, stored in little-endian byte order.

Newer Intel PHYs define an *extended* area, which starts
immediately after the main one, but the `nvmutil` program
does not modify or manipulate these in any way.

The final word in the NVM section is the *checksum*; all words
must add up, truncated, to the value `0xBABA`. The hardware
itself does not calculate or validate this, and will in
fact work nicely, but software such as Linux will check
that this is correct. If the checksum is invalid, your
kernel will refuse to make use of the NIC.

This NVM section is the first 128 bytes of a 4KB region in flash.
This 4KB region is then repeated, to make an 8KB region in
flash, known as the *GbE region*. In `nvmutil`, the first part
is referred to as *part 0* and the second part as *part 1*.

Known compatible PHYs
---------------------

TODO: write a full list her ofe what actual PHYs are known to work.

It's probably all of them, but some newer ones might have
changed the standard by which they are configured. This
program actively avoids working on files that have
invalid checksums, on most commands, precisely so that
the user does not inadvertently use it on incompatible
files; it is assumed that intel would later change the
file size and/or checksum value and/or checksum location.

How to obtain the GbE file
==========================

The chip containing your BIOS/UEFI firmware (or coreboot) has
it, if you have an Intel PHY for gigabit ethernet.

The sections below will teach you how to obtain the GbE file,
containing your NIC's configuration. This is the part that
many people will struggle with, so we will dedicated an
entire next section to it:

Use flashprog
------------

**NOTE: Libreboot standardises on [flashprog](https://flashprog.org/wiki/Flashprog)
now, as of 27 January 2024, which is a fork of flashrom.
The reason why was explained, in
the [Libreboot 20240225 release](../../news/libreboot20240225.md#flashprog-now-used-instead-of-flashrom)**

If you wish to operate on the GbE section that's already
flashed, you should *dump* the current full ROM image.
If you already have a ROM image, you do not need to dump
it, so you can skip this section.

Download flashprog here:

* <https://flashprog.org/>

Using recent flashprog versions, you can extract this region. If
your regions are unlocked, you can run flashprog on the target
system, like so:

	flashprog -p internal -r rom.bin

If your system has two flash chips, the GbE region is usually
stored on SPI1 (not SPI2). Otherwise, it may be that you have
a single-flash setup. In that case, it's recommended to dump
both chips, as `spi1.rom` and `spi2.rom`; you can then cat
them together:

	cat spi1.rom spi2.rom > rom.bin # WARNING: see note below

**WARNING: After concatenating the files, please ensure that you did so in
the correct order. In `hexdump -C rom.bin` you can check for the Intel Flash
Descriptor near the start of the file, for the bytes `5a a5 f0 0f`. You may
alternatively attempt extraction with `ifdtool -x rom.bin`, adding
the `--platform OPTION` option if needed, based on output from `--help` if
you need to (it lists platform strings for certain newer Intel platforms). If
ifdtool extraction fails, then that is another indication that you did not
cat the files correctly.**

If your GbE region is locked (per IFD settings), you can dump
and flash it using external flashing equipment. The Libreboot
project has a handy guide for this; it can be used for reading
from and writing to the chip. See:

* <https://libreboot.org/docs/install/spi.html>

If you're using an external programmer, the `-p internal`
option should be changed accordingly. Read flashprog
documentation, and make sure you have everything
properly configured.

Use ifdtool
-----------

NOTE: This has only been tested on systems that use IFDv1
(Intel Flash Descriptor, version 1). This distinction, between
v1 and v2, is made in the `ifdtool` source code, which you
should read if you're interested. Intel`s v2 specification
has more regions in it, whereas v1 systems usually
defined: IFD, GbE, PD, ME and BIOS regions.

The `ifdtool` program is a powerful tool, allowing you to
manipulate Intel Flash Descriptors. It's part of coreboot,
available in the `coreboot.git` repository
under `util/ifdtool/`. Just go in there and build it
with `make`, to get an ifdtool binary.

To make internal flashing possible later on, you might do:

	ifdtool --unlock rom.bin # READ THE WARNING BELOW FIRST

**WARNING: On ThinkPad T480/T480s and OptiPlex 3050 Micro, do this instead:**

	ifdtool --platform sklkbl --unlock rom.bin

Running this command will create a modified image,
named `rom.bin.new`. This file will have all regions set
to read-write, per configuration in the Intel Flash Descriptor.

Note: if you want the original image to be modified, without needing to
keep track of `rom.bin.new` as mentioned above, use the -O switch. For example,
repeating the above command:

	ifdtool --unlock rom.bin -O rom.bin

(add the `--platform` option if you need to)

In addition to unlocked regions, you may wish to *neuter* the
Intel Management Engine, removing all the nasty spying features
from it, using `me_cleaner`. See:

* <https://github.com/corna/me_cleaner>
* Also available in `coreboot.git`, undir `util/`

The `me_cleaner` program is outside the scope of this
article, so you should read their documentation.

Now run this:

	ifdtool -x rom.bin # For T480/3050micro, add: --platform sklkbl

Several files will be created, and the one you need to
operate on is named `flashregion_3_gbe.bin` so please
ensure that you have this file.

Read the notes below about how to use the `nvmutil` program,
operating on this file. When you're done, you can insert the
modified GbE file back into your ROM image, like so:

	ifdtool -i gbe:flashregion_3_gbe.bin rom.bin  # For T480/3050micro, add: --platform sklkbl

This will create the file `rom.bin.new`, which contains
your modified GbE section with the NVM images inside; this
includes your MAC address.

Refer to flashprog documentation. You may flash the new ROM
like so, if running on the same system and the regions are
read-write:

	flashprog -p internal -w rom.bin.new

Newer versions of flashprog support flashing just the specified
region, like so:

	flashprog -p internal --ifd -i gbe -w rom.bin.new

**WARNING: If using `--ifd` in flashprog, note that flashprog probably doesn't
have anything similar to the `--platform` option in ifdtool. Therefore, you
way wish to specify the regions manually. You can do this quite simply, by:**

	ifdtool -f layout.txt rom.bin  # For T480/3050micro, add: --platform sklkbl

and instead of `--ifd` in flashprog, use:

	flashprog -p internal -l layout.txt -i gbe -w rom.bin.new

If you're running flashprog from host CPU on the target
system, and it's dual flash, you can just flash the
concatenated image, which you created earlier by running
the `cat` program; dual-IC flash configurations appear to
your operating system as one large flash area, as though
it were a single chip.

If you're using an external programmer, you should change
the `-p internal` parameter to something else. In this
situation, you should re-split the file accordingly, if
you have a dual-IC flash set, like so:

	dd if=rom.bin.new of=spi2.rom bs=1M skip=8 # WARNING: see note below
	dd if=rom.bin.new of=spi1.rom bs=1M count=8 # WARNING: see note below

**WARNING: The commands above assume SPI1 is 8MB and SPI2 is 4MB, making 12MB
total. Please adapt accordingly, for your own configuration.**

These files would then be flashed externally, separately,
using an external programmer.

The *above* example (using `dd`) is for setups with 12MB
flash, where you have 8MB as SPI1 and 4MB as SPI2. SPI1
would contain the IFD, and SPI2 is the upper flash area
containing your bootblock; GbE is probably located in
SPI1. You should adjust the above parameters, according
to your configuration.

How to compile source code
==========================

The nvmutil source code is located under `util/nvmutil/` in the
lbmk repository. A makefile is included there, for you to build an
executable.

The nvmutil programs will work just fine, on any modern BSD Unix operating
system, or unix-like system such as Linux.

You must be sure to have toolchains installed, for
building; a normal libc, C compiler and linker should be enough.
GCC and LLVM have all these things included, so use whichever one
you want.

If the code is compiled on OpenBSD,
[pledge(2)](https://man.openbsd.org/pledge.2) is used.
This is done with an `ifdef` rule, so that the code still compiles
on other systems. When the `dump` command is specified, pledge
will use these promises: `stdio rpath`. When any other command
is used, these pledge promises will be used: `stdio wpath`.

The `nvmutil` software has been build-tested on `Clang`, `GCC`
and `tcc`. Only standard library functions (plus `err.h`) are
used, so you don't need any extra libraries.

How to compile it
-----------------

First, ensure that the current working directory is your
copy of the nvmutil source code!

You may run this in your terminal:

	make

This will result in a binary being created named `nvm`.
Install this to wherever you want, such as `/usr/bin` (or
whatever is in your `$PATH` for userspace programs).

TODO: Add `make install` to the Makefile, portably.

How to use nvmutil
==================

You run it, passing as argument the path to a file, and you run
commands on that file. This section will tell you how to
perform various tasks, by using these commands.

In these examples, it is assumed that you have installed
the `nvm` binary to somewhere in your `$PATH`. If you haven't
done that, you could still run it in cwd for instance:

	./nvm bla bla bla

Exit status
-----------

The `nvmutil` program uses `errno` extensively. The best error
handling is done this way, the Unix way. Error handling is extremely
strict, in nvmutil; on program exit, the errno message is printed (if not
zero) and the value of errno is returned (upon exit from `int main`).

The `main` function always returns `errno`, no matter what. This style
of programming (set errno and return) is a very old fashioned way of
doing things, and in many cases it is the most *correct* way.

This is why we say `zero status` and `non-zero status` in Unix
programs, when we talk about exit status. Zero is success, and
anything above zero is fail; errno is zero by default, unless
set, and it will always be set to a value above zero (if set).

All commands (except `dump`) require read and write access. The `dump`
command only requires read access on files. Where sufficient permission
is not given (read and/or write), nvmutil will exit with non-zero status.

Non-zero status will also be returned, if the target file is *not*
of size *8KB*.

Additional rules regarding exit status shall apply, depending on
what command you use. Commands are documented in the following sections:

Change MAC address
------------------

The `nvm` program lets you change the MAC address. It sets
a valid checksum, after changing the MAC address. This program
operates on *both* NVM parts, but it will only modify a given
part if the existing checksum is correct. It will exit with zero
status if at least one part is modified; otherwise, it will
exit with non-zero status.

The following rules are enforced in code:

* User cannot specify multicast addresses
* User cannot specify `00:00:00:00:00:00`
* When generating random addresses, if the right
  most nibble of the left-most byte is `?` (random),
  nvmutil will (in code) force the generated MAC
  address to be local (not global), and will prevent
  a multicast address from being generated.

A multicast address is invalid because it represents
multiple devices; you must specify a unicast address.
A global address is one uniquely assigned by the vendor,
and a local address is an overridden one. You *can* set
global MAC addresses in nvmutil, for example if you are
simply copying what was officially assigned to your NIC,
you can do that. For example, if your MAC address
was `00:de:ad:be:ef:69` as assigned by the manufacturer,
which is a global unicast MAC address, you would type:

	nvm gbe.bin setmac 00:de:ad:be:ef:69

How to use (the MAC address in just an example):

	nvm gbe.bin setmac 00:de:ad:be:ef:00

You can also set random MAC addresses:

	nvm gbe.bin setmac ??:??:??:??:??:??

In this example, every character is random. However, you
can mix and match random characters with static ones. For
example:

	nvm gbe.bin setmac 00:1f:16:??:??:??

You can also pass it without a MAC address:

	nvm gbe.bin setmac

If you only type `setmac` without specifying a MAC address,
it will do the same thing as `setmac ??:??:??:??:??:??`.

This will set the last three bytes randomly, while the
MAC address would begin with `00:1f:16`.

The *reason* nvmutil doesn't alter a part with an existing
invalid checksum, is precisely so that if the algorithm
changes in future Intel PHYs, nvmutil will just fail and
not modify your file. This is because the checksum would
then be invalid, at all times. However, correct NVM parts
with otherwise invalid checksums do exist, and can be
corrected if you use the `setchecksum` command
in `nvmutil`. It is common for vendor gbe files to contain
one valid part and one invalid part, per checksum rules.

Verify checksums (and show MAC addresses)
-----------------------------------------

This command *only* requires *read* access on files.

The `nvm` program can show a hexdump of both NVM parts, and
tell you whether each one is valid (as per checksum calculation).
It also prints the MAC address from each part.

How to use:

	nvm gbe.bin dump

NOTE: This will exit with zero status if at least one part
contains a valid checksum. If both parts are invalid, nvmutil
will exit with non-zero status.

Copy part
---------

This command requires read *and* write access on files.

The `nvm` program can copy one NVM part to another. It copies
the *entire* 4KB part, within the 8KB file.

Overwrite part 0 with the contents of part 1:

	nvm gbe.bin copy 1

Overwrite part 1 with the contents of part 0:

	nvm gbe.bin copy 0

NOTE: If the part to be copied has a bad checksum, no operation
will be performed, and nvmutil will exit with non-zero status.
Otherwise, it will (if all other conditions are met) exit with
zero status.

Swap parts
----------

This command requires read *and* write access on files.

The `nvm` program can swap both 4KB parts in the GbE
file. It does this, via simple XOR swaps.

How to use:

	nvm gbe.bin swap

NOTE: This operation will be aborted if BOTH checksums
are invalid. This is to guard against accidentally
using `nvmutil` on the wrong file.

If *at least one* part is valid, nvmutil will return
with zero exit status. If both parts are invalid, it will
return non-zero.

Set valid checksum
------------------

This command requires read *and* write access on files.

The `nvm` program can calculate and sets a valid checksum, on
the desired NVM part. Usage:

Fix part 0:

	nvm gbe.bin setchecksum 0

Fix part 1:

	nvm gbe.bin setchecksum 1

*WARNING: NO validity checks are performed. This will simply
set the checksum. There is no feasible way to guard against
use on the wrong file, unlike with the other commands. Please
make SURE you're running this on the correct file!*

Set invalid checksum
--------------------

This command requires read *and* write access on files.

The `nvm` program can intentionally set an invalid checksum, on
the desired NVM part. Usage:

Invalidate part 0:

	nvm gbe.bin brick 0

Invalidate part 1:

	nvm gbe.bin brick 1

NOTE: If the part already has an invalid checksum, no operation
will be performed, and nvmutil will exit with non-zero status.
This is to guard against `nvmutil` being used on the wrong file.

This may be desirable, if you've made modifications to both
parts but you want to guarantee that only one of them is
used. Also, the `setmac` command will only operate on
parts that already have a valid checksum, so you could
run `brick` before running `setmac` (or run it afterwards).

The Linux kernel's `e1000` driver will refuse to initialise
Intel gigabit NICs that don't have a valid checksum. This
is software-defined, and not enforced by the hardware.

History
=======

A historical change log
is included at [docs/install/nvmutilimport.md](nvmutilimport),
but this simply lists historical changes to nvmutil when it
was a separate project. Future changes to nvmutil can be found by
running `git log util/nvmutil` in `lbmk.git`. No more changes
to `nvmutilimport.md` will be applied, but future releases of
Libreboot announced in `news/` will mention any nvmutil changes.

The *older* `nvmutils` is still available, for reference. See:

* <https://notabug.org/osboot/nvmutils/>

The `nvmutil` software is a clean re-write of `nvmutils`,
which is compiled to a single binary instead of multiple
binaries. It contains many fixes and enhancements that
are absent in the *original* `nvmutils` programs. The
old `nvmutils` project has been deprecated, and
abandoned. All new development shall now be performed
on `nvmutil`.

Libreboot's version of nvmutil is located at `util/nvmutil` in
the `lbmk.git` repository. The original nvmutil project, when
it was part of osboot, is still available (for reference) here:

* <https://notabug.org/osboot/nvmutil/>

Please use the latest nvmutil version. The above information is provided
only for reference.
