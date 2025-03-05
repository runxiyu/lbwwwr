---
title: U-Boot payload (x86 and ARM)
---

**NOTE: This documentation refers only to ARM64. For AMD64/i386 (Intel/AMD)
U-Boot setups, please read [uboot-x86.md](uboot-x86).**

Libreboot has experimental support for using U-Boot as a coreboot
payload since the [20221214](../../news/libreboot20221214) release, on ARM64
systems, and on x86 since late 2024.

U-Boot integration in Libreboot is currently at a proof-of-concept
stage, with most boards completely untested and most likely not working.
ROM images for them are mostly intended for further testing and
development. If you have one of these machines and want to help fix
things, you can ping `alpernebbi` on Libera IRC, who ported these boards
to Libreboot.

As of 14 December 2022, building of U-Boot images has been tested on
Debian. Make sure you have the latest `lbmk` from the Git repository,
and the build dependencies are installed like so, from `lbmk/` as root:

	./mk dependencies debian

This installs everything needed for `./mk -b coreboot`, and part of the
build process makes use of coreboot's own cross-compile toolchain.

[QEMU x86/ARM64 virtual machines](../misc/emulation) are also
supported, which should be easy targets to start tinkering on if you
want to contribute.

## Usage

When your board is powered on, U-Boot will ideally turn on the display
and start printing console messages there. After a countdown of a few
seconds it will proceed to automatically boot whatever it can find.
U-Boot will fall back to an interactive prompt if its boot sequence
fails or if you interrupt the countdown.

U-Boot supports UEFI to some extent, enough to run a GRUB package that
would be installed by whatever OS you want to have on your device. The
boot sequence checks for the standard UEFI removable media paths like
`/efi/boot/bootaa64.efi`, so you should be able to use your desired OS'
generic installer images. For details, see upstream documentation for
[UEFI on U-Boot](https://u-boot.readthedocs.io/en/latest/develop/uefi/uefi.html).

Otherwise, the boot sequence also checks an `extlinux.conf` file that
can configure which kernel, initramfs, device-tree file and kernel
command line arguments should be used. See upstream documentation for
[Generic Distro Configuration Concept](https://u-boot.readthedocs.io/en/latest/develop/distro.html).

If you want to work inside the U-Boot shell, see an incomplete list of
[shell commands](https://u-boot.readthedocs.io/en/latest/usage/index.html#shell-commands),
or use the `help` command inside the prompt. Configuration is done via
[environment variables](https://u-boot.readthedocs.io/en/latest/usage/environment.html)
inside the shell, which can be saved to and automatically loaded from
persistent storage configured at build-time.

WARNING: Environment variable storage has not been explicitly configured
so far and is untested in the context of Libreboot. It may cause data
loss or even brick your device by overwriting your disk's partition
table, unexpected parts of the SPI ROM image, or do something else
entirely.

## Known issues

U-Boot integration in Libreboot is incomplete. Here is a list of known
issues that affect all boards:

- Branding is U-Boot with their logo (Libreboot only in version number)
- Splash screen might be better instead of console messages
- Cursor/drawing bugs with video improvements patches
- Environment storage is likely dangerously broken
- SMBIOS info is missing, `Unknown`, `Unknown Product`, etc.
- Coreboot tables are ignored, unavailable to the OS
- Re-inits display instead of using coreboot framebuffer
- Chromebook FMAP layouts should match stock layout for GBB, VPD
- Chromebook GBB, VPD are not handled, data may be unavailable to OS
- U-Boot "coreboot\*" defconfigs needs more work and an ARM64 version
- UEFI support is incomplete

## See also
- [U-Boot documentation](https://u-boot.readthedocs.io/en/latest/)
- [U-Boot documentation (unmigrated files)](https://source.denx.de/u-boot/u-boot/-/tree/master/doc)
- [U-Boot and generic distro boot](https://marcin.juszkiewicz.com.pl/2021/03/14/u-boot-and-generic-distro-boot/)
