---
title: Project Contributors
---

This list does not necessarily reflect who is currently working on the project,
but it lists some people who have contributed to the project in meaningful ways.

If we forgot to mention you here, let us know and we'll add you. (Or if
you don't want to be mentioned, let us know and we'll remove your
entry.)

You may with to use [git blame](https://git-scm.com/docs/git-blame) to find the
author of particular source files in the build system.

### Leah Rowe

**Founder of the Libreboot project, and currently the lead developer.** Leah
works on all aspects of Libreboot, such as:

* General management. Leah handles all outside contributions to Libreboot,
  reviews pull requests, deals with bug reports, delegates tasks when necessary
  or desirable. Leah controls the libreboot.org server infrastructure, hosted
  in her lab.
* Leah has the final say on all decisions, taking input via discussion with
  members of the public, mostly on IRC. Leah oversees releases of Libreboot,
  and generally keeps the project going. Without Leah, there would be no Libreboot!
* The build system (lbmk, short for Libreboot Make). This is the automated build
  system that sits at the heart of Libreboot; it downloads, patches, configures
  and compiles the relevant components like coreboot, GRUB and generates
  the Libreboot ROM images that you can find in release archives.
* Upstream work on coreboot, when necessary (and other projects that Libreboot
  uses). This means also working with people from outside of the Libreboot
  project, to get patches merged (among other things) on the upstream projects
  that Libreboot uses.
* Providing user support on IRC.

## External projects

### Coreboot project

Without coreboot, the Libreboot project simply would not be possible.

The people and companies that work on coreboot are numerous, and they make the
Libreboot project what it is. The Libreboot project makes heavy use of coreboot, to
provide hardware initialization.

### GRUB

GRUB is the bootloader used by Libreboot. It goes without saying that the GRUB
developers enable Libreboot, through their work.

### SeaBIOS

The Libreboot firmware provides SeaBIOS as a payload option. SeaBIOS provides a
legacy x86 BIOS implementation.

### U-Boot

Libreboot uses U-Boot as the coreboot payload on supported ARM Chromebooks, and
on AMD64 systems if configured to be used.

## Contributors in alphabetical order

### Alexei Sorokin

Sent minor fixes to lbmk; improved sha512sum verification on images, config
improvements e.g. hide MEI device where neutered ME is used. General
improvements and tweaks.

### Alper Nebi Yasak

Contributed the build system integration and documentation for using
U-Boot as payload, and initial Libreboot ports of some ARM Chromebooks
based on that.

Alper also does upstream development on U-Boot, e.g. continued an almost
complete port of the `gru-kevin` board and got it merged upstream.

### Alyssa Rosenzweig

Switched the website to use markdown in lieu of handwritten HTML and custom
PHP. **Former Libreboot project maintainer (sysadmin for libreboot.org).**

Alyssa wrote the original static site generator (shell scripts converting
markdown to html, via pandoc) for libreboot.org. Leah heavily modified this
static site generator and forked into [Untitled](https://untitled.vimuser.org)
(untitled is Leah's work, not Alyssa's, but it's based on Alyssa's original
work on the static site generator that Libreboot used to use; the Libreboot
website is now built with Untitled)

### Andrea Perotti

Sent several small fixes to Libreboot's dependencies scripts for Debian, Fedora
and Ubuntu distros.

### Andrew Robbins

Worked on large parts of Libreboot's old build system and related
documentation. Andrew joined the Libreboot project as a full time developer
during June 2017, until his departure in March 2021. Although the work was
ultimately scrapped in 2021, in favour of Libreboot's current [lbmk
design](../maintain/), he provided countless hours of work to the project
over the years, helping users on IRC and generally being a very passionate
Libreboot developer.

Andrew was working on a build system re-write that ultimately never reached a
stable state, and he abandoned the project after his work was replaced, but the
feeling of disgust that he had was not mutual.

I, Leah Rowe, am very grateful to Andrew Robbins for his numerous contributions
over the years. Anyone who contributes to Libreboot is a hero. Look at the old
Libreboot repository on [notabug](https://notabug.org/Libreboot) to find his
contributions.

### Angel Pons

Angel is a coreboot developer. Their contributions are numerous, in that and
many other projects. Countless patches in coreboot from them have enabled
Libreboot to be what it is.

The most noteworthy work by Angel, that Libreboot imported, is the native
raminit (NRI) for Intel Haswell platform, which Libreboot was able to use for
replacing the Intel MRC. Because of these patches, Libreboot is able to provide
wholly free initialisation on that platform, in the BIOS region of the flash.
For example, the ThinkPad T440p and OptiPlex 9020 ports boot in such a
configuration, since these are Haswell machines.

Over 2000 commits in coreboot were written by Angel, as of January 2025. They
are one of coreboot's most active developers.

### Arsen Arsenović

Added the config for ThinkPad T430 to Libreboot.

### Arthur Heymans

Merged a patch from coreboot into Libreboot, enabling C3 and C4 power states to
work correctly on GM45 laptops. This was a long-standing issue before Arthur's
contribution. Arthur also fixed VRAM size on i945 on GM45 systems, allowing
maximum VRAM allocation for the onboard GPUs on these systems, another
longstanding issue in Libreboot.

Arthur also did work on the Libreboot build system, when he was a member of the
project. He still works on coreboot, to this day, and Libreboot greatly
benefits from his work. His contributions to the coreboot project, and
Libreboot, are invaluable.

### Ben Westover

Added info about internal flashing for Dell OptiPlex 9020, in the Libreboot
documentation.

### Caleb La Grange

Caleb contributed heavily to the Libreboot build system, and even implemented
the first version of Libreboot's [vendor inject
script](docs/install/ivy_has_common.md), back when it was part of the erstwhile
osboot project, which formally merged with Libreboot in November 2022.

Before Caleb came along, Libreboot didn't have any sort of structure in its
package management. The current `include/git.sh` script in Libreboot, which
uses a centralised set of configuration files, is ultimately derived from the
work that Caleb did.

Caleb was the one who figured out how to auto-download and neuter the Intel ME
on ThinkPad T440p, where previous osboot versions had used one that had to be
extracted from a dump of the original firmware; the Heads project also made use
of his work, in their project, to add the ThinkPad T440p, since their build
system focuses a lot on reproducibility so they place an emphasis on auto
downloading such files, to get the same version each time. Caleb's work in
Libreboot was largely inspired by Heads, which did the same thing at that time
on the ThinkPad X230. Libreboot's checksum-based design was also implemented
by him; when inserting vendor files, checksums are verified on images, to
ensure that they match what was built in the original release, for each given
release.

Caleb worked heavily on the Libreboot documentation, vastly improving much of
the installation instructions, and provided a lot of user support on IRC.

In general, Caleb heavily audited the entire project. The very nature of its
design, now, is based directly on the work that he did, when looking at the
design of the build system. The various Libreboot build system audits that
started in 2023 were essentially turbo-charged versions of the same work he
was doing.

Caleb has also been a good friend to me, Leah, and provided a lot of advice
during the osboot merger. I avoided a lot of stupid mistakes because of his
advice.

### Canberk TURAN

Added Turkish Q keyboard layout to Libreboot's GRUB payload.

### Damien Zammit

Maintains the Gigabyte GA-G41M-ES2L coreboot port, which is integrated in
Libreboot. Also works on other hardware for the benefit of the Libreboot
project.

Damien didn't work directly on Libreboot itself, but he worked heavily with
Leah Rowe, integrating patches and new board ports into Libreboot, based on
Damien's upstream work on coreboot.

### Daniil Prokofev

Translated several Libreboot website pages into the Russian language.

### Denis Carikli

Based on the work done by Peter Stuge, Vladimir Serbinenko and others in the
coreboot project, got native graphics initialization to work on the ThinkPad
X60, allowing it to be supported in Libreboot. Denis gave a lot of advice and
helped found the Libreboot project.

Denis was a mentor to Leah Rowe in the early days, when she founded the
Libreboot project. A lot of the decisions taken, especially with the Libreboot
build system (lbmk), were inspired from talks with Denis.

Denis taught Leah about registers used by Intel GPUs for backlight control. In
the early days, the ThinkPad X60 and T60 laptops in Libreboot did not have
backlight control working, so the brightness was always 100%. With Denis's
help, Leah was able to get backlight controls working by reverse engineering
the correct values to write in those registers. Based on this, a simple fix was
written in coreboot; however, the fix just wrote directly to the register and
didn't work with ACPI based brightness controls. Others in coreboot later
improved it, making ACPI-based backlight controls work properly, based on this
earlier work.

Very cool guy!!!

### Eason aka ezntek

Sent a SOIC8 photo for Raspberry Pi Pico pinout, where previously only SOIC16
info existed. Also added info about `thinkpad_acpi` Linux kernel module for
ThinkPad T480.

I (Leah) worked with ezntek on some testing and he discovered several bugs on
the ThinkPad T480, while Mate and I were working on it for Libreboot.

ezntek wrote this guide:
<https://ezntek.com/posts/Librebooting-the-thinkpad-t480-20241207t0933/>

This guide was written based on my and other people's help, on IRC, while we
were in the process of adding the T480 to Libreboot. Several parts of this guide
were in fact used to improve the Libreboot guide, such as the info about how
to update the Lenovo UEFI firmware prior to Libreboot installation, by using
USB boot media instead of needing to boot Windows.

Eason's guide also made number one on hacker news that day, and as a result,
many more people learned about Libreboot, especially its support for T480,
which helped to spread the news about the work.

Absolute legend. One of Libreboot's many great champions.

### E. Blåsten

Documented several quirks of the MacBook2,1 and ThinkPad X200T, such as
swivel/rotation on X200T, and various alt keys on the MacBook to make it more
usable with Linux, when used on Libreboot.

Also helped me (Leah) in a very fundamental way, in 2018. The help I got
enabled me to be who I am today.

### Fedja Beader

Wrote several guides for Libreboot, including the original version of the GRUB
hardening guide. Wrote the info about the Linux kernel panic/netconsole on
Libreboot's FAQ.

Also sent some small fixes to Libreboot's GRUB configuration, enabling USB
devices to boot more reliably. Also improved Libreboot's documentation
pertaining to Full Disk Encryption.

### Ferass El Hafidi

Added cstate 3 support on macbook21, enabling higher battery life and cooler
CPU temperatures on idle usage.

Also has a series of extensive improvements to the entire Libreboot system; for
example, Ferass made the entire build system use POSIX `sh`, removing bashisms
that previously plagued it.

Libreboot's original support for cross-compiling AArch64 coreboot was added by
him. He also submitted a few bug fixes to the GRUB configuration used by
Libreboot.

This is IRC nick `f_` on Libreboot IRC. Cool guy!

### hslick

Documented Arch Linux ARM installation on ARM64 U-Boot targets.

### Integral

Translated the Libreboot home page into Chinese language.

### Jason Lenz

Sent instructions for installing Debian Linux on ARM64-based chromebooks with
Libreboot and Alper's U-Boot ARM64 payload.

### Jeroen Quint

Contributed several fixes to the Libreboot documentation, relating to
installing on Arch-based systems with full disk encryption on Libreboot
systems.

### John Doe

This person never gave their name, but they sent two patches:

```
* 676eb110c7f Perform the silentoldconfig step of seabios before full make 
* acc57bda6df scripts: process git versions when lbmk is a worktree or submodule
```

Every contribution is appreciated. Every contributor gets their own entry in
the Libreboot Hall of Fame.

### Joshua Gay

Joshua was in a position during 2014&ndash;2016 to help promote Libreboot in
the media, in his capacity working for the employer he worked for at the time;
I credit him specifically. Joshua was one of Libreboot's earliest supporters.

He made sure everyone knew what I was doing, and he taught me a *lot* about
licensing; many of Libreboot's practises today are still based on his lessons,
such as the pitfalls of GPL compliance and how to really audit everything.

### Klemens Nanni

Made many fixes and improvements to the GRUB configuration used in
Libreboot, and several tweaks to the build system.

### Linear Cannon

Added NetBSD support for `dell-flash-unlock`.

### Lisa Marie Maginnis

Lisa was one of Libreboot's early contributors to Libreboot. She personally
helped me set up a lot of the early infrastructure, including things like IRC,
mailing list and so on. She provided a lot of technical guidance, while working
in a sysadmin job for a certain free software organisation; she was both a
mentor and a friend.

She got me in touch with a lot of people, and at one point was instrumental in
helping Paul Kocialkowski secure funding to work on the Veyron Speedy boards
in Libreboot, e.g. ASUS Chromebook C201PA &mdash; at the time, this was using
Google's own Depthcharge payload, which you can find in 2016 Libreboot
releases.

### Livio

Sent a small enhancement for GRUB, allowing the user to turn on or off several
options at boot time, such as graphical options or spkmodem output, so that
these features can be included on every image, and used flexibly.

Sent some small fixes to the QEMU target, fixing a bug in the SMBIOS info.

### Lorenzo Aloe

Provided hardware testing for the [Dell OptiPlex
9020](docs/install/dell9020.md), also provided testing for proxmox with GPU
passthrough on Dell Precision T1650, confirming near-native performance; with
this, you can boot operating systems virtually natively, performance-wise, on a
Libreboot system in cases where that OS is not natively supported.

All round good guy, an honest and loyal fan.

### Luke T. Shumaker

Sent a patch to Libreboot, fixing vboot on 32-bit (i686) hosts; it previously
only compiled on 64-bit x86 (amd64) machines.

### Marcus Moeller

Made the Libreboot logo.

### Mate Kukri

Mate Kukri is a *major* contributor to Libreboot, and several of the upstreams
that it uses; he is a coreboot developer, and also contributes heavily to the
GNU GRUB project.

Off the top of my head, here are just a few of the contributions that he has
made:

* Wrote several enhancements for `pico-serprog`, based on the original work
  done by [stacksmashing](https://github.com/stacksmashing), who also has this
  very interesting [youtube
  channel](https://www.youtube.com/channel/UC3S8vxwRfqLBdIhgRlDRVzw); Riku's
  work is heavily inspired by Mate's and stacksmashing's work.
* Ported the Dell OptiPlex 9020 SFF and MT, and provided several fixes on it
  for the Libreboot project; several fixes that I (Leah) did were also based on
  advice that he gave me.
* Wrote the [deguard](docs/install/deguard.md) utility for disabling Intel Boot
  Guard on MEv11; this is used for the Dell OptiPlex 3050 Micro and ThinkPad
  T480 ports.
* Ported the Dell OptiPlex 3050 Micro and Lenovo ThinkPad T480/T480s to
  coreboot, directly providing Leah with advice when integrating these ports
  into Libreboot. This work included heavy amounts of reverse engineering
  Lenovo's EC firmware.
* Ported the ASUS H610M-K D4 motherboard to coreboot, an Alderlake machine that
  Libreboot is interested in, for the release planned by April 2025; this
  bullet-point is being written on 5 January 2025 prior to its addition in
  Libreboot.
* Wrote the NVMe driver that Libreboot uses in GRUB, based upon work done for
  the SeaBIOS project.

Mate Kukri is a hero to the Libreboot project. Without him, Libreboot would not
be what it is today.

### Michael Reed

Wrote Libreboot's original OpenBSD installation guide.

Also sent fixes to the original static site generator that Alyssa wrote, upon
which the Untitled Static Site Generator was later based.

### Michał Masłowski

Sent several fixes to Libreboot's early build system, back in the early days of
the project. Also taught Leah how to use Git, because the very first revisions
were released only as tarballs, without Git history; the first commits in the
old repository were imports of those tarballs.

### Nicholas Chin

[Ported Dell Latitude E6400 to Libreboot](news/e6400.md) and also [Dell
Latitude E6430](docs/install/latitude.md) &mdash; author of the
`dell-flash-unlock` (formerly `e6400-flash-unlock`) utility, which can unlock
the flash on these boards, allowing internal flashing of Libreboot directly
from host OS running under the original Dell firmware.

Nicholas has ported many more Dell Latitude laptops to Libreboot, and he works
heavily on the upstream coreboot project. In fact, *every* Dell Latitude
board supported in Libreboot was done by him, at least as of 5 January 2025.

Nicholas has provided countless hours of user support on the Libreboot IRC
channel and in those of projects which Libreboot uses, and submitted many fixes
to Libreboot, both in terms of code and documentation.

He has advised me, Leah, on many occasions, teaching me things. Needless to
say, he is one of Libreboot's champions.

Nicholas also contributes to coreboot heavily, to flashprog, and several other
projects that Libreboot uses.

### 0xloem

Added info about LPC flashing on Libreboot's external flashing guide.

### Patrick "P. J." McDermott

Patrick also did a lot of research and wrote the Libreboot FAQ section relating
to the [Intel Management Engine](../faq.md#intelme), in addition to making
several improvements to the build system in Libreboot. **Former Libreboot
project maintainer.**

### Patrick Rudolph

Coreboot developer. Also wrote the xHCI GRUB driver, that Libreboot uses;
without it, several ports in Libreboot would not be feasible, unless they
excluded GRUB as a payload, because several newer Intel platforms no longer
have (or configure) EHCI controllers. Upstream GRUB currently has no xHCI
driver, but Patrick sent patches in 2020 that Libreboot later re-based, on top
of GRUB 2.12.

### Paul Kocialkowski

Ported the ARM (Rockchip RK3288 SoC) based *Chromebook* laptops to Libreboot.
Also one of the main [Replicant](http://www.replicant.us/) developers.

He was also responsible for the original re-write of the Libreboot build
system, upon which Libreboot's effort from 2017-2021 was based; ultimately,
this work never became stable and the work was scrapped in 2021, in favour of
the current Libreboot build system design, named lbmk.

### Paul Menzel

Investigated and fixed a bug in coreboot on the ThinkPad X60/T60 exposed by
Linux kernel 3.12 and up, which caused 3D acceleration to stop working and
video generally to become unstable. The issue was that coreboot, when
initializing the Intel video chipset, was mapping *GTT Stolen Memory* in the
wrong place, because the code was based on kernel code and the Linux kernel had
the same bug. When Linux fixed it, it exposed the same bug in coreboot.

Paul worked with Libreboot on this, sending patches to test periodically until
the bug was fixed in coreboot, and then helped her integrate the fix in
Libreboot.

### Peaksol

Translated several pages, including the SPI flashing guide, into Chinese
language.

### Peter Stuge

Helped write the [FAQ section about DMA](../faq.md#hddssd-firmware), and
provided general advice in the early days of the project. Peter was a coreboot
developer in those days, and a major developer in the *libusb* project (which
flashprog makes heavy use of).

Peter also wrote the *bucts* utility used to set Backup Control (BUC) Top Swap
(TS) bit on i945 laptops such as ThinkPad X60/T60, which is useful for a
workaround to flash Libreboot without using external hardware; on this machine,
with Lenovo BIOS present, it's possible to flash everything except the main
bootblock, but Intel platforms have 2 bootblocks, and you specify which one is
to be used by setting the TS bit. You then boot with only one bootblock flashed
(by the coreboot project's bootblock on that machine), and afterwards you reset
bucts before flashing the ROM again, to flash the main bootblock. Libreboot
hosts a copy of his work, because his website hosting bucts is no longer
responsive.

### Riku Viitanen

Added support for [HP Elite 8200 SFF](../install/hp8200sff) desktop PC to
Libreboot. You can read about this in the hardware page:

Riku also ported the HP Elite 8300 USDT.

Riku implemented MXM support as an INT15h handler in SeaBIOS, and wrote
some tooling for it, which enables the HP EliteBook 8560w port to work reliably
in Libreboot.

Riku also added the HP Folio 9470m to Libreboot.

Riku is also in charge of Libreboot's fork of `pico-serprog`, which is used
to provide serprog firmware on RP2040 and RP2530 devices. These devices can
be used to set up a cheap but reliable NOR flasher, which is now the default
recommended one for flashing Libreboot externally. Riku's fork contains several
enhancements, such as a higher default drive level of 12mA and the ability to
control multiple chip select pins, useful for flashing dual-chip Intel boards.

Riku has submitted numerous bug fixes to many boards, and generally sent many
improvements for the build system and also the Libreboot documentation. He
also added the HP EliteBook 2560p to Libreboot.

Riku also contributes to coreboot and flashprog, and several other projects
that Libreboot uses.

### samuraikid

Added Portuguese keyboard layout to Libreboot's GRUB payload.

### semigel

Added BTRFS subvolume support to Libreboot's GRUB configuration, for
auto-booting various Linux distros.

### Simon Glass

Simon Glass is principally responsible for the x86 U-Boot payload that
Libreboot now uses as a coreboot payload. Simon provided Leah with several
critical patches and advised Leah on several aspects of U-Boot's design, that
helped a lot when integrating it.

Without him, Libreboot would not have a functioning U-Boot implementation on
x86.

### Snooze Function

Translated several pages on the Libreboot documentation into the German
language.

### StackSmashing

Author of the original
[pico-serprog](https://github.com/stacksmashing/pico-serprog) project, upon
which Libreboot's fork (maintained by Riku Viitanen) is based.

StackSmashing didn't do this specifically for Libreboot, but their work is
outstanding, so their name is honoured here.

StackSmashing also has a [YouTube
channel](https://www.youtube.com/channel/UC3S8vxwRfqLBdIhgRlDRVzw) with a lot
of really cool videos on it about all things electronics, and hacking of
electronics. Check it out!

### Steve Shenton

Steve did the early reverse engineering work on the Intel Flash Descriptor used
by ICH9M machines such as ThinkPad X200. He created a C struct defining (using
bitfields in C) this descriptor region. With some clever tricks, he was able to
discover the existence of a bit in the descriptor for *disabling* the Intel ME
(management engine) on those platforms.

His initial proof of concept only defined the descriptor, and would do this:

* Read the default descriptor and GbE regions from a Lenovo X200 ROM (default
  firmware, not coreboot)
* Disable the ME, by setting 2 bits in the descriptor
* Disable the ME region
* Move descriptor+GbE (12KiB in total) next to each other
* Allocate the remaining flash space to the BIOS region
* Generated the 12KiB descriptor+GbE region, based on this, to insert into a
  coreboot ROM image.

In the early days, before Libreboot supported GM45+ICH9M platforms such as
ThinkPad X200/T400, you could use those machines but to avoid the Intel ME you
had to flash it without a descriptor region. This worked fine in those days,
because the ME only handled TPM and AMT on those machines, and the system would
work normally, but that Intel Flash Descriptor also handles the Intel GbE NVM
region in flash, which is used for the Intel Gigabit Ethernet interface.

So you either had Intel ME, or no ethernet support. Steve figured out how to
disable the Intel ME via 2 toggle bits in the descriptor, and also how to
remove the Intel ME region from flash.

Based on his research, I, Leah Rowe, working alongside Steve, also reverse
engineered the layout of the Intel GbE NVM (non-volatile memory) region in the
boot flash. This region defines configuration options for the onboard Intel GbE
NIC, if present.

Based on this, I was able to take Steve's initial proof of concept and write
the `ich9gen` utility, which generates an Intel Flash Descriptor and GbE NVM
region, from scratch, without an Intel ME region defined. It is this tool, the
`ich9gen` tool, that Libreboot uses to provide ROM images for GM45+ICH9M
platforms (such as ThinkPad X200/T400/T500/W500), with a fully functional
descriptor and functional Gigabit Ethernet, but *without* needing Intel
Management Engine (ME) firmware, thus making those machines *libre* (the ME is
fully disabled, when you use a descriptor+gbe image generated by `ich9gen`).

With *my* `ich9gen` tool (Steve's tool was called `ich9deblob`), you didn't
need a dump of the original Lenovo BIOS firmware anymore! I could not have
written this tool, without Steve's initial proof of concept. I worked with him,
extensively, for many months. All GM45+ICH9M support (X200, T400, etc) in
Libreboot is made possible because of the work he did, back in 2014.

### Swift Geek

Contributed a patch for ich9gen to generate 16MiB descriptors.

After that, Swift Geek slowly became more involved until he became a full time
developer. Swift Geeks contributions were never really in the form of *code*,
but what he lacked in code, he made up for in providing excellent support, both
to users and other developers, helping others learn more about technology at a
low level.

When Swift Geek was a member of the project, his role was largely providing
user support (in the IRC channel), and conducting research. Swift Geek knows a
lot about hardware. Swift Geek also did some upstream development on GRUB.

Swift Geek has provided technical advice on numerous occasions, to Leah Rowe,
and helped her to improve her soldering skills in addition to teaching her some
repair skills, to the point where she can now repair most faults on ThinkPad
mainboards (while looking at the schematics and boardview).

Swiftgeek left the project in March 2021. I, Leah Rowe, wish him all the best
in his endeavours, and I'm very grateful to his numerous contributions over the
years.

### Timothee Benedet

Translated several Libreboot website pages into the French language.

### Timothy Pearson

Ported the ASUS KGPE-D16 board to coreboot for the company Raptor Engineering
of which Timothy is the CEO. Timothy maintains this code in coreboot, helping
the project with the Libreboot integration for it. This person's contact
details are on the raptor site.

**D16 support was removed on 19 November 2022. You can still use older
revisions of Libreboot, and older release versions.**

### Vladimir Serbinenko

Ported many of the thinkpads supported in Libreboot, to coreboot, and made many
fixes in coreboot which benefited the Libreboot project.

Vladimir wrote a lot of the original video initialization code used by various
Intel platforms in Libreboot, when flashing it (now rewritten by others in Ada,
for libgfxinit in coreboot, but originally it was written in C and included
directly in coreboot; libgfxinit is a 3rdparty submodule of coreboot).

### Vladislav Shapovalov

Translated several pages of the Libreboot website into Ukranian language.
