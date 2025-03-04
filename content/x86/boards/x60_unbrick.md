---
title: ThinkPad X60 Recovery guide
x-toc-enable: true
---

Only the Intel GPU is compatible. Do not flash the ATI GPU models.

"Unbricking" means flashing a known-good (working) ROM. The problem:
you can't boot the system, making this difficult. In this situation,
external hardware is needed which can flash the SPI chip (where libreboot
resides). First, disassemble the machine using the following steps, and refer
to the external flashing guide linked later from *this* guide.

Remove those screws:\
![](https://av.libreboot.org/x60_unbrick/0000.jpg)

Push the keyboard forward (carefully):\
![](https://av.libreboot.org/x60_unbrick/0001.jpg)

Lift the keyboard up and disconnect it from the board:\
![](https://av.libreboot.org/x60_unbrick/0002.jpg)

Grab the right-hand side of the chassis and force it off (gently) and
pry up the rest of the chassis:\
![](https://av.libreboot.org/x60_unbrick/0003.jpg)

You should now have this:\
![](https://av.libreboot.org/x60_unbrick/0004.jpg)

Disconnect the wifi antenna cables, the modem cable and the speaker:\
![](https://av.libreboot.org/x60_unbrick/0005.jpg)

Unroute the cables along their path, carefully lifting the tape that
holds them in place. Then, disconnect the modem cable (other end) and
power connection and unroute all the cables so that they dangle by the
monitor hinge on the right-hand side:\
![](https://av.libreboot.org/x60_unbrick/0006.jpg)

Disconnect the monitor from the motherboard, and unroute the grey
antenna cable, carefully lifting the tape that holds it into place:\
![](https://av.libreboot.org/x60_unbrick/0008.jpg)

Carefully lift the remaining tape and unroute the left antenna cable so
that it is loose:\
![](https://av.libreboot.org/x60_unbrick/0009.jpg)

Remove the screw that is highlighted (do NOT remove the other one; it
holds part of the heatsink (other side) into place):\
![](https://av.libreboot.org/x60_unbrick/0011.jpg)

Remove those screws:\
![](https://av.libreboot.org/x60_unbrick/0012.jpg)

Carefully remove the plate, like so:\
![](https://av.libreboot.org/x60_unbrick/0013.jpg)

Remove the SATA connector:\
![](https://av.libreboot.org/x60_unbrick/0014.jpg)

Now remove the motherboard (gently) and cast the lcd/chassis aside:\
![](https://av.libreboot.org/x60_unbrick/0015.jpg)

Lift back that tape and hold it with something. Highlighted is the SPI
flash chip:\
![](https://av.libreboot.org/x60_unbrick/0016.jpg)

Here is another photo, with the numbers of the pins written:\
![](https://av.libreboot.org/x60_unbrick/0017.jpg)\

This photo shows an SPI flasher used, with SOIC8 test clip:\
![](https://av.libreboot.org/x60/th_bbb_flashing.jpg)

Refer to the following guide:\
[Externally rewrite 25xx NOR flash via SPI protocol](spi)

NOTE: Do not use the 3.3v rail from your raspberry pi. Leave that disconnected.
For 3.3v, plug your charger into the motherboard (but do not power on the mainboard)
when the clip is connected. Before removing the clip, disconnect the charger.
This will provide adequate 3.3v DC at correct current levels. The SPI flash on an
X60 shares a common 3.3V rail with many other components on the motherboard,
which all draw a lot of current, more than your programmer can provide.

When you're finished flashing, remove the programmer and put it away somewhere.
Put back the tape and press firmly over it:\
![](https://av.libreboot.org/x60_unbrick/0026.jpg)

Your empty chassis:\
![](https://av.libreboot.org/x60_unbrick/0027.jpg)

Put the motherboard back in:\
![](https://av.libreboot.org/x60_unbrick/0028.jpg)

Reconnect SATA:\
![](https://av.libreboot.org/x60_unbrick/0029.jpg)

Put the plate back and re-insert those screws:\
![](https://av.libreboot.org/x60_unbrick/0030.jpg)

Re-route that antenna cable around the fan and apply the tape:\
![](https://av.libreboot.org/x60_unbrick/0031.jpg)

Route the cable here and then (not shown, due to error on my part)
reconnect the monitor cable to the motherboard and re-insert the
screws:\
![](https://av.libreboot.org/x60_unbrick/0032.jpg)

Re-insert that screw:\
![](https://av.libreboot.org/x60_unbrick/0033.jpg)

Route the black antenna cable like so:\
![](https://av.libreboot.org/x60_unbrick/0034.jpg)

Tuck it in neatly like so:\
![](https://av.libreboot.org/x60_unbrick/0035.jpg)

Route the modem cable like so:\
![](https://av.libreboot.org/x60_unbrick/0036.jpg)

Connect modem cable to board and tuck it in neatly like so:\
![](https://av.libreboot.org/x60_unbrick/0037.jpg)

Route the power connection and connect it to the board like so:\
![](https://av.libreboot.org/x60_unbrick/0038.jpg)

Route the antenna and modem cables neatly like so:\
![](https://av.libreboot.org/x60_unbrick/0039.jpg)

Connect the wifi antenna cables. At the start of the tutorial, this
system had an Intel wifi chip. Here you see I've replaced it with an
Atheros AR5B95 (supports 802.11n and can be used without blobs):\
![](https://av.libreboot.org/x60_unbrick/0040.jpg)

Connect the modem cable:\
![](https://av.libreboot.org/x60_unbrick/0041.jpg)

Connect the speaker:\
![](https://av.libreboot.org/x60_unbrick/0042.jpg)

You should now have this:\
![](https://av.libreboot.org/x60_unbrick/0043.jpg)

Re-connect the upper chassis:\
![](https://av.libreboot.org/x60_unbrick/0044.jpg)

Re-connect the keyboard:\
![](https://av.libreboot.org/x60_unbrick/0045.jpg)

Re-insert the screws that you removed earlier:\
![](https://av.libreboot.org/x60_unbrick/0046.jpg)

Power on!\
![](https://av.libreboot.org/x60_unbrick/0047.jpg)

Operating system:\
![](https://av.libreboot.org/x60_unbrick/0049.jpg)
