---
title: Acer G43T-AM3
---

This is similar to Gigabyte GA-G41M-ES2L but uses an Intel NIC rather than
Realtek. Some problems with Linux on this NIC, on this board, with Libreboot,
were observed; see [notabug issue
125](https://notabug.org/libreboot/lbmk/issues/125)

[A SuperUser page](https://superuser.com/questions/1104537/how-to-repair-the-checksum-of-the-non-volatile-memory-nvm-of-intel-ethernet-co/1106641#1106641)
has some guidance on how to either correct the checksum (in GbE config) or skip
checksum validation in Linux, to get the onboard NIC working. Although it's
talking about different hardware, the steps should be the same.

<!--
TODO: factory BIOS on this board works fine with the onboard NIC. study what
that is doing
-->
