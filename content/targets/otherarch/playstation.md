---
title: Sony PlayStation (PS1/PSX)
x-toc-enable: true
---

The PlayStation is a computer like any other. It ought to run all Free Software
if you want it to, and you can!

<div class="specs">
<center>
<img tabindex=1 alt="Sony PlayStation (PSOne) console" class="p" src="https://av.libreboot.org/playstation/psone.jpg" /><span class="f"><img src="https://av.libreboot.org/playstation/psone.jpg" /></span>
<img tabindex=1 alt="PCSX-Redux Open BIOS" class="p" src="https://av.libreboot.org/playstation/openbios.png" /><span class="f"><img src="https://av.libreboot.org/playstation/openbios.png" /></span>
</center>

| ***Specifications***       |                                                |
|----------------------------|------------------------------------------------|
| **Manufacturer**           | Sony Computer Entertainment Inc.               |
| **Name**                   | PlayStation                                    |
| **Variants**               | PlayStation, PSOne, Net Yaroze                 |
| **Released**               | 1994 (Japan), 1995 (Worldwide)                 |
| **CPU**                    | MIPS R3000 @ 33.8688 MHz                       |
| **Graphics**               | Custom 3D processor by Toshiba, 1MB Video RAM  |
| **Sound**                  | 16-bit custom Sony SPU                         |
| **I/O**                    | CD-ROM, analog Audio/Video, Serial, Parallel   |
| **Memory**                 | 2MB EDO DRAM                                   |
| **Architecture**           | MIPS I instruction set (RISC)                  |
| **Original boot firmware** | Sony PS1 BIOS (USA/JPN/EU)                     |
| **Flash chip**             | 512KB Mask ROM                                 |
</div>
## Introduction

This uses [the free/opensource BIOS developed by the PCSX-Redux team](https://github.com/grumpycoders/pcsx-redux/tree/main/src/mips/openbios).

### Build from source

Pre-compiled builds will be in the next Libreboot release, after
version 20240612. For now, you must compile it from source, but the Libreboot
build system provides automation for this. Please use the latest lbmk
revision [from Git](../../git).

First, please make sure you have build dependencies. The build logic in lbmk
has been tested on Debian 12 (x86\_64) and you can do this for example, as root:

	./mk dependencies debian

The `arch` and `parabola` dependencies should also work nicely, if you want
to replace `debian` with one of those in the above example; you need to get the
cross compiler (mipsel one) from the AUR, which you will see when running e.g.:

	./mk dependencies arch

If you have another distro, or you're unsure, the PCSX-Redux project also
provide [generic instructions for other distros](https://github.com/grumpycoders/pcsx-redux/blob/main/src/mips/psyqo/GETTING_STARTED.md)

When you have the dependencies, including mipsel cross toolchain, you can
just do this in lbmk:

	./mk -b pcsx-redux

This commonly only builds the BIOS part. If you want to build all of PCSX-Redux,
you can, but lbmk does not provide automation for this.

## Installation

If all went well, you should see `openbios.bin` located
under the `bin/playstation/` (within lbmk). Alternatively, you may be using
a release *after* Libreboot 20240612 that has it pre-built. Either way is fine.

The `openbios.bin` file is your new BIOS build.

### Emulators

Most PlayStation emulators rely on low-level emulation to execute the real BIOS.
The Open BIOS by PCSX-Redux (as distributed by Libreboot) can also be used, and
boots many commercial games, plus homebrew.

These emulators can boot many commercial games, with varying degrees of
compatibility, and they can also boot any homebrew/opensource games that you
might develop yourself, or that others have written.

Simply load your `openbios.bin` file into the emulator, using the instructions
provided with your chosen PlayStation emulator. You can even freely
redistribute this BIOS, because it's free software (released under MIT license),
which is a major advantage over Sony's original BIOS.

### Hardware

Not yet tested by the Libreboot project, but the PCSX-Redux developers have
stated that it will work on the real console. *It should be noted that the Open
BIOS does not seem to implement a memory card save handler at present; you can
save and load games, in-game, but there is no built-in program for copying
and deleting saves between memory cards.* From reading the documentation, it
seems that this is essentially a very well-engineered proof of concept that
happens to boot a majority of games; some polishing is still needed to make this
really useful on a real machine.

The main usefulness of the Open BIOS is that it's under an MIT license, and
therefore legal to distribute; anyone wishing to use an emulator can use a
compiled copy of the Open BIOS, and distribute it freely without trouble.

You also do not get to listen to music CDs. The quirk with memory cards is
easily mitigated in an *emulator*, because you can simply create different
memory card images for each game you play.

It would be nice if a memory card manager program were available, to make this
BIOS much more polished, but a number of games have been tested and it's more
or less fully reliable in most cases.

## Game compatibility

The upstream maintains [a compatibility list](https://docs.google.com/spreadsheets/d/1UNGs7uYb8viAbm7YJaf1CR4dkgX7ZzntUdcowGsjcVc/edit?pli=1&gid=772799649#gid=772799649)

NOTE: Google Docs, but an option exists on there to export it for LibreOffice
Calc. The list is provided as a spreadsheet.

## Remarks about hardware

Modern NOR flash can be used. You specifically want a TSOP-32 SMD/SMT type device,
one that operates at 3.3v (tolerance 2.7 to 3.6v), organised into 512KB blocks,
for example 512KB x8 is a common part, for example [SST39VF040](https://eu.mouser.com/ProductDetail/Microchip-Technology/SST39VF040-70-4C-WHE?qs=I6DYTe5pEPUDs7BrdNtR9w%3D%3D).

Look here:
<https://oshpark.com/profiles/mi213>
<!-- TODO -->

This person has designed PCBs that can be used to add a NOR flash, adapting to
the pinout of the playstation BIOS. Some early launch model PlayStations used
a 40-pin chip but most later ones soon after and to end of life were 32-pin.
This page only sells adapters for use with 32-pin boards.

For most boards, the one you want is probably the `PS1_Flash_Bios_(A)` one.

We do not yet provide instructions for how to install this on real hardware, in
the Libreboot project, but this can be done at a future date.

## Other mods (hardware)

### Video timings

The Open BIOS will not implement any DRM, so it's possible that you might boot
out of region games. In an emulator, this is no problem, but it can prove
difficult on hardware in a number of situations.

The purpose of these kinds of mods *on hardware* is typically that the user
wants to remove all DRM. Well, there's something many people overlook: video
timings out-of-region are often wrong on these machines. The GPUs have two
clock inputs (early launch models only have one clock input): one for PAL and
one for NTSC. More info could be written here at a later date but these consoles
typically don't have a PAL GPU clock on NTSC consoles, and vice versa. You can
correct this.

Look up the PS1 "dual frequency oscillator" mod. Without this mod, NTSC games
will run slightly slower than they should and have the wrong colours, when booted
on PAL consoles (and vice versa); RGB SCART can be used to mitigate the colour
issue, but not the timing issue. The oscillator mod is the only solution for the
timing issue.

The PAL GPU clock is roughly 53.2MHz, and divides by 12 to create the 4.43MHz PAL
subcarrier/colorburst signal; this is needed in composite video for example.

The NTSC GPU clock is 53.693175MHz, and divides by 15 to create the 3.58MHz NTSC
subcarrier/colorburst signal; ditto, this is used for NTSC composite video.

On a PAL playstation, Sony hardwired 53.2MHz to both inputs, and on NTSC, wired
53.69MHz to both inputs; that means on NTSC machines, PAL games will run with
a 3.579545MHz colorburst signal, and on PAL consoles running NTSC games,
the colorburst would be 3.55MHz. *Some* people suggest hardwiring a 4.43MHz
clock to the video dac/buffer on PAL consoles, thus creating what is called
a "PAL60" signal, but this is ill advised; ditto wiring 3.58MHz to it (NTSC50).

On *most* consoles except very early launch/debug models, and *very late* slim
models, the PAL clock is pin 192 on the GPU and NTSC is pin 196 on the GPU.
The Dual Frequency Oscillator mod uses a programmable oscillator and taps into
the video mode signal off of the GPU to know whether PAL/NTSC is used; it
switches the master clock hooked up to both inputs accordingly.

Another method is to *cut* the line going to the NTSC pin on a PAL console,
and wire a 53.69MHz oscillator (at 3.3V, with the output through a 220Ohm
resistor) directly to the pin; on an NTSC console, do the same but cut 192
and hook up 53.2MHz to it. The Dual Frequency Oscillator method is easier and
therefore recommend, but you can do this other method, which I call *DO* (Dual
Oscillator. Because it's two oscillators!)

By fixing the timings in this way, your region-free console will also have
correct timings, thus maximum game compatibility, and colours will always be
correct no matter what video cable you're using.

### Modchips

If using hardware, you will probably still want a modchip. Many proprietary
modchip firmwares exist, such as Old crow, MultiMode3 and Mayumi; these run on
PIC chips e.g. PIC12C508A. A special *OneChip* firmware is often used on PAL
PSOne Slims.

We recommend a *free/opensource* modchip type called
[PsNee](https://github.com/kalymos/PsNee).

Unlike the other modchips, PsNee runs mostly on Arduino-type boards. You can
find more info on its GitHub page.

Although not yet tested by Libreboot, it might be possible to have both the
Sony BIOS and Open BIOS, by stacking them on top of each other, soldered pin
for pin but leaving the OE/CS pins floating; then, wire up a switch that turns
one chip or the other off, so that you can pick which BIOS you want at boot.
This might be useful, in case you run into any compatibility issues with the
Open BIOS.

A modchip is still desirable, to mitigate copy and region protection in the
original BIOS; it may still be required when using the Open BIOS, but this has
not yet been confirmed by the Libreboot project.

More hardware testing is planned, but the Open BIOS works perfectly in emulators.
Give it a try!

### Boot games on SD cards

The [PicoStation](https://github.com/paulocode/picostation) project provides
free firmware for RP2040 devices, which you can solder into a modboard which
then emulates the PS1 CD drive. It then lets you boot software (including
many games) from an SD card instead of a CD, using disc image files, on a
real playstation (the picostation replaces your CD drive).

Not only is this useful in a development context, but it can also be used when
your CD drive has worn out and no longer reads discs properly.

### Final remarks

Combined with PsNee and PicoStation, the Open BIOS from PCSX-Redux team will
turn your 90s PlayStation into a very hackable machine. There is
also PSXSDK (which is also free/opensource) allowing for libre game
development, also known (somewhat ambiguously) as "homebrew" development. The
fact that these old consoles were designed to boot proprietary games is mere
coincidence; they are
simply computers, fully reprogrammable and as such, Libreboot is happy to provide
this support, for the Sony PlayStation

## Credit

Thanks go to the PCSX-Redux team for their excellent work reverse engineering
the Sony PS1 BIOS.

The two photos shown are as follows:

* [PSOne Slim
  photo](https://commons.wikimedia.org/wiki/File:PS_One_with_LCD.JPG)
  (the one provided by Libreboot is scaled down and cropped, with
  color levels enhanced for better contrast)
* The cube screenshot is of the PCSX-Redux Open BIOS in operation, on an
  emulator.

PlayStation, PS1, PSOne and other terms are the trademark of Sony Interactive
Entertainment. Libreboot is in no way affiliated to Sony Interactive
Entertainment; this page is not an endorsement of Sony Interactive Entertainment,
nor do they endorse Libreboot.

PCSX-Redux developers are not affiliated with Libreboot in any way. We simply
integrate their Open BIOS into Libreboot because their work is awesome.
