---
title: Insert Vendor Files not Included in Release Images
toc: true
---

**PLEASE MAKE SURE you read and follow the instructions on this page, prior to
flashing Libreboot, if required for your motherboard; failure to heed this
warning can and will result in a soft-brick, which would then necessitate
recovery via [external flashing](spi) &ndash; regardless, you are advised to
also read the external flashing guide just in caes, and have an external
flasher handy in case you need it.**

Even if your board doesn't need vendor firmware inserted, you can also use this
guide to change the GbE MAC address in the flash, if your board has an Intel
Gigabit Ethernet device (where an Intel Flash Descriptor is used).

## WARNING: eCryptfs file name limits

Do not run the build system on a eCryptfs file system, because it has
very short file name limits and Libreboot's build system deals with very
long file names. We commonly get reports from this by Linux Mint users
who encrypt their home directory with eCryptfs; regular LUKS encryption will
do nicely.

## **Install build dependencies first**

**You will be compiling several small utilities from source code. This means
you need the compilers and various libraries.**

**Please make sure to install [build dependencies](../build/)** before using this
guide, and note that this guide assumes you use [lbmk.git](../../git).

**Failure to adhere to this warning will result in vendor file insertion not
working. The insertion must work correctly, prior to Libreboot installation,
if your board requires it, otherwise your board simply will not boot.**

## Introduction

On *some* boards, but certainly not all of them, certain files are required from
the hardware vendor. Libreboot has strict [rules](../../news/policy)
governing this, and you can find more information on
the [Freedom Status](../../freedom-status) page.

Libreboot can't directly distribute *all* of these files, so some of them are
downloaded at build-time, and processed for insertion into the firmware images.
**On pre-compiled ROM images in releases, these files are removed, and can be
re-added using the same automation that was applied during the build process.**

Examples of these files can be found on
the [Freedom Status](../../freedom-status) page.

**If in doubt, you should simply follow these instructions. If your board
doesn't need vendor files, the tar archive won't be modified.**

### MAC address

Regardless of whether your board needs vendorfiles or not, you can also use
this command to change the MAC address on systems with Intel GbE regions in
the flash, where an Intel gigabit ethernet device is used.

For example, a Lenovo ThinkPad X200 doesn't need any files added, but can still
have the mac address changed; please continue reading!

### Injecting vendor files into tarballs

In order to inject the necessary files into a rom image, run the script from the root of lbmk and point to the rom image.

If you only wish to flash a release rom then the process of injecting the necessary files is quite simple.
Run the injection script pointing to the release archive you downloaded:

	./mk inject libreboot-RELEASE_targetname.tar.xz

**NOTE: As of Libreboot 20241206 rev8 or newer, the above command will behave
the same way as if you declared `setmac` without argument, mentioned below:**

Where a GbE region is present in the flash, you can also use the above command
to change the MAC address, by modifying it like so:

	./mk inject libreboot-RELEASE_targetname.tar.xz setmac

Note that `setmac`, without additional argument, will *randomise* the MAC
address, setting a *local*, *unicast* MAC address. You can specify a custom
MAC address, like so:

	./mk inject libreboot-RELEASE_targetname.tar.xz setmac 00:1f:16:00:01:02

The `setmac` command, without argument, is technically redundant, since MAC
addresses are randomised by default, every time you run the inject script.

If you wish to *skip* changing the MAC address (not recommended), you can
use the `keep` argument, like so:

	./mk inject libreboot-RELEASE_targetname.tar.xz setmac keep

The `setmac` command works by inserting a reference GbE file, contained within
lbmk. The `keep` command makes lbmk *skip* changing your current GbE region;
it does not, for example, restore the reference GbE image from lbmk.

The `setmac` command, when not using `keep`, copied the default GbE file within
lbmk for that board, modifying the temporary copy and then inserting that. To
insert the *original file*, without modification, you can do this:

	./mk inject libreboot-RELEASE_targetname.tar.xz setmac restore

The `restore` setting does the same as `setmac` (without `keep`), but skips
running `nvmutil`; it also skips building nvmutil. Essentially, this will
restore the default MAC address from standard release images.

The above MAC address is a random example; please make sure to use one that matches
your board, if you wish. You can also use randomisation this way; the `?` character
will be randomised, e.g.:

	./mk inject libreboot-RELEASE_targetname.tar.xz setmac ??:??:??:??:??:??

You can mix and match arbitrary characters with random ones, e.g.:

	./mk inject libreboot-RELEASE_targetname.tar.xz setmac 0?:??:12:?a:6?:69

The script can automatically detect the board as long as you do not change the file name.

On Libreboot 20241206 rev8 or newer, releases newer than the 20241206 series,
and in the latest lbmk Git repository branch revisions (`master` branch), the
commands above *directly modify the tarball*.

Older versions left the tarball unmodified, and extracted the modified images
to `bin/release/` - on current behaviour, you inject the tarball and then
extract the tarball yourself afterward, to flash the modified images.

### Behaviour changes in Libreboot 20241206 rev8

*Older* versions of this script would have produced the injected images under
the `bin/release/` directory, and/or allow you to do it on specific ROM images.

The *current* version, pertaining to this documentation, *only* supports injecting
tarballs, because the tarball-based mechanism verifies checksums on images,
after insertion.

The older versions of this script would have left the tarball unmodified, while
producing `bin/release/` containing your images.

The *current* version, pertaining to this documentation, modifies the tarball
itself. You can inject and un-inject. To un-inject, you can do:

	./mk inject libreboot-RELEASE_targetname.tar.xz nuke

Running the `nuke` command will remove vendorfiles, and re-generate a file inside
the archive named `vendorhashes`. When running regular inject, not `nuke`,
the `vendorfiles` file is removed after insertion; this way, subsequent
injections are avoided, by detecting whether they're needed on the basis of
that file.

The nuke command is available because Libreboot's build system uses it when
producing release archives. You otherwise shouldn't use `nuke` yourself, except
for testing purposes or if you're just curious.

Libreboot 20241206 rev8 have different command structure for the inject script.
Older versions could insert into lone ROM images, with a special command, and
generally didn't have good error checking. The new version of this script is
much safer and easier to use. **These changes are also present in the latest
lbmk git repository.**

ALSO: Non-injected images do, on Libreboot 20241206 rev8 or higher, have 1 byte
of padding - yes, *1 byte* - at the end, to make flashprog fail to flash it due
to size mismatch versus chip size, and the words `DO_NOT_FLASH` are inserted
into the file name. With both of these things, the user is unlikely to flash
an image that hasn't been injected.

After injection, the `DO_NOT_FLASH` file name prefix is removed, as is the
padding, so that the injected images are ready to flash, and the tarball is
re-generated with these images.

ALSO: If vendorfiles are not needed, or if an error occurs, modification of
the tarball is avoided and it's left alone, UNLESS the following condition is
met:

If no errors occurred, but no vendor files are needed, you can still inject a
new MAC address, where there is a GbE region. If there isn't a GbE region,
such modification is skipped (some boards don't have Intel gigabit ethernet,
and might have a different ethernet adapter instead).

When vendor files are inserted and/or a MAC address is inserted, the tarball
is re-generated. MAC address insertion is handled with [nvmutil](nvmutil);
the steps there are applied automatically.

Older release images, prior to 20241206 rev8, do not have `DO_NOT_FLASH` or
the 1-byte padding, so watch out! However, this script, the new version, is
backwards compatible with older releases.

That's one possible use for the `nuke` command, running it yourself. If you're
distributing the older release images, you could inject them, and then nuke
them; doing so will re-generate the `vendorhashes` file, *and* retroactively
pad them (and add `DO_NOT_FLASH` to the image file names). It would be pointless
for Libreboot to retroactively modify the official images in this way, since
20241206 rev8 and newer already has this done to it. Just be careful when
using the older tarballs.

## Check that the files were inserted

### Automatic verification

You *must* ensure that the files were inserted. The inject command automatically
verifies checksums of the complete images, when you run it directly on a
release tarball.

If there was an error, and/or the checksums didn't match, then the tarball won't
be modified. If you're using newer release images with `DO_NOT_FLASH` and
the one-byte padding (as described above), that's a good indicator, but older
release images didn't have this modification.

### Manual inspection

You could check the files manually, if you're paranoid, after insertion.

Some examples of how to do that in lbmk:

	./mk -d coreboot TREENAME

TREENAME should be the coreboot tree corresponding to your board. Check
this in `config/coreboot/BOARD/target.cfg` for your board, and `tree` will be
set to e.g. `default`, or some other tree name.

Now you find `elf/cbfstool`, which is a directory containing `cbfstool`
and `ifdtool`. Do this on your ROM image (`libreboot.rom` in the example
below):

	./elf/cbfstool/TREENAME/cbfstool libreboot.rom print

You should check that the files were inserted in cbfs, if needed; for example,
EC firmware or MRC firmware, perhaps FSP.

FSP is redistributable by Intel, but not with modification. Since coreboot has
to de-concatenate FSP into its modules, and modify pointers in the FSP-M module,
for raminit, Libreboot treats FSP modules like other injectable vendor files.

(in the original 20241206 release, FSP was directly baked in; the change
described above was applied in Libreboot 20241206 and newer, and the 3050micro
image from Libreboot 20241008 was removed from Libreboot's rsync server)

Next:

	./elf/ifdtool/TREENAME/ifdtool -x libreboot.rom

This creates several `.bin` files, one of which says `me` in it (Intel ME).
Run hexdump on it:

	hexdump flashregion_2_intel_me.bin

Check the output. If it's all `0xFF` (all ones) or zeroes or otherwise isn't a
bunch of code, then the Intel ME firmware wasn't inserted. You could also run
the `me_cleaner` program on this file, to see if it gives you any information,
if you're not savvy enough to look at stuff in hexdump.

You'll note the small size of the Intel ME, e.g. 84KB on sandybridge platforms.
This is because lbmk *automatically* neuters it, disabling it during
early boot. This is done using `me_cleaner`, which lbmk imports. If the platform
uses MEv11 with Intel Boot Guard, the boot guard is automatically disabled
by processing the MEv11 image with Mate Kukri's [deguard](deguard) utility.

## Errata

This section should not concern you, if you're using newer Libreboot releases.
This section largely concerns *bugs* which existed in older releases, pertaining
to this documentation, and design changes made accordingly.

NOTE: As of Libreboot releases from May 2024 onward, the Intel MRC is no longer
included for Haswell; MRC is a firmware for raminit, but we now provide native
raminit written by Angel Pons, for the coreboot project. The following targets
no longer exist in the build system:

* `t440pmrc_12mb` (use `t440plibremrc_12mb` instead)
* `t440pbmrc_12mb` (use `t440plibremrc_12mb` instead)
* `w541mrc_12mb` (use `w541_12mb` instead)
* `w541bmrc_12mb` (use `w541_12mb` instead)
* `dell9020sff_12mb` (use `dell9020sff_nri_12mb` instead)
* `dell9020sffbmrc` (use `dell9020sff_nri_12mb` instead)
* `dell9020mt_12mb` (use `dell9020mt_nri_12mb` instead)
* `dell9020mtbmrc` (use `dell9020mt_nri_12mb` instead)

FSP images are also no longer baked in on release images, from
Libreboot 20241206 rev8 or higher (or releases newer than the 20241206 series),
but the machines that use them still need them; they are injected instead,
using the commands shown above on this very page. Older images with FSP baked
directly into release images had `_fsp` in the file names; newer images that
need it to be injected have `_vfsp` in the file name. Releases from Libreboot
20241206 release series at revision 8 or higher, or releases newer than the
20241206 series, no longer include `_fsp` images as they are set `release="n"`
in the build system; these releases include `_vfsp` images instead. Newer
targets added in the future, that need FSP, will also have `_vfsp` in the
file name, for consistency.

This is written as errata because some users may still be using older release
images but on the newer build system from May 2024 onward; you must use the
Libreboot 20240225 release if you want to inject MRC and so on, for these older
targets.

Libreboot's [Binary Blob Reduction Policy](../../news/policy) is very strict,
and states: if it can be done with free software exclusively, then it should be
done with free software exclusively. Therefore, the MRC is removed on Haswell
and Libreboot will only use the libre raminit (called NRI, short for Native Ram
Initialisation).

The four freedoms are absolute.
