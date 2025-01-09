---
title: Chromebook flashing instructions
---

## Board support

**Libreboot currently officially supports the `nyan` and `gru` chromebooks.
`daisy`, `peach`, and `veyron` were temporarily removed.**

**WARNING: veyron speedy boards (e.g. C201) have non-functional video init as
of 19 February 2023, and no fix is yet available on that date. See:
<https://notabug.org/libreboot/lbmk/issues/136> - the last tested revision
from 2021.01 is known to work, for u-boot on this board. See:\
<https://wiki.postmarketos.org/wiki/ASUS_Chromebook_C201_(google-veyron-speedy)>
(alpernebbi on IRC is looking into this, to bisect uboot and update the latest
revisions) - for now, ROM images deleted from the Libreboot 20221214
and 20230319 releases.**

**WARNING: daisy- and peach- boards require a BL1 bootloader firmware, but the
one from coreboot 3rdparty is a fake/placeholder file. We need logic in the
Libreboot build system for properly fetching/extracting these, plus docs to
cover it. For now, assume that these are broken - ROM images are excluded,
for now, and have been deleted from the Libreboot 20221214 and 20230319
releases. - see: <https://review.coreboot.org/plugins/gitiles/blobs/+/4c0dcf96ae73ba31bf9aa689768a5ecd47bac19e>
and <https://review.coreboot.org/plugins/gitiles/blobs/+/b36cc7e08f7337f76997b25ee7344ab8824e268d>**


## Google's flashrom

Compile it from
[source](https://chromium.googlesource.com/chromiumos/third_party/flashrom/)
and run it.

## Enable ChromeOS "Developer Mode"

Chromebooks are locked-down by default to only run ChromeOS. Most things
you will want to do on these require you unlock it by enabling their
[Developer Mode](https://chromium.googlesource.com/chromiumos/docs/+/HEAD/developer_mode).
On most devices, you would press the `Escape + Refresh + Power` key
combination to restart into the Recovery Mode, then press `Ctrl + D` and
finally confirm enabling Developer Mode with `Enter`.

On your next boot, it will show you an "OS Verification is disabled"
screen. Waiting for 30 seconds or pressing `Ctrl + D` on this screen will
proceed to boot into ChromeOS, which then erases all data on the device
and reboots again into a clean ChromeOS installation.

With Developer Mode enabled, you can launch a terminal emulator inside
ChromeOS by pressing the `Ctrl + Alt + T` key combination. Run `shell`
inside the resulting `crosh` prompt to actually get to a `bash` session
where you can run programs. Most of the root file system is read-only,
except for `/usr/local` and any mounted drives under `/media/removable`.

## Identify your device

It's more common to refer to ChromeOS boards by their codenames, and
many compatible devices can share a single codename. Libreboot ROM
images also use these, you should only use the one corresponding to your
device's. There are a number of ways to find it, some are:

- Check the "Model" on the Recovery Mode or Developer Mode screens
- Visit `chrome://version` in ChromeOS and check the "Firmware Version"
- Run `crossystem hwid` or `crossystem fwid` in a terminal

## Back up stock firmware

The stock firmware on your device comes with some irreplaceable data
that is unique to your device. This can include the serial number and
hardware ID of the device, network MAC address, HDCP keys, maybe more.
The stock firmware is also the only one that will properly boot and run
ChromeOS.

Make sure you back up the original firmware before trying to replace it.
The version of flashrom in ChromeOS understands `host` as a programmer
to flash firmware internally. To back up stock firmware you can run:

	sudo flashrom -p host -r depthcharge.rom
	sudo flashrom -p host -v depthcharge.rom

Keep the resulting `depthcharge.rom` file safe and properly backed up on
another device.

If you can already boot a conventional Linux distro on your Chromebook,
you may be able to use `flashrom -p linux_mtd` on that system instead.

## Check external flashability

If a ROM image you flash is broken, you may need to restore the stock
firmware to fix the board to get internal flashing working. Refer to the
[external flashing guide](spi), and check that the result of
`flashrom -r` matches what you get when you run it from the device.
Chromebooks may have 1.8V as the supply voltage for the SPI NOR chip, be
extra careful about that.

On newer Chromebooks, there is a root-of-trust chip providing a
[Closed Case Debugging](https://chromium.googlesource.com/chromiumos/platform/ec/+/cr50_stab/docs/case_closed_debugging_gsc)
mechanism that lets you flash externally using a special USB debugging
cable. However, most boards that Libreboot supports do not have this.

## Disable write protection

Chromebooks have the SPI flash chip partially write-protected by
default, but thankfully this protection can be disabled by the device
owner. How to do so depends on the board, refer to the
[ChromiumOS documentation on Write Protection](https://chromium.googlesource.com/chromiumos/docs/+/HEAD/write_protection)
for more info. You will usually need to do this only once for the
board's lifetime, unless you manually enable it again.

On most boards that Libreboot supports, write-protection is enforced by
a physical screw. When screwed in, it forms an electrical connection
that asserts the WP pin on the flash chip. The screw can be identified
by the fact that it bridges electrical contacts, but finding and
removing it might require you to disassemble most of the board.

Newer boards have a root-of-trust chip enforcing write-protection. The
[Closed Case Debugging](https://chromium.googlesource.com/chromiumos/platform/ec/+/cr50_stab/docs/case_closed_debugging_gsc)
mechanism should be used to disable hardware write-protection. Opening
the case and disconnecting the battery might also disable it.

Disabling the write-protect signal doesn't directly make the chip stop
protecting its data, it just allows you to disable its write-protection
in software. That also needs to be done in ChromeOS afterwards:

	sudo flashrom -p host --wp-status
	sudo flashrom -p host --wp-disable
	sudo flashrom -p host --wp-range 0x0,0x0

The *--wp* arguments are only available on the
[ChromiumOS fork of flashrom](https://sites.google.com/a/chromium.org/dev/chromium-os/packages/cros-flashrom).
If you are using another OS or an external flasher, you may need to
compile and use that flashrom fork to disable write-protection. There is
no `lbmk` support yet for automatically building it.

## Prepare the ROM image

Libreboot ROM image layouts are currently incompatible with the regions
that should be carried over from the stock firmware. However, the
released images should still be somewhat usable, since the Chromebooks
supported so far don't require any non-redistributable code to be
injected by the end user.

Future Libreboot versions will likely require post-processing to
preserve irreplaceable data in the firmware image. For now, make sure to
keep backups of the original firmware.

<!-- TODO: Instructions to preserve vital data when FMAPs are compatible. -->

## Flash the ROM image

WARNING: Although none are supported yet, make sure not to flash ROM
images on x86 Chromebooks without injecting non-redistributable code
first (like Intel ME firmware). This is not yet documented here.

You can flash the ROM image both internally and externally. For the
latter, see the [external flashing guide](spi) and the ChromiumOS
[Closed Case Debugging](https://chromium.googlesource.com/chromiumos/platform/ec/+/cr50_stab/docs/case_closed_debugging_gsc)
documentation if your board supports it.

To flash the entire ROM image internally, run within ChromeOS:

	sudo flashrom -p host -w libreboot.rom
	sudo flashrom -p host -v libreboot.rom

If you can already boot a conventional Linux distro on your Chromebook,
you may be able to use `flashrom -p linux_mtd` on that system instead.

## Install an operating system (experimental research)

In general, ARM-compatible distros targeting U-boot can be used.  There are
three general methods for installing that vary depending on the distribution:

1. EFI - common u-boot methodology used by both arm64 and amd64 systems.
2. `boot.scr` - an older u-boot specific script used by some distributions.
3. `extlinux.conf` - a newer flat, bootloader-spec text file that typically
   lives in /boot/extlinux/extlinux.conf

### Successful installations:

* [ArchLinuxARM on RK3399-based Chromebooks](../uboot/uboot-archlinux).
* [Debian Bookworm on Samsung Chromebook Plus XE513C24](../uboot/uboot-debian-bookworm).
* [Debian on Asus Chromebook C201](https://wiki.debian.org/InstallingDebianOn/Asus/C201).

### Unsuccessful installations:

* [OpenBSD on Samsung Chromebook Plus XE513C24](../uboot/uboot-openbsd).

### Other promising ARM-compatible distros:

* [Armbian](https://www.armbian.com/uefi-arm64/).

## See also

* [ChromiumOS Documentation](https://chromium.googlesource.com/chromiumos/docs/+/HEAD/)
* [ChromiumOS Firmware Test Manual](https://chromium.googlesource.com/chromiumos/docs/+/HEAD/firmware_test_manual)
* [ChromiumOS Flashrom Fork Information](https://www.chromium.org/chromium-os/packages/cros-flashrom/)
* [MrChromebox's Unbricking Guide](https://wiki.mrchromebox.tech/Unbricking)
* [MrChromebox's Write-Protection Notes](https://wiki.mrchromebox.tech/Firmware_Write_Protect)
* [Coreboot Tutorial as used in ChromeOS](https://docs.google.com/presentation/d/1eGPMu03vCxIO0a3oNX8Hmij_Qwwz6R6ViFC_1HlHOYQ/preview)
