---
title: Encrypted /boot via LUKS2 with Argon2id
---

Full encryption for basic LUKS2 (with PBKDF or Argon2 key derivation) is
supported in libreboot. Legacy LUKS1 is also supported. On *most* other
systems, `/boot` must be unencrypted, but Libreboot supports use of the GRUB
bootloader as a coreboot payload, directly in the boot flash. GRUB has code in
it that can be used to unlock LUKS1 and LUKS2 dm-crypt, using the `cryptomount`
command. With this, you can boot with *true* full disk encryption, by
encrypting `/boot`.

This is a boon for security, because it's harder to tamper with, and you could
potentially write-protect plus maybe provide a [password](../grub_hardening/)
in GRUB at boot time.

The easiest way to use it is like this: in Linux, set up your partitions like
you would, but use LVM volume groups, with group name `grubcrypt` and either:

* `/` as volume name `rootvol` and `/boot` as volume name `bootvol`
* `/` as volume name `rootvol` and `/boot` exists within it (no `bootvol`)

Libreboot's GRUB will automatically give you a passphrase prompt, where you
type your passphrase and it unlocks the volume. Then it loads
`/boot/grub/grub.cfg` from `bootvol` and it should work.

Otherwise, to manually unlock it, you drop to the GRUB shell with C and do `cryptomount -a` or `cryptomount (ahci0,1)` for a specific device.

Libreboot GRUB merges the PHC argon2 implementation, so it has full support
for LUKS2 installations in addition to LUKS1. Libreboot 20231021 and higher
has argon2 support, but older releases only supported PBKDF2 which would make
LUKS2 dysfunctional unless you swapped it to use PBKDF2 (not argon2) and/or
downgraded to LUKS1.

With modern Libreboot, you can just use LUKS2 as-is, on most/all Linux distros.
At the time of the Libreboot 20231021 release, the GRUB upstream (on gnu.org)
did not have these argon2 patches in its source tree, but Libreboot merges and
maintains them out of tree.

## Manually writing a GRUB menu entry

```
menuentry 'Load encrypted system on main disk  [m]' --hotkey='m' {
        cryptomount (ahci0,gpt3) # change as needed
        configfile (crypto0)/boot/grub/grub.cfg
}
```

## Argon2id

You should *specifically* use argon2id. Please ensure this, because some older
LUKS2 setups defaulted to the weaker *argon2i*. Read [this
post](https://mjg59.dreamwidth.org/66429.html) by Matthew Garret.

## Pitfalls

If the console doesn't work, ensure that you've followed the "GRUB and VGA
modes" section in the [main GRUB guide](../).

## Credits

The work is based on that done by Patrick Steinhardt, importing PHC's Argon2
implementation. This was later added to GRUB 2.06 on the Arch Linux AUR by
Ax333l, and Nicholas Johnson later rebased it for GRUB 2.12 to use in
Libreboot's GRUB payload.
