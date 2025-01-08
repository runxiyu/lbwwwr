---
title: ThinkPad T420 external flashing
x-toc-enable: true
---

**[PLEASE READ THESE INSTRUCTIONS BEFORE INSTALLING](ivy_has_common.md), OR
YOU MAY BRICK YOUR MACHINE!! - Please click the link and follow the instructions
there, before flashing. For posterity,
[here is the link again](ivy_has_common.md).**

Read the [Ivybridge/Haswell common guide](/docs/install/ivy_has_common.html) if you want more information. Please note, for Thinkpad T420, splitting the rom is not required.
The following instructions expect you to have these on hand:

+ a clone of lbmk, can be obtained from `https://codeberg.org/libreboot/lbmk`
+ necessary tools (flat-nose pliers or sleeve tool, screwdriver, small crowbar)
+ some CPU grease
+ a pack of backup screws
+ a programmer

Preparing a release Rom
-----------------------

**Please follow this prior to flashing, or you may brick your machine.**

Please [inject vendor files](ivy_has_common.md) prior to flashing. You can also
use this guide to change the built-in MAC address for your Intel Gigabit
Ethernet device; doing so is advisable, because otherwise you will have a
default, generic MAC address.

Disassembly
-----------

Be patient when trying to disassembly Thinkpad T420, the disassembling is relatively complicated. You need to take the main board off the magnesium structure frame, for a complete disassembly.

Since there are a lot of screws on it, you need to at least get few spare screws in case that you messed it up. And also, using each screw only once is recommended.

The disassembly guide here aimed to be simple and clear. But if you are confused, the [ThinkPad T420 Hardware Maintenance Manual](https://web.archive.org/web/20230106040715/https://download.lenovo.com/ibmdl/pub/pc/pccbbs/mobiles_pdf/t420_t420i_hmm.pdf) is always your friend.

Start by detaching some plates, main battery, and the ultrabay. Loosen the screws (in blue border) but don't remove it, and just pull out the plates. For the battery and the ultrabay, just unlock it and detach it. If you have any expresscard, SD card attached, also remove it.\
![](https://av.libreboot.org/t420/t420_back.jpg)

Next, remove all the screws on the black cover.\
![](https://av.libreboot.org/t420/t420_back_detached.jpg)

And now, you will able to remove the keyboard. Slightly use the crowbar to push the keyboard towards the screen to remove it. Also, pay attention to the cable under it, pull it off gently.\
![](https://av.libreboot.org/t420/t420_keyboard_removal.jpg)
![](https://av.libreboot.org/t420/t420_keyboard_cabel.jpg)

Now you can pull up around the sides of the front cover (the one with keyboard removed) to release it. Pull it upwards and lift it, pull it back to remove it. There is also a touchscreen cabel under it, pull it off as well.\
![](https://av.libreboot.org/t420/t420_side_lift.jpg)

Remove the red screws first to remove the speaker and pull off the cabel. Then, remove the pink screws and remove the modem, the telephone jack and the wireless WAN card. Pull out the anthenna cabel around them (You may need to remove your wireless WAN card in the back and push the cabel to the front). And, you need to remove the green screws and the connector in the blue box (of the picture). And then, lift up the screen to remove it.\
![](https://av.libreboot.org/t420/t420_under.jpg)

Remove the blue connections and the USB port. Then, remove the red screws and connection. Gently pull up the fan to remove it. Next, remove the pink screws (the position in picture may not be accurate, watch out for all the screws there).\
![](https://av.libreboot.org/t420/t420_screen_removed.jpg)

Now you can pull the bottom cover off. Turn it back, remove all the visible screws. Use your flat-nose pliers or sleeve tool to unscrew the VGA port. And you can pull your main board off the magnesium structure frame.

You will see the eeprom on the front:\
![](https://av.libreboot.org/t420/t420_board_front.jpg)
![](https://av.libreboot.org/t420/t420_board_front_eeprom.jpg)

The flash will likely be Winbond W25Q64CV. You may double check it by looking at the silkscreen.

Now, you can proceed to [flashing](/docs/install/spi.html) this machine.
