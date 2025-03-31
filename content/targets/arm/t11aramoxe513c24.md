---
title: Trisquel 11 Aramo on Samsung Chromebook Plus XE513C24
toc: true
---

System Configuration
--------------------

Hardware: Samsung Chromebook Plus XE513C24 (gru\_kevin)

Libreboot: 2024-12-06

Operating System: Trisquel 11.0.1 Aramo

Background
-------------------------

The current arm64 installer for Trisquel 11 has a so far unresolved problem where the the installer doesn’t start after choosing any of the installation methods offered by the arm64 ISO’s menu [trisquel-netinst_11.0.1_arm64.iso](https://cdimage.trisquel.info/trisquel-images/trisquel-netinst_11.0.1_arm64.iso). The screen simply stays blank without anything ever showing up or happening. The issue has been discussed in the forum of Trisquel [comment-178704](https://trisquel.info/en/trisquel-samsung-chromebook-v1-kevin-support-group#comment-178704).

Until the problem is resolved, “debootstrap” can be used as a workaround.

What is debootstrap?
-------------------------

Most Debian based distributions offer an installer that can be executed from an external media, but what happen if we have an already installed system? would it be possible to install a second system from it into another drive for example? With debootstrap you can.

Debootstrap installation workaround
-------------------------

Since there was a precedence that Debian 12 could be easily installed using it’s installation ISO [uboot-debian-bookworm](https://libreboot.org/docs/uboot/uboot-debian-bookworm.html), I figure it could be possible to install Trisquel 11 after it and thankfully it worked.

The way I did it, is that I installed Debian 12 into a SD card using its installer from a USB A memory. For this purpose I used and adapter/hub since this computer only has USB C inputs. Then after booting Debian from the SD card, I used debootstrap to install Trisquel 11 into the internal MMC.

Detailed instructions and other useful info
-------------------------

A step by step guide can be found in the following Trisquel’s documentation page [arm64-chromebooks-trisquel-installation](https://trisquel.info/en/wiki/arm64-chromebooks-trisquel-installation).

The following page also details many user experiences, some fixes and some tips to improve the usability of Trisquel with this device [samsung-chromebook-v1-kevin-support-group](https://trisquel.info/en/wiki/samsung-chromebook-v1-kevin-support-group). Many of its points might also apply to Debian users as well.

A review of the device from a Trisquel’s user point of view can be found here: [samsung-chromebook-v1-kevin-review](https://trisquel.info/en/samsung-chromebook-v1-kevin-review)

System Functionality
-------------------------

Things that work:

* Touch screen and stylus
* Touchpad
* Speakers
* Volume buttons on side of laptop.
* Graphics
* Playing videos

Things that do not work:

* Wireless internet and Bluetooth (non free software drivers are required)
* The headphone jack does't work
* Some times the computer stops responding with the screen shutoff while trying to hibernate or recovering from it. For this reason I disabled hibernation on my system.
