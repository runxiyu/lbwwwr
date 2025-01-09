---
title: Hardening GRUB
---

GRUB supports various security mechanisms that are not enabled by default.
This page will tell you how to enable them, for the purpose of boot security,
both detecting and attempting to prevent certain types of attack.

**Make sure you have an [external SPI programmer](../../install/spi/), for
recovery purposes, just in case you brick your machine. The modifications
documented here are highly invasive and it would be easy to make mistakes.**

You **must** read and understand [modifying GRUB in CBFS](../grub_cbfs/) first.

The following might also be of interest:
* [Encrypted `/boot`](../grub_encrypted_boot/)
* [Flash write protection](../../write_protect/)

## GRUB Password

The security of this setup depends on a good GRUB password as GPG signature
checking can be disabled through the GRUB console with this command:

	set check_signatures=no

The above GRUB shell command is required when you want to live USB media,
or other Linux setups that don't yet have signatures on files e.g. linux.

We will assume that you're using the `default` GRUB tree; the GRUB CBFS guide
linked above tells you how to determine which GRUB tree to use.

The following executable will then be available under `src/grub/default/`:

	grub-mkpasswd-pbkdf2

Run that program. It will ask you to choose a new passphrase. Its output will
be a string of the following form:

	grub.pbkdf2.sha512.10000.HEXDIGITS.MOREHEXDIGITS

Put this *before* the menuentries (just before) in `grub.cfg`, but note that
you should **not** literally use what is below; the hash below is not the one
you generated yourself. Make sure to adapt accordingly.

Example:

	set superusers="root"
	password_pbkdf2 root grub.pbkdf2.sha512.10000.711F186347156BC105CD83A2ED7AF1EB971AA2B1EB2640172F34B0DEFFC97E654AF48E5F0C3B7622502B76458DA494270CC0EA6504411D676E6752FD1651E749.8DD11178EB8D1F633308FD8FCC64D0B243F949B9B99CCEADE2ECA11657A757D22025986B0FA116F1D5191E0A22677674C994EDBFADE62240E9D161688266A711

GRUB will also ask for a username in addition to the password; the "root" user
is specified above, but you can change it to whatever you want.

## Unset superusers

Comment out the line `unset superusers` in `grub.cfg` by prepending a "`#`" to it.:

This ensures that password authentication works, because `unset superusers` in
fact disables passwordh authentication, so it's very important that you comment
out this line.

## Disable the SeaBIOS menu

**Please read this carefully if you wish to do so.**

In releases after Libreboot 20240504, SeaBIOS is the primary payload on all
images, but GRUB is available in the boot menu.

Do this:

	cbfstool libreboot.rom add-int -i 0 -n etc/show-boot-menu

This disables the SeaBIOS menu, so that it only loads GRUB.

If your ROM image doesn't auto-start GRUB, you should also insert the
bootorder file:

	cbfstool libreboot.rom add -f config/grub/bootorder -n bootorder -t raw

This `bootorder` file has the following contents:

```
/rom@img/grub2
```

Release images with `seagrub` in the name already have this bootorder file,
so you only need to disable the menu on these images. If you have the
image with `seabios` in the name (instead of `seagrub`), you must do both.

## SeaBIOS option ROMs

SeaBIOS will also still execute PCI option ROMs. Depending on your preference,
you may wish to disable this, but please note that this will break certain
things like graphics cards. More information is available in the [SeaBIOS
runtime config documentation](https://www.seabios.org/Runtime_config).

If you're using a graphics card, you *need* VGA option ROMs at least.

## GRUBSEA

Another option is to make it so that GRUB is the primary payload on your board.
In this setup, SeaBIOS and U-Boot are still available.

For your board's `target.cfg`, add this:

	payload_grubsea="y"

You should only do this on setups that have native graphics initialisation
e.g. Intel graphics (or FSP-based Intel graphics initialisation like on
Alderlake which sets up a similar framebuffer).

If you can't use GRUB as a primary payload, then you can use SeaGRUB as above
and disable the SeaBIOS menu, making SeaBIOS load only GRUB; SeaGRUB is useful
because GRUB will piggyback off of the VGA setup done by SeaBIOS first.

## GPG keys

**Warning:** GRUB does not read ASCII armored keys. When attempting to
trust ASCII armor keys, it will print `error: bad signature`.

First, generate a GPG keypair to use for signing. Option RSA (sign only)
is ok.

```
mkdir --mode 0700 keys
gpg --homedir keys --gen-key
gpg --homedir keys --export-secret-keys --armor > boot.secret.key # backup
gpg --homedir keys --export > boot.key
```

Now that we have a key, we can sign some files with it. We must sign:

-   a kernel
-   (if we have one) an initramfs
-   (if we wish to transfer control to it) an on-disk `grub.cfg`
-   `grubtest.cfg` in CBFS, if it exists
-   `grub.cfg` in CBFS, if it exists

You must provide a *detached signature* alongside each file. For example, if
a file in a directory is named `foo`, and GRUB uses this file, an accompaning
file `foo.sig` must exist alongside it.

Suppose that we have a pair of `my.kernel`, `my.initramfs` and an
on-disk `grub.cfg`. We will sign them by running the following
commands:

```
gpg --homedir keys --detach-sign my.initramfs
gpg --homedir keys --detach-sign my.kernel
gpg --homedir keys --detach-sign grub.cfg
```

You must also do the above on any file that goes in CBFS, and insert it
into CBFS, using instructions already provided on the GRUB CBFS guide linked
above, earlier on in this guide.

## Enforce GPG check in GRUB

The following must be present in `grub.cfg`, but please note that the
background image used by GRUB is in the memdisk by default, not CBFS, so you
might want to put it *after* the command that enables a background:

```
trust (cbfsdisk)/boot.key
set check_signatures=enforce
```

The follow the [GRUB configuration guide](../grub_cbfs/) to write it to ROM and
re-flash.

## Additional information

You may wish to read the [coreboot GRUB security howto](https://www.coreboot.org/GRUB2#Security).
