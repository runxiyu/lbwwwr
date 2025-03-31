---
title: MacBook 1,1 and 2,1
---

<div class="specs">
<center>
![MacBook2,1]()
</center>

| ***Specifications***       |                                                |
|----------------------------|------------------------------------------------|
| **Manufacturer**           | Apple                                          |
| **Name**                   | Late 2006/Mid 2007 MacBook "Core 2 Duo" / Early 
                                                      2006 MacBook "Core Duo" |
| **Released**               | 2006/2007                                      |
| **Chipset**                | Intel Calistoga 945GM                          |
| **CPU**                    | Intel Core 2 Duo or Intel Core Duo on 
                                                            original MacBooks |
| **Graphics**               | Intel GMA 950                                  |
| **Display**                | 1280x800 TFT                                   |
| **Memory**                 | 512MB, 1GB (upgradable to 4GB with 3GB usable) |
| **Architecture**           | x86_64                                         |
| **EC**                     | Proprietary                                    |
| **Original boot firmware** | Apple EFI                                      |
| **Intel ME/AMD PSP**       | Not present.                                   |
| **Flash chip**             | SOIC-8 2MiB (Upgradable to 16MiB)              |

```
W+: Works without vendor firmware; 
N: Doesn't work; 
W*: Works with vendor firmware; 
U: Untested; 
P+: Partially works; 
P*: Partially works with vendor firmware
```

| ***Features*** |                                       |
|----------------|---------------------------------------|
| **Internal flashing with original boot firmware** | W+ |
| **Display**                                       | W+ |
| **Audio**                                         | W+ |
| **RAM Init**                                      | W+ |
| **External output**                               | W+ |
| **Display brightness**                            | P+ |

| ***Payloads supported***  |           |
|---------------------------|-----------|
| **GRUB**              | Works     |
| **SeaBIOS**               | Works     |
| **SeaBIOS with GRUB** | Works     |
</div>
The MacBook1,1 and MacBook2,1 are very similar to the 
ThinkPad X60. It shares some hardware with the X60 such as the chipset.

You do not need to use external flashing equipment when flashing the MacBook2,1
but the MacBook1,1 requires external flashing equipment while running Apple EFI
firmware.

MacBook2,1 laptops come with Core 2 Duo processors
which support 64-bit operating systems (and 32-bit). The MacBook1,1
uses Core Duo processors (supports 32-bit OS but not 64-bit), and it is
believed that this is the only difference.

## Compatibility

* [MacBook 1,1](http://www.everymac.com/ultimate-mac-lookup/?search_keywords=MacBook1,1)
* [MacBook 2,1](http://www.everymac.com/ultimate-mac-lookup/?search_keywords=MacBook2,1)

### Models

Specifically (Order No. / Model No. / CPU) for the MacBook1,1:

* MA255LL/A / A1181 (EMC 2092) / Core Duo T2500 *(tested - working)*
* MA254LL/A / A1181 (EMC 2092) / Core Duo T2400 *(tested - working)*
* MA472LL/A / A1181 (EMC 2092) / Core Duo T2500 *(tested - working)*

For the MacBook2,1:

* MA699LL/A / A1181 (EMC 2121) / Intel Core 2 Duo T5600 *(tested -
    working)*
* MA701LL/A / A1181 (EMC 2121) / Intel Core 2 Duo T7200 *(tested -
    working)*
* MB061LL/A / A1181 (EMC 2139) / Intel Core 2 Duo T7200 *(tested -
* MA700LL/A / A1181 (EMC 2121) / Intel Core 2 Duo T7200 *(tested -
    working)*
* MB063LL/A / A1181 (EMC 2139) / Intel Core 2 Duo T7400 *(tested - working)*
* MB062LL/A / A1181 (EMC 2139) / Intel Core 2 Duo T7400 *(tested -
    working)*

It's believed that all MacBook2,1 and MacBook1,1 models work fine with 
Libreboot. If there's a model not in the list or not confirmed working 
here and you happen to have that model and that model works with Libreboot 
then don't forget to [send a patch](../../git), confirming that it 
actually works!

## Internal flashing

MacBook2,1 can always be flashed internally, even if running Apple firmware:

	sudo flashprog -p internal:laptop=force_I_want_a_brick,boardmismatch=force -w your.rom

The MacBook1,1 can't be flashed internally if running the Apple EFI firmware. 
You must flash externally.

## External flashing

MacBook1,1 requires external flashing, if running the default Apple firmware.
MacBook2,1 can be flashed internally, regardless.
If running coreboot or libreboot you can already internally re-flash.

[This page shows disassembly
guides](https://www.ifixit.com/Device/MacBook_Core_2_Duo)

Locate the flash. It'll be a SOIC8, which looks like this:

![](https://av.libreboot.org/chip/soic8.jpg)

The chip is located under the motherboard. [How to remove the
motherboard](https://www.ifixit.com/Guide/MacBook+Core+2+Duo+PRAM+Battery+Replacement/529).

Refer to the following guide:\
[Externally rewrite 25xx NOR flash via SPI protocol](../install/spi)

## OSes using Linux on Apple EFI firmware

You have 2 choices for booting up OSes using Linux as their kernel 
on the MacBook:

* Boot via USB ;

* Boot via a CD or DVD.

### Boot via a CD or DVD

The Apple EFI firmware contains a PC BIOS emulation layer for booting 
Microsoft Windows on CDs and DVDs. That emulation layer **only** works 
if booting from a CD/DVD or from the hard drive. The MacBook will **not** 
boot MBR bootloaders from USB, which is why booting from a CD or DVD is 
easier than booting from a USB.

* First, burn your ISO to a CD or DVD ;

* Reboot and while rebooting, hold down the Alt/Control key, a boot menu 
should pop up, requesting you to choose which device to boot from ;

* Select the CD/DVD icon with 'Windows' as the label (the Apple EFI firmware 
elways recognises CDs/DVDs using MBR as 'Windows', because the emulation 
layer was made specifically for booting Microsoft Windows as part of 
BootCamp, a tool which allowed dual-booting Windows and OS X) ;

* Install it like you normally would (If there's an OS X installation then 
it's highly recommended to save all your data and wipe it. Libreboot isn't 
able and will never be able to boot OS X) ;

* While rebooting, hold Alt/Control once again, and select the hard disk 
icon with the 'Windows' label, after each subsequent boot, the Apple EFI 
should boot up properly automatically.

*If you installed your OS alongside OS X then you won't be able to boot 
to it using GRUB, despite the fact that it does sometimes show up. You 
also won't be able to boot it up when using Libreboot.*

### Boot via USB

This method is harder than booting from a CD/DVD and may soft-brick your 
MacBook but it's the only way to boot up successfully from a USB.

The PC BIOS emulation layer found in the Apple EFI firmware doesn't work 
when booting up from a USB stick. Despite the fact that the 
MacBook2,1 does use a 64-Bit processor, the firmware only supports booting 
32-Bit EFI devices, meaning you're stuck with 32-Bit OSes and rare 
64-Bit OSes which have ISOs that still support booting from 32-Bit EFI. 
Meanwhile, GRUB fully supports booting up 64-Bit OSes on 32-Bit EFI.

* First, search for an ISO that supports 32-Bit EFI while being 64-Bit or 
a normal 32-Bit ISO and put it in your USB stick ;

* Reboot and while rebooting, hold down the Alt/Control key, a boot menu 
should pop up, requesting you to choose which device to boot from ;

* Select the USB icon ;

* Install it like you normally would (If there's an OS X installation then 
it's highly recommended to save all your data and wipe it. Libreboot isn't 
able and will never be able to boot OS X) ;

* Reboot. It should boot up to your newly-installed system if you wiped OS X, 
else, hold Alt/Control and select the correct boot device ;

* Flash Libreboot. DO NOT REBOOT AGAIN BEFORE FLASHING. Sometimes the 
firmware can get confused, because Apple never intended to boot other 
EFI OSes other than OS X, as such there's a chance that your MacBook can 
become [soft-bricked](https://apple.stackexchange.com/questions/408104/late-2006-macbook-doesnt-turn-on-fan-spinning-but-no-chime/409754). 
If that is the case then disassemble it and remove 
the CMOS/PRAM battery, wait a few minutes, and put it back in.

*If you want to install Libreboot with the SeaBIOS payload then be sure 
to reconfigure GRUB2 correctly, else your system won't boot.*

## Coreboot wiki page

[Here](https://www.coreboot.org/Board:apple/macbook21)

## Issues and solutions/workarounds

There is one mouse button only, however multiple finger tapping
works. The Apple logo on the
back is a hole, exposing the backlight, which means that it glows. You
should [cover it up](http://cweiske.de/tagebuch/tuxbook.htm).

*The MacBook2,1 comes with a webcam which does not work with free
software. Webcams are a privacy and security risk; cover it up! Or
remove it.*

### Make it overheat less

NOTE: on newer libreboot revisions, this section is less relevant, because C3
states are supported now. However, this section may still be useful, so it will
be retained.

The MacBook2,1 overheats a lot with libreboot, we still don't know why but a simple workaround is to install macfanctld.

Macfanctld is available on the default repos of many distributions.

For example, to install macfanctld on an Arch-based distro, you would run as root

	pacman -S macfanctld

and don't forget to enable it by using `systemctl` or by a script that will run macfanctld if using runit.

Then, you want to install powertop and tlp.
And then, run the following on battery

	sudo tlp start && sudo powertop --calibrate

Then, after quitting powertop, run :

	sudo powertop --auto-tune

Now, configure tlp, edit the `/etc/tlp.conf` and uncomment/add/modify the following:

```
CPU_BOOST_ON_AC=1
CPU_BOOST_ON_BAT=0

SCHED_POWERSAVE_ON_AC=0
SCHED_POWERSAVE_ON_BAT=1

PLATFORM_PROFILE_ON_AC=performance
PLATFORM_PROFILE_ON_BAT=low-power
```

The MacBook will still overheat, just less.

### Enable AltGr

The keyboard has a keypad enter instead of an AltGr. The first key on
the right side of the spacebar is the Apple "command" key. On its
right is the keypad enter. We can make it act as an AltGr.

If your operating system is Debian or other dpkg-based distribution,
there is an easy solution. Under root (or sudo) run

	dpkg-reconfigure keyboard-configuration

and select the option "apple laptop", leave other settings as their
defaults until you are given the option "Use Keypad Enter as
AltGr". Select this. The keypad enter key will then act as an AltGr
everywhere.


For Arch-based distributions you can enable AltGr manually. Simply add the
line:

	KEYMAP_TOGGLE=lv3:enter_switch

to the file /etc/vconsole.conf and then restart the computer.

### Make touchpad more responsive

Linux kernels of version 3.15 or lower might make the touchpad
extremely sluggish. A user reported that they could get better
response from the touchpad with the following in their xorg.conf:

```
	Section "InputClass"
		Identifier "Synaptics Touchpad"
		Driver "synaptics"
		MatchIsTouchpad "on"
		MatchDevicePath "/dev/input/event*"
		Driver "synaptics"
	The next two values determine how much pressure one needs
	for tapping, moving the cursor and other events.
		Option "FingerLow" "10"
		Option "FingerHigh" "15"
	Do not emulate mouse buttons in the touchpad corners.
 		Option "RTCornerButton" "0"
 		Option "RBCornerButton" "0"
 		Option "LTCornerButton" "0"
		Option "LBCornerButton" "0"
	One finger tap = left-click
		Option "TapButton1" "1"
	Two fingers tap = right-click
		Option "TapButton2" "3"
	Three fingers tap = middle-mouse
		Option "TapButton3" "2"
	Try to not count the palm of the hand landing on the touchpad
	as a tap. Not sure if helps.
		Option "PalmDetect" "1"
	The following modifies how long and how fast scrolling continues
	after lifting the finger when scrolling
		Option "CoastingSpeed" "20"
		Option "CoastingFriction" "200"
	Smaller number means that the finger has to travel less distance
	for it to count as cursor movement. Larger number prevents cursor
	shaking.
		Option "HorizHysteresis" "10"
		Option "VertHysteresis" "10"
	Prevent two-finger scrolling. Very jerky movement
		Option "HorizTwoFingerScroll" "0"
		Option "VertTwoFingerScroll" "0"
	Use edge scrolling
		Option "HorizEdgeScroll" "1"
		Option "VertEdgeScroll" "1"
	EndSection
```
