---
title: Installing ArchLinuxARM on a Chromebook with U-Boot installed
---

## Background

ArchLinuxARM Latest (as of May 1st 2023) boots and can be installed successfully using libreboot 20230319 on a gru_bob chromebook.

The following process should theoretically be applicable to other U-Boot devices and GNU/Linux distributions, but the focus here is specifically on ArchLinuxARM.

Sources used for this guide include the [following guide to install ArchLinuxARM on a RockPro64,](https://jforberg.se/blog/posts/2023-02-19-rockpro64/rockpro64.html)

And the the instructions from the ArchLinuxARM wiki [here](https://archlinuxarm.org/platforms/armv8/rockchip/asus-chromebook-flip-c101pa)
(Be aware that there will be overlap in my documentation with these guides, so some of this information will be very close to verbatim.)

The purpose of this guide is to instruct users on how to install an ArchLinuxARM on an external disk that will boot on a gru_bob chromebook, and optionally on the internal eMMC. Many concepts covered in this guide may be familiar to prospective and veteran Libreboot users, with the scope being comprehensive.

## Boot Method

There are (at least) three methods that can be used to boot into a Linux distribution from u-boot:
1) EFI - common, modern boot method for amd64 architecture machines. This is not distribution-specific, so if you intend to make a portable drive that is compatible across multiple systems, you may have a use case.

This is an unlikely use-case, so it's a bit odd to use an EFI partition when not using a UEFI system.

2) boot.scr - a boot script provided by a distribution. Since it is u-boot specific, you will only be able to boot your device from u-boot.
Despite still being distributed by some distros, boot.scr is a legacy boot method according to the u-boot docs:
"Typically we expect extlinux.conf to be used, but execution of boot.scr is maintained for backwards-compatibility."

For more information about what actually goes into a boot.scr script, check [this page in the u-boot documentation](https://u-boot.readthedocs.io/en/latest/usage/cmd/source.html?highlight=boot.scr#fit-image)

3) extlinux.conf - a flat, bootloader-spec text file that lives in /boot/extlinux/extlinux.conf. That's all.

Since extlinux.conf is supported by multiple bootloaders, making your system more portable, is natively supported by u-boot, it seems to be the best choice for a chromebook.

## Creating extlinux.conf

Here is an example template of extlinux.conf, [similar examples are found in the u-boot docs](https://u-boot.readthedocs.io/en/latest/develop/distro.html):

```
default arch
menu title Libre-U-Boot menu
prompt 0
timeout 50


label arch
        menu label Arch Linux ARM
        linux /Image
        initrd /initramfs-linux.img
        fdt /dtbs/rockchip/rk3399-gru-bob.dtb
        append  root=PARTUUID=$PARTUUID rw console=tty1 console=ttyS2,115200 earlycon rootwait LANG=en_US.UTF-8

label archfallback
        menu label Arch Linux ARM (FALLBACK)
        linux /Image
        initrd /initramfs-linux-fallback.img
        fdt /dtbs/rockchip/rk3399-gru-bob.dtb
        append  root=PARTUUID=$PARTUUID rw console=tty1 console=ttyS2,115200 earlycon rootwait LANG=en_US.UTF-8
```

## Formatting and Partitioning Your External Media

Now it's time partition the boot disk. During testing, a microSD card was used in the microSD card slot of the gru-bob chromebook.
The libreboot configuration (in the 20230319 release) will boot the microSD card above the onboard eMMC if both are present and bootable. This is useful because it means no knowledge or use of the u-boot console is required.

Since the eMMC is 16GB of storage space, it's advisable to choose an external storage disk of less than 16GB if you intend to install onto the onboard storage, or to create a root partition of less than 15.8GB.

Find your device with my favourite command, `lsblk` and open it with `fdisk`

```
fdisk /dev/sdX
```
For users creating a bootable SD card, your device may show up as `/dev/mmcblkX` - if this is the case, make sure to change the commands in this guide to
contain that path instead of `/dev/sdX`.

In the fdisk tui, create two partitions on a Master Boot Record:
- create a new MBR label
- create boot partition of approx. 200MB or greater
- set bootable flag on this partition
- set type to fat32 (ext2 is also supported by extlinux I believe, but I used fat32)
- create a second partition of up to 15.8GB

You will find the appropriate options by typing `m` when using the fdisk tui on GNU/Linux distros.

Now make the filesystems:
```
mkfs.vfat /dev/sdX1
mkfs.ext4 /dev/sdX2

```

It's now time to get the PARTUUID of `/dev/sdX2`:
```
sudo blkid | grep "/dev/sdX2"
```
make sure to note down the PARTUUID of your second partition; not your boot partition.
paste this into your extlinux.conf file in the `append` section, e.g.:
```
append console=ttyS0,115200 console=tty1 rw root=PARTUUID=fc0d0284-ca84-4194-bf8a-4b9da8d66908
```
in the template provided above, replace `$PARTUUID` with your own. It's possible to specify root in other ways - check the u-boot docs for more examples.

## Boot-Disk Creation

Now that we've got an extlinux.conf file, copy it to your /tmp directory, and we'll begin.
```
cd /tmp
curl -LO http://os.archlinuxarm.org/os/ArchLinuxARM-aarch64-latest.tar.gz
mkdir root
mkdir boot
mount /dev/sdX2 root

mount /dev/sdX1 boot
tar -C boot --strip-components=2 -xvf ArchLinuxARM-aarch64-latest.tar.gz ./boot/
tar -C root --exclude=./boot -xvf ArchLinuxARM-aarch64-latest.tar.gz
mkdir boot/extlinux
cp extlinux.conf boot/extlinux/extlinux.conf
sync
umount boot
umount root
```
Note the use of ArchLinuxARM-aarch64-latest.tar.gz and not ArchLinuxARM-gru-latest.tar.gz

The current gru build only supports a depthcharge payload and, of course, we're not using depthcharge are we?

With that, you should now have a (kind of) working boot disk - insert your installation media and boot.

Extensive testing with ArchLinuxARM-latest release, showed that booting the fallback initramfs image will work, but the main image won't.
If you create an extlinux.conf file with paths to both images - like in the template above - you can select either by number at boot.

## Going Live - Necessary Tweaks

Once you're at the login prompt, the fun isn't over! Login & password for root are both `root` by default.
Most Arch users will likely try to update their system now - don't update just yet.

Run `lsblk` and you'll see that the boot partition is not mounted by default.
Updating with `pacman -Syu` at this stage will cause driver problems if you update without your boot partition mounted, likely meaning you cannot connect to the internet with a USB peripheral.

To prevent this becoming a problem:
```
mkdir /boot
mount /dev/sdX1 /boot
```
With that out of the way, yes, you may now update.
It's worth creating a basic filesystem table to automate mounting at boot - it's blank by default so here's another template:

```
# Static information about the filesystems.
# See fstab(5) for details.

# <file system> <dir>           <type>          <options>       <dump> <pass>
# /dev/mmcblk1p2 root
UUID=$UUID1       /               ext4            rw,relatime     0 1

# /dev/mmcblk1p1 boot
UUID=$UUID0       /boot           vfat            rw,relatime     0 2
```
It should go without saying that you'll replace `$UUID0` and `UUID1` with your boot and root filesystem UUID.
To get the right information in there:
```
lsblk -o NAME,UUID,FSTYPE,SIZE
```
`NAME` and `SIZE` are not necessary, but they will help you tell which partition is which.

## Final Steps

At this stage, you now have a fully functional ArchLinuxARM system on an external disk, and are ready to configure your system.
If you intend to install onto the eMMC module, you can make your changes permanent with:
```
dd if=/dev/mmcblk0 of=/dev/mmcblk1 bs=4M status=progress
```

If you did not update before `dd`-ing your drive, remember that you may still have to use the fallback initramfs to boot properly until you update the kernel.

This should be everything you need to do for the time being - enjoy configuring your system!
