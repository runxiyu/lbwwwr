---
title: ThinkPad X60 Tablet Recovery guide
x-toc-enable: true
---

**NOTE: Libreboot standardises on [flashprog](https://flashprog.org/wiki/Flashprog)
now, as of 27 January 2024, which is a fork of flashrom.
The reason why was explained, in
the [Libreboot 20240225 release](../../news/libreboot20240225.md#flashprog-now-used-instead-of-flashrom)**

"Unbricking" means flashing a known-good (working) ROM. The problem:
you can't boot the system, making this difficult. In this situation,
external hardware is needed which can flash the SPI chip (where libreboot
resides). First, disassemble the machine using the following steps, and refer
to the external flashing guide linked later from *this* guide.

![](https://av.libreboot.org/x60t_unbrick/0000.JPG)

Remove those screws:\
![](https://av.libreboot.org/x60t_unbrick/0001.JPG)

Remove the HDD:\
![](https://av.libreboot.org/x60t_unbrick/0002.JPG)

Push keyboard forward to loosen it:\
![](https://av.libreboot.org/x60t_unbrick/0003.JPG)

Lift:\
![](https://av.libreboot.org/x60t_unbrick/0004.JPG)

Remove those:\
![](https://av.libreboot.org/x60t_unbrick/0005.JPG)

![](https://av.libreboot.org/x60t_unbrick/0006.JPG)

Also remove that (marked) and unroute the antenna cables:\
![](https://av.libreboot.org/x60t_unbrick/0007.JPG)

For some X60T laptops, you have to unroute those too:\
![](https://av.libreboot.org/x60t_unbrick/0010.JPG)

Remove the LCD extend board screws. Also remove those screws (see blue
marks) and remove/unroute the cables and remove the metal plate:\
![](https://av.libreboot.org/x60t_unbrick/0008.JPG)

Remove that screw and then remove the board:\
![](https://av.libreboot.org/x60t_unbrick/0009.JPG)

This photo shows the flash location:\
![](https://av.libreboot.org/x60t_unbrick/0011.JPG)

This photo shows an SPI flasher used, with SOIC8 test clip:\
![](https://av.libreboot.org/x60/th_bbb_flashing.jpg)

Refer to the external flashing guide:

[Externally rewrite 25xx NOR flash via SPI protocol](spi)

NOTE: Do not use the 3.3v rail from your SPI programmer. Leave that disconnected.
For 3.3v, plug your charger into the mainboard (but do not power on the mainboard)
when the clip is connected. Before removing the clip, disconnect the charger.
This will provide adequate 3.3v DC at correct current levels. The SPI flash on an
X60 Tablet shares a common 3.3V rail with many other components on the mainboard,
which all draw a lot of current, more than most flashers can provide.

Reverse the steps to re-assemble your system, after you've flashed the chip.
