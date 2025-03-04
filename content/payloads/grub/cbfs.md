---
title: Modifying grub.cfg in CBFS
---

Be sure that you are familiar with the [Libreboot flashing
guides](../../install/) before continuing, and make sure to back up the current
flash contents before you consider following this guide.

Before you follow this guide, it is advisable that you have the ability to
[flash externally](../../install/spi/), just in case something goes wrong.

Libreboot's own GRUB configuration automatically scans for one provided by your
distro, and this automation will usually work. Sometimes, you might wish to
override it with your own custom menuentry or additional logic in the GRUB
config. You can configure GRUB however you like, and this topic is vast so what
to actually *put in the config* will not be covered here.

This guide will simply teach you how to modify the config, but not what to put,
whereas the [GRUB hardening](../grub_hardening/) guide specifically
says what to modify; cross reference that page and this page.

## Disable `/dev/mem` security before continuing

Before internal flashing, you must first [disable `/dev/mem`
protections](../../install/devmem/). Make sure to re-enable them after you're
finished.

This only applies if you're following these instructions via internal flashing,
from an existing installation. If you're externally flashing the machine, you
can ignore this advice.

## Build dependencies

Follow the [build guide](../../build/) and install build dependencies.

### Coreboot utilities

You need `cbfstool` from coreboot. For whatever board you have, check which
coreboot tree it uses in Libreboot's build system, lbmk. For example, let's
say your board is `x200_8mb`, you would do:

	grep tree= config/coreboot/x200_8mb/target.cfg

In this example, the output might be:

	tree="default"

This means you should compile `cbfstool` from the `default` coreboot tree,
like so:

	./mk -d coreboot default

This will result in the following binary: `elf/cbfstool/default/cbfstool`

We won't assume the path to cbfstool, in the remainder of this guide, so
adapt accordingly.

### GRUB utilities

Again, let's assume the coreboot board is `x200_8mb`. Check the
file `config/coreboot/x200_8mb/target.cfg` for `grubtree` - if it's not set,
then the GRUB tree is `default`. We will assume `default`:

	./mk -b grub default

This will compile GRUB for the given tree. If you need to use any of the GRUB
utilities, this command will build them and in this example, they will be
available under `src/grub/default/`.

### Flashprog

Compile flashprog like so:

	./mk -b flashprog

A binary will appear at `elf/flashprog/flashprog`.

## Default GRUB config

The coreboot image has its own filesystem, CBFS, and within CBFS is the GRUB
binary, and within the GRUB binary is another filesystem called memdisk, where
the default GRUB configuration is located.

You can override it by inserting your own GRUB config within CBFS.

## Acquiring a GRUB config

### Dump the boot flash

This is only useful if you already inserted a GRUB config in CBFS. Otherwise,
you can grab it from Libreboot's build system, lbmk.

[Learn how to externally reprogram these chips](../../install/spi/) and use the
`-r` option in flashprog; alternatively, for internal flash access, look at the
[main flashing guide](../../install/).

Those guides show how to dump the flash contents, which you are advised to do.

### Default GRUB config location

We'll assume that your GRUB tree is `default`, so the
file `config/grub/default/config/payload` is your GRUB config; this will be the
same as what you have in memdisk. Make a copy of this file, for modification.

Modify *that* file, or the one you extracted if you already inserted a custom
one before, and you will re-insert it when you're done.

## Insert `grubtest.cfg`

Before reading the next section, please note: if you only have the fallback
GRUB config in memdisk, and no configs in CBFS, you can test the modified
version by inserting it as `grubtest.cfg`, instead of `grub.cfg`:

	cbfstool libreboot.rom add -f grubtest.cfg -n grubtest.cfg -t raw

Libreboot will not automatically load it, but it will be available from the
default GRUB menu. This can be useful for test purposes, hence the name.

## Insert `grub.cfg`

If you're sure that your configuration works (e.g. you used it as
`grubtest.cfg` and it works properly) you may wish to proceed to install it as
your main `grub.cfg`.

If you already have a `grub.cfg` in cbfstool, you can extract and modify that
one, e.g.:

	cbfstool libreboot.rom extract -n grub.cfg -f grub.cfg

Now remove it:

	cbfstool libreboot.rom remove -n grub.cfg

It's important that you re-add `grub.cfg` before flashing (or just add it, if
it was never there in the first place):

	cbfstool libreboot.rom add -f grub.cfg -n grub.cfg -t raw

If you flash the Libreboot image without a `grub.cfg` in CBFS, it will default
back to the one in GRUB memdisk.

## Flash the modified ROM image

Check the [Libreboot flashing guide](../../install/) which says how to flash the
new image.

If you did all of the steps correctly, your system should boot up just fine.
Shut it down and wait a few seconds. If you screwed it up and the system is now
unbootable, that's OK because you can use an external flasher; please read
[external flashing instructions](../../install/spi/)

