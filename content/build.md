---
title: Building ROM Images from Source
---

Libreboot's build system is named `lbmk`, short for `LibreBoot MaKe`, and this
document describes how to use it. With this guide, you can know how to compile
libreboot from the available source code.

This document assumes that you are using a Linux-based system.

You may also wish to check out the [lbmk maintenance manual](../maintain/).

## eCryptfs file name limits

Do not run the build system on a eCryptfs file system, because it has very
short file name limits and Libreboot's build system deals with very long
file names. We commonly get reports from this by Linux Mint users who
encrypt their home directory with eCryptfs; regular LUKS encryption will do
nicely.

## System requirements

System requirements are documented in the maintenance manual.

## Environment variables

| Name           | Description                                          |
| -              | -                                                    |
| `TMPDIR`       | A directory that lbmk uses for large temporary files |
| `XBMK_THREADS` | The number of CPU cores that we use                  |

## Configuring Git

You must do this even if you are using a release archive because of the build
system's peculiarities.

```
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```

## Downloading the source

```
git clone https://codeberg.org/libreboot/lbmk.git
cd lbmk
```

Or use an equivalent release tarball.

## Installing build dependencies

```
./mk dependencies ubuntu
./mk dependencies debian
./mk dependencies fedora41
./mk dependencies arch
```

If your distribution is not supported this way, read the script and install the
equivalent packages yourself.

### GNAT issues

As of January 2025, Debian Trixie and Debian Sid and  a few other distros,
provide `gnat` and `gcc` as you expect, but `gnat` resolves to `gnat-13` and
installs `gcc-13` as a dependency, while `gcc` resolves to `gcc-14` and other
toolchain components correspond to this version.

The GCC/GNAT versions need to match during build time, so Libreboot's build
system hacks the `PATH` environmental variable, setting up symlinks, matching
GNAT to GCC or GNAT to GCC. When you run `./mk dependencies debian`, you get
GNAT 13 and GCC 14. This seems to make most boards compile; in our testing, the
KGPE-D16 board failed to compile in this configuration. This PATH hack is only
done for compiling the coreboot crossgcc toolchain, and nothing else; after that,
coreboot's toolchain is used.

GNAT is used by coreboot, because some of the Intel graphics devices are
initialised natively, with code written in Ada spark (called `libgfxinit`).

When updating from Debian stable to Debian Trixie(testing) or Sid, you should
also check for orphaned packages, using `aptitude search '~o'`. Do this,
removing what was leftover from the old release, and make sure to re-run the
Debian dependencies script, but do it like this:

	./mk dependencies debian --reinstall

For better reliability, you should, after running the dependencies script,
remove `gnat` and install `gnat-14` instead, which is available on this day
of 3 December 2025, but currently marked experimental. When you install
GNAT 14, GNAT 13 is removed but `gnat` (in `PATH`) still won't resolve to
anything. Libreboot *still* accommodates this, detecting and matching the GCC
and GNAT versions, which would in this instance match version 14 between them,
so that `gnat` and `gcc` are both in PATH at build time, resolving to v14.x.
When we tested with this configuration, the KGPE-D16 images also compiled.

### MIPS cross compiler

Libreboot has support for the Sony PlayStation (PS1/PSX), based on
the PCSX-Redux Open BIOS. If you're doing a full release build, and/or
specifically building the PSX BIOS, you need a MIPS cross compiler.

Arch-based systems have a mipsel cross compiler available from AUR, and most
Debian-based systems have a mipsel cross compiler in apt; for these, the normal
dependencies installation command will provide them. We know Void Linux and
Fedora don't have a MIPS compiler, for instance.

If your distro doesn't have the MIPS compiler available,
the [PlayStation](../install/playstation) page provides instructions for
manual installation; please do this in addition to the normal dependencies.

## Build ROM images

Libreboot MaKe (lbmk) automatically runs all necessary commands; for
example, `./mk -b coreboot` will automatically build the required payloads
if not already compiled.

As a result, you can now (after installing the correct build dependencies) run
just a single command, from a fresh Git clone, to build all ROM images:

	./mk -b coreboot

or even just build specific ROM images, e.g.:

	./mk -b coreboot x60

or get a list of supported build targets:

	./mk -b coreboot list

## Build payloads only

You can do, for example

```
./mk -b grub
./mk -b seabios
./mk -b u-boot
```

## Modifying configurations

You should check the maintenance manual for specifics, but:
```
./mk -m coreboot x200_8mb
```
