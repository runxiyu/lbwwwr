---
title: Other Coreboot Distributions
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
Libreboot isn't for you, you might find some of the others to be preferable.

The following list is alphabetical.

## [Canoeboot](https://canoeboot.org)

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

## [Chultrabook](https://docs.chrultrabook.com) and [MrChromeBox](https://docs.mrchromebox.tech/)

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

## [Dasharo](https://docs.dasharo.com)

Supports many machines, with a choice of EDK2(UEFI) or Heads(Linuxboot)
payload in the flash. Some older machines may provide a SeaBIOS payload
instead. A lot of work that goes into the upstream coreboot project came
from the Dasharo developers.

Dasharo provides their own fork of coreboot, with a specific tree *per board*.
Several coreboot ports (e.g. MSI Z690-A PRO) were implemented directly by the
Dasharo project, and later upstreamed into the regular coreboot project.

Dasharo has a special emphasis on commercial application, providing tailored
coreboot images for each supported mainboard, with an emphasis on stability.
It's a very different approach than Libreboot's; Libreboot provides a more
generalised design in its build system and infrastructure.

## [Heads](https://osresearch.net)

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

## [Skulls](https://github.com/merge/skulls)

Skulls provides simple coreboot images with SeaBIOS payload, on a handful of
ThinkPads. Libreboot also provides similar SeaBIOS configurations, on all of
the same machines, but Libreboot's design does mean that there are a few
additional steps for installation.

If you just want the simplest, most barebones setup, Skulls is a great choice.

Libreboot also provides U-Boot and GRUB, and has other ambitions. Libreboot
aims to provide ease of use while also providing great power and flexibility.
So Libreboot is aimed specifically at power users, while also trying to
accomodate non-technical users; Skulls largely targets the latter.

## [System76 Open Firmware](https://github.com/system76/firmware-open)

System76 provides their own special coreboot fork, that they tailor for
specific machines that they sell; they also provide free EC firmware. Jeremy
Soller of System76 maintains this firmware, and the work is regularly
upstreamed into the regular coreboot project.

System76 provides the coreboot firmware, along with EDK2 UEFI payload. It can
boot Linux distros, BSD systems and even Windows perfectly.
