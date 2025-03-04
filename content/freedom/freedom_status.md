---
title: Freedom status for each board
toc: true
---

This page documents how Libreboot's [binary blob reduction policy](../policy/)
is applied in practice, i.e. the free software status of each board.

It may be useful to understand [coreboot's
architecture](https://doc.coreboot.org/getting_started/architecture.html).


## Intel platforms

### Descriptor vs descriptorless setup

Libreboot supports several motherboards using Intel platforms. Of these, there
are essentially two class of machine (for the purposes of this article):

* Descriptorless configuration
* Descriptor-based configuration

What does *descriptor* mean? Well, traditionally, the main flash IC (containing
the boot firmware, commonly referred to as the BIOS) on Intel machines,
contained only x86 executable code, responsible for initialising all of the
hardware, such as the CPU, memory controller and peripherals. This is what we
will refer to as the descriptorless setup; in such configurations, the Intel
ME firmware is absent by default.

However, In a descriptor configuration, the flash is divided into regions such
as:

* Intel flash descriptor: always the first 4KiB of the flash. Binary-encoded
  configuration data for the machine, and the regions (such as this, or
  others below) is defined in here. In some ways, you might think of this as
  analogous to the Master Boot Record on a hard drive.

* Intel GbE NVM (gigabit ethernet non-volatile memory): binary-encoded
  configuration data, for the onboard Intel gigabit ethernet device, if one is
  present. It contains lots of settings like MAC address, what speed the NIC
  should run at, PCI IDs, LED blinking speed and more.
  If a non-Intel NIC is used, this region of the flash will not be present.

* ME (Intel Management Engine): a *nasty* security liability in its default
  state, the ME provides many features such as remote management, with full
  networking, The ME is a dedicated coprocessor separate from the main CPU, and
  the initialisation firmware plus operating system for it is loaded from this
  dedicated region in the main boot flash. More info is available [in the
  FAQ](faq.md#intelme) &mdash; where ME firmware is otherwise present,
  Libreboot either removes it or (with the `me_cleaner` program)
  [reconfigures](https://github.com/corna/ me_cleaner/wiki/How-does-it-work%3F)
  it in such a way where it is disabled during machine initialisation.

* Platform region: non-program data, usually just a bunch of strings put there
  by the hardware vendor.

* BIOS region: this contains the main boot firmware, responsible for
  initialising the CPU, memory controller and peripherals, putting the machine
  into a state where it can run programs (most likely a bootloader, then an
  operating system). The coreboot code (provided by Libreboot) goes in here.

Basically, you can think of such "regions" as analogous to partitions on
a hard drive. What's important is that the flash IC is divided into such
regions, where each region is intended for a specific purpose.

The contents of the descriptor and GbE regions are described by Intel
datasheets, but those datasheets often contain reserved sections where
parts are left undocumented. Reverse engineering efforts over the years have
documented some of these blank spots.

### Intel ME removal

This section applies to boards on which the ME can be completely removed.

Libreboot provides a way to fully remove the ME firmware, while retaining full
use of the machine, on GM45 platforms with ICH9M southbridge. These include
ThinkPad X200/T400/T500/W500 and so on of that generation.

### Intel ME images

This section applies to boards on which the ME cannot be completely removed.

Libreboot does *not* distribute the Intel ME firmware in any way, whether in
the Git repository or in releases. Where it is needed, Libreboot provides
scripts that automatically fetches it from the vendor, neuter it by running the
[me_cleaner](https://github.com/corna/me_cleaner/wiki/How-does-it-work%3F)
program, and insert it. **If you use release ROMs instead of building from
source, you must run it manually according to the [Ivy Bridge & Haswell
Guide](../install/ivyhas/), to achieve the same effect, since
non-redistributable components are scrubbed from release ROMs.**

The bringup code of Intel ME is all that remains in Libreboot configurations.
All it does it it initializes the ME, and since the actual ME logic is removed,
the ME just idles after bringup, leaving the ME completely benign.

The mere prescence of the ME firmware is *required* on almost all Intel
platforms, or the machine will turn off after 30 minutes (or it will not boot,
if the ME also controls whether the CPU comes out of reset).

## Notes about vendor files

### VGA option ROMs

Native video initialisation is supported and enabled for all supported Intel
platforms that have it. The source code is provided by coreboot, under free
license.

In some cases, a laptop may have a graphics chip that is unsupported by
coreboot. In this situation, a vendor file called a *VGA Option ROM* must be
used. Libreboot has experimental support for Nvidia GPU models of the Dell
Latitude E6400, in an experimental branch where the build system automatically
downloads the VGA ROM for it. This is currently *not* present in releases, or
in the stable branch of lbmk.

In other instances, a machine may have *two* graphics devices, where one has
native (free/libre) initialisation provided by coreboot. In these situations,
it is possible to insert a VGA ROM for the other one; Libreboot currently lacks
documentation for this, but it has been tested. Example: Dual Intel/Nvidia
graphics on some Ivy Bridge or Haswell ThinkPads.

For add-on GPUs, SeaBIOS can typically scan a VGA ROM present on the card and
execute it. This has been tested on certain desktop motherboards that Libreboot
supports, and works just fine; Libreboot does not need to handle these files at
all.

Libreboot's default is always freedom, when feasible in practise. Users who
wish to have use of these additional GPUs, on such hardware, must take stock
of the following paragraph in Libreboot policy:

> The principles above should apply to default configurations. However,
libreboot is to be configurable, allowing the user to do whatever they like.

### Memory controller initialization

Libreboot has fully libre raminit available for all Intel memory controllers up
to and including Haswell (ThinkPad T440p and W541).

However on Broadwell, Intel MRC is used; on Skylake/newer, FSP-M is used.

## ARM platforms (chromebooks)

Mostly free software, except for the requirement on `daisy` and `peach`
motherboards to include BL1 bootloader files from the vendor. These are:

* HP Chromebook 11 G1 (`daisy-spring`)
* Samsung Chromebook XE303 (`daisy-snow`)
* Samsung Chromebook 2 13” (`peach-pi`)
* Samsung Chromebook 2 11” (`peach-pit`)

The Chromebooks above have been temporarily removed from Libreboot due to
various issues.

nyan-* chromebooks also temporarily removed, but are 100% free software in
Libreboot. <!-- TODO: why? -->

## List of vendor files for each board

### CPU Microcode

These are always provided when available. See [the microcode
page](../microcode/) for details.

### Intel ME

Applies to: `dell9020mt_nri_12mb`, `dell9020sff_nri_12mb`, `e5420_6mb`, `e5520_6mb`, `e5530_12mb`, `e6220_10mb`, `e6230_12mb`, `e6320_10mb`, `e6330_12mb`, `e6420_10mb`, `e6430_12mb`, `e6520_10mb`, `e6530_12mb`, `hp2170p_16mb`, `hp2560p_8mb`, `hp2570p_16mb`, `hp8200sff_4mb`, `hp8200sff_8mb`, `hp820g2_12mb`, `hp8300cmt_16mb`, `hp8300usdt_16mb`, `hp8460pintel_8mb`, `hp8470pintel_16mb`, `hp8560w_8mb`, `hp9470m_16mb`, `t1650_12mb`, `t420_8mb`, `t420s_8mb`, `t430_12mb`, `t440plibremrc_12mb`, `t520_8mb`, `t530_12mb`, `w530_12mb`, `w541_12mb`, `x220_8mb`, `x230_12mb`, `x230_16mb`, `x230t_12mb`, `x230t_16mb`, `dell3050micro_fsp_16mb`, `dell3050micro_vfsp_16mb`, `t480_fsp_16mb`, `t480_vfsp_16mb`, `t480s_fsp_16mb`, `t480s_vfsp_16mb`.

On the above boards the ME is included after being neutered.

On MEv11-based platforms, such as the ThinkPad T480 and Dell OptiPlex 3050 Micro,

### KBC1126 EC firmware for HP laptops

Applies to: `hp2170p_16mb`, `hp2560p_8mb`.

### Intel FSP

Applies to: `t480_fsp_16mb`, `t480_vfsp_16mb`, `t480s_fsp_16mb`, `t480s_vfsp_16mb`.

Provides romstage and raminit.

### SMSC SCH5545 Environmental Control

Applies to: Dell Precision T1650.

### Intel Flash Descriptor (IFD)

Intel Flash Descriptors are provided as blobs on some boards, but these are
not *software* blobs. They are configurations provided in a binary format,
fully readable by libre software. For example:

* Coreboot's `ifdtool` program has extensive features for manipulating Intel
  flash descriptors.
* Corebot's `bincfg` program generates any sort of binary from a `.spec` file
  which can describe any binary format in a human readable format. It contains
  several flash descriptors for several platforms, but Libreboot does not use
  these.

Intel GbE NVM config (configuration data, binary-encoded, for gigabit NIC):

* Libreboot's `nvmutil` program can manipulate GbE NVM images

### BL1 bootloader on `peach`/`daisy` Chromebooks

Applies to: `daisy_snow`, `daisy_spring` and `peach_pit`.

These boards are currently not present in Libreboot. They were removed from
Libreboot, because the build system does not yet auto-insert the BL1 files. The
boards are otherwise believed to work, using Alper's port of U-Boot in
Libreboot.

## Addendum

Please be reminded again that there is [firmware outside the scope of
Libreboot](../other_firmware/).
