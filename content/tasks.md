---
title: Misc Tasks
toc: true
---

TODO: Move all of this to the issue tracker

Please read the [contributing page](../contrib/) and occasionally refer to the [maintenance manual](../maintain/).

## Rockchip RK3588 SoCs in coreboot

See:
<https://www.collabora.com/news-and-blog/blog/2024/02/21/almost-a-fully-open-source-boot-chain-for-rockchips-rk3588/>

Although coreboot is not mentioned (the context is TF-A), this could be added
to coreboot.

Also:

### Add TF-A support to Libreboot

Yes. We already provide other non-coreboot firmware, such as the serprog
images. We even integrate U-Boot, albeit as a coreboot payload with some init
steps skipped in U-Boot (handled by coreboot).

TF-A is quite an interesting project:

<https://www.trustedfirmware.org/>

It is essentially an analog of coreboot; coreboot even uses parts of this, on
some boards.

## general auditing

Libreboot's build system design is already extremely efficient. See:
[lbmk build system documentation](../maintain/)

One of the reasons for this is auditing. The build system is regularly audited.
In this context, that means reading the code to check for quality, pre-emptively
fix bugs and generally think about the design of the project. Smaller is better.

Code equals bugs, so less code yields fewer bugs. For a general idea of how
audits are done in Libreboot, see:

* [Libreboot build system audit 1](../news/audit)
* [Libreboot build system audit 2](../news/audit2)
* [Libreboot build system audit 3](../news/audit3)
* [Libreboot build system audit 4](../news/audit4)
* [Libreboot build system audit 5](../news/audit5)
* [Libreboot build system audit 6](../news/audit6)

Auditing can often be pedantic, and seem petty. You might commit a patch that
reduces the sloccount by only 1 line, maybe 3, but they all add up.

I say again:

Code equals bugs, so fewer lines of code will cause fewer bugs.

## Interesting board ports

**Any board port is interesting. These are just a few that happened to be
noticed at a given time. The list below is by no means complete!**

Libreboot can support any board from coreboot, in principle. It would also be
feasible to integrate other (libre) boot firmware, if desirable. The list below
is not exhaustive, it just lists boards that are interesting to us at this time:

### Boards

* HP EliteBook 2760p
* HP ProBook 6360b
* HP Revolve 810 G1
* HP EliteBook Folio 9480m
* HP EliteBook 8770w
* HP EliteBook 840 G2 (not in coreboot yet, but should be similar to 820 G2)
* HP Z220 CMI and SFF motherboards
* MSI PRO Z690-A motherboard (supported by Dasharo, not sure about coreboot) -
  also, Dasharo supports several more motherboards that aren't in coreboot
  proper.
* KGPE-D16 and KCMA-D8: use the Dasharo fork of coreboot, instead
  of coreboot `4.11_branch`, because Dasharo's version is much more up to
  date and more reliable with raminit. D8 isn't supported by Dasharo, but it's
  not much different code-wise to the D16 motherboard, so differences
  in coreboot `4.11_branch` could be adapted to provide a Dasharo port.

### ThinkPad T430s and T431s

These are interesting; the T431s in particular has soldered RAM, so we'd need
to take care of SPDs (not done automatically yet, in coreboot). The schematics
will show GPIO straps that could be used to glean which SPD data is correct,
if we wanted to scan it automatically at boot time (we'd have to include SPD
data for all known modules, it might be possible to extract it from vendor
updates, otherwise we'd have to dump it from multiple variants of the same
machine).

Both are supported by coreboot.

### 840 G2 (possible 820 G2)

These notes are based on a chat on Libreboot IRC.

The TPM is Infineon SLB9660 and does TPM 1.2. We could maybe upgrade
firmware to that of SLB9665. It would no longer work with the HP BIOS but
maybe coreboot could be used, and then we could have
newer TPM version - SLB9665 firmware can meet TPM 2.0 specification.

(we do not yet use the TPM in any meaningful way on Libreboot machines)

### Blobless boards

Not yet supported, but interesting for the project. Separated thus:

already supported by coreboot:

* [ASUS P5Q motherboard](https://doc.coreboot.org/mainboard/asus/p5q.html) (ICH10 / i82801jx),
  known variants, e.g.: Pro, C, L-Pro, SE
* Scan coreboot code for ICH9/ICH10 systems, or boards with x4x/gm45 based
  northbridges. Many of these can boot blobless.

### Dell Latitude/Precision:

* Dell Latitude laptops: E4200, E4300, E5400, E5500, E6500, Precision M4400,

Also E6440 (Haswell machine) - also E6540, 5540, E5440, E3540, E3440, E7440, and E7240
 also - Nicholas says only the E6x40 models here have socked CPUs. The
rest are soldered.

E7440: https://review.coreboot.org/c/coreboot/+/46540

E7240: https://review.coreboot.org/c/coreboot/+/40300 (original)
and rebased to main: https://review.coreboot.org/c/coreboot/+/79746

These typically use MEC5045 or compatible EC. Some may use MEC5035.

SuperIO: at least M6500 is known to use ECE5028. I have a bunch of these
Dells at my lab, they are high priority for porting because they would be
easily flashable.

### Broadwell Dell

E5450 uses MEC5085, currently untested for dell-flash-unlock.

### Skylake Dell

<https://en.wikipedia.org/wiki/Dell_Latitude#Exx70_Models_(2016)>

Non-E models don't have the MEC ECs. The E models have MEC5085.

Nicholas isn't sure whether these have bootguard. TODO: test, and also
test with dell-flash-unlock.

### Dell Latitude E7240

See: <https://review.coreboot.org/c/coreboot/+/79746>

Haswell latitude, works with `dell-flash-unlock`, uses MEC5055 EC. Documentation
is included with that patch. It should be possible to reuse the existing
MRC extraction logic. It will have to be backported to the branch used for
libremrc in lbmk.

NOTE: Iru Cai is the person working on this.

### Dell Precision M4800 and M6800

Also M6800, though no port is available yet. 17.3 inch display.

See: <https://review.coreboot.org/c/coreboot/+/79755>

Another haswell machine. However, according to Nicholas Chin, at least
on 1 January 2024, this patch (on patchset 4), there were problems with
code quality and libgfxinit didn't work yet - also, the ACPI code seemed
to be a dump of the vendor, which is of low quality and likely not suitable
for entry into coreboot due to copyright reasons.

This port is worth looking at. When the issues are fixed, this will make a
fine addition to lbmk.

### E4200 SPD

NOTE: Some of this may be inaccurate, because it's copied from handwritten
notes that were written very hastily and are barely legible.

The SPD EEPROM is on the back of the board, between the CPU backplate and the
RAM chips. SOIC-8 chip labelled U2. It's a 24XX IC, should be possible to
dump using a 3.3v-modded CH341A (on the 24xx socket).

or

```
modprobe eeprom
```

look in e.g. 0-0058 or 0-0052 in `/sys/bus/i2c/devices`

May need other modules like at25 and i2c-i801

The eeprom file in these should contain the SPD data. Just look through a bunch
of them until the file is found and seems to be correct.

decode-dimms (utility) can also read eeprom and decode SPD data but doesn't dump
the ram eeprom (dumping it in a ch341a as above would do so)

see <https://unix.stackexchange.com/questions/92037/how-to-view-rams-spd-timings-table#92044>

(yes, that url was also handwritten)

modprobe i2c-dev and sudo i2cdump 0 0x50 works in libreboot, but not the
vendor bios.

### Other Dells (Ivybridge and Sandybridge)

Nicholas Chin is interested in these:

* 6430u
* E5520m
* E5420m

Many others have been added, of Intel 2nd and 3rd gen.

Most/all of these should be easily flashable, with the `dell-flash-unlock`
utility, and many could be ported using autoport as a guide. Nicholas is
working on these. They are left here for reference. If you have one of these,
please contact `nic3-14159` on the [Libreboot IRC channel](../contact).

Look at the page:
<https://en.wikipedia.org/wiki/Dell_Latitude#Exx50_Models_(2015)>

It lists Dell Latitude models, though "Precision" brand is also available
on some models that may be Libreboot-feasible.

### ARM-based CrOS devices

Alper Nebi Yasak ported several of these to Libreboot, but only
the `gru_bob` and `gru_kevin` machines are known to be stable.

It would be nice to re-add veyron-based platforms, e.g. `veyron_speedy` - old,
but still very useful.

The `nyan`, `peach` and `daisy` platforms were initially added to lbmk, but
prematurely. They are talked about here:

<https://libreboot.org/docs/install/#removed-boards>

It would be nice in general to support more ARM platforms in Libreboot. None
of these machines are as decent as the Apple silicon machines (m1/m2/m3 etc),
but they're still decent enough for most computing tasks (and the Apple machines
do not currently have coreboot support).

The actual coreboot code for these machines is thought to be reliable. The
problem is that the U-Boot port is not yet stable across all these machines.
Libreboot has Alper's proof of concept which works well
on `gru` chromebooks.

Caleb is interested in the `krane` chromebooks, but has had problems with vboot,
getting it to boot reliably on custom firmware builds.

### OpenSIL and AMD Ryzen

Coreboot is importing OpenSIL code from AMD, to support Epyc Genoa (server
platform).

There are also chromebooks now with AMD Ryzen CPUs.

<https://github.com/coreboot/coreboot/commit/a859057db8d2eaf59a7575e303d7af35979d12d7>

<https://github.com/coreboot/coreboot/commit/9e45e32420eda750afea9f6e4a3e6de42ba4152b>

NOTE:

9elements seems to be the main entity working on OpenSIL integration in
coreboot, under the direction of Arthur Heymans.

also <https://www.youtube.com/watch?v=gAZw0fTKdYg>

### AMD Family16 boards

See: <https://review.coreboot.org/c/coreboot/+/71607>

This is part of a patch series, from 9 September 2023 onward, re-adding
AMD Family 16 platform to coreboot, most notably enabling use of the new
allocator and other things in coreboot.

AMD AGESA-based platforms were removed from coreboot, because they weren't
being maintained anymore, so they were dropped. Some of those boards are
still quite decent today. Various efforts here and there have revived some
of them, e.g. the Dasharo project.

Also referenced there: Biostar A68N-5200 motherboard. Check
coreboot `4.18_branch` for these boards. Coreboot started removing the
AGESA boards after release 4.11.

### Lenovo G505s

Old board, removed from coreboot ages ago, but one of the fastest pre-PSP
AMD laptops, has full init in coreboot - it does require a VGA ROM for
graphics. Anyway:
<http://dangerousprototypes.com/docs/Lenovo_G505S_hacking>

This page was linked to me ages ago by Mike Banon. It contains instructions
for how to configure the machine. It might be worth integrating into lbmk.

### RISC-V hardware

See: <https://github.com/oreboot/oreboot>

Oreboot is a re-written fork based on coreboot, re-written in Rust instead of
C, and it has a strong focus on RISC-V platforms. We should start integrating
this into lbmk - although [Rust has several
disadvantages](https://drewdevault.com/2019/03/25/Rust-is-not-a-good-C-replacement.html),
oreboot is still a good project.

(though, whenever possible, lbmk should stick to coreboot, to keep things
simpler - are there efforts to implement oreboot ports in coreboot/C?)

### LoongArch support

Ariadne Conill has been working on bringup for coreboot. Work also being done
with edk2; U-Boot also desirable here.

### RockPro64

Another interesting board that coreboot supports. We could add this.

### uefistub

Currently [under review](https://review.coreboot.org/c/coreboot/+/78913) in
the coreboot project, this provides an *incomplete* UEFI implementation, but
much more minimalist than the U-Boot one. It doesn't really *do* anything
except provide the most minimal code possible, and then you can jump to a
Linux payload in the flash.

For UEFI purposes, U-Boot seems more mature, and it offers other features
like SPL. As already stated, this is the preferred UEFI implementation for
Libreboot, but uefistub is listed too because it's interesting.

Probably useless, since U-Boot is more complete. We may as well use U-Boot, but
uefistub will remain mentioned here for the time being. The context for
uefistub is linuxboot-only setups; this is where uefistub can truly shine,
specifically on ARM64 devices.

### Videos (plus RISCV)

The *Open Source Firmware Conference* (OSFC) in 2023 had several interesting
talks pertaining to ARM, secureboot, linuxboot, UEFI and everything in between.
Also RISCV/oreboot. Here are some videos, some of which contain info already
alluded to on this page:

* <https://www.osfc.io/2023/talks/enabling-coreboot-for-open-system-firmware-on-arm-servers/>
* <https://www.osfc.io/2023/talks/u-boot-as-a-coreboot-payload/>
* <https://www.osfc.io/2023/talks/aligned-on-risc-v/>

In general, there are many interesting talks:

* <https://www.osfc.io/archive/2023/>

The talks go all the way back to 2018. They're all worth watching.

## Linuxboot

**NOTE: Stali Linux is a useful base, on top of which any Linux-based setup
could be built. With a stripped down kernel, it already provides a sensible
build system for ARM64 and AMD64.**

See for inspiration: [Heads project](https://osresearch.net/)
and [Ownerboot project](https://sr.ht/~amjoseph/ownerboot/), these are other
coreboot distros similar to Libreboot, but they provide Linux-based payloads.
Also see more in general, the [Linuxboot](https://www.linuxboot.org/) project.

Libreboot's build system is documented, see: [lbmk
documentation](../maintain/).

It's possible to provide a Linux system that runs from the flash. Linux can
execute another Linux kernel, using the `kexec` feature. There are bootloaders
that can make use of it, for example
the [u-root](https://github.com/u-root/u-root) project.

Libreboot's current choice of coreboot payloads are:

* SeaBIOS (x86 only), provides a traditional PC BIOS implementation
* GNU GRUB (x86 only), provides a multiboot implementation, can boot Linux and
  BSD. This is the preferred default payload on x86, especially for Linux
  distros, because it provides many security features like GPG signature
  checking on Linux kernels, and password protection.
* U-Boot (ARM only), provides several boot methods, we typically use the UEFI
  implementation but it also provides many different boot methods; the one that
  is most interesting is the SPL (secondary program loader) feature, which is
  essentially the same concept as loading a coreboot payload - together with
  something like the minimal [uefistub](https://review.coreboot.org/c/coreboot/+/78913)
  payload, can provide a complete setup.

U-Root in particular (not to be confused with U-boot has parsers in it for
GRUB and Syslinux config files. GRUB also has a parser for syslinux configs.
This makes it a useful drop-in replacement for the GNU GRUB payload that
Libreboot currently uses. Linux has much better drivers than GRUB, especially
for things like LUKS2 and networking.

### Ideas for how to implement in lbmk

Look at the [lbmk documentation](../maintain/) for context. The most
logical way to implement Linux payloads in Libreboot's build system, lbmk,
might be:

* Reuse the current crossgcc handling in `script/update/trees`, which is used
  for coreboot and u-boot. Coreboot's cross compiler isn't very useful for
  general applications e.g. utilities, but it could compile the Linux kernel
  easily.
* Separately to crossgcc,
  use [musl-cross-make](https://github.com/richfelker/musl-cross-make) for
  the programs inside initramfs. Use this to provide musl libc, busybox and
  all of the userland applications in general. Musl-cross-make itself would not
  be used as-is, but adapted and integrated into the lbmk build system.
  The design of musl-cross-make is largely compatible with that of lbmk, because
  both build systems are written in shell scripts and with the same minimalist
  mentality. 72 source lines! At least as of musl-cross-make git
  revision `fe915821b652a7fa37b34a596f47d8e20bc72338`.
* In each package defined under `config/git/` in lbmk, use the current design
  but support specifying, for each one, whether or not to use musl-cross-make.
  The current design in lbmk already permits use of make and cmake, for simple
  projects, otherwise for more complicated setups, a dedicated script is
  written, e.g. `script/build/grub` for building the grub images (which runs
  automake in the grub build system), or `script/build/roms` which builds
  rom images.
* A script, `script/build/linuxboot` would build the entire payload with u-root
  in it, but `script/update/trees` would actually build each package.

BONUS: the musl-cross-make logic could also be used to provide static linked
utilities, so as to provide compiled utilities in Libreboot releases, reliably.
We currently only provide source code for utilities, which is not always
convenient for users, especially for utilities needed alongside vendor scripts.

If done in the way described above, the current code size in the Libreboot
build system would not increase much. It's mainly the addition of
musl-cross-make. Most of the generic build logic already exists in lbmk, for
projects that use cmake and/or make. It could be done with minimal complexity.

### Flash size limitations

With a stripped down kernel, and sensible configuration, about 6-8MB of flash
space would be required in this setup. The Heads setup is just under 8MB.

### Why Linux in flash?

Linux has better drivers than GRUB, has netboot, and it's much more practical
when you want to control the boot process. For example, you could more easily
implement measured boot and make use of TPM-based security mechanisms.

For the everyday user, it probably doesn't make much difference if they're
already happy with SeaBIOS, GRUB or SeaBIOS.

### x86 implementation

Coreboot can directly execute it as a payload, but we would also execute it
from the GRUB payload - if running from the GRUB payload, we could just provide
it as a vmlinuz and initramfs file.

### ARM implementation

We already standardise on U-Boot, for ARM machines. It's debatable whether
Linuxboot is even desirable here, U-Boot is quite competent, but the SPL mode
in U-Boot could be used to provide the Linux payload setup, OR:

See: [uefistub](https://review.coreboot.org/c/coreboot/+/78913)

Although currently only under review, not yet merged anywhere, uefistub seems
like a useful way to provide just the most minimal UEFI implementation, required
on Linux distros, but all it does it then boot a Linux payload. This is probably
what should be used, on ARM platforms, instead of U-Boot, if Linux is to be
provided in flash, but the uefistub will use a lot less space than U-Boot. That
being said, uefistub does not seem to provide a complete, or even fully
correct UEFI implementation.

(then again, linux on bare metal providing kexec as main bootloader method is
also quite non-standard, at least on x86 and ARM).

### Netboot.xyz

It's unlikely that this will actually be used in lbmk, but this provides a really
nice way to boot Linux distros over the network:

<https://github.com/netbootxyz>

It uses iPXE, whereas we would be using Linux and kexec.

### Zfsbootmenu

See: <https://docs.zfsbootmenu.org/en/v2.3.x/>

Similar in concept to netboot.xyz, but this actually does use Linux. It can
boot many distros. We could provide something similar to this in Libreboot.

This was briefly documented on the Libreboot website,
before [argon2 kdf support](../news/argon2) was merged in Libreboot GRUB.

## Seek QUBES endorsement

Libreboot is compatible with Qubes, on several supported motherboards. This could
be audited, to provide a complete list. Qubes has a page on their website which
lists compatible devices.

It would be a nice way to promote the Libreboot project, and promote Qubes at
the same time, which is an excellent project. We could host a page specifically
for it, saying what works on our end, and basically copy that to their wiki.

## GRUB VGA modes

VGA support is not universal in Libreboot. We typically rely on GRUB to start
in console mode (`GRUB_TERMINAL=console`), which means GRUB won't change
modes, it'll just use whatever mode we started in.

We do not currently modify GRUB's video handling, so some distro setups will
try to use VGA modes, or some syslinux configs (that GRUB can parse) will,
causing weird behaviour on many Libreboot systems.

TODO: modify GRUB to only have behaviour matching `GRUB_TERMINAL=console`.
See: <https://www.gnu.org/software/grub/manual/grub/html_node/Simple-configuration.html>

This will prevent the need for modification. In some cases, it is necessary
to modify `GRUB_TERMINAL` in distro grub configs. The way Libreboot's GRUB
menu works is, it scans for GRUB and Syslinux/Extlinux configs on the user's
HDD/SSD, switching to the first one found.

## GRUB configs menu

Libreboot systematically scans for GRUB/Syslinux/Extlinux configs provided by
the user's operating system, by scanning partitions. It can also scan
encrypted partitions (asking for the user to type their LUKS passphrase).

However, Libreboot switches to the first one found. In some cases, a user may
have multiple configurations.

TODO: Keep the current behaviour, for performance reasons, but offer a mode
where instead a new menu appears, with menuentries generated, where each one
just switches to one of the detected configurations.

This would enable Libreboot to work more seamlessly on dualboot setups, where
it is currently assumed that the user would modify `grub.cfg` in the flash.

This pertains to the GRUB *payload* provided in the flash, by Libreboot. It is
currently the preferred payload in Libreboot, at least for x86 machines.

## Document flash write protection

### IFD-based method

Already covered, but could be documented more prominently.
Use `ifdtool --lock libreboot.rom` to lock the IFD.

This method is easily circumvented, by enabling the Flash Descriptor Override,
which varies from trivial to physically difficult depending on the board.

On some platforms, such as the Dell Latitude E6400, this method is entirely
useless; on the E6400, the EC firmware can be instructed to override the
IFD settings, by enabling the Flash Descriptor Override (in fact, this is part
of what the `dell-flash-unlock` utility does).

### FLILL-based method

We already vaguely mention Intel Flash Descriptor settings ta enable
write protection. This documentation should be expanded on.

See:
<https://opensecuritytraining.info/IntroBIOS_files/Day2_02_Advanced%20x86%20-%20BIOS%20and%20SMM%20Internals%20-%20Flash%20Descriptor.pdf>

Actually, look at that site in general:

* <https://web.archive.org/web/20190104155418/http://opensecuritytraining.info/IntroBIOS.html>
* <https://opensecuritytraining.info/IntroBIOS.html>
* <https://p.ost2.fyi/courses/course-v1:OpenSecurityTraining2+Arch4001_x86-64_RVF+2021_v1/course/>

Anyway:

Universal across all currently known IFD versions, the FLILL section can be
used to define *invalid* opcodes when the flash is used, and this could be used
to define *write* and/or *erase* opcodes. Up to 4 can be defined.

This could be used to complement existing flash-based write protection. Of
particular interest is the fact that the FLILL config *cannot* be overridden.
Setting `HDA_SDO` (newer platforms) or `HDA_DOCK_EN` (GPIO33) to enable
Flash Descriptor Override, will not affect FLILL entries.

We could document this on the Libreboot website.

### SMM write protection

system management mode can also be used, to implement flash write protection.

### PR (Protected Range) registers

Differing per platform but defined by Intel datasheets, the Protected Range
registers can be set, to enable flash write protection. Once written, these
cannot be changed until a reboot. Anything can set them.

This is the preferred method and should be the default (enabled by default),
because it can be done from GRUB. So, it could be provided on GRUB setups.

We could make it so that all menuentries in the default Libreboot GRUB menu
enable this, when possible on a given motherboard. The GRUB *shell* would not
enable it, and special menuentries that don't enable it could be provided (or
an entirely separate GRUB config, e.g. `grub_unprotected.cfg`).

With the PRx-based method, the user can easily circumvent it when they want to
update their firmware. Combined with a passphrase in GRUB, for menuentries
and the shell, this would prevent an unauthorised user from updating the
system; boot password alone cannot protect against malicious code in the user's
operating system, but this method would *require* a boot password.

It could also be done earlier, in coreboot, but then there's no way to turn
it off. Doing it from GRUB (or Linux, when a payload for that is added) seems
wiser.

In practise, this should probably not be the default. Libreboot's current
default is *no write protection*, though most Linux distros and BSDs enable
protecting `/dev/mem` by default, that the user can turn off at boot time when
they want to flash (e.g. cmdline option `iomem=relaxed` in Linux,
or `kern.securelevel=-1` in OpenBSD).

### Chip-specific

Some flash chips support their own write protection scheme, covered in their
datasheets, but this is usually unreliable or inconsistent. This method is
not to be relied upon.

### Layers!

Security is all about layers. When you want to lock down the flash, use every
method available to you.

## lbwww: Document MXM graphics

MXM graphics modules are present, on some laptops that we do not yet support,
because certain functionality is needed on them that we do not implement yet.

See: <https://codeberg.org/libreboot/lbmk/issues/112>

Unlike on several other setups, many of these modules require certain data
tables to be present, provided by a BIOS interrupt, which the VGA ROMs then
use. These tables essentially contain config for things like ports, and power
management. More information, including links to PDF files containing the
specs for it, are provided for in the above linked issue page.

Several more high-end HP EliteBook machines use MXM graphics modules,
e.g. HP EliteBook 8560w.

## lbmk-c: clustered builds

I had an idea on IRC when we were talking about how to optimise the build
speed in Libreboot. Most of the time is spent simply compiling the ROM images,
and this will become especially true when we support hundreds of boards; almost
none of the time, by percentage, will be spent on payloads and cross compilers
anymore.

So my idea was: what if we had a cluster setup where multiple machines have
their own clone of lbmk, but they all stay in sync, re-using the same builds,
for example the same crossgcc builds, but each dividing up tasks between each
other.

For example, if you have 100 boards and 10 machines, those 10 machines in
the cluster would build 10 rom sets each. They would tell each other when
they're all done, and then at the end, there would be a process where they're
all copied.

This could probably be done using an NFS share, for things like the bin/
directory on the release/ directory. We really will need something like this
in the future, because Libreboot's goal is to support literally every coreboot
board, providing automated configurations for all of them.

distcc is probably useful here:

<https://www.distcc.org/scenarios.html>

### ccache

not directly related, but this can speed up coreboot builds

## Fixdep

This would be something to implement in coreboot's build system, but could also
benefit lbmk. Currently, any changes to the coreboot's config results in Make
recompiling all objects, even if `make clean` wasn't run or if the change
shouldn't have an effect. This is because the build system force includes the
generated config.h header into every source, thus making it a prerequisite of
every object. This file contains C macro definitions for the value of all
visible Kconfig options, allowing code to reference these values for various
purposes. Since all of them are contained in this file alone, any change to the
config will cause config.h to be updated, forcing all object targets to be out
of date.

Linux solves this using a utility called fixdep (scripts/basic in the kernel
sources), which parses all source files and their included headers to determine
which configs, if any, an object actually depends on. The config.h prerequisite
is replaced with dependencies on the appropriate config options, allowing make
to skip rebuilding objects that do not have any config dependencies or where
the config has not changed in value.

This may make it possible to avoid running distclean in lbmk between boards,
allowing existing objects to be reused if the new board's config does not
affect the object. This would reduce the complexity of the build from O(n\*m)
to the order of O(m), where n is the number of configs and m is the number of
source files. For maximum effectiveness using fixdep alone, boards would need
to be built in an order that minimizes the differences in configs between
sequential builds, otherwise Make may end up rebuilding an object that was
built previously but overwritten with a new build due to a change in the
config.

Consider:

- Board A, which sets CONFIG_TEST=y
- Board B, which sets CONFIG_TEST=n
- Board C, which sets CONFIG_TEST=y
- test.c, which uses the value of CONFIG_TEST

An order such as A->C->B would be most efficient:

1. A: test.c compiled for the first time with CONFIG_TEST=y
2. C: CONFIG_TEST hasn't changed, so test.o can be reused from step 1
3. B: test.c recompiled, since CONFIG_TEST changed back to n

An order such as A->B->C would be least efficient:

1. A: test.c compiled for the first time with CONFIG_TEST=y
2. B: test.c recompiled, since CONFIG_TEST changed to n
3. C: test.c recompiled again, since CONFIG_TEST changed back to y, even though
   this configuration was previously built in step 1.

Given the number of possible configs, the ideal order is likely impractical to
determine, and some files may necessarily have to be built multiple times with
the same Kconfigs applied. However, the use of ccache would help mitigate this
issue, as it would return cached object files when it detects that the sources
for the object being built are the same as a previous compile.

All of this should be carefully implemented to ensure that the resulting output
is the same as if each file was compiled from scratch each time.

The following article describes the function of fixdep in more detail, under
the header "Dependency tracking":
<https://opensource.com/article/18/10/kbuild-and-kconfig>

Nicholas Chin is looking at this in coreboot.

## Use crossgcc for SeaBIOS and GRUB

We currently use hostcc for the SeaBIOS and GRUB payloads. This, among other
things, means lbmk is currently only supported for amd64 machines.

See other notes on this page about Linuxboot. When that work is done, we will
have better infrastructure for cross compilation, which could also be used for
this purpose.

In particular, GRUB's build system requires you to build certain utilities
first. We use `grub-mkstandalone` to then provide the coreboot payload. For
GRUB specifically, we should therefore use musl-cross-make. SeaBIOS can be
built using crossgcc.

## Port lbmk to BSD systems

In particular, FreeBSD is of interest.

We probably don't need to natively port it, because FreeBSD has Linux ABI
compatibility in its kernel, using *linuxlator*, and you can bootstrap a
Debian system under it.

See: <https://docs.freebsd.org/en/books/handbook/linuxemu/>

See: <https://docs.freebsd.org/en/books/handbook/linuxemu/#linuxemu-debootstrap>

We may still need certain build system modifications anyway, but this would
probably be mostly just documenting how to use lbmk that way.

FreeBSD specifically offers many advantages, such as really good OpenZfs
integration (better than ZFS-On-Linux setups), which it can do natively because
the licensing in BSD is compatible; Linux can't merge ZFS due to CDDL licensing.

An actual native port to FreeBSD is also feasible, and coreboot itself already
has some support for that, as does GRUB. If using crossgcc to build all payloads,
this could be even easier.

Building a Linux kernel might be slightly more challenging, but again: crossgcc.

Adapting musl-cross-make for use in FreeBSD could be interesting. Other notes
on this TODO page talk about using musl-cross-make to provide static linked
utilities in releases, but this has only Linux in mind. Doing them for
FreeBSD may also be desirable.

Libreboot already has excellent support for booting all of the BSDs. Having the
build system be compatible would just be another great boon.

## Package lbmk in distros

Providing binaries of Libreboot in distros wouldn't make sense, because we
do that anyway, on Libreboot RSYNC, but having ports of the build system on
various Linux distros and BSDs might be desirable.

Distro package managers could check when changes are made to a given board,
and if the system you're on matches that given board, the package manager could
provide you with an option to *flash* it.

This would probably only be provided on systems where that is extremely safe,
specifically that those systems have been well-tested. Some ports in Libreboot
are a bit flaky and would require extra work.

It's unlikely that this job will ever be done, but it's on the TODO page
anyway. Distro package managers concern themselves with OS applications, kernel,
libc, bootloaders and so on; Libreboot is a step below them, earlier on in
the boot process.

But then again, there are things
like [fwupd](https://github.com/fwupd/fwupd) that provide firmware updates in
distros, so there's no reason Libreboot couldn't do something equivalent - we
could even do binaries, though I'm mostly thinking of the Libreboot build
system itself. A distro could package lbmk to build for a specific Libreboot
version, and handle all of the dependencies and everything.

## Vendor scripts

### Bruteforce more files

We bruteforce extract IME but some other firmwares are more or less
hardcoded in config.

In particular, VGA ROM extraction could be improved. We could modify
the `romheaders` utility to return zero status or non-zero status based on
a given PCI vendor/device ID; non-zero if it's not a match, for a given file,
or it isn't a VGA ROM. We currently extract an nvidia ROM for certain models
of Dell Latitude E6400, but the logic is more or less hardcoded.

The script at `script/vendor/download` auto-downloads vendor firmwares needed
on certain motherboards, during build time. Libreboot's build system
uses the script at `script/vendor/inject` to add or remove such files after
the fact, on release ROMs, because those firmwares are *deleted* at release
time. This work began mostly after mid-2022, and has since been expanded to
cover many types of firmwares, used on various motherboards.

## Investigate 16MB flash setups

On some ivybridge and sandybridge boards, where flash is 8MB or 12MB,
it is feasible (with some soldering) to upgrade it to 16MB setups.

The IFD is configured accordingly, but some board modification besides
that may be required. For example, on the ThinkPad T440p, SPI2 is easily
accessible but SPI1 requires full disassembly. One could re-wire the board,
removing the Chip Select resistor for SPI1, and the SPI2 CS resistor, then
re-wiring CS1 to CS2 via a resistor, so that only SPI2 is used (thanks go
to Nicholas Chin for describing this idea) - then you stick one big 16MB flash
on SPI2, which is easily flashable.

These upgrades are really only recommended for advanced users. We do already
provide images for them; 16MB ROM images on many GM45 thinkpads, and also
the ThinkPad X230.

A 16MB setup was attempted on the ThinkPad T440p, but didn't boot, and I now
believe it was because I didn't insert the MRC firmware at the correct offset
during that test. Libreboot's build system now handles that correctly, in
the vendorfile inject script at `script/vendor/inject`.

In IFD-based systems, CS1 and CS2 are separate, but data lines like
MOSI/MISO are shared, and the PCH/southbridge will enable or disable the given
flash IC to access the region needed.

## ME Cleaner status page

See: <https://github.com/corna/me_cleaner/issues/3>

It's a good reference, though far from complete. People post there saying
whether their hardware works with `me_cleaner`.

## Overclocking

See: <https://review.coreboot.org/c/coreboot/+/42547>

The patch, now abandoned, is a proof of concept tested on Asus P8Z77-V LX2 with
i7-2600 and i5-3330. It is possible for coreboot to enable overclocking on
some boards, though it's seldom-used and not very universally supported.

It might be useful on some machines. The research here (by Angel Pons) may be
transferrable to other platforms.

## Detect module changes

When a given package is already downloaded and built in some way, lbmk
currently works on the assumption that it doesn't change. During development,
it is necessary to manually delete certain build artifacts, and know what to
delete.

For example, you have to delete `src/grub` after updating the GRUb revision in
lbmk. Lbmk does not, for example, detect when you updated the revision and
automatically adjust to the new revision+patches by: 1) undoing all patches
and 2) running git pull 3) resetting again to the new revision and applying
new patches and 4) cleaning the previous builds

In practise, revisions don't change very often in Libreboot, and they're
normally updated all at once, when they are updated.

## Normal/fallback scheme

Libreboot currently does not handle the normal/fallback payload scheme at all.
Instead, it is assumed that the user will always be booting from the fallback
payload, with no normal payload provided. One single payload. This assumption
is hardcoded into certain logic, in the build system.

Coreboot supports configuring which scheme to use, at boot time, but we don't
use it. Coreboot's default is to always load the fallback, so we use that.

## Improved payload documentation

The actual payload documentation is quite sparse in Libreboot, especially SeaBIOS
but also GRUB. We don't need to repeat what is said by upstream docs, but we
also don't link to them or cross reference them in any way.

We should start writing about the payloads in more detail, referencing upstream
documentation whenever possible.

## Static compiled utils in releases

We currently only provide binaries of the firmware itself, for each motherboard,
but we do not provide utilities compiled. We provide only source code, and the
user is expected to compile utilities from source.

This can be inconvenient, especially if the user is running the vendorfile
download scripts. This should be done alongside providing musl-cross-make for
the linuxboot builds.

## Download repositories in bulk

At present, lbmk does what it needs to do, and downloads repositories only as
required, upon each stage of the boot process. For example, it may download
gnulib when downloading GRUb, after having maybe built 5 motherboards all with
only SeaBIOS, having built SeaBIOS before those 5 - it doesn't build SeaBIOS
and GRUB before the 5.

What this means is that the internet may work at one stage during a build,
but for very long builds (ones that take hours, which some do), it may be that
the user's internet goes down, and a latter part of the build fails, where it
might have succeeded if packages were downloaded much earlier and in bulk.

### Optimisation

So, TODO: Make lbmk determine precisely what packages would later be downloaded
through various parts of a build, for a given command, and do it all at once,
and then build. This is also better because, for very large amounts of modules,
that take a long time to install, existing downloaded modules could be built
while the download is in progress, to save on overall build time. This would
be especially beneficial on slow internet connections, where a larger amount
of time is spent downloading that building.

In this context, slow internet means 20Mbps or less. Libreboot downloads a *lot*
of code during the build process. For reasonable build times, it is currently
recommended that you run lbmk an on internet connection that is at least 100Mbps.
You can still use slower connections, it'll just take longer.

## Don't copy src trees

For multi-tree projects, lbmk currently copies the source code per tree,
e.g. `coreboot/default`, `coreboot/dell`. What could be done instead is to
use the existing Git history as-is, and just make a new branch, with whatever
patches, at the given revision.

At release time, to save space, the given repository would have its history
re-initialised, with the code branches reset per tree, and the source code
copied, then committed - *this* would actually create *more* copies than lbmk
currently does, thus using the disk more heavily, but only during release time.
For normal builds (from Git, or from released archives), less disk space would
be used, and there would be less disk I/O. This would especially reduce wear
and tear on SSDs, where Libreboot is used.

This may have some complications, where submodules are used. A solution to this
would be to define those submodule repositories under lbmk's `config/git/`
instead, and from there, define them as dependencies for a given project. Where
a multi-tree project defines them, those dependencies could themselves be
treated as multi-tree in the ame way as described above, even if they don't
have a configuration for that in lbmk, because they are already used as
dependencies in the multi-tree projects - in this case, if no custom config is
provided, they would just use whatever revision is used in the defined submodule
for the main target project that lbmk is downloading for.

## Vendor scripts

### Check hashes of resulting files

Libreboot extracts the files from vendor updates, and those updates are checked
against known hashes, but lbmk only defines such hashes for the larger updates
themselves. hashes for the files extracted could also be defined, mostly as a
way to ensure that they were correctly extracted, though it could default back
to current behaviour (only check the main file) if individual checksums for
inside files are not defined.

## Reproducible builds

We can't focus on this reliably, because we use hostcc extensively for many
parts of the build process. Other parts of this TODO page talk about how to
integrate linux as a payload, by improving our cross compiling setup.

Cross compilation is the first step to reproducibility, because then we only
have to worry about the toolchain, which is easier to control. We can start
focusing specifically on reproducibility once all of that has been done.

### Tarballs

We already have partial reproducibility, though we currently use the `-T0`
option in xz, whereas `-T1` is more appropriate; forcing it to run on 1 core
will ensure that the file is always compressed in the same way.

See: <https://reproducible-builds.org/docs/archives/>

We already pretty much are right on the money. The main task that we still need
to work on is cross compilation; specifically, we need to actually cross compile,
because most code is compiled by hostcc when we use lbmk. This is covered in
another section, on this TODO page.

Also: <https://lists.debian.org/debian-dpkg/2016/10/msg00012.html>

This post writes about the rationale for `-T1` when using xz.

## VGA: Run-time, not build-time

In coreboot, configuration of video initialisation is done at build time. This
has several disadvantages, in that you now need multiple ROM images for multiple
configurations, but it has the upside that the resulting ROM image will have
fewer bytes of code within it.

From an lbmk perspective, the upsides are largely ignored because we want to
build hundreds and hundreds of ROM images, fast. That means reducing the amount
of time spent to compile for each motherboard.

We currently do this on each motherboard:

* libgfxinit with text mode startup, if possible
* libgfxinit with coreboot framebuffer, if possible
* vgarom setup when desirable; usually executed by seabios, not coreboot

This is often literally 3 different ROM images, for all of the above. It is
possible to have a libgfxinit setup where SeaBIOS is the payload, so that VGA
ROMs can be executed as well, but this has several issues, covered elsewhere on
this page.

It would be nice if all of this could be runtime options instead. By "runtime",
we do mean modification of the ROM image, but not in a way that requires a
full re-build. A good example of this would be the SeaBIOS runtime setup:

<https://www.seabios.org/Runtime_config>

On SeaBIOS, it is not necessary to re-build for the most part (though some things
are still left to build-time config). Instead, you edit files inside the
coreboot file system (CBFS), that SeaBIOS will use to configure itself at
boot time.

We could take a note from SeaBIOS and do that here, but in coreboot. Why is it
that we need separate ROMs just to switch between the coreboot framebuffer or
classic text mode startup? Why can't it be the same ROM?

If we were to do it at runtime like described above, we could cut the build
time in half, or even more than half; we could cut it down to about 30% of the
current time. Disabling libgfxinit could also be a runtime option. It's already
possible to change the payload at runtime for instance (manually), by running
cbfstool.

## Modularise the coreboot stages

### ie. generate cbfs in lbmk

We currently use the coreboot build system which is designed to build all
stages, such as the bootblock, car, ramstage, romstage etc. The coreboot build
system already builds these separately, as separate binaries, and then joins
them all together inside the CBFS (coreboot file system) of the target ROM
image. Essentially, coreboot creates the empty file containing CBFS, and starts
adding all of the files.

The logic is already there in coreboot, but it does everything all at once.

We might benefit from splitting this, within the coreboot build system, so that
it's possible to do one stage then another, separately, and then we could
use *lbmk* to join them, initialising the CBFS and adding all of the stages.

This could be useful when we *do* actually need a build-time configuration
changed, but where many stages are identical between different build-time
setups. This could then be abused, to substantially reduce the overall build
time in lbmk. We want to build hundreds of ROM images in coreboot, and that
takes *time* - too much time.

This will require working with upstream, and in practise require that they
accept such proposals. The build system design in coreboot is already ready
for this sort of thing, and it could be done with minimal complexity - the
current behaviour would be retained as a default.

We might have to backport to some older revisions, because lbmk uses certain
older revisions on some machines, e.g. AMD AGESA platforms.

## Macbook21 C-states patch

See: <https://review.coreboot.org/c/coreboot/+/63587>

We currently reuse the same ROM image for macbook21 on the imac52, but it is
now believed that the C-state config there is not suitable on imac52. See patch.

TODO: test on imac52 and macbook21. If confirmed (again, see patch, the problem
is described there), we can expand it to configure c-states differently on
imac52. This config is used to enable efficient power management, on these
machines.

### How to dump c-state config

```
i2cdump 0x69
```

dump the c-state config from apple efi firmware

imac5,2 breaks with the current c-state patch used in libreboot, according
to `f_` on IRC.

powertop can give info about available c-states

also: don't use efi grub or anything efi on non-macos operating systems on
these machines, doesn't work well in apple's firmware. mentioned by avph in
the gerrit link (see above)

## Check file ownership in builds

When lbmk is running, it is assumed that the current user has ownership of
the files. If lbmk is operated on a clone that is under different ownership,
it might fail in strange ways; for example if you had read access but not
write access. There is already general error management all over lbmk, where
a given command returning non-zero status will result in lbmk pretty reliably
exiting, and printing the error on screen for the user.

However, we do not specifically check permissions/ownership of files. For
example, the user might have cloned lbmk as root to run the dependencies
script, and then they want to run lbmk. We already make lbmk exit, with non
zero status, if it's run as root, for safety reasons, but this does not
apply when lbmk is run on a clone that is owned by another user.

Lbmk could specifically check for this at startup, and provide a specific
warning message to the user, so that they know what to do to fix it. Lbmk
would also then exit earlier, rather than trying to run something, which
might result in very unpredictable behaviour.

### Sanity checks

We basically should have startup sanity checks in general, such as checking
whether all the right dependencies are installed on the host system - similar
to autoconf setups used by many GNU projects, though we don't want to use
autoconf, it's bloat.

If a sanity check is passed, a configuration file can then be provided, which
can be used to control how lbmk runs. For example, if a certain version of a
library is installed that behaves differently from a newer version, lbmk
might have logic implemented that makes it behave differently depending on
which library is installed. The general goal of lbmk is to be as portable as
possible, but without introducing too much complexity into its design, so this
TODO item will have to be handled with a lot of core.

Remember the mantra: code equals bugs.

We are running lbmk on extremely buggy systems, such as Linux. We do not yet
have native support for running on BSD systems for example. This TODO entry
is basically the same thing as the other entry on this page about porting
to BSD. So tackle both.

## Software Bill of Materials

Generate an SBOM for all of Libreboot, on release builds specifically; it can
be skipped for performance/convenience reasons on regular development builds
from git. See: `script/update/release` - it would be handled here, because this
is the script that actually generates full release sets.

SBOM is a requirement now, in many commercial contexts, depending on how
software is used, or how it's shipped. For example, if you're providing software
to certain government departments, in certain countries, they may require it.

We can't know where Libreboot will be used. Let's automate this problem so that
our users don't have to. Coreboot already has some support for this, in its
build system, and we could adapt the build systems of other projects, and tie
it all together from lbmk.

The way lbmk works makes it very simple to implement something like this. The
SBOM is literally just a thing that says what's included in a software release,
or an aggregate distribution of software in our case. Libreboot's build system
already has to have things like repository links, revisions, lists of patches
and so on, to know how each piece of software is configured.

I'd say this would be handled in, say, `include/sbom.sh` within lbmk, with a
minimal stub in `script/update/trees` that handles it. All it would do is
generate an sbom file by reading everything under `config/`. This would not be
used automatically, during regular development builds, but it would be used
by `script/update/release`. It could output the sbom to regular `stdout`, with
errors outputted to `stderr` (specifically, and deliberately - like if a certain
piece of software is missing or disabled or something, write about that in
stderr, though the actual sbom data would be on stdout).

Let's say you do it as `-z` - ok, but the script handles specific projects.
So now we do:

	./update trees -z coreboot

This is just one example. The `trees` script already knows how to read configs
of all the projects, so that it knows how to download and build them. It would
just output that in a parseable format, to stdout. Then you might do for
example:

	./update trees -z coreboot 1>sbom.txt 2>sbom.txt.err

But oh, what's this? We already know that the trees script can handle multiple
projects. For instance:

	./update trees -z flashprog pico-serprog grub seabios

Then it would output for all of those. It just goes in a loop.

This is just an idea. Anyway, this should go hand in hand with reproducible
builds, which is mentioned elsewhere on this TODO page.

This is a very unix-y way to do an sbom, in lbmk, which is already a very
unix-esque build system design. Write one thing that does one thing well. We
pretty much already have everything we need to implement this.

NOTE: The above is not necessarily the best way to handle an SBOM, it's just
one possible idea off the top of my head, proposed that way because it would
minimise the amount of complexity needed in lbmk, to handle that use-case.

NOTE: the `-z` option in ./update trees is not yet implemented. Again, the
above just a concept.

## Reuse build artifacts

Libreboot's build system, lbmk, does not reuse artifacts well. It largely
assumes that you are building everything from scratch, which is great for
release builds and is very simple, but sometimes that can be annoying during
development. This pretty much goes hand in hand with the other TODO item on
this page, about lbmk checking itself when a given codebase or config gets
updated, so that it can adapt itself.

Most notably, lbmk runs distclean on most/all codebases before then running
make-all. This is done for simplicity, and in practise usually works OK because
most projects only get built once, unless they are modified (by a developer).

This might be useful for:

### Partial coreboot re-builds

A lot of the time in lbmk, we are building multiple variants of the same
motherboard, for different setups. We could skip a lot of the re-building.
This pretty much goes hand in hand with the other entry on this TODO page,
about splitting up the various stages in coreboot, and handling CBFS generation
within lbmk.

### Notes about Git

See: <https://github.blog/2020-12-21-get-up-to-speed-with-partial-clone-and-shallow-clone/>

This guide has some useful information about using Git, and some of it may be
useful for this goal. There are many cases where we download all of the Git
history for a given project, where we really only need a small part of it. We
could speed up the downloads a lot, and also speed up the builds a bit (by
reducing the amount of deltas that need to be resolved when cloning).

In particular, Git Work Trees are a useful feature that we might use in lbmk.

## Chinese users can't run lbmk

Libreboot has quite a few Chinese users, but the Chinese internet blocks access
to several sites like github - and apparently the coreboot gerrit site is also
blocked, where we clone coreboot from.

We'd need to get Chinese internet users to test this, but lbmk should be
modified to work on the Chinese internet, when downloading packages. China is
a huge country with over 1 billion people, all of whom deserve to use coreboot.

We could provide special branches of lbmk with patches in it, that make certain
upstreams be altered. For example, download coreboot from several mirrors that
are not blocked in China.

I did toy with the idea of making a Gitee account (China's not-invented-here
copy of GitHub), but registration required a Chinese phone number, so I couldn't
make an account. I was going to set it up for Libreboot.

## me cleaner is old

From what I can tell, `me_cleaner` is not well-tested or supported on many
newer Intel platforms. it shouldn't affect us in Libreboot for now, because we're
not even past Haswell yet, but see for instance:


### Also: disablement

See: <https://github.com/corna/me_cleaner/issues/278>

This looks interesting. It seems on some arrandale machines it's actually
possible to completely disable the ME (remove it from the nor flash),
with "almost no ill effects" according to the OP on that issue page.

## FAQ: cover USB fuzzing attacks

We write on the FAQ that SATA devices could potentially have DMA capability,
but this has still not been proven, and it's probably not true in practise.

USB may not have DMA, but it's possible to perform what's called a fuzzing
attack, whereby a USB device pretends to be something such as a keyboard,
a mouse, a networking device, or any number of things in quick succession.
A wily attacker could program a small USB dongle, and plug it into your running
machine. If your operating system is insufficiently secured or otherwise
poorly configured, and attacker could then remotely control your machine,
and steal data.

You can just look up "USB fuzzing attack" online. There are several actually
practical examples of it in the wild, and it's really easy to do. Easy meaning:
cheap. It's a low-effort attack.

So we should cover it, and talk about ways to mitigate the risk (e.g. disable
USB input devices and networking devices, in the user's operating system).

## Auto-configure IFD region limits

We currently configure the ME/BIOS region sizes manually, which is fine, but
the way it's configured is very complicated.

See: [Vendor file guide](../install/ivy_has_common.html)

The way the Libreboot build system works, the Intel ME and other firmware is
automatically downloaded at build time. At release time, files such as these
are deleted, but an extra *insert* script is provided that can provide the
same auto-download and auto-insert on release ROMs.

The default Intel ME firmware is about 5MB in most setups. We
use `me_cleaner` which removes a lot of the malicious features in the ME,
and truncates it to a much smaller size, e.g. 96KB on ivybridge systems (down
from the default 5MB).

We currently configure this manually. We could do it automatically, though it
should not be done automatically at build time, but at the time of adding
a given machine to Libreboot. We could automate it like so:

* Download the vendor update, and use the bruteforce extraction method to get
  at `me.bin`
* Run the `me_cleaner` program, and get the size of the ME.
* Pass it a factory dump, and run `me_cleaner` on that, to set all the
  extra bits like HAP, but don't use truncate.
* Run the `--unlock` command in ifdtool, to unlock that ROM.
* Auto-configure the IFD region sizes in that dump, based on the truncated
  size.
* Extract the final IFD, and the GbE region if it exists.

Then it can configure the config file under `config/vendor/`.

After this, lbmk would still have static configs, not altered in any way at
build time, but this would be an automated way to add new configs. Read more
on the guide linked above, and read the vendor scripts themselves, to learn
more; you can also read about them on the [lbmk maintenance
manual](../maintain/).

## Signed commits

Start signing commits in Git. There's nothing more to say. Just do it.

## Secure suspend method (LUKS setups)

See: <https://github.com/shmalebx9/luks-suspend-portable>

Caleb came up with a method to have suspend functionality, where the encryption
keys are not stored in memory. It's worth looking into. We might be able to
provide something automated in lbmk.

## USB keyboard in secondary payload

We don't use secondary payloads defined here, but see:
<https://ticket.coreboot.org/issues/484>

The issue page has info about the problem, and a workaround. Listed here
for reference, in case this functionality is ever used in Libreboot.

## zstd in btrfs on grub

Reported buggy by a user on IRC. TODO: test it

zstd is the compression used in btrfs, when compression is enabled. No other
information was given, other than it is "buggy". Reported
on Libreboot 20231101.

## Optimise crossgcc space

Reuse crossgcc from other coreboot trees, in other coreboot trees. We currently
build several versions of it, but we probably only need one, maybe two. Audit
this, across various coreboot trees. Specific coreboot trees (older ones) could
just be patched if re-using crossgcc from a newer tree.

## T60 /proc/acpi/ibm/thermal

Reported by a user (unknown what LIbreboot version), this file is not available
at all. It was later revealed that the user flashed a ROM image without microcode
updates, triggering the AE18 errata. Thermal management is buggy without the
updates, on that platform.

## Link CPU errata PDFs

Libreboot makes reference to CPU errata in documentation, but without actually
linking to the documents themselves. Link to the PDFs for all available CPUs,
on supported Libreboot hardware. AMD has them too. These are errata documents
that define which bugs exist in each CPU, and which ones have been fixed by
microcode updates - they also generally provide information for OS developers,
to know how certain bugs should be mitigated, whenever possible.

## Macbook2,1 backlight controls

Was reported broken in linux 6.1, but works in 5.x

Since linux 6.1, the backlight subsystem was revamped. Try one of the
cmdline options:

* `acpi_backlight=video`
* `acpi_backlight=vendor`
* `acpi_backlight=native`

More testing is needed on this. So far, nothing seems broken on other machines
tested and no user reports have come in. The way backlight controls work on
coreboot can differ a bit from the vendor firmware on some boards.

Not really a major issue, but it does need to be addressed.

### TODO: test other platforms too

Test other platforms.

## Document CH341A variants

All CH341A variants are garbage for ISP-based flashing, because of weak
drive strength and poor board layout, also the WP/HOLD pins are often held
high via straight connections to VCC on these boards (rather than going through
a pull-up resistor, as safe electrical design would dictate).

However, Libreboot currently only documents the black and gold one, that comes
with 5V logic levels by default, and it has information for how to modify it
so that the logic level are 3.3v - in addition, there are 1.8V logic level
adapters, that just come with logic level converters on them.

The original green variant is 3.3v by default, and some newer variants have
adjustable voltage for the logic levels.

For socket-based flashing, they're actually quite decent flashers. Quite
convenient, because you don't have to mess with a breadboard or anything,
because they already have ZIF sockets on them for DIP-8 ICs, on which you can
also use adapters for SOIC-8, SOIC-16 and WSON-8.

### E6400 VGA ROM (Nvidia)

See: <https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=990662#22>

Although we couldn't reproduce it after testing, a redditor did report that
following these steps caused nouveau to work.

Also: `e6400nvidia_4mb` works better on that setup, nouveau is actually stable
in some cases. Check the E6400 page for libreboot, it lists issues with nouveau
on those machines.

### Test Crystalwell CPUs on T440p

Coreboot has support for these, but they have not been tested as far as I know,
and no reports have been made for them by Libreboot users. These offer higher
performance and the machine is already very nice.

Ditto W541.

### How to extract VBT data

See:

* <https://manpages.debian.org/bullseye/intel-gpu-tools/intel_vbt_decode.1.en.html>

Extract it from the vga rom, the vbt header is in there, and the number of bytes
will be in the size field, so that one can know how many bytes to extract. One
of these tools linked above prints it.

The VBT table is needed on machines where intel libgfxinit is used. It can just
be extracted and included in a coreboot port.

Also see: intelvbttool in coreboot. How to use:

	intelvbttool --inlegacy --outvbt data.vbt

Example patch (merged in coreboot) that used this:
<https://review.coreboot.org/c/coreboot/+/79625>

## Guix: use debootstrap

GCC-Gnat is unavailable in Guix, due to the distro's requirement for sources
to be bootstrapped. GCC-Gnat is also required, for building GCC-Gnat. We build
it in libreboot, to provide libgfxinit, because it's written in Ada.

Therefore, lbmk cannot be used reliably in Guix. It's possible to just add
a binary for Gnat to the host, and then use that, but there is another idea:

Guix *does* have debootstrap, which could be used to bootstrap a Debian system,
and install everything in that, including GCC-Gnat. Of course, we don't need
to do anything for this in lbmk, but it would be nice to document.

In fact, it wouldn't necessarily need to be specific to Guix, because many
systems have debootstrap; FreeBSD also has it, and it's even mentioned here
on this page, though in the context of *porting* lbmk to FreeBSD.

Perhaps this could be done:

In the logic for `./build dependencies distroname`, add an option for Guix,
but on that one, make lbmk automatically set up debootstrap if it's being
run for Guix (and it would detect whether the host actually is Guix System).

## docs/build/clean.md

Add this section, telling the user (of lbmk specifically) how to clean various
directories. This isn't handled universally, due to lbmk's design. When
updating revisions, a lot of manual intervention is needed if an existing
revision was already downloaded, especially if it was built.

For example, if you already compiled GRUB at a given revision, it will be
present under `elf/grub/`. If you're updating the revision in lbmk, you must
delete `elf/grub` first. Similarly, if you're testing out code changes, you
have to know to do that and re-make GRUB.

This section relates to another section on this page, about automatically
handling such updates in lbmk when it runs. Until that is done, this section
is also here. We should document how this is handled, under the current scheme.
A lot of development on lbmk requires the operator to *know* how lbmk works.

The preference however is to simplify and automate everything as much as possible.
That is Libreboot's philosophy, that the user should never have to do more than
is absolutely necessary when someonething could just as easily be done in code.

## E6400 security

See other section on this page about write protection.

Setting PR registers for write protection is a valid way to write protect on
Dell E6400, and it would not be affected by the flash-unlock utility.

### SMM methods

Tere are two SMM write protect methods:

The old lock enable bit, which causes an SMI to be triggered whenever BIOS write
enable is changed back to 1. Then SMM needs to change the BISO write enable back
to 0. Not the best option as it is vulnerable to timing attacks where a write gets
through before SMM can change it back.

On newer chipsets (5 series and newer, basically everything newer than GM45),
there's a new bit called SMM BIOS write protection, which prevents flash
from being written to unless all cores are in SMM, which is better than the other
method.

^ These notes were supplied by Nicholas Chin via IRC.

## PCI-E REBAR

See: <https://github.com/xCuri0/ReBarUEFI>

This is *required* on some newer graphics cards, and can otherwise improve
performance when supported. Support supports
PCI-E REBAR - apparently some GPUs need it.

It allows the host CPU to access all of VRAM at once, without 32-bit legacy
code. The above repository is a proof of concept that shows it working, though
the work there is not directly applicable to us.

This feature is only supported commercially on much newer motherboards, and is
unavailable on many older motherboards, but it can be added if the firmware is
updated. This is one of the benefits of the *freedom* coreboot gives you. We
could enable this on all the older desktop machines, where otherwise their
factory firmware does not and will not enable it (and the above link is for
UEFI systems only).

## Shrink FSP size (Intel)

See: <https://blog.osfw.foundation/breaking-the-boundary-a-way-to-create-your-own-fsp-binary/>

Remove modules from FSP that coreboot doesn't use. This will especially be
useful on setups where linuxboot is to be enabled. Initially done on Alderlake
but possible on other platforms.

Thanks go to Nicholas Chin for linking this.

### Chromebooks

Especially useful here, if using the default setup. In the default setup,
there are essentially three copies of the firmware in flash: a recovery
image, an "A" image and a "B" image, according to Nicholas Chin.

## Compare factory/download neutered ME

Use tools and hexdump diffs to compare neutered Intel ME images,
comparing ones neutered from factory.bin dump, and ones from
the auto-downloader in lbmk.

Probably no difference, or no differences that matter, but we never
tested this (no problems so far, since mid/late 2022 when we started
doing this in osboot, and heads did it for years before we did, and
they never had any problems).

## HP 820 G2 TPM

TODO: check that it can be upgraded to TPM 2.0 (default is 1.2).
It's a SLB 9660 TPM

<https://community.infineon.com/t5/OPTIGA-TPM/SLB-9660-TT1-2-upgrade-TPM-1-2-to-TPM-2-0/td-p/382419>

<https://support.hp.com/gb-en/document/c05792935>

Apparently, this can be upgraded to TPM 2.0. Riku linked this on IRC:

<https://forum.ts.fujitsu.com/forum/viewtopic.php?t=49340#p156746>

And also this, straight from the horse's mouth:

<https://www.infineon.com/cms/en/product/security-smart-card-solutions/optiga-embedded-security-solutions/optiga-tpm/slb-9660xt1.2/>

## 4th SSD on T440p

probably possible on w541 too

<https://www.youtube.com/watch?v=jURgHzLrpBs>

<https://www.youtube.com/watch?v=gAZw0fTKdYg>

this was tested on windows in the lenovo firmware, but it will
be possible to use this in coreboot with linux/bsd

todo: test it. need to actually solder it and test it.

## Disable ME device in devicetree

We neutered, but coreboot still enables MEI1 on many boards.

Look in devicetrees within coreboot, and see:

```
			device ref mei1 on end
			device ref mei2 off end
			device ref me_ide_r off end
			device ref me_kt off end
```

Example taken from lenovo/x230. We could just turn all of these off.
It doesn't affect anything in practise, whether this is on or not, because
we neuter anyway, so the ME interface is broken by default. Leaving it
on in devicetree will result in a benign error message on linux dmesg.

## Switchable Graphics (Optimus)

Some of the Thinkpads we support have dual graphics, using Nvidia Optimus.
It'd be nice to have. This coreboot patch enables it on Thinkpads:

<https://review.coreboot.org/c/coreboot/+/28380>

There are other patches on Gerit, related to Optimus too:

<https://review.coreboot.org/q/Optimus>

This should be looked into.

## Overclocking (CPU and RAM)

Coreboot could be modified to support overclocking. Here is an example
patch on gerrit (not merged in main):

<https://review.coreboot.org/c/coreboot/+/42547>

Coreboot can also be used to load custom SPDs for the RAM if you want to get
into re-binning (as it's called. Thank you Riku for telling me that this is
what it's actually called). Useful if you want to quickly test.

Libreboot is starting to support machines where some users may want to start
overclocking their CPU/GPU/RAM.

As for GPU overclocking: usually there are programs you can run for this in
your operating system, but sometimes on laptops with dgpu, the VGA ROM might
limit it in some way.

This article is from someone who modified the VGA ROM on their AMD Radeon
graphics chip, in a laptop:
<https://habr.com/en/articles/232265/?_x_tr_hist=true> - it is an example of
the sort of thing lbmk could automate, when auto-downloading those VGA ROMs,
on certain machines. NOTE: Page is in Russian, use a translator.

The type of people (enthusiasts) that like Libreboot would be into this sort
of thing. It may be interesting to study, especially on haswell machines.

### Haswell

<https://www.youtube.com/watch?v=vCZiTSZutR4>

interesting video on alienware laptop (haswell), and there are other examples.
those machines, whether they get ported to coreboot or not, could be used
to study what affect those options have: take dumps of hardware logs using
various utils, before and after, to study what change those settings actually
makes. this could reverse engineered to then add those options in coreboot.

haswell overclocking would be very useful to have, on libreboot machines,
because you can get some still-very-nice CPUs for these machines.

## X60/T60 alloc magic is broken at 0x7b1aedf0: 0

See: <https://codeberg.org/libreboot/lbmk/issues/179>

Reported on T60. Another user reported on X60. Happened when booting from
battery. On the X60 reported, booting with charger connected worked, but
this GRUB error is produced when booting on battery.

Happens in 20240126 and 20240225. Does not happen in 20230625.

A bisect is indicated; possibly in GRUB, but if nothing is found there,
then the bug will be in coreboot. Could be either of them.

Could be a bug in GRUB's memory management. And/or regression in
coreboot raminit. More testing is needed.

NOTE: May 2024 release is using coreboot from 20230625 on these laptops (i945)
to work around the issue, but it'll possibly be fixed before that release,
otherwise afterward.

## Intel/AMD errata PDF

List PDF links for Intel/AMD CPUs, provided by Intel/AMD, showing what is
unpatched as of yet, in microcode updates.

<https://www.intel.com/content/www/us/en/products/docs/processors/core/core-technical-resources.html>

<https://github.com/intel/Intel-Linux-Processor-Microcode-Data-Files/blob/main/releasenote.md#microcode-20230808>

Links.

## interesting video

<https://www.youtube.com/watch?v=5qauRh7eTNY>

## Automate testing

Even though there's lots of error handling, it's better to be paranoid than
brick users' machines.

### Unit tests

- Build time or separate?
- me_cleaner -c: checks that ime was inserted and has valid signatures

### CI

Preferably self-hosted. Run tests for every commit. There could be tests of
different size, and even a periodic nightly release could be done.

Integrating this with an automated test stand would also be doable. At the
very least, it would assure that the ROM images boot successfully.

## Board status

As the number of ports grows, it becomes harder to keep track of what works.
Let's build a machine-readable repo documenting every release (or commit)
on every board. What features/payloads work, maybe include errata text field.
A HTML report could also be generated and published online.

On top of this, an easy to use installer could be developed. It would know
to not install an unbootable (broken) ROM, and would inform users about any
known problems and have meaningful options.

## haswell board bifircation

<https://www.mouser.com/pdfDocs/4th-gen-core-family-desktop-vol-1-datasheet.pdf>

page 89

also

<https://winraid.level1techs.com/t/bios-mod-to-enable-pcie-bifurcation/31547>

## ec hacking on lenovo x230

<https://zmatt.net/unlocking-my-lenovo-laptop-part-2/>

## DELL 7th gen


3050 micro is being worked on.

3050 sff and mt are TODO

5050 models also.

## Dell 3020

another haswell. different to 9020, but could be added.

## Dell 3050 Micro century byte

The `CONFIG_USE_LEGACY_8254_TIMER`
and `CONFIG_USE_PC_CMOS_ALTCENTURY` options must both be
enabled. Discovered in patch `d1743d1f64720801146b162c01568ca0023dfb00`
of lbmk; look at that revision and the next one after it,
revision `237fa1e3c18365794bf5bf525df99a460c821192`.

As of that revision, SeaBIOS works normally, on Dell OptiPlex 3050 Micro.
It was hanging. Look at the patches about 10 revisions before
then, from when the 3050 was first added to lbmk. I made, at that time,
a bunch of changes to match upstream as closely as possible,
until fixing it in the above revisions.

While SeaBIOS does indeed now work perfectly on this machine, I still
don't know why it was broken before. We have our smoking gun, but
now what needs to happen is for this bug to be re-introduced, using
the above information as reference.

Then, follow SeaBIOS execution with serial debug, possibly inserting
print statements into parts of the SeaBIOS source code. This would be
desirable, so that SeaBIOS can be used with the above two options
turned off.

When debugging the issue, I initially tried many things. The issue was
not to do with the SeaBIOS revision, though I also changed that to the
one used by coreboot at the time, instead of the slightly newer one that
lbmk was using; I even directly used coreboot's own SeaBIOS build, instead
of lbmk's. Weirdly, I did also try with the legacy 8254 timer enabled, but
without enabling the alt century byte option; when disabling the latter,
relative to the above commit, that's what broke SeaBIOS again.

For now, Libreboot will leave these options enabled, but this is not
desirable.
