---
title: Other Libre Firmware projects
toc: true
---

Libreboot is a coreboot distribution. Libreboot's build system automatically
downloads, patches, and builds all the various upstream sources such as
coreboot, GRUB, SeaBIOS, U-Boot and so on. This automation is used to provide
[binary releases](../download/), which the user can [install](../install/).
Coreboot is requires a high degree of technical skill to configure and install; 
distros like Libreboot attempt to make it accessible to more users.

Libreboot was the first coreboot distro founded in December 2013.

Although Libreboot tries to support a wide range of hardware, there are certain
limitations. For example, Libreboot mostly does not target Chromebooks. If
Libreboot isn't for you, you mind find the following to be useful.

## Other coreboot distros

Note that coreboot also maintains [a list of
distros](https://coreboot.org/users.html).

### [Canoeboot](https://canoeboot.org)

Canoeboot is a special fork of Libreboot, maintained by the same developer,
Leah Rowe. It provides a *purely* free software coreboot distribution, due to
its [policy](https://canoeboot.org/news/policy.html), and therefore supports
only very old hardware.

It otherwise has the same design as Libreboot and is kept in sync, often doing
releases on the same days.

If you're an absolute Free Software fanatic, Canoeboot is for you. Otherwise,
if you want to use much newer hardware, Libreboot is a worthy choice. Since
Canoeboot only supports much older hardware, and uses Libreboot's *old* policy,
you could consider Canoeboot to be *legacy Libreboot*

### [Chultrabook](https://docs.chrultrabook.com) and [MrChromeBox](https://docs.mrchromebox.tech/)

Provides a tailored EDK2(UEFI) payload on supported Chromebooks. You can use
this to replace ChromeOS with a regular Linux distro or BSD system (or even
Windows) if you wish.

The benefit of using them is that it provides up to date EDK2, unlike
proprietary vendors who often provide old, CVE-ridden versions of EDK2 forks
such as InsydeH2O.

With either's guidance, you can have a completely up to date UEFI firmware
on your machine, and get good use out of your Chromebook for many more years,
with regular security updates.

Libreboot largely avoids supporting Chromebooks, precisely because Chultrabook
and MrChromebox are perfectly viable options on these machines.

One of Chultrabook's maintainers, Elly, did [this
talk](https://www.youtube.com/watch?v=7HFIQi835wY) at 37C3 conference,
demonstrating Chultrabook: &mdash; and also did this more general talk about
coreboot [at 38C3](https://www.youtube.com/watch?v=LD9tOcf4OkA). It's very good
reference material if you want to know more about coreboot, and coreboot
distros more generally.

Elly also did [this interview](https://www.youtube.com/watch?v=4Am_1MzJ6ZA)
with Brodie Robertson, about coreboot, and explains the concept of a coreboot
distro in more detail in one part of the interview:

### [Dasharo](https://docs.dasharo.com)

Supports many machines, with a choice of EDK2(UEFI) or Heads(Linuxboot)
payload in the flash. Some older machines may provide a SeaBIOS payload
instead. A lot of work that goes into the upstream coreboot project came
from the Dasharo developers.

Dasharo provides their own fork of coreboot, with a specific tree *per board*.
Several coreboot ports (e.g. MSI Z690-A PRO) were implemented directly by the
Dasharo project, and later upstreamed into the regular coreboot project.

Dasharo has a special emphasis on commercial application, providing tailored
coreboot images for each supported motherboard, with an emphasis on stability.
It's a very different approach than Libreboot's; Libreboot provides a more
generalised design in its build system and infrastructure.

### [Firmware-action](https://9elements.github.io/firmware-action/)

<!-- **TODO: Link their FOSDEM 2025 talk when it becomes available on archives.** -->

Launched at the start of 2023, this project by 9elements provides
a source-based package manager similar conceptually to lbmk; it downloads,
patches and compiles various upstream sources, specifically coreboot,
Linux, Tianocore/edk2, u-root and others.

It currently does not provide specific build targets pre-configured, nor
binary releases, but it could theoretically be fashioned that way, and this
was asked of them at their FOSDEM 2025 talk, during questions and answers - and
much of what it's trying to do could inspire aspects of Libreboot's design in
the future.

Their build system design is interesting, and has many of the same sort of
features lbmk has, such as tracking of build artifacts / re-use of build
artifacts to speed up re-builds. I (Leah Rowe, Libreboot maintainer) learned
of Firmware-action because I attended their FOSDEM 2025 talk. It is listed on
this page, because their build system design *can* be used to provide a fully
fledged coreboot distribution, with binary releases.

The goal of the firmware-action project is to provide a fully reproducible
build environment, for integration with a CI/CD setup during coreboot
development. This build system has great potential to provide a useful
competitor versus, say, Heads or LinuxBoot projects. The design of this build
system could also be adapted to provide many different coreboot payloads,
even ones that it currently doesn't support, such as GNU GRUB.

### [Heads](https://osresearch.net)

Heads provides a LinuxBoot payload using U-Root, and has many advanced features
such as TPM-based MeasuredBoot. With combined use of a FIDO key, you can easily
and more reliably determine whether you boot firmware has been tampered with.

The Linux-based payload in flash uses kexec to boot another Linux kernel. It
provides an easy to use boot menu, highly configurable and supports many Linux
distros easily.

If you're the sort of person who needs full disk encryption and you have a
focus on security, Heads is for you. Perfect for use with something like Qubes.

Libreboot provides its own [security
mechanisms](../linux/grub_hardening/), but Heads is much more flexible
and complete in this regard. The only downside to Heads's Linux-based flash
setup, is that it's basically a Linux-only coreboot distro (whereas Libreboot
can boot BSD and even Windows in some cases).

Another focus of the heads project is on reproducible builds. Its build
system bootstraps a toolchain that then compiles everything else, including the
coreboot crossgcc toolchain. The purpose of this is to provide matching ROM
hashes on every build; for this purpose, it also auto-downloads vendor files
such as Intel ME at build time, instead of requiring you to dump from the
original boot firmware.

Heads's vendorcode auto-download logic inspired Libreboot's own vendorcode
inject; Libreboot greatly expanded on it onto more machines.

We in Libreboot have an affinity for the Heads project, and have worked with
them in the past, and they with us, helping each other back and forth. Many of
the machines supported in Libreboot are also supported in Heads, and vice
versa, but they target different kinds of users and use-case scenarios, with
Libreboot targeting a more general audience (while providing security hardening
options), whereas Heads specifically targets security-conscious users.

### [Skulls](https://github.com/merge/skulls)

Skulls provides simple coreboot images with SeaBIOS payload, on a handful of
ThinkPads. Libreboot also provides similar SeaBIOS configurations, on all of
the same machines, but Libreboot's design does mean that there are a few
additional steps for installation.

If you just want the simplest, most barebones setup, Skulls is a great choice.

Libreboot also provides U-Boot and GRUB, and has other ambitions. Libreboot
aims to provide ease of use while also providing great power and flexibility.
So Libreboot is aimed specifically at power users, while also trying to
accommodate non-technical users; Skulls largely targets the latter.

### [System76 Open Firmware](https://github.com/system76/firmware-open)

System76 provides their own special coreboot fork, that they tailor for
specific machines that they sell; they also provide free EC firmware. Jeremy
Soller of System76 maintains this firmware, and the work is regularly
upstreamed into the regular coreboot project.

System76 provides the coreboot firmware, along with EDK2 UEFI payload. It can
boot Linux distros, BSD systems and even Windows perfectly.

## Non-coreboot free firmware

### fwupd

fwupd is essentially a centralised repository of firmware images, that
can be used to provide updates for your mainboard. Many Linux distros make use
of this to provide UEFI firmware updates for example.

### [LinuxBoot](https://linuxboot.org)

LinuxBoot can be provided as a UEFI DXE, or as a U-Boot SPL, coreboot payload
or Slim Bootloader Stage 1B, to provide a Linux kernel at boot time, which
kexecs into another Linux kernel.

The benefit of using *Linux* to *boot Linux* is that then the bootloader part
of your firmware doesn't need to rewrite every driver, because Linux already
provides excellent drivers, and it also affords you many advanced
configuration possibility such as hardened encryption setups with things
like Measured Boot, and it could also be used to boot over a network.

### [OpenBMC](https://github.com/openbmc/docs)

Linux distro for management controllers (BMCs) used on servers,
rack switches and RAID appliances. This provides a remote management
feature, most useful (for example) on colocated server hosting.

### [Oreboot](https://github.com/oreboot/oreboot)

Oreboot is a special fork of coreboot, re-written in the Rust programming
language, focusing specifically on the *LinuxBoot* payload configuration.

### [Trusted Firmware](https://www.trustedfirmware.org/)

Trusted Firmware provides boot firmware for ARMv8-A, ARMv9-A
and ARMv8-M. Specifically tailored for use on embedded systems, and parts of
it are also used by the coreboot project on some boards.

### [Das U-Boot](https://www.u-boot.org)

U-Boot runs on a large number of embedded systems, with support for a variety
of architectures such as ARM, x86, RISC-V and others. U-Boot provides its own
small kernel and operating system, with drivers and applications designed to
boot your operating system using various methods. It has an advanced *shell*,
with excellent networking and file system support - most notably, we use it
in Libreboot as a UEFI payload for *coreboot*, but U-Boot can also provide its
own boot initialisation independently of coreboot.

One of the nice features of U-Boot is its *licensing* (GPLv2 for the most part)
and similar coding style to Linux; the licensing and technical design means
that it's much easier to port existing Linux drivers, when something needs to
be done in the U-boot project.
