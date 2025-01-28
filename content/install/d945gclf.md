---
title: Intel D945GCLF Desktop Board 
---

d945gclf: Doesn't boot at all, according to last report. D510MO is still in
lbmk but still was reported problematic; other boards should be fine (see list
above).

![Intel D945GCLF desktop board](https://av.libreboot.org/d945gclf/d945gclf.jpg)

| Type                   | Value                 |
| -                      | -                     |
| Manufacturer           | Intel                 |
| Name                   | D945GCLF/D945GCLF2D   |
| Released               | 2008                  |
| Chipset                | Intel Calistoga 945GC |
| CPU                    | Intel Atom            |
| Graphics               | ?                     |
| Display                | None.                 |
| Memory                 | Up to 2GB             |
| Architecture           | x86_64                |
| Original boot firmware | Intel BIOS            |
| Intel ME/AMD PSP       | Not present.          |
| Flash chip             | SOIC-8 512KiB         |

```
W+: Works without vendor firmware; 
N: Doesn't work; 
W*: Works with vendor firmware; 
U: Untested; 
P+: Partially works; 
P*: Partially works with vendor firmware
```

| ***Features*** |                                       | Notes |
|----------------|---------------------------------------|-------|
| **Internal flashing with original boot firmware** | N  |       |
| **Display**                                       | -  |       |
| **Audio**                                         | W+ |       |
| **RAM Init**                                      | W+ |       |
| **External output**                               | W+ |       |
| **Display brightness**                            | -  |       |

| ***Payloads supported***  |              |
|---------------------------|--------------|
| **GRUB**              | Doesn't work |
| **SeaBIOS**               | Works        |
| **SeaBIOS with GRUB** | Doesn't work |
</div>
If you just want flashing instructions, go to
[../install/d945gclf.md](../install/d945gclf)

D945GCLF2D also reported working by a user.

Introduction
============

This board is a mini-itx desktop board for 2008. It uses an atom 230,
which is a single core CPU but it is hyperthreaded so it appears to have
2 thread to the OS. The flash chip is very small, 512KiB, so grub2 does
not fit, which is why libreboot has to use seabios on this target. Full
disk encryption like on other supported targets will not be possible, so
plan accordingly.

This board has a 945gc chipset which is the desktop equivalent of 945gm
which can be found in the Lenovo x60/t60 or macbook2,1. This chipset
features an ICH7 southbridge. It has 1 DIMM slot that can accommodate up
to 2G of DDR2 RAM.

Connectivity-wise it has 1 PCI slot, a 10/100 ethernet port, 4 usb slot
and 4 usb ports, with one internal header and 2 SATA ports.

The D945GCLF2 is an upgraded version of this board. The differences are:
1 more USB header, 10/100/1000 ethernet and a dual core cpu (also
hyperthreaded). Since the board is almost identical (and coreboot code
seem to indicate that it works, since MAX\_CPU=4 is set), it is believed
that it should also work but this is untested.

Remarks about vendor bios:
--------------------------

-   Without coreboot/libreboot this board is completely useless, since the
    vendor bios is very bad. It cannot boot from any HDD whether it is
    connected to the SATA port or USB. With libreboot it works just
    fine.

-   The vendor bios write protects the flash so it requires external
    flashing to install libreboot on this device. Once libreboot is
    flashed there is no problem to update the firmware internally

Here is an image of the board:\
![](https://av.libreboot.org/d945gclf/d945gclf.jpg)\
Here is an image of the D945GCLF2 board:\
![](https://av.libreboot.org/d945gclf/20160923_141521.jpg){width="80%" height="80%"}\
And SPI SOIC8 flash chip\
![](https://av.libreboot.org/d945gclf/20160923_141550.jpg){width="50%" height="50%"}

Flashing instructions {#clip}
=====================

Refer to [spi.md](spi) for how to re-flash externally.

Here is an image of the flash chip:\
![](https://av.libreboot.org/d945gclf/d945gclf_spi.jpg)

How to replace thermal paste and fan
------------------------------------

This board comes with very crappy disposable loud fan, that one has no
bearings, which can not be repaired or oiled properly, do not waste your
time trying to fix it, just buy one chinese same size fan\
![](https://av.libreboot.org/d945gclf/20160923_141620.jpg){width="50%" height="50%"}
![](https://av.libreboot.org/d945gclf/20160923_141614.jpg){width="50%" height="50%"}\
Make sure that new one has same wiring\
![](https://av.libreboot.org/d945gclf/20160923_142618.jpg){width="50%" height="50%"}\
This is a new one, with bearing and maintenable\
![](https://av.libreboot.org/d945gclf/20160923_141738.jpg){width="50%" height="50%"}
![](https://av.libreboot.org/d945gclf/20160923_141814.jpg){width="50%" height="50%"}\
Now remove the both coolers rotating them a bit, slowly, then clean both
silicons and both coolers (removing cmos battery first is recommended)\
![](https://av.libreboot.org/d945gclf/20160923_141601.jpg){width="50%" height="50%"}\
Put a little bit of non conductive thermal paste on both silicons (only
cpu silicon iis shown on that image)\
![](https://av.libreboot.org/d945gclf/20160923_142031.jpg){width="50%" height="50%"}\

Before assembling new fan, some need new longer screws, make sure having
these (on the left is original one, too short for new fan)\
![](https://av.libreboot.org/d945gclf/20160923_141659.jpg){width="50%" height="50%"}\
After that, assemble your new fan into CPU cooler\
![](https://av.libreboot.org/d945gclf/20160923_141635.jpg){width="50%" height="50%"}\
Finally assemle both coolers on both chips, do not forget put in the CPU
fan connector back, and you are done.
