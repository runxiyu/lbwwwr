---
title: Generic SPI Flashing Guide
x-toc-enable: true
---

There are a plethora of single board computers with which you can flash libreboot to a SOIC chip.
Some users might be daunted by the price of a raspberry pi.
This guide is intended to help users looking to use a programmer which is not listed in the [main guide.](spi)
As an example, this guide will use the [libre computer 'le potato.'](https://libre.computer/products/aml-s905x-cc/)
You should note however, that this guide is intended to demonstrate how to set up any SBC with SPI programming capabilities for flashing libreboot.

If you are wondering about which SBC to buy, keep these things in mind:

+ The board *must* support SPI (look at the specs/pinout to find out if it does)
+ It is easier to use a board that supports raspbian/raspberry pi OS
+ Boards often require their own kernel patches which rarely get upstreamed

All of this means that you should try to find a board that is *known* to support SPI on an OS for which there are available images.
It is *not* enough to know that the board itself supports SPI.

Selecting an Operating System
=============================

In theory, any linux based operating system will do.
In practice, many distros are highly limited when it comes to single-board-computers.
SBCs often require specialized kernel patches which are rarely upstreamed.
Additionally, armhf boards (like the le potato) are not supported in most modern distros.

In light of the above facts, it is a good general rule to use a distro aimed at supporting SBCs.
[Armbian](https://www.armbian.com/) is one such distro you might use.
Note that not all armbian images support SPI.
If your SBC supports [Raspbian](https://www.raspberrypi.com/software/) then using it will make your work much easier.
As a bonus, you may refer to the [main guide](spi) if the SBC you have supports raspbian, should you get confused with this guide.

Connecting to your Programmer
=============================

Many SBC operating systems enable ssh by default.
If the OS you chose does not enable ssh on first boot, try checking the distro documentation and looking for terms such as 'headless install.'

You will need the IP address of your programmer to continue.
Connecting via ethernet is generally easier than doing so with WiFi.
Check your distro's docs if you wish to connect with WiFi only.
To determine the IP address of your programmer, log in to your AP/Router web interface.
If you're not sure the IP address of your AP, it is likely `192.168.1.1.`
You can determine the correct IP address with `ip r` on a linux machine.
You should see your programmer somewhere on the homepage, depending on your router firmware.
This author recommends using [https://openwrt.org/](https://openwrt.org/) for your router firmware.

SSH to your programmer using the default credentials as specified in your distro's docs.
The IP address is the one determined in the earlier step.
For example:

`ssh root@192.168.0.167`

Finding GPIO Pins
=================

If you have determined that a board supports SPI then the only step left is to
determine the correct location of the SPI pins.
The board will have the pinout in its documentation.
The Le potato board has the same pinout as the raspberry pi so you can refer to the [main SPIC documentation.](spi.md#gpio-pins-on-raspberry-pi-rpi-40-pin)

If your board is not raspberry pi compatible, refer to the [wiring table.](spi.html#soic8dip8wson8-wiring-diagram)
Match each of the categories in the 'signal' column with those in the 'pin' column.
Using this method, you can theoretically use any single board computer with SPI support.

Enabling SPI
============

The modules needed and methods to enable SPI vary based on the SBC you choose.
You should always make sure there is a well documented method for enabling SPI on your SBC before purchasing.
In the case of the *le potato,* SPI is enabled by activating the correct overlays as such (raspbian):

```
sudo ldto enable spicc spicc-spidev
sudo ldto merge spicc spicc-spidev
```

Using Flashrom
==============

Most linux distros will provide flashprog in their default repositories.
You can also download flashprog in binary form with [libreboot utils.](https://libreboot.org/download.html#https)
Here is an example using raspbian:

```
sudo apt update
sudo apt install flashprog
```

Reading/writing from SPI works respectively as such:

```
sudo ./flashprog -p linux_spi:dev=/dev/spidev0.0,spispeed=32768 -r /path/to/read.bin
sudo ./flashprog -p linux_spi:dev=/dev/spidev0.0,spispeed=32768 -w /path/to/libreboot.rom
```

Note that `spispeed` varies based on the board in question.
A standard lower limit is *512.*
For example, to read on a board with a lower SPI speed, you may try:

	sudo ./flashprog -p linux_spi:dev=/dev/spidev0.0,spispeed=512 -r /path/to/read.bin
