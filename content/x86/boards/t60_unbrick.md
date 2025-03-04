---
title: ThinkPad T60 Recovery guide
x-toc-enable: true
---

Only the Intel GPU is compatible. Do not flash the ATI GPU models.

"Unbricking" means flashing a known-good (working) ROM. The problem:
you can't boot the system, making this difficult. In this situation,
external hardware is needed which can flash the SPI chip (where libreboot
resides). First, disassemble the machine using the following steps, and refer
to the external flashing guide linked later from *this* guide.

Remove those screws and remove the HDD:\
![](https://av.libreboot.org/t60_dev/0001.JPG) ![](https://av.libreboot.org/t60_dev/0002.JPG)

Lift off the palm rest:\
![](https://av.libreboot.org/t60_dev/0003.JPG)

Lift up the keyboard, pull it back a bit, flip it over like that and
then disconnect it from the board:\
![](https://av.libreboot.org/t60_dev/0004.JPG) ![](https://av.libreboot.org/t60_dev/0005.JPG)
![](https://av.libreboot.org/t60_dev/0006.JPG)

Gently wedge both sides loose:\
![](https://av.libreboot.org/t60_dev/0007.JPG) ![](https://av.libreboot.org/t60_dev/0008.JPG)

Remove that cable from the position:\
![](https://av.libreboot.org/t60_dev/0009.JPG) ![](https://av.libreboot.org/t60_dev/0010.JPG)

Now remove that bezel. Remove wifi, nvram battery and speaker connector
(also remove 56k modem, on the left of wifi):\
![](https://av.libreboot.org/t60_dev/0011.JPG)

Remove those screws:\
![](https://av.libreboot.org/t60_dev/0012.JPG)

Disconnect the power jack:\
![](https://av.libreboot.org/t60_dev/0013.JPG)

Remove nvram battery:\
![](https://av.libreboot.org/t60_dev/0014.JPG)

Disconnect cable (for 56k modem) and disconnect the other cable:\
![](https://av.libreboot.org/t60_dev/0015.JPG) ![](https://av.libreboot.org/t60_dev/0016.JPG)

Disconnect speaker cable:\
![](https://av.libreboot.org/t60_dev/0017.JPG)

Disconnect the other end of the 56k modem cable:\
![](https://av.libreboot.org/t60_dev/0018.JPG)

Make sure you removed it:\
![](https://av.libreboot.org/t60_dev/0019.JPG)

Unscrew those:\
![](https://av.libreboot.org/t60_dev/0020.JPG)

Make sure you removed those:\
![](https://av.libreboot.org/t60_dev/0021.JPG)

Disconnect LCD cable from board:\
![](https://av.libreboot.org/t60_dev/0022.JPG)

Remove those screws then remove the LCD assembly:\
![](https://av.libreboot.org/t60_dev/0023.JPG) ![](https://av.libreboot.org/t60_dev/0024.JPG)
![](https://av.libreboot.org/t60_dev/0025.JPG)

Once again, make sure you removed those:\
![](https://av.libreboot.org/t60_dev/0026.JPG)

Remove the shielding containing the motherboard, then flip it over.
Remove these screws, placing them on a steady surface in the same layout
as they were in before you removed them. Also, you should mark each
screw hole after removing the screw (a permanent marker pen will do),
this is so that you have a point of reference when re-assembling the
system:

![](https://av.libreboot.org/t60_dev/0027.JPG) ![](https://av.libreboot.org/t60_dev/0028.JPG)
![](https://av.libreboot.org/t60_dev/0029.JPG) ![](https://av.libreboot.org/t60_dev/0031.JPG)
![](https://av.libreboot.org/t60_dev/0032.JPG) ![](https://av.libreboot.org/t60_dev/0033.JPG)

This photo shows the flash chip, near the RAM, with numbers of pins written:

![](https://av.libreboot.org/t60_dev/0030.JPG)

Refer to the external flashing guide:

[Externally rewrite 25xx NOR flash via SPI protocol](spi)

NOTE: Do not use the 3.3v rail from your SPI programmer. Leave that disconnected.
For 3.3v, plug your charger into the motherboard (but do not power on the mainboard)
when the clip is connected. Before removing the clip, disconnect the charger.
This will provide adequate 3.3v DC at correct current levels. The SPI flash on an
X60 shares a common 3.3V rail with many other components on the motherboard,
which all draw a lot of current, more than your flasher can provide.

Example command:

	sudo ./flashprog -p linux_spi:dev=/dev/spidev0.0,spispeed=4096 -w libreboot.rom -V

If flashprog complains about multiple flash chips detected, just pass the `-c`
option as it suggests, and pick any of the chips it lists. `spispeed=4096` or
lower (e.g. `spispeed=512`) is recommended on this board. The flashing becomes
unstable, on this machine, when you use higher speeds.

Reverse the steps to re-assemble your system, after you've flashed the chip.

It should be `Verifying flash... VERIFIED` at the end. If flashprog
complains about multiple flash chip definitions detected, then choose
one of them following the instructions in the output.

Put those screws back:\
![](https://av.libreboot.org/t60_dev/0047.JPG)

Put it back into lower chassis:\
![](https://av.libreboot.org/t60_dev/0048.JPG)

Attach LCD and insert screws (also, attach the lcd cable to the board):\
![](https://av.libreboot.org/t60_dev/0049.JPG)

Insert those screws:\
![](https://av.libreboot.org/t60_dev/0050.JPG)

On the CPU (and there is another chip south-east to it, sorry forgot to
take pic) clean off the old thermal paste (with the alcohol) and apply
new (Artic Silver 5 is good, others are good too) you should also clean
the heatsink the same way\
![](https://av.libreboot.org/t60_dev/0051.JPG)

Attach the heatsink and install the screws (also, make sure to install
the AC jack as highlighted):\
![](https://av.libreboot.org/t60_dev/0052.JPG)

Reinstall that upper bezel:\
![](https://av.libreboot.org/t60_dev/0053.JPG)

Do that:\
![](https://av.libreboot.org/t60_dev/0054.JPG) ![](https://av.libreboot.org/t60_dev/0055.JPG)

Re-attach modem, wifi, (wwan?), and all necessary cables. Sorry, forgot
to take pics. Look at previous removal steps to see where they go back
to.

Attach keyboard and install nvram battery:\
![](https://av.libreboot.org/t60_dev/0056.JPG) ![](https://av.libreboot.org/t60_dev/0057.JPG)

Place keyboard and (sorry, forgot to take pics) reinstall the palmrest
and insert screws on the underside:\
![](https://av.libreboot.org/t60_dev/0058.JPG)

It lives!\
![](https://av.libreboot.org/t60_dev/0071.JPG) ![](https://av.libreboot.org/t60_dev/0072.JPG)
![](https://av.libreboot.org/t60_dev/0073.JPG)

Always stress test ('stress -c 2' and xsensors. below 90C is ok) when
replacing cpu paste/heatsink:\
![](https://av.libreboot.org/t60_dev/0074.JPG)
