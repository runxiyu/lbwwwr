---
title: Intel GbE MAC Address 
---

This only applies to IFD-based systems.

On all Intel platforms except X4X (e.g. Gigabyte GA-G41M-ES2L) and i945
ones (e.g. ThinkPad X60, ThinkPad T60, MacBook2,1), an Intel Flash Descriptor is
used. If the board has Intel gigabit ethernet, the MAC address is included in
flash, and can (must) be changed prior to installation.

You can use [nvmutil](nvmutil) to change the MAC address. You will perform
this modification to the ROM image, before flashing it.

