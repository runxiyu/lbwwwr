---
title: Frequently Asked Questions
---

<!--
  -- TODO: Replace all of these with shortcodes that use <details>
  -->

## General questions

### How do I install Libreboot?

Refer to the [installation guide](../install/).

### How do I build from source?

Refer to the [lbmk build instructions](../build/).

### How can I help?

Refer to the [contributing guide](../contrib/).

## Issues with specific boards

### Unable to load `thinkpad_acpi` on post-Haswell systems

Reported by a user on Debian 11 (on a ThinkPad T440p) and a user on Void Linux
(ThinkPad T480), Linux (or modprobe) may fail to load `thinkpad_acpi`:

```
modprobe: ERROR: could not insert 'thinkpad_acpi': "No such device"
```

It is suspected that at least these motherboards are affected:

* [ThinkPad W541](../install/w541_external/)
* [ThinkPad T440p](../install/t440p_external/)
* [ThinkPad T480/T480s](../install/t480/)

This may result the following effects, including or not limited to:

 * Temperature reporting not working
 * Battery info not working
 * Fan speed reporting not working
 * Fan control not working

**However, enabling it on the ThinkPad T480 may cause, as of Libreboot
20241206rev8: it might turn off rfkill making you have to manually unblock
wlan, and the Fn keys through F9 to F12 may stop working.**

For these systems, add the line

```
options thinkpad_acpi force_load=1
```

to any file in `/etc/modprobe.d`. You can also add

```
thinkpad_acpi.force_load=1
```

to your kernel parameters (in GRUB, or your preferred linux-capable bootloader).

### TLP


You can install the `tlp` package and start that service. For example, on
Debian:

```
apt-get install tlp tlp-rdw
systemctl enable tlp
systemctl start tlp
```

Now read the manual:

```
man tlp-stat
```

As root, you can do:

```
tlp-stat -b
```

This will provide information about the battery.

### Uneven backlight on GM45 ThinkPads

We don't know how to detect the correct PWM value to use in coreboot, so we
just use the default one in coreboot which has this issue on some CCFL panels,
but not LED panels.

You can work around this in your distribution, by following the notes at [docs:
backlight control](../misc/#finetune-backlight-control-on-intel-gpus).
<!-- TODO -->

### GM45 thinkpad ethernet port doesn't autoconnect

This was observed on some systems using NetworkManager. This happens both on
the original BIOS and in Libreboot. It's a quirk in the hardware. Restart the
`NetworkManager` service when you connect the cable.

### PIKE2008 module hangs KGPE-D16 / KCMA-D8

Loading the option ROM from the PIKE2008 module on either ASUS KCMA-D8
or KGPE-D16 causes the system to hang at boot. It's possible to use
this in the payload (if you use a Linux kernel payload, like
[LinuxBoot](https://www.linuxboot.org/)), or to boot (with SeaGRUB and/or
SeaBIOS) from regular SATA and then use it in Linux. Linux is capable of using
the PIKE2008 module without loading the option ROM.

### How to save kernel panic logs on ThinkPads?

The easiest method of doing so is by using the kernel's netconsole
and reproducing the panic. Netconsole requires two machines, the one that is
panicky (source) and the one that will receive crash logs (target). The
source has to be connected with an ethernet cable and the target has to be
reachable at the time of the panic. To set this system up, execute the
following commands as root on the source (`source#`) and normal user on
the target (`target$`):

1.  Start a listener server on the target machine (netcat works well):

    ```
	target$ nc -u -l -p 6666
    ```

2.  Mount configfs (only once per boot, you can check if it is already mounted
    with `mount | grep /sys/kernel/config`. This will return no output
    if it is not).

    ```
	source# modprobe configfs
	source# mkdir -p /sys/kernel/config
	source# mount none -t configfs /sys/kernel/config
    ```

3.  Find source's ethernet interface name, it should be of the form `enp*` or
    `eth*`, see `ip address` or `ifconfig` output.

    ```
	source# iface="enp0s29f8u1" # Change this!
    ```

    Fill the target machine's IPv4 address here:

    ```
	source# tgtip="192.168.1.2" # Change this!
    ```


4.  Create netconsole logging target on the source machine:

    ```
	source# modprobe netconsole
	source# cd /sys/kernel/config/netconsole
 	source# mkdir target1; cd target1
	source# srcip=$(ip -4 addr show dev "$iface" | grep -Eo '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+')
	source# echo "$srcip" > local_ip
	source# echo "$tgtip" > remote_ip
	source# echo "$iface" > dev_name
	source# arping -I "$iface" "$tgtip" -f | grep -o '..:..:..:..:..:..' > remote_mac
	source# echo 1 > enabled
    ```

5.  Change console loglevel to debugging:

    ```
	source# dmesg -n debug
    ```

6.  Test if the logging works by e.g. inserting or removing an USB
    device on the source. There should be a few lines appearing in the
    terminal, in which you started netcat (nc), on the target host.

7.  Try to reproduce the kernel panic.

## General technical questions

### How do I write-protect the flash chip?

By default, there is no write-protection on a Libreboot system. This is
for usability reasons, because most people do not have easy access to an
external programmer for re-flashing their firmware, or they find it
inconvenient to use an external programmer.

On some systems, it is possible to write-protect the firmware, such that
it is rendered read-only at the OS level (external flashing is still
possible, using dedicated hardware). For example, on current GM45
laptops (e.g. ThinkPad X200, T400), you can write-protect (see
[ICH9 gen utility](docs/install/ich9utils.md#ich9gen)).

It's possible to write-protect on all Libreboot systems, but the instructions
need to be written. The documentation is in the main git repository, so you are
welcome to submit patches adding these instructions.

There is also another incomplete guide for [flash write
protection](../write_protect/).

<!-- Document PRx based flash protection on Intel platforms, and investigate
other methods on AMD systems. -->

### How do I change BIOS settings?

Most Libreboot setups actually use the [GRUB
payload](http://www.coreboot.org/GRUB2). More information about payloads
can be found at
[coreboot.org/Payloads](http://www.coreboot.org/Payloads). SeaBIOS is also
available. The CMOS config is hardcoded in Libreboot.

The libreboot project inherits the modular payload concept from coreboot, which
means that pre-OS bare-metal BIOS setup programs are not very practical.
Coreboot (and libreboot) does include a utility called `nvramtool`, which can
be used to change some settings. You can find nvramtool under
`coreboot/util/nvramtool/`, in the libreboot source archives.

The `-a` option in nvramtool will list the available options, and `-w` can be
used to change them. Consult the nvramtool documentation on the coreboot wiki
for more information.

In practise, you don't need to change any of those settings, in most cases.

Default libreboot setups lock the CMOS table, to ensure consistent
functionality for all users. You can use:

```
nvramtool -C yourrom.rom -w somesetting=somevalue
```

To get a full list of available options, do this:

```
nvramtool -C yourrom.rom -a
```

This will change the default inside that ROM image, and then you can re-flash
it.

### Do I need to install a bootloader when installing a distribution?

Most libreboot setups integrate the GRUB bootloader already, as a
[payload](http://www.coreboot.org/Payloads). This means that the GRUB
bootloader is actually *flashed*, as part of the boot firmware. This means that
you do not have to install a boot loader on the HDD or SSD, when installing a
new distribution. You'll be able to boot just fine, using the bootloader (GRUB)
that is in the flash chip.

This also means that even if you remove the HDD or SSD, you'll still have a
functioning bootloader installed which could be used to boot a live
distribution installer from a USB flash drive. <!-- TODO See [How to install Linux on a
libreboot system](../linux/grub_boot_installer) -->

You should refer to the [GRUB guide](../grub/).

Nowadays, other payloads are also provided. If you're using the SeaBIOS payload,
then the normal MBR bootsector is used on your HDD or SSD, like you would
expect, so you would need a separate bootloader.

<!-- TODO: uhhh how do you configure the GRUB? -->

### Do I need to re-flash when I re-install a distribution?

<!--
  -- TODO: this seems to imply that you should install GRUB to chainload if
  -- you don't want to reflash libreboot all the time.
  -->

Not anymore. Recent versions of libreboot (using the GRUB payload) will
automatically switch to a GRUB configuration on the HDD or SSD, if it exists.
You can also load a different GRUB configuration, from any kind of device that
is supported in GRUB (such as a USB flash drive). For more information, see
[Modifying the GRUB Configuration in libreboot
Systems](../linux/grub_cbfs)

If you're using the SeaBIOS payload, it's even easier. It works just like you
would expect. SeaBIOS implements a normal x86 BIOS interface.


## Hardware compatibility

### Which systems are compatible?

Any system that coreboot supports can easily be added, so *compatibility*
merely refers to whatever boards are integrated in the `lbmk` build system,
which Libreboot uses.

The [installation page](../install/) lists compatible machines.

## Issues during flashing

### What does a flash chip look like?

There are many images on the [SPI guide](../install/spi/).

### How do I pad a ROM before flashing?

It is advisable to simply use a larger ROM image. This section was written
mostly for ASUS KCMA-D8 and KGPE-D16 motherboards, where previously we only
provided 2MiB ROM images in libreboot, but we now provide 16MiB ROM images.
Other sizes are not provided because in practise, someone upgrading one of
these chips will just use a 16MiB one. Larger sizes are available, but 16MiB
is the maximum that you can use on all currently supported libreboot systems
that use SPI flash.

Required for ROMs where the ROM image is smaller than the flash chip
(e.g. writing a 2MiB ROM to a 16MiB flash chip).

Create an empty (00 bytes) file with a size the difference between
the ROM and flash chip. The case above, for example:

```
truncate -s +14MiB pad.bin
```

For x86 descriptorless images you need to pad from the *beginning* of the ROM:

```
cat pad.bin yourrom.rom > yourrom.rom.new
```

For ARM and x86 with intel flash descriptor, you need to pad after the image:

```
cat yourrom.rom pad.bin > yourrom.rom.new
```

Flash the resulting file. Note that cbfstool will not be able to
operate on images padded this way so make sure to make all changes to
the image, including runtime config, before padding.

To remove padding, for example after reading it off the flash chip,
simply use dd(1) to extract only the non-padded portion. Continuing with the
examples above, in order to extract a 2MiB x86 descriptorless ROM from a
padded 16MiB image do the following:

```
dd if=flashprogread.rom of=yourrom.rom ibs=14MiB skip=1
```

With padding removed cbfstool will be able to operate on the image as usual.


### How do I program an SPI flash chip?

Refer to the [SPI guide](../install/spi/).

<!-- It's possible to use a 16-pin SOIC test clip on an 8-pin SOIC chip, if you
align the pins properly. The connection is generally more sturdy. -->

### Can I use CH341A?

This SPI flasher will damage your chip, and motherboard unless if you modify
its circuitry. We strongly recommend using a Raspberry Pi Pico instead, which
is superior in every way, and costs about the same price. [Read more here.](../install/ch341a/)


### I'm having issues with `/dev/mem`

Before internal flashing, you must first [disable `/dev/mem`
protections](../install/devmem/). Make sure to re-enable them after you're
finished.

## Operating systems

### Can I use Linux?

Absolutely! It is well-tested in Libreboot, and highly recommended. See
[the Linux guide](../os/linux/).

Any recent distribution should work, as long as it uses KMS (kernel mode
setting) for the graphics.

### Fedora won't boot?

On Fedora, by default the grub.cfg tries to boot linux in 16-bit mode. You
just have to modify Fedora's GRUB configuration. 
Refer to [the Linux guide](../os/linux/).

### Can I use BSD?

Absolutely! The Libreboot firmware has good support for FreeBSD, NetBSD and
OpenBSD. Other systems are untested, but should work just fine.
See [the BSD guide](../os/bsd/).

### Can I use Windows?

In theory, yes, you can use Windows [10](https://yewtu.be/watch?v=BWq6XnWKQnM)
and [11](https://yewtu.be/watch?v=OFHiMfVNNeA). You will need to [bypass the
TPM 1.2 and SecureBoot
requirement](https://www.majorgeeks.com/content/page/bypass_tpm.html) to use
Windows 11.

Windows is proprietary software, which means that you do not have the freedom
to use, study, adapt and share the software in any reasonable way. This is
contradictory to the goals of Libreboot, are not officially supported, and the
community cannot provide support for them.

### Can I use Plan 9?

You will need to use the VGA ROM. <!-- TODO -->

### Are other operating systems compatible?

Unknown. Perhaps so, but it's impossible to say without further testing.

## Licensing and other non-technical information

### What level of software freedom does Libreboot give me?

You should refer to:
- The [binary blob minimalization policy](../policy/)
- The supported hardware list <!-- TODO -->
- The page on [firmware outside of Libreboot's scope](../other_firmware/)

No device we support is "100% free", as they all include firmware outside of
Libreboot's scope, such as disk/USB controllers and the embedded controller
firmware.

### What are the prospects for libre hardware?

One day, we will live in a world where anyone can get their own chips made,
including CPUs but also every other type of IC. Efforts to make homemade chip
fabrication a reality are now in their infancy, but such efforts do exist, for
example, the work done by [Sam Zeloof](http://sam.zeloof.xyz)
([YouTube](https://www.youtube.com/channel/UC7E8-0Ou69hwScPW1_fQApA); literally
makes CPUs in his garage) and the [Libre Silicon](https://libresilicon.com/)
project.

### Where can I learn more about electronics?

* Basics of soldering and rework by PACE  
    Both series of videos are mandatory regardless of your soldering skill.
    * [Basic Soldering](https://yewtu.be/playlist?list=PL926EC0F1F93C1837)
    * [Rework and Repair](https://yewtu.be/playlist?list=PL958FF32927823D12)
    The PACE series above covers classic techniques, but does not cover much
    about *modern* electronics. For that, see:
    * [iFixit microsoldering lessons, featuring Jessa
	Jones](https://yewtu.be/playlist?list=PL4INaL5vWobD_CltiZXr7K46oJ33KvwBt)
    * Also see youtube links below, especially Louis Rossman videos, to learn
      a (lot) more.
* [edX course on basics of electronics](https://www.edx.org/course/circuits-and-electronics-1-basic-circuit-analysi-2)  
    In most countries contents of this course is covered during
    middle and high school. It will also serve well to refresh your memory
    if you haven't used that knowledge ever since.
* Impedance intro
    * [Similiarities of Wave Behavior](https://yewtu.be/watch?v=DovunOxlY1k)
    * [Reflections in transmission line](https://yewtu.be/watch?v=y8GMH7vMAsQ)
    * Stubs:
        * [Wikipedia article on stubs](https://en.wikipedia.org/wiki/Stub_(electronics))
        * [Polar Instruments article on stubs](http://www.polarinstruments.com/support/si/AP8166.html)  
        With external SPI flashing we only care about unintended PCB stubs
* [How to accurately measure header/connector pitch](https://www.microcontrollertips.com/accurately-measure-headerconnector-pitch/)
* Other YouTube channels with useful content about electronics
    * [EEVblog](https://yewtu.be/channel/UC2DjFE7Xf11URZqWBigcVOQ)
	(generally about electronics, reviews about equipment, etc, some
	repair videos)
    * [Louis Rossmann](https://yewtu.be/channel/UCl2mFZoRqjw_ELax4Yisf6w)
	(right to repair advocacy, lots of macbook repair videos)
    * [mikeselectricstuff](https://yewtu.be/channel/UCcs0ZkP_as4PpHDhFcmCHyA)
    * [bigclive](https://yewtu.be/channel/UCtM5z2gkrGRuWd0JQMx76qA)
    * [ElectroBOOM](https://yewtu.be/channel/UCJ0-OtVpF0wOKEqT2Z1HEtA)
	(he blows stuff up, and shows you how not to do that)
    * [Jeri Ellsworth](https://yewtu.be/user/jeriellsworth/playlists)
	(has a video showing how to make a *transistor* yourself)
    * [Sam Zeloof](https://yewtu.be/channel/UC7E8-0Ou69hwScPW1_fQApA)
	(Sam literally makes CPUs in his garage, inspired by Jeri Ellsworth's
	work with transistors)
    * [Ben Eater](https://eater.net/) (shows how to build an 8-bit CPU from scratch,
	also does things with MOS 6502)
	(also shows how to make other things like graphics chips, teaches networking
	concepts) - check out [Ben's videos](https://redirect.invidious.io/beneater)!
    * [iPad Rehab with Jessa Jones](https://yewtu.be/channel/UCPjp41qeXe1o_lp1US9TpWA)
	(very precise soldering. she does repairs on mobile phones and such, also
	featured in iFixit's series about getting into component repairs)
* Boardview files can be open with [OpenBoardview](https://github.com/OpenBoardView/OpenBoardView),
which is libre software under MIT license.

Use of [yt-dlp](https://github.com/yt-dlp/yt-dlp) is recommended for YouTube
links.

Lastly the most important message to everybody gaining this wonderful new
hobby: [Secret to Learning Electronics](https://yewtu.be/watch?v=xhQ7d3BK3KQ)
