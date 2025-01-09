---
title: EC Firmware Updates
---

EC firmware is usually not on the main boot flash and usually could only be
changed with the vendor's tool (running from the vendor boot firmware and
usually only on Windows).

It is recommended that you update to the latest EC firmware version. Updating
the EC can sometimes provide benefit depending on the vendor. For example, they
might fix power issues that could then enhance battery life.

## ThinkPads

See the [BIOS update without optical disk ThinkWiki
page](http://www.thinkwiki.org/wiki/BIOS_update_without_optical_disk).

Otherwise, check the Lenovo website to find the update utility for your
mainboard.

## HP EliteBooks

EC firmware is required in the main boot flash, but Libreboot's build system
automatically downloads this from HP for each machine, and inserts it, so
you don't have to worry. Just make sure that [vendor files are
inserted](insert_vendor_files/) if using release images.

