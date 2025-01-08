---
title: ich9utils
x-toc-enable: true
---

**THIS PAGE IS OBSOLETE. Releases after Libreboot 20230625 no longer include
ich9utils; instead, ICH9M descriptors and gbe nvm configurations are provided
pre-assembled. Coreboot's bincfg can regenerate them if you wish, and/or you
can modify the ifd file with coreboot's ifdtool. You can use nvmutil to modify
the GbE NVM MAC address**

**If all you want to do is change the MAC address, you might use `nvmutil`
instead. See: [nvmutil documentation](../install/nvmutil), or use
the [inject script](ivy_has_common).**

The documentation below is *still valid*, if you actually want to use ich9utils.
You can find it in older Libreboot releases, up to Libreboot 20230625. The only
modification that ich9gen permitted was to change the MAC address, and ifdtool
can set read-only mode via `--unlock` argument on a ROM, so ich9utils was a
moving (read: not moving) part that basically did the same thing as providing
static images.

The initial plan was to rewrite ich9utils in a cleaner coding style, like that
used in nvmutil, but then it was decided instead that ich9utils would be
scrapped.

Anyway, ich9utils documentation:

Introduction
============

The `ich9utils` utility from Libreboot is used to manipulate Intel Flash
Descriptors for ICH9M on laptops such as ThinkPad X200 or T400. Specifically,
the `ich9gen` utility can generate 12KiB descriptor+GbE files for inserting
into the start of a ROM, where everything after that is the BIOS region. These
are special descriptors with the Intel ME region disabled, and Intel ME itself
fully disabled.

ich9utils is handled by the `lbmk` (libreboot-make) build system, but the code
itself is hosted in a separate repository. You can check the Git repositories
linked on [../../git.md](../../git) if you wish to download and use it.

It is very *uncommon*, on GM45/ICH9M systems, to have an Intel Flash Descriptor
and GbE but *without* an Intel ME. On *most* of these systems (without libreboot,
Libreboot or coreboot), there is either descriptor+GbE+ME+BIOS or just BIOS,
where on systems with just the BIOS region an Intel GbE NIC is not present.
In libreboot (and Libreboot), we provide descriptor+GbE images with Intel ME
disabled and not present in the ROM; this enables the Intel GbE NIC to be used,
while not having an Intel ME present. A consequence of this is that the
malicious features of ME (such as AMT) are not present, however the Intel ME
also handles TPM which is therefore disabled in this setup.

NOTE: If you accidentally flash a ROM *without* descriptor+GbE, it will still
work but the Intel GbE NIC will be dysfunctional. If you do that, just boot up
and correct the problem (and you can use a USB/cardbus/expresscard NIC or WiFi
for internet if necessary). That is the *main reason* why `ich9utils` was
written in the first place; it was already very possible to boot without an
Intel ME by simply not having a descriptor or anything in ROM, just coreboot.
The purpose of `ich9gen` specifically is to get the Intel GbE NIC working but
without the Intel ME being enabled!

ICH9 based systems were the last generation that could be booted *without* an
Intel ME. Future platforms (such as Sandybridge and Ivybridge) require an
Intel ME since the ME on those platforms also handles power management and
some minor initialization functions. On ICH9 based systems (such as X200 or
T400) the Intel ME only handles AMT and TPM, and there's no 30 minute timer
(if you boot later platforms without an Intel ME and descriptor, or invalid
Intel ME firmware, the system will either not boot or will turn off after 30
minutes per a watchdog reset timer).

More information about the ME can be found at
<http://www.coreboot.org/Intel_Management_Engine> and
<http://me.bios.io/Main_Page>.

Another project: <http://io.netgarage.org/me/>

ich9utils
=========

You can find `ich9utils` on the [Git page](../../git) or you can download
`lbmk` from the same page at an under revision (around Libreboot 20230625 or
so), and find it under `util/ich9utils/`.

Go in there and type `make` to get the binaries: `ich9deblob`, `ich9gen`
and `ich9show`.

ICH9 show utility {#ich9show}
================

The *ich9show* utility outputs the entire contents of the descriptor and GbE
regions in a given ROM image as supplied by the user. Output is in Markdown
format (Pandoc variant) so that it can be converted easily into various
formats. It could even be piped *directly* into pandoc!

ICH9 gen utility {#ich9gen}
================

When you simply run `ich9gen` without any arguments, it generates
descriptor+GbE images with a default MAC address in the GbE region. If you wish
to use a custom macaddress, you can supply an argument like so:

	ich9gen --macaddress 00:1f:16:80:80:80

**WARNING: ich9gen's `--macaddress` functionality does NOT check for all-zero
MAC addresses, nor does it prevents multicast addresses. A valid MAC address
is non-zero, and unicast. This is why you should use `nvmutil` because it does
this check.**

The above MAC address is just an example. It is recommended that you use the
MAC address officially assigned to your NIC.

Three new files will be created:

-   `ich9fdgbe_4m.bin`: this is for GM45 laptops with the 4MB flash
    chip.
-   `ich9fdgbe_8m.bin`: this is for GM45 laptops with the 8MB flash
    chip.
-   `ich9fdgbe_16m.bin`: this is for GM45 laptops with the 16MB flash
    chip.

**NOTE: You can also use the `--lock` and `--unlock` arguments in ifdtool, to
accomplish the same result of locking or unlocking a descriptor.**

These files contain the descriptor+GbE region and are suitable for systems
that have an Intel GbE NIC present. The flash regions (as defined by the
Intel Flash Descriptor) are set *read-write* which means that you can also
re-flash using `flashprog -p internal` in your operating system running on
that machine. This is the default setup used when libreboot's build system
compiles ROM images.

Alternative versions of these files are also created, which have `ro` in the
filename. If you use *those* versions, all flash regions (as defined by the
Intel Flash Descriptor) will be set to *read only*. This can be useful, for
security purposes, if you wish to ensure that malicious software in your
operating system cannot simply re-flash new firmware.

The region setup created by these descriptors is as follows:

* First 4KiB of flash is: Intel Flash Descriptor
* Next 8KiB after Descriptor: Intel GbE region
* Rest of the flash, after GbE: BIOS region (BIOS region will have libreboot)

The GbE region contains configuration data for your Intel GbE NIC. You can
find information about this in Intel datasheets, and it is very well described
in the `ich9utils` source code.

Assuming that your libreboot image is named **libreboot.rom**, copy the
file to where **libreboot.rom** is located and then insert the
descriptor+gbe file into the ROM image.

For 16MiB flash chips:

	dd if=ich9fdgbe_16m.bin of=libreboot.rom bs=12k count=1 conv=notrunc

For 8MiB flash chips:

	dd if=ich9fdgbe_8m.bin of=libreboot.rom bs=12k count=1 conv=notrunc

For 4MiB flash chips:

	dd if=ich9fdgbe_4m.bin of=libreboot.rom bs=12k count=1 conv=notrunc

If you wish to have read-only flash (write protected flash), substitute the
above examples with descriptor+GbE images that have `ro` in the filename. RO
here means *read only*, not *Romania*!

The above commands assume that in coreboot you have specified the CBFS size
as no more than the size of the flash, minus 12KiB.

NOTE: `ich9gen` also generates descriptors without a GbE region, where in
those descriptors the Intel GbE is not specified. Those are highly experimental,
and *theoretical* since no such system exists in the wild where ICH9 is used,
no Intel GbE NIC present *and* descriptor present; on such systems, the vendor
will just supply a descriptor-less setup. Those GbE-less descriptor images
created by `ich9gen` are only 4KiB in size, and should *never be used* except
for fun, like, basically shits and/or giggles.

For shits and giggles, R500 ROM images in libreboot use these no-GbE descriptor
images generated by ich9gen. However, a descriptorless setup would also work
just fine. ThinkPad R500 doesn't have an Intel PHY in it, and it instead uses
a Broadcom NIC for ethernet. In descriptorless mode, ICH9M works very similarly
to older ICH7 chipsets.

Your libreboot.rom image is now ready to be flashed on the system. Refer
back to [../install/\#flashprog](../install/#flashprog) for how to flash
it.

Write-protecting the flash chip
-------------------------------

The `ich9gen` utility (see below) generates two types of descriptor+GbE setup:

* read-write
* read-only

Read on for more information. Use the `ro` files mentioned below, and your
flash will be read-only in software (you can still externally re-flash and read
the contents of flash).

For ease of use, libreboot provides ROMs that are read-write by default.

ICH9 deblob utility {#ich9deblob}
===================

This was the tool originally used to disable the ME on X200 (later
adapted for other systems that use the GM45 chipset).
[ich9gen](#ich9gen) now supersedes it; ich9gen is better because it does
not rely on dumping the factory.rom image (whereas, ich9deblob does).

Simply speaking, `ich9deblob` takes an original dump of the boot flash, where
that boot flash contains a descriptor that defines the existence of Intel ME,
and modifies it. The Intel Flash Descriptor is modified to disable the ME
region. It disables the ME itself aswell. The GbE region is moved to the
location just after the descriptor. The BIOS region is specified as being
after the descriptor+GbE regions, filling the rest of the boot flash.

The GbE region is largely unedited when using this utility.

Run it like so, with `factory.rom` in the same directory:

	./ich9deblob

The `factory.rom` file is your dump of the vendor boot flash. Older versions
of this utility have this file name hardcoded, and for compatibility reasons
it will still work in this manner. However, you can now specify your own file
name.

For example:

	./ich9deblob lenovo.rom

A 12kiB file named **deblobbed\_descriptor.bin** will now appear. **Keep
this and the factory.rom stored in a safe location!** The first 4KiB
contains the descriptor data region for your system, and the next 8KiB
contains the gbe region (config data for your gigabit NIC). These 2
regions could actually be separate files, but they are joined into 1
file in this case.

A 4KiB file named **deblobbed\_4kdescriptor.bin** will alternatively
appear, if no GbE region was detected inside the ROM image. This is
usually the case, when a discrete NIC is used (eg Broadcom) instead of
Intel. Only the Intel NICs need a GbE region in the flash chip.

Assuming that your libreboot image is named **libreboot.rom**, copy the
**deblobbed\_descriptor.bin** file to where **libreboot.rom** is located
and then run:

	dd if=deblobbed_descriptor.bin of=libreboot.rom bs=12k count=1 conv=notrunc

Alternatively, if you got a the **deblobbed\_4kdescriptor.bin** file (no
GbE defined), do this:

	dd if=deblobbed_4kdescriptor.bin of=libreboot.rom bs=4k count=1 conv=notrunc

(it's very unlikely that you would ever see this. Descriptor without GbE is
very rare, probably non-existant, but theoretically possible and this functionality
is implemented based on Intel datasheets)

The utility will also generate 4 additional files:

* `mkdescriptor.c`
* `mkdescriptor.h`
* `mkgbe.c`
* `mkgbe.h`

These are *self-written* by `ich9deblob`. The `ich9gen` utility was created,
based on this very functionality, with some tweaks made afterwards.

These are C source files that can re-generate the very same Gbe and
Descriptor structs (from ich9deblob/ich9gen). To use these, place them
in src/ich9gen/ in ich9deblob, then re-build. The newly
build `ich9gen` executable will be able to re-create the very same 12KiB
file from scratch, based on the C structs, this time **without** the
need for a` factory.rom` dump!

You should now have a **libreboot.rom** image containing the correct 4K
descriptor and 8K gbe regions, which will then be safe to flash. Refer
back to [index.md/\#gm45](index.md/#gm45) for how to flash
it.

demefactory utility {#demefactory}
===================

This utility has never been tested, officially, but it *should* work.

This takes a `factory.rom` dump and disables the ME/TPM, but leaves the
region intact. It also sets all regions read-write. Simply put, this means
that you can use the original factory firmware but without the Intel ME enabled.

The ME interferes with flash read/write in flashprog, and the default
descriptor locks some regions. The idea is that doing this will remove
all of those restrictions.

Simply run (with `factory.rom` in the same directory):

	./demefactory

It will generate a 4KiB descriptor file (only the descriptor, no GbE).
Insert that into a factory.rom image (NOTE: do this on a copy of it.
Keep the original factory.rom stored safely somewhere):

	dd if=demefactory_4kdescriptor.bin of=factory_nome.rom bs=4k count=1 conv=notrunc

Use-case: a factory.rom image modified in this way would theoretically
have no flash protections whatsoever, making it easy to quickly switch
between factory/libreboot in software, without ever having to
disassemble and re-flash externally unless you brick the device.

The sections below are adapted from (mostly) IRC logs related to early
development getting the ME removed on GM45. They are useful for
background information. This could not have been done without sgsit's
help.

Early notes {#early_notes}
-----------

-   <http://www.intel.co.uk/content/dam/doc/datasheet/io-controller-hub-10-family-datasheet.pdf>
    page 230 mentions about descriptor and non-descriptor mode (which
    wipes out gbe and ME/AMT).
-   ~~**See reference to HDA\_SDO (disable descriptor security)**~~
    strap connected GPIO33 pin is it on ICH9-M (X200). HDA\_SDO applies
    to later chipsets (series 6 or higher). Disabling descriptor
    security also disables the ethernet according to sgsit. sgsit's
    method involves use of 'soft straps' (see IRC logs below) instead
    of disabling the descriptor.
-   **and the location of GPIO33 on the x200s: (was an external link.
    Putting it here instead)**
    [https://av.libreboot.org/x200/gpio33_location.jpg](https://av.libreboot.org/x200/gpio33_location.jpg) -
    it's above the number 7 on TP37 (which is above the big intel chip
    at the bottom)
-   The ME datasheet may not be for the mobile chipsets but it doesn't
    vary that much. This one gives some detail and covers QM67 which is
    what the X201 uses:
    <http://www.intel.co.uk/content/dam/www/public/us/en/documents/datasheets/6-chipset-c200-chipset-datasheet.pdf>

Flash chips {#flashchips}
-----------
-   X200 laptop (Mocha-1):
    ICH9-M overrides ifd permissions with a strap connected to GPIO33 pin (see IRC notes below)

    - The X200 can be found with any of the following flash
    chips:
        -   ATMEL AT26DF321-SU 72.26321.A01 - this is a 32Mb (4MiB) chip
        -   MXIC (Macronix?) MX25L3205DM2I-12G 72.25325.A01 - another 32Mb
            (4MiB) chip
        -   MXIC (Macronix?) MX25L6405DMI-12G 41R0820AA - this is a 64Mb
            (8MiB) chip
        -   Winbond W25X64VSFIG 41R0820BA - another 64Mb (8MiB) chip

    sgsit says that the X200s (Pecan-1) with the 64Mb flash chips are (probably)
    the ones with AMT (alongside the ME), whereas the 32Mb chips contain
    only the ME.

Early development notes {#early_development_notes}
-----------------------

```
Start (hex) End (hex)   Length (hex)    Area Name
----------- ---------   ------------    ---------
00000000    003FFFFF    00400000    Flash Image

00000000    00000FFF    00001000    Descriptor Region
00000004    0000000F    0000000C        Descriptor Map
00000010    0000001B    0000000C        Component Section
00000040    0000004F    00000010        Region Section
00000060    0000006B    0000000C        Master Access Section
00000060    00000063    00000004            CPU/BIOS
00000064    00000067    00000004            Manageability Engine (ME)
00000068    0000006B    00000004            GbE LAN
00000100    00000103    00000004        ICH Strap 0
00000104    00000107    00000004        ICH Strap 1
00000200    00000203    00000004        MCH Strap 0
00000EFC    00000EFF    00000004        Descriptor Map 2
00000ED0    00000EF7    00000028        ME VSCC Table
00000ED0    00000ED7    00000008            Flash device 1
00000ED8    00000EDF    00000008            Flash device 2
00000EE0    00000EE7    00000008            Flash device 3
00000EE8    00000EEF    00000008            Flash device 4
00000EF0    00000EF7    00000008            Flash device 5
00000F00    00000FFF    00000100        OEM Section
00001000    001F5FFF    001F5000    ME Region
001F6000    001F7FFF    00002000    GbE Region
001F8000    001FFFFF    00008000    PDR Region
00200000    003FFFFF    00200000    BIOS Region

Start (hex) End (hex)   Length (hex)    Area Name
----------- ---------   ------------    ---------
00000000    003FFFFF    00400000    Flash Image

00000000    00000FFF    00001000    Descriptor Region
00000004    0000000F    0000000C        Descriptor Map
00000010    0000001B    0000000C        Component Section
00000040    0000004F    00000010        Region Section
00000060    0000006B    0000000C        Master Access Section
00000060    00000063    00000004            CPU/BIOS
00000064    00000067    00000004            Manageability Engine (ME)
00000068    0000006B    00000004            GbE LAN
00000100    00000103    00000004        ICH Strap 0
00000104    00000107    00000004        ICH Strap 1
00000200    00000203    00000004        MCH Strap 0
00000ED0    00000EF7    00000028        ME VSCC Table
00000ED0    00000ED7    00000008            Flash device 1
00000ED8    00000EDF    00000008            Flash device 2
00000EE0    00000EE7    00000008            Flash device 3
00000EE8    00000EEF    00000008            Flash device 4
00000EF0    00000EF7    00000008            Flash device 5
00000EFC    00000EFF    00000004        Descriptor Map 2
00000F00    00000FFF    00000100        OEM Section
00001000    00002FFF    00002000    GbE Region
00003000    00202FFF    00200000    BIOS Region

Build Settings
--------------
Flash Erase Size = 0x1000
```

It's a utility called 'Flash Image Tool' for ME 4.x that was used for
this. You drag a complete image into in and the utility decomposes the
various components, allowing you to set soft straps.

This tool is proprietary, for Windows only, but was used to deblob the
X200. End justified means, and the utility is no longer needed since the
ich9deblob utility (documented on this page) can now be used to create
deblobbed descriptors.

GBE (gigabit ethernet) region in SPI flash {#gbe_region}
------------------------------------------

Of the 8K, about 95% is 0xFF. The data is the gbe region is fully
documented in this public datasheet:
<http://www.intel.co.uk/content/dam/doc/application-note/i-o-controller-hub-9m-82567lf-lm-v-nvm-map-appl-note.pdf>

The only actual content found was:

```
00  1F  1F  1F  1F  1F  00  08  FF  FF  83  10  FF  FF  FF  FF  
08  10  FF  FF  C3  10  EE  20  AA  17  F5  10  86  80  00  00  
01  0D  00  00  00  00  05  06  20  30  00  0A  00  00  8B  8D  
02  06  40  2B  43  00  00  00  F5  10  AD  BA  F5  10  BF  10  
AD  BA  CB  10  AD  BA  AD  BA  00  00  00  00  00  00  00  00  
00  00  00  00  00  00  00  00  00  00  00  00  00  00  00  00  
00  01  00  40  28  12  07  40  FF  FF  FF  FF  FF  FF  FF  FF  
FF  FF  FF  FF  FF  FF  FF  FF  FF  FF  FF  FF  FF  FF  D9  F0  
20  60  1F  00  02  00  13  00  00  80  1D  00  FF  00  16  00  
DD  CC  18  00  11  20  17  00  DD  DD  18  00  12  20  17  00  
00  80  1D  00  00  00  1F  
```

The first part is the MAC address set to all 0x1F. It's repeated haly
way through the 8K area, and the rest is all 0xFF. This is all
documented in the datasheet.

The GBe region starts at 0x20A000 bytes from the \*end\* of a factory
image and is 0x2000 bytes long. In libreboot (deblobbed) the descriptor
is set to put gbe directly after the initial 4K flash descriptor. So the
first 4K of the ROM is the descriptor, and then the next 8K is the gbe
region.

### GBE region: change MAC address {#gbe_region_changemacaddress}

According to the datasheet, it's supposed to add up to 0xBABA but can
actually be others on the X200.
<https://web.archive.org/web/20150912070329/https://communities.intel.com/community/wired/blog/2010/10/14/how-to-basic-eeprom-checksums>

*"One of those engineers loves classic rock music, so they selected
0xBABA"*

In honour of the song *Baba O'Reilly* by *The Who* apparently. We're
not making this stuff up...

0x3ABA, 0x34BA, 0x40BA and more have been observed in the main Gbe
regions on the X200 factory.rom dumps. The checksums of the backup
regions match BABA, however. We think `0xBABA` is the only correct checksum,
because those other, similar checksums were only ever found in the "backup"
GbE regions on factory ROM dumps. In libreboot, we simply use `0xBABA` and
ensure that both 4KiB regions in GbE NVM have that checksum.

By default, the X200 (as shipped by Lenovo) actually has an invalid main
gbe checksum. The backup gbe region is correct, and is what these
systems default to. Basically, you should do what you need on the
\*backup\* gbe region, and then correct the main one by copying from the
backup.

Look at `ich9deblob.c` in ich9utils.

-   Add the first 0x3F 16bit numbers (unsigned) of the GBe descriptor
    together (this includes the checksum value) and that has to add up
    to 0xBABA. In other words, the checksum is 0xBABA minus the total of
    the first 0x3E 16bit numbers (unsigned), ignoring any overflow.

Flash descriptor region {#flash_descriptor_region}
-----------------------

<http://www.intel.co.uk/content/dam/doc/datasheet/io-controller-hub-9-datasheet.pdf>
from page 850 onwards. This explains everything that is in the flash
descriptor, which can be used to understand what libreboot is doing
about modifying it.

How to deblob:

-   patch the number of regions present in the descriptor from 5 - 3
-   originally descriptor + bios + me + gbe + platform
-   modified = descriptor + bios + gbe
-   the next stage is to patch the part of the descriptor which defines
    the start and end point of each section
-   then cut out the gbe region and insert it just after the region
-   all this can be substantiated with public docs (ICH9 datasheet)
-   the final part is flipping 2 bits. Halting the ME via 1 MCH soft
    strap and 1 ICH soft strap
-   the part of the descriptor described there gives the base address
    and length of each region (bits 12:24 of each address)
-   to disable a region, you set the base address to 0xFFF and the
    length to 0
-   and you change the number of regions from 4 (zero based) to 2

There's an interesting parameter called 'ME Alternate disable', which
allows the ME to only handle hardware errata in the southbridge, but
disables any other functionality. This is similar to the 'ignition' in
the 5 series and higher but using the standard firmware instead of a
small 128K version. Useless for libreboot, though.

To deblob GM45, you chop out the platform and ME regions and correct the
addresses in flReg1-4. Then you set meDisable to 1 in ICHSTRAP0 and
MCHSTRAP0.

How to patch the descriptor from the factory.rom dump

-   map the first 4k into the struct (minus the gbe region)
-   set NR in FLMAP0 to 2 (from 4)
-   adjust BASE and LIMIT in flReg1,2,3,4 to reflect the new location of
    each region (or remove them in the case of Platform and ME)
-   set meDisable to 1/true in ICHSTRAP0 and MCHSTRAP0
-   extract the 8k GBe region and append that to the end of the 4k
    descriptor
-   output the 12k concatenated chunk
-   Then it can be dd'd into the first 12K part of a coreboot image.
-   the GBe region always starts 0x20A000 bytes from the end of the ROM

This means that libreboot's descriptor region will simply define the
following regions:

-   descriptor (4K)
-   gbe (8K)
-   bios (rest of flash chip. CBFS also set to occupy this whole size)

The data in the descriptor region is little endian, and it represents
bits 24:12 of the address (bits 12-24, written this way since bit 24 is
nearer to left than bit 12 in the binary representation).

So, *x << 12 = address*

If it's in descriptor mode, then the first 4 bytes will be 5A A5 F0 0F.

platform data partition in boot flash (factory.rom / lenovo bios) {#platform_data_region}
-----------------------------------------------------------------

Basically useless for libreboot, since it appears to be a blob. Removing
it didn't cause any issues in libreboot. We think it's just random data that
the manufacturer can put there, to use in their firmware. Intel datasheets seem
to suggest that the platform region serves no specific function except to
provide a region in flash for the hardware manufacturer to use, for whatever
purpose (probably just to store other configuration data, to be used by software
running from the BIOS region as per region layout specified in the descriptor).

This is a 32K region from the factory image. It could be data
(non-functional) that the original Lenovo BIOS used, but we don't know.

It has only a 448 byte fragment different from 0x00 or 0xFF, on the X200
thinkpads that were tested.
