---
title: External Flashing via SPI
toc: true
---

**Note: SCK and CLK mean the same thing.**

## Internal vs external flashing

Note that this guide is about external flashing (i.e. usually opening up your motherboard
and connecting an external device to your ROM to flash it). Most boards, after
Libreboot has been installed (with write protection disabled), may be
[internally flashed](../generic_internal/).

## Introduction

This guide will teach you how to use various tools for externally reprogramming
a 25xx NOR flash via the SPI protocol. This is the most common type of flash IC
for computers that coreboot runs on: every system currently supported by
Libreboot uses this type of boot flash except [ASUS KFSN4-DRE](../kfsn4-dre/).

We will be using [flashprog](https://flashprog.org) which
can dump, erase, and rewrite these flash chips.

Libreboot currently documents how to use these SPI programmers:

* Raspberry Pi Pico / Pico 2
* Raspberry Pi
* BeagleBone Black
* Libre Computer "Le Potato" (written to be generic)

This document consists of roughly four steps:
1. Setting up a flash programmer, which should leave you with a `FLASHCMD`
   alias, to save for stage 4. Learn the relevant pins on your flash
   programmer.
2. Identifying your flash chip, know what each of the pins mean.
3. Connecting your flash programmer's corresponding pins to your flash chip.
4. Selecting the correct ROM file, and running flashprog.

## Step 1: Flash programmers

### Raspberry Pi Pico

The Raspberry Pi Pico is a small microcontroller board that can be used to
flash via the SPI protocol. Versions with "H" in their name have "headers"
(i.e. easy to use pins) pre-soldered and are easier to use.

Currently, Libreboot supports both the Pico (RP2040 chip) and Pico 2 (RP2530).
Other RP2530 models should also work.

We recommend these since they only cost about $5, and all of the software
(including its own [Boot ROM](https://github.com/raspberrypi/pico-bootrom))
are libre, other than the wireless firmware on versions with "W" in their name
(which are not needed for Libreboot).

![Left to right: Raspberry Pi Pico and Pico H](https://av.libreboot.org/rpi_pico/two_picos.webp)

#### Download (and perhaps build) serprog firmware

Serprog is Pico firmware that basically translates USB serial to SPI. It 
lets you use flashprog to write to the Pico's USB serial port, which gets
translated to the SPI protocol and flashes your chip.

Download the Pico serprog tarball from Libreboot releases, named
`libreboot-$version_pico_serprog.tar.xz` under the `roms` directory.

The source is in a [Git repo](https://codeberg.org/libreboot/pico-serprog). But
if you want to build from source, you should build lbmk and use `./mk -b
pico-serprog`. Images for each type of Pico board will appear in
`bin/serprog_pico`.

#### Install the serprog firmware

First, connect just the Pico to your computer with a micro-USB cable. Mount it
like any other USB flash drive. If it isn't detected, you might need to press
the BOOTSEL button while you plug it in (this forces it into the bootloader
mode).

When you have the build, or if you're using a release build, copy the
corresponding `.uf2` file into your Pico.

#### Wiring

![Raspberry Pi Pico pinout](/pico2_pinout.svg)

#### Commands

When you plug in the Pico, a line like this will appear in your `dmesg`:

	[123.456] cdc_acm 2-1.2:1.0: ttyACMx: USB ACM device

Substitute the `ttyACMx` below. Flashprog is now usable.

	alias FLASHCMD='flashprog -p serprog:dev=/dev/ttyACMx,spispeed=16M'

You may try higher speeds such as `spispeed=32M` on the Pico 2, but since ROM
files are small, it doesn't really matter anyway.

### BeagleBone Black

**This section is out of date: It was written for Debian Stretch.**

#### Caution about BBB

BeagleBone Black is not recommended, because it's very slow and unstable for
SPI flashing, and nowadays much better options exist. You should use a
`spispeed` of below 512; make sure that you can read flash contents reliably
several times before attempting to write.

#### Setting up SPI

All commands below will be run on your BeagleBone Black.

```
config-pin P9.17 spi_cs
config-pin P9.18 spi
config-pin P9.21 spi
config-pin P9.22 spi_sclk
```

Verify that the spidev devices now exist:

```
ls /dev/spidev*
# output: /dev/spidev1.0  /dev/spidev1.1  /dev/spidev2.0  /dev/spidev2.1
```

#### Flash command

```
alias FLASHCMD='./flashprog -p linux_spi:dev=/dev/spidev1.0,spispeed=128'
```

It is important to use a low `spispeed` because otherwise the BBB will be quite
unstable.

Example correct output when executing `FLASHCMD` alone, when no flash chip is
connected:

```
Calibrating delay loop... OK.
No EEPROM/flash device found.
Note: flashprog can never write if the flash chip isn't found automatically.
```

### Raspberry Pi

All commands will be run from you Raspberry Pi.

#### Setting up [SPI](https://www.raspberrypi.org/documentation/hardware/raspberrypi/spi/README.md)

You must configure `spidev` on your Raspberry Pi. This is a special driver in
the Linux kernel; technically, the driver name is `spi-bcm2835`.

In your Raspberry Pi, which we assume you're running the latest Raspbian version
on, enable SPI in the Interface section of `raspi-config`.

#### Flash command

```
alias FLASHCMD='./flashprog -p linux_spi:dev=/dev/spidev0.0,spispeed=32768'
```

#### RPi Drive Strength

Flashprog on the RPi may not be able to detect the SPI flash chip on some
systems, even if your wiring and clip are set up perfectly. This may be due to
the drive strength of the Raspberry Pi GPIOs, which is 8mA by default. Drive
strength is essentially the maximum current the pin can output while also
maintaining the minimum high-level voltage (3.0V for the RPi).

Similarly, the SPI flash chip has a minimum voltage it will accept as a high
logic value. This is commonly 0.7\*VCC for SPI flash, which is 2.31V for 3.3V
chips.  If the drive strength is too low, the voltage at the pins of the flash
chip may fall below this minimum voltage, causing it to register as a low logic
value instead of the high value that was sent.

On many systems, the VCC pin of the SPI flash is shared with other chips on the
system, causing them to be powered through the voltage supplied through your
programming clip. In this case, parts of the chipset may power up, and it may
attempt to set the SPI lines high or low, interfering with the data the Pi is
trying to send. If the Pi and chipset are trying to set a pin to different
values, the side with a greater drive strength will be able to "pull" the
voltage toward the level it wants to set.

Fortunately, the drive strength of the Raspberry Pi can be increased up to
16mA.  There are a few tools that can set this, such as the pigs utility from
the pigpio project. On the Raspberry Pi OS, the following commands should
install pigpio and set the drive strength to 16mA:

Install pigpio:

	sudo apt install pigpio

Start the pigpiod daemon, which the pigs utility communicates with to interact
with the gpios:

	sudo pigpiod

Set the drive strength of GPIO group 0, which contains the spi0 pins, to 16mA:

	pigs pads 0 16 

Note that the drive strength hardware works in multiples of 2mA, and pigs will
round odd values up to the next multiple of 2. You can check the current drive
strength using

	pigs padg 0

**Warning:** If the chipset is very strongly trying to drive a pin to a value
opposite that of the Pi, more than 16mA pass through the Pi's GPIO pins, which
may damage them as they are only designed for 16mA. The drive strength is NOT a
current limit. That said, this is a risk to the Pi regardless of the drive
strength. Resistors between the chipset and the flash should protect against
this, though not all boards have these.

See the [GPIO Pads Control
documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#gpio-pads-control)
for more information about the drive strength control on the Pi.

### Le potato (and others)

The [generic guide](spi_generic.md) is intended to help those looking to use an
SBC which is not listed in this guide.
The guide will, however, use the libre computer 'Le Potato' as a reference board.
If you have that board, you should refer to the [generic guide.](spi_generic.md)



## Step 2: Identifying your flash chip and its pins

**TODO:** Use proper shortcodes for these images and don't stuff the table
under them.

In all of them, a dot or marking shows pin 1.

### SOIC8

![SOIC8](https://av.libreboot.org/chip/soic8.jpg)

| Pin | Function |
|-----|----------|
|   1 | CS       |
|   2 | MISO     |
|   3 | WP       |
|   4 | GND      |
|   5 | MOSI     |
|   6 | CLK      |
|   7 | HOLD     |
|   8 | VCC      |

### SOIC16

![SOIC16](https://av.libreboot.org/chip/soic16.jpg)

| Pin | Function |
|-----|----------|
|   1 | HOLD     |
|   2 | VCC      |
|   7 | CS       |
|   8 | MISO     |
|   9 | WP       |
|  10 | GND      |
|  15 | MOSI     |
|  16 | CLK      |

### WSON8

This is the most likely chip on ThinkPad X200S or X200 Tablet.

![WSON8](https://av.libreboot.org/x200t_flash/X200T-flashchip-location.jpg)

| Pin | Function |
|-----|----------|
|   1 | CS       |
|   2 | MISO     |
|   3 | WP       |
|   4 | GND      |
|   5 | MOSI     |
|   6 | CLK      |
|   7 | HOLD     |
|   8 | VCC      |


On T400S, it is in this location near the RAM.

### DIP8

![DIP8](https://av.libreboot.org/dip8/dip8.jpg)

Pinout is the same as SOIC8 above.

## Step 3: Connecting wires

**This section is still work in progress.**

### Precautions

* Do not connect the power source until your chip is otherwise properly wired.
  For instance, do not connect a test clip that has power attached.

* Do not disconnect your chip from the flasher until you've disconnected or
  turned off the power source.

* [Do not use CH341A.](../ch341a/) They will break your boards because CH341As
  have a 5V voltage level.**

* Be careful that you are indeed supplying the appropriate supply voltage to
  the chip. SPI flashes on most of the currently supported libreboot hardware
  run on 3.3V DC and logic at that level too. Some of them (at least
  Chromebooks) can have chips that run on 1.8V DC. You should make sure to
  check the part number and datasheet of the SPI flash chip for the supply
  voltage it requires. If your external flashing hardware doesn't match it, use
  an adapter or logic level converter to flash.

* Do not connect more than 1 DC power source to your flash chip.

### Extra protection on data lines

You may want to add 47ohm series resistors on MISO/MOSI/CS/CLK lines (but not
VCC/GND) to provide some protection from over-current.

On Intel platforms, the SPI flash is usually connected via such resistors,
directly to the Southbridge chipset.

### ISP programming and VCC diode

ISP means in-system programming. It's when you flash a chip that is already
mounted to the motherboard of your computer that you wish to install libreboot
on.

It may be beneficial to modify the motherboard so that the SPI flash is powered
(on the VCC pin) through a diode, but please note: a diode will cause a voltage
drop. The tolerated range for a chip expecting 3.3V VCC is usually around 2.7V
to 3.6V DC, and the drop may cause the voltage to fall outside that. If you do
this, please also ensure that the WP and HOLD pins are still held to a high
logic state; each via their own resistor (1K to 10K ohms) connected to the
*same* power source going through the diode.

The reason is simple: on most systems, the flash shares a common power rail
with many other components on the board, which draw a lot of current. Further,
if you accidentally provide too much voltage or cause an overcurrent, you could
fry those other components but if there is diode protection, you'll only fry
the boot flash (and it is very easy to replace, if you have good soldering
skills).

When you've placed the diode, ensure that VCC on the chip is isolated from all
other components on that board, which share the same power rail. Further,
ensure that the pull-up resistors for WP/HOLD are *only* connected to the side
of the diode that has continuity with the VCC pin (this is important because if
they're not, they won't be held high while doing ISP flashing, even if they're
still held high when the motherboard is fully powered on).

Furthermore: ensure that the SPI flash is operating at the appropriate supply
voltage (2.7V to 3.6V for a 3.3V chip) when fully powered on, after installing
the diode.

If it's a desktop/workstation/server board (not a laptop), you could de-solder
the SOIC8/WSON8 if it uses that, and replace with an IC socket (for SOIC8,
WSON8 or DIP8, whatever you want), because then you could easily just insert
the flash into a breadboard when flashing.

TODO: Make a page on libreboot.org, showing how to do this on all motherboards
supported by libreboot.

### GPIO pins on BeagleBone Black (BBB)

Use [this image](https://beagleboard.org/Support/bone101#headers) for reference
when connecting the pomona to the BBB. (D0 = MISO or connects to MISO)

On that page, look at the *P9 header*. It is what you will use to wire up your
chip for flashing.

### GPIO pins on Raspberry Pi (RPi) 40 Pin

This diagram shows the pinout for most modern Pi's and Pi derivatives.
The diagram shows the pins of an RPi on the left and the two SOIC clips
on the left.

![](https://av.libreboot.org/rpi/wiring.webp)

### GPIO pins on Raspberry Pi (RPi) 26 Pin

Diagram of the 26 GPIO Pins of the Raspberry Pi Model B (for the Model
B+ with 40 pins, start counting from the right and leave 14 pins):

![](https://av.libreboot.org/rpi/0012.webp) ![](https://av.libreboot.org/rpi/0013.png)

Use this as a reference for the other sections in this page, seen below:

### SOIC8/DIP8/WSON8 wiring diagram

Refer to this diagram:

| Pin \# | 25xx signal | RPi(GPIO) | BBB(P9 header) |
| -      | -           | -         | -              |
| 1      | CS          | 24        | 17             |
| 2      | MISO        | 21        | 21             |
| 3      |             |           |                |
| 4      | GND         | 25        | 1              |
| 5      | MOSI        | 19        | 18             |
| 6      | CLK         | 23        | 22             |
| 7      |             |           |                |
| 8      | VCC         | 1         | 3              |

On your SOIC8, there will be a dot in one of the corners. The dot is pin 1.

NOTE: pins 3 and 7 are WP/HOLD pins. If flashing a chip on a breadboard, please
use pull-up resistors on those (see notes below), and decoupling capacitor on
pin 8 (VCC).

NOTE: On X60/T60 thinkpads, don't connect pin 8. Instead, plug in your the PSU
to the charging port on your motherboard, but do not power on the mainboard. This
will provide a stable 3.3V voltage, with adequate current levels. On those
laptops, this is necessary because the flash shares a common 3.3V DC rail with
many other ICs that all draw quite a lot of current.

### SOIC16 wiring diagram (Raspberry Pi)

RPi GPIO header:\
![](https://av.libreboot.org/rpi/0009.webp)
![](https://av.libreboot.org/rpi/0010.png)

[BBB P9 header](https://beagleboard.org/static/images/cape-headers.png)

Refer to this diagram:

| Pin \#  | 25xx signal   | RPi(GPIO)  | BBB(P9 header) |
| ------- | ------------- | ---------- | -------------- |
| 1       |               |            |                |
| 2       | VCC           | 1          | 3              |
| 3       |               |            |                |
| 4       |               |            |                |
| 5       |               |            |                |
| 6       |               |            |                |
| 7       | CS\#          | 24         | 17             |
| 8       | MISO          | 21         | 21             |
| 9       |               |            |                |
| 10      | GND           | 25         | 1              |
| 11      |               |            |                |
| 12      |               |            |                |
| 13      |               |            |                |
| 14      |               |            |                |
| 15      | MOSI          | 19         | 18             |
| 16      | SCLK          | 23         | 22             |

Refer to the RPi GPIO guide above, on this page.

On your SOIC16, there will be a dot in one of the corners. The dot is pin 1.

NOTE: pins 1 and 9 are WP/HOLD pins. If flashing a chip on a breadboard, please
use pull-up resistors on those (see notes below), and decoupling capacitor on
pin 2 (VCC).

### Pull-up resistors and decoupling capacitors

**Do this for chips mounted to a breadboard. Ignore this section if you're
flashing a chip that is already soldered to a motherboard.**

This section is only relevant if you're flashing a new chip that is not yet
mounted to a motherboard. You need pull-up resistors on the WP and HOLD pins,
and decoupling capacitors on the VCC pin. If the chip is already mounted to a
board, whether soldered or in a socket, these capacitors and resistors will
probably already exist on the board and you can just flash it without pulling
WP/HOLD high, and without capacitors(just connect your external power source).

The best way is as follows:

* Insert the DIP8 IC into a breadboard (2.54mm holes), if it's DIP8
* Insert WSON8 into a WSON8 socket and put on a breadboard, if WSON8
* Insert SOIC8 into a SOIC8 socket and put on a broadboard, if SOIN8
* Wire an SPI flasher, using 2.54mm dupont leads, to the breadboard, using
  the correct wiring (see link to SPI flashing guides below)

SOIC8/WSON8/DIP8: pin 3 and 7 must be held to a high logic state, which means
that each pin has its own pull-up resistor to VCC (from the voltage plane that
pin 8 connects to); anything from 1Kohm to 10Kohm will do. When you're flashing
a chip that's already on a laptop/desktop/server motherboard, pin 3 and 7 are
likely already held high, so you don't need to bother.

SOIC8/WSON8/DIP8: pin 8, which is VCC, will already have decoupling capacitors on it
if the chip is on a motherboard, but lone chip flashing means that these capacitors
do not exist. A capacitor passes AC but blocks DC. Due to electromagnetic
indunctance, and RF noise from high-speed switching ICs, a DC voltage line isn't
actually straight (when viewed on an oscilloscope), but actually has low voltage
AC mixed in; on a particularly noisy line under high load, noise of around 300mV
or more is common. To smooth out that noise, you wire capacitors from the DC
line to ground, with the side of the capacitor on VCC as close to the IC's VCC
pin as possible. We recommend that you use ceramic capacitors for this purpose.
The recommended capacitors for this are: 100nF and 4.7uF ceramic capacitors.
Electrolytic capacitors are inferior for this, because they have higher ESR
(ceramic capacitors have super low ESR, which is very good for decoupling).

The result of using a decoupling capacitor is that some of the noise on the DC
line is filtered to ground, making the DC signal much cleaner/straighter (when
seen on an oscilloscope).

SOIC16: same as above, but use a SOIC16 socked on a breadboard. On SOIC16,
WP/HOLD are not pin 3/7 like above, but instead pins 1 and 9, so wire your 
pull-up resistors on those. VCC on SOIC16 is pin 2, so wire your decoupling
capacitors up on that.

### SOIC8/WSON8/DIP8/SOIC16 not mounted to a motherboard

If your system has lower capacity SPI flash, you can upgrade. On *most* systems,
SPI flash is memory mapped and the maximum (in practise) that you can use is a
16MiB chip. For example, KGPE-D16 and KCMA-D8 motherboards in libreboot have
2MiB flash by default, but you can easily upgrade these. Another example is the
ThinkPad X200S, X200 Tablet and T400S, all of which have WSON8 where the best
course of action is to replace it with a SOIC8 flash chip.

In all such cases, flashing a new chip should be done using a breadboard, not
a test clip. You will use 2.54mm dupont leads to connect your Raspberry Pi.
For data lines, make sure that all wires are the same length, and about 10cm
in length (don't use longer lengths than this).

Some advice:

* DIP8: Strong choice is Winbond W25Q128FVIQ. It is a direct drop-in replacement
* SOIC8 is possible: Winbond W25Q128FVSIG is a strong choice.
* DIP8 using adapter and SOIC8 is also possible. Use a 208-mil 1.27mm SOP8/SOIC8
  to DIP8 adapter PCB with a
  2.54mm 4-pin header on each side (square pins), then you can slot that in as
  though it were a normal P-DIP 8 IC. [This
  page](https://coolcomponents.co.uk/products/soic-to-dip-adapter-8-pin) shows
  a perfect example.
* The above SOP8/DIP8 adapter is actually what we recommend, if you're going
  that route. It's made by Sparkfun and widely available; you don't have to buy
  from that particular website. The part number is: BOB-13655
* If you use a SOP/DIP adapter with a SOIC8 IC, you'll have to solder it
  obviously. K tip is a nice choice for soldering ICs like these. Use good
  flux and 60/40 leaded solder (or 63/37), none of that Rohs lead-free crap.

If you go for a SOIC8, mounted it to the SOP to DIP adapter (208mil 1.27mm one)
and solder 2.54mm headers to it. You could put the 2.54mm pins in a breadboard,
then solder the chip to the adapter PCB and mount that to the pins on the
breadboard, to keep it aligned, and solder that. With the PCB on the pins, and
the pins in the breadboard, push the pins inwards a little bit.

This is for a new SOIC8 chip, but you can get sockets similar to the one in the
video, but for WSON8. Sometimes they are called DFN8 or QFN8 sockets. Get one
that is 1.27mm pitch.

If you're flashing/dumping a lone WSON8, get a WSON8/QFN8/DFN8 socket (1.27mm
pitch) and mount it to a breadboard for flashing. If your motherboard's landing
pads for the flash IC can take a SOIC8, we recommend that you use a SOIC8
instead because a test clip is possible later on when you wish to re-flash it,
however you may be dealing with a board where replacing existing WSON8 with
SOIC8 is desirable; in that case, you might still want to dump the contents of
the original WSON8.

Here is a SOIC8 in a socket, mounted to a breadboard, for flashing:\
![](https://av.libreboot.org/rpi/soic8_socket.jpg)

Here is a photo of a DIP8 IC:\
![](https://av.libreboot.org/dip8/dip8.jpg)

Here is a photo of a SOIC8 in 1.27mm 208mil SOP to DIP adapter:\
![](https://av.libreboot.org/dip8/sop8todip8.jpg)

NOTE: DIP8 and WSON8-in-socket, and SOIC16-in-socket, are basically the same,
just adapt accordingly.

If you're replacing a DIP8 but using SOIC8 on an adapter, solder it to the
adapter first, then insert 2.54mm headers (square pins) into a breadboard to
keep them aligned. Put the SOIC8 on the PCB, onto the pins, and push the pins
inwards a little bit, and solder that. Alternatively to the breadboard, you
can just put the 2.54mm pins directly in the DIP8 socket and mount the SOIC8 +
adapter onto that, and solder that. Use quality rosin flux (not acid based)
and good 60/40 or 63/37 leaded solder (don't use lead-free):

![](https://av.libreboot.org/dip8/adapter_breadboard.jpg)
![](https://av.libreboot.org/dip8/adapter.jpg)
![](https://av.libreboot.org/dip8/sop8todip8.jpg)

### SOIC8/SOIC16 soldered to a motherboard

This is an example of *in-system programming* or *ISP* for short.

SOIC8:\
Pomona 5250 is a SOIC8 test clip. There are others available, but this is the
best one. Use that. Use the SOIC8 diagram (see above) to wire up your Raspberry
Pi.
Your motherboard likely already pulls WP/HOLD (pins 3 and 7) high, so don't
connect these. VCC on SOIC8's pin 8 probably already has decoupling
capacitors on the motherboard, so just hook that up without using a capacitor.

SOIC16:\
Pomona 5252 is a SOIC16 test clip. There are others available, but this is the
best one. Use that. Use the SOIC16 diagram (see above) to wire up your Raspberry
Pi. WP/HOLD pins are pins 1 and 9, and likely already held high, so no pull-up
resistors needed. You do not need a decoupling capacitor for pin 2 (VCC) either
because the motherboard will already have one.

Here is an example of a test clip connected for SOIC16:\
![](https://av.libreboot.org/rpi/0002.jpg)

And here is an example photo for SOIC8:\
![](https://av.libreboot.org/x60/th_bbb_flashing.jpg)

### DIP8 soldered to the motherboard

It is extremely cursed for DIP8 to be soldered directly to the motherboard. It is
usually mounted to a socket.

The pins are large enough that you can just use test hooks to wire up your chip
for flashing. You might want to de-solder the chip, using a solder vacuum
(extractor) tool, and then you can install a socket in its place. You can then
insert the DIP8 IC into the socket.

In the libreboot project, we have never heard of a board where the DIP8 is
directly soldered. It is almost always mounted in a socket.

Your DIP8 IC has the same pinout as a SOIC8 IC.

### Replace WSON8 IC with SOIC8

**NOTE: You can alternatively purchase WSON8 probes from a site like Aliexpress.
They look similar to SOIC8 clips, and they work similarly.**

You *can* connect a SOIC8 test clip, but you will struggle to get good
connections and it will be extremely unreliable. DO NOT solder to the pads of
the WSON8 directly; some people do this, but you shouldn't do it, because you
can easily damage the pads that way.

WSON8 has the same pinout as SOIC8, but it's a ball mounted QFN (quad flat
pack, no leads). There are no clips for it. Sometimes referred to as QFN8

On all currently supported libreboot hardware, boards that have WSON8 can also
have a SOIC8 because the pads are long enough to accommodate either type of
chip.

A good choice of soldering iron would be a T12-D08 or T12-K tip, on a T12
soldering station. [KSGER makes nice soldering stations](https://yewtu.be/watch?v=w0nZCK7B-0U).

The case on that KSGER station is not grounded by default, so you should
[modify it to ground the case](https://yewtu.be/watch?v=-6IZ_sBgw8I), in case
of an electrical fault. This is for your safety.


Use quality 60/40 or 63/37 lead+tin solder. Do not use lead-free! Lead-free is
not suitable for hobbyist use such as this. Use quality *rosin* flux. Fluxes
with an acid base should never be used. Amtech and MG Chemicals make good flux
pastes. Use it in a dispenser tube. Some of these fluxes will contain adapic
acid which has a low pH level, and it is simply used as a mild activator. So
long as you clean the flux afterwards, you should be fine.

Make sure to have a copper wire brush and a wet sponge handy. You wipe the iron
on the wire brush and tap it on the wet sponge(to remove oxides) to keep it
clean. Always clean your tip constantly. Also, after cleaning it, always re-tin
the tip with fresh solder, to prevent the tip from oxidizing!

Make sure to buy 99.9% isopropyl alcohol. Don't buy weaker solutions because
they contain water, and don't use other chemicals because most other chemicals
are corrosive. You use the isopropyl to clean the area you're soldering, before
soldering it, and then soak up the wet alcohol with a cloth. You will also use
it to clean off any flux that you used.

Use of flux is very important, to get a good solder joint, because it removes
oxides and prevents further oxidation during soldering, ensuring that the solder
flows properly, otherwise the solder will ball up and you won't get a good
joint.

In case you're not comfortable with soldering, we have some excellent videos
linked on the [FAQ page](../../faq.md) which you can watch.

WSON8 IC:\
![](https://av.libreboot.org/rpi/wson8/0001.jpg)

Surround a large area around the chip with layers of kapton tape, and then
aluminium foil. This will act as a heat shield, to reduce the risk of re-flowing
other solder joints (which can make them turn into cold joints, and you risk
knocking them off of the board):\
![](https://av.libreboot.org/rpi/wson8/0002.jpg)\
Notice that the kapton+foil does not cover the chip itself, or the solder pads.
It's important that these are exposed to the heat.

Use a hot air rework station, set to about 330-340C. The reason for the higher
temperature is because air doesn't conduct heat as efficiently as an iron, so
you must use a higher temperature. You should put lots of rosin flux above the
IC. Do not hold the nozel too close to the board. The diameter of the nozel
should be slightly higher than the length of the chip. Apply even heat, at high
air flow.

While blasting the chip with hot air, hold the chip with tweezers but do not
use any real force. Do not try to forcefully pry off the chip. Simply hold the
chip with your tweezers, gently nudging it until it feels like the chip can
move freely. While in this state, the solder is fully melted and the chip can
be lifted off with ease.

If you're doing it correctly, the chip will come off within 1 minute, like so:\
![](https://av.libreboot.org/rpi/wson8/0003.jpg)

Add fresh solder to the pads, including the thermal pad:\
![](https://av.libreboot.org/rpi/wson8/0004.jpg)

Now wick it out using a copper braid, dunked in rosin flux:\
![](https://av.libreboot.org/rpi/wson8/0005.jpg)

Ensure that all of the solder is removed:\
![](https://av.libreboot.org/rpi/wson8/0006.jpg)\
You will notice that one of the pads doesn't have all of the solder removed.
The pad on the top-left in this photo. This is intentional, to show you a
comparison for reference. The other pads are free of solder.

You *can* simply solder the chip unflashed, and flash it using a test clip.
Alternatively, you can put the SOIC8 in a socket on a breadboard, and flash it
before soldering it. If you wish to dump the contents of the WSON8, you can
put the removed WSON8 in a socket on a breadboard and dump it using your
SPI flasher.

Align the new SOIC8, and tack it in the corner pins. Then solder it fully. Use
lots of flux!\
![](https://av.libreboot.org/rpi/wson8/0007.jpg)\
A T12-D08 tip is being used in this photo, but a mini chisel, mini hoof or
knife (e.g. T12-K) tip would be ideal.

Ensure that all the joints are perfect. A good solder joint is shiny, and with
concave fillets where the solder has flowed. Observe:\
![](https://av.libreboot.org/rpi/wson8/0008.jpg)

After you're done, use a soft bristle brush and 99.9% isopropyl alcohol to
break up the remaining flux, then soak up the flux using a cloth, while the
alcohol is still wet. 99.9% isopropyl is the best liquid to use, because it
evaporates quickly and it does not leave a corrosive residue.


## Step 4: Using flashprog

### Installing

If you're using a BBB or RPi, install flashprog while logged into them.

```
git clone https://codeberg.org/libreboot/lbmk.git
cd lbmk
sudo ./mk dependencies debian
./mk -b flashprog
```

Replace `debian` with your distribution identifier; distribution configurations
are available in `config/dependencies/`. If your distro is not listed, read one
of the lists and install the corresponding packages manually.

**Note:** If you're flashing a Macronix flashchip on a ThinkPad X200, you will
want to use a special patched version of flashprog, which you can download
[here](https://vimuser.org/hackrom.tar.xz) - patched source code is available,
and a binary is also available that you can simply run. Pass the
`--workaround-mx` argument in flashprog. This mitigates stability issues.

Alternatively, you may download flashprog's source from upstream and type
`make`.

### Reading

Before flashing a new ROM image, it is highly advisable that you dump the
current chip contents to a file.

Run `FLASHCMD` command to see if 25xx flash is detected, with your programmer
properly wired. If flash chip is detected you may try reading (dumping) the
flash contents now:

```
FLASHCMD -r dump1.bin
FLASHCMD -r dump2.bin
sha1sum dump*.bin
```

If the checksums match, it indicates that you have a good dump. If they do not,
check your wiring. Wires should be within 10cm length for best stability, and
they should all be the same length (VCC and GND wires can be longer).

For boards with more than one flash chip (e.g. X230, T430, T530, T440p, etc.)
you will need to read from both chips and combine them into a single file. Most
of the time, a two chip setup includes one 8mb 'bottom' chip and one 4mb 'top'
chip.

```
cat bottom_8mb.rom top_4mb.rom > full_12mb.rom
```

You will need this combined rom if you intend to manually extract vendor files,
which is a method not officially supported by Libreboot's build system.

### Writing

You will need to find the proper Libreboot ROM file for you motherboard. Usually,
they are named like `payload_board_graphicsfirmware_graphicsmode_keyboardlayout.rom`.

Do not flash files that have `DO_NOT_FLASH` in their name; if you encounter any
of these files, you should [inject vendor files](../inject_vendor_files/).

```
FLASHCMD -w /path/to/the/correct/rom
```
It should tell you something like:

```
Reading old flash chip contents... done.
Erasing and writing flash chip... Erase/write done.
Verifying flash... VERIFIED.
```

If the board you are writing to has two chips you'll need to split the rom into
two sections. For example, to split a rom for the X230, T430, T530, or T440p
run:

	dd if=/path/to/12mb.rom bs=1M of=bottom.rom count=8
	dd if=/path/to/12mb.rom bs=1M of=top.rom skip=8

Flash the resulting roms to each of their respective chips according to the
above instructions.

## Licensing

This page and the photos on it are available under [CC BY SA
4.0](https://creativecommons.org/licenses/by-sa/4.0/legalcode.txt)

Photos showing a BeagleBone Black are under the normal GNU Free Documentation
license like other pages and images on this website, or you can use them under
the CC-BY-SA 4.0 license if you wish.
