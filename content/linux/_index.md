---
title: Linux Guide
---

This guide pertains to x86 hosts with the GRUB payload, and does not cover
supported CrOS/ARM chromebooks. For ARM targets, you should refer to u-boot
documentation. SeaBIOS users should just use it like a traditional BIOS.
From now on this document assumes the GRUB payload.

## General idea of how Libreboot's GRUB works

Libreboot's GRUB, in the flash, finds and loads a distro's `grub.cfg` file. It
does not load the distro's GRUB itself.

## Useful GRUB guides

These are too large and have been moved to separate pages.

* [Encrypted `/boot` via LUKS2 with Argon2](grub_encrypted_boot/)
* [Prepare and Boot a USB Installer in Libreboot Systems](grub_boot_installer/)
* [Modifying the GRUB Configuration in libreboot Systems](grub_cbfs/)
* [How to Harden Your GRUB Configuration, for Security](grub_hardening/)
* [How to add custom keyboard layouts to your GRUB](grub_keymap/)

## GRUB and VGA modes

Libreboot GRUB boots in text mode or uses the coreboot framebuffer. Setting
`GRUB_TERMINAL=console` prevents GRUB from switching video modes which is
unsupported.

On most distributions, you can edit `/etc/default/grub` as root, and uncomment
or add `GRUB_TERMINAL=console`, then run `/sbin/update-grub` or `grub-mkconfig
-o /boot/grub/grub.cfg`.

## Fedora won't boot?

This may also apply to CentOS or Redhat. Chroot guide can be found on
[Fedora website](https://docs.fedoraproject.org/en-US/quick-docs/bootloading-with-grub2/#restoring-bootloader-using-live-disk).

### linux16 issue

Libreboot's default GRUB config sources fedora's grub config
`grub.cfg` (in `/boot/grub2/grub.cfg`), fedora by default makes use of the
`linux16` command, where it should be saying `linux`.

Open `/etc/grub.d/10_linux` and set the `sixteenbit` variable to an empty
string, then run `grub2-mkconfig -o /boot/grub2/grub.cfg`.

### BLS issue

With [newer versions of
fedora](https://fedoraproject.org/wiki/Changes/BootLoaderSpecByDefault),
scripts from grub package default to generating
[BLS](https://www.freedesktop.org/wiki/Specifications/BootLoaderSpec/) instead
of `grub.cfg`. BLS is not recognized by Libreboot's GRUB payload. To change
that behaviour set following line in `/etc/default/grub`:

	GRUB_ENABLE_BLSCFG=false

Then generate `grub.cfg` with `grub2-mkconfig -o /boot/grub2/grub.cfg`.
