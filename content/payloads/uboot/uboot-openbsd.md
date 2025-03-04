---
title: OpenBSD Install Attempt on a Samsung Chromebook Plus
---

System Configuration
====================

Hardware: Samsung Chromebook Plus XE513C24 (gru_kevin)

Libreboot: 2023-04-23

Operating System: OpenBSD 7.3

Install Media Preparation
=========================

Follow the OpenBSD arm64 installation instructions in the link below:

https://ftp.openbsd.org/pub/OpenBSD/snapshots/arm64/INSTALL.arm64

Write the install73.img file to a micro sdcard.  Replace "sdcard_device" below
with the appropriate device path on your system.
```
# dd if=install73.img of=/dev/sdcard_device bs=1M status=progress; sync
```

Installation Attempt
====================

1. Insert the micro sdcard into the slot on the Chromebook.
2. Power on the Chromebook.

Initially things looked promising as the system automatically found the OpenBSD
EFI image on the micro sdcard and proceeded to the OpenBSD boot prompt. However
there was a strange display issue where the first character on each row of the
display was missing.

After a brief pause, the OpenBSD boot process continued.  A message displayed
indicating an error opening random.seed but continued to load the OpenBSD
kernel.  Unfortunately the system then froze indefinitely.  See screen shot
below.

![](https://av.libreboot.org/xe513c24/openbsd-attempt.jpg)
