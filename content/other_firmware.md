---
title: Firmware Outside of Libreboot’s Scope
---

Libreboot is concerned with what goes into the main boot flash IC. The
following potentially nonfree firmware is outside the scope of Libreboot but
may also be relevant to a Libreboot user.

### WiFi

We actually do not recommend Atheros cards:

![Why Atheros cards could be less free than Intel cards](https://av.libreboot.org/firmware.png)

### External GPUs

The Video BIOS is present on most video cards. For integrated graphics, the
VBIOS (special kind of OptionROM) is usually embedded in the main boot
firmware. For external graphics, the VBIOS is usually on the graphics card
itself. This is usually proprietary; the only difference is that SeaBIOS can
execute it (alternatively, you embed it in a coreboot ROM image and have
coreboot executes it, if you use a different payload, such as GRUB).

The *coreboot project* provides free initialization code, on many boards, and
libreboot will use this code when it is available, depending on the
configuration.

In configurations where SeaBIOS and native GPU init are used together, a
special shim VBIOS is added that uses coreboot linear framebuffer.

### EC (embedded controller) firmware 

Most (all?) laptops have this. The EC (embedded controller) is a small,
separate processor that basically processes inputs/outputs that are specific to
laptops, including but not limited to:
-   When you flick the radio on/off switch, the EC will enable/disable the
    wireless devices (WiFi, bluetooth, etc) and enable/disable an LED that
    indicates whether it's turned on or not
-   Listen to another chip that produces temperature readings, adjusting fan
    speeds accordingly (or turning the fan(s) on/off).
-   Takes certain inputs from the keyboard, e.g. brightness up/down, volume
    up/down.
-   Detect when the lid is closed or opened, and send a signal indicating this.

EC is present on nearly all laptops. Other devices use, depending on complexity,
either EC or a variant with firmware in Mask ROM such as Super I/O.

### HDD/SSD firmware 

HDDs and SSDs have firmware in them, intended to handle the internal workings
of the device while exposing a simple, standard interface (such as AHCI/SATA)
that the OS software can use, generically. This firmware is transparent to the
user of the drive.

HDDs and SSDs are quite complex, and these days contain quite complex hardware
which is even capable of running an entire operating system (by this, we mean
that the drive itself is capable of running its own embedded OS), even Linux.

SSDs and HDDs are a special case, since they are persistent storage devices as
well as computers.

Example attack that malicious firmware could do: substitute your SSH keys,
allowing unauthorized remote access by an unknown adversary. Or maybe
substitute your GPG keys. SATA drives can also have DMA (through the
controller), which means that they could read from system memory; the drive can
have its own hidden storage, theoretically, where it could read your LUKS keys
and store them unencrypted for future retrieval by an adversary.

With proper IOMMU and use of USB instead of SATA, it might be possible
to mitigate any DMA-related issues that could arise.

Some proof of concepts have been demonstrated for
[HDDs](https://spritesmods.com/?art=hddhack&page=1) and
[SSDs](http://www.bunniestudios.com/blog/?p=3554).

Viable free replacement firmware is currently unknown to exist. For SSDs, the
[OpenSSD](https://web.archive.org/web/20220425071606/http://www.openssd-project.org/wiki/The_OpenSSD_Project)
project may be interesting.

Apparently, SATA drives themselves don't have DMA but can make use of it
through the controller. See [this (pages 388&ndash;414, 420&ndash;421, 427, 446&ndash;465,
492&ndash;522, 631&ndash;638)](http://web.archive.org/web/20170319043915/http://www.lttconn.com/res/lttconn/pdres/201005/20100521170123066.pdf)
and [this (pages 59, 67, 94,
99)](http://www.intel.co.uk/content/dam/www/public/us/en/documents/technical-specifications/serial-ata-ahci-spec-rev1_3.pdf)
.

The following is based on discussion with Peter Stuge (`CareBear\\`) in the
coreboot IRC channel on Friday, 18 September 2015, when investigating whether
the SATA drive itself can make use of DMA. The following is based on the
datasheets linked above:

According to those linked documents, FIS type 39h is *"DMA Activate FIS -
Device to Host"*. It mentions *"transfer of data from the host to the device,
and goes on to say: Upon receiving a DMA Activate, if the host adapter's DMA
controller has been programmed and armed, the host adapter shall initiate the
transmission of a Data FIS and shall transmit in this FIS the data
corresponding to the host memory regions indicated by the DMA controller's
context."* FIS is a protocol unit (Frame Information Structure). Based on this,
it seems that a drive can tell the host controller that it would like for DMA
to happen, but unless the host software has already or will in the future set
up this DMA transfer then nothing happens. **A drive can also send DMA Setup**.
If a DMA Setup FIS is sent first, with the Auto-Activate bit set, then it is
already set up, and the drive can initiate DMA. The document goes on to say
*"Upon receiving a DMA Setup, the receiver of the FIS shall validate the
received DMA Setup request."* - in other words, the host is supposed to
validate; but maybe there's a bug there. The document goes on to say *"The
specific implementation of the buffer identifier and buffer/address validation
is not specified"* - so no one will actually bother. *"the receiver of the FIS"*
&mdash; in the case we're considering, that's the host controller hardware in
the chipset and/or the kernel driver (most likely the kernel driver). All SATA
devices have flash-upgradeable firmware, which can usually be updated by
running software in your operating system; **malicious software running as root
could update this firmware, or the firmware could already be malicious**. Your
HDD or SSD is the perfect place for a malicious adversary to install malware,
because it's a persistent storage device as well as a computer.

Based on this, it's safe to say that use of USB instead of SATA is advisable if
security is a concern. USB 2.0 has plenty of bandwidth for many HDDs (a few
high-end ones can use more bandwidth than USB 2.0 is capable of), but for SSDs
it might be problematic. USB 3.0 will provide more reasonable performance,
though note that depending on the system, you may have to deal with binary
vendor XHCI firmware in your kernel (if that bothers you).

Use of USB is also not an absolute guarantee of safety, so do beware. The
attack surface becomes much smaller, but a malicious drive could still attempt
a "fuzzing" attack (e.g. sending malformed USB descriptors, which is how the
tyrant DRM on the Playstation 3 was broken, so that users could run their own
operating system and run unsigned code). (you're probably safe, unless there's
a security flaw in the USB library/driver that your OS uses. USB is generally
considered one of the safest protocols, precisely because USB devices have no
DMA)

It is recommended that you use full disk encryption, on HDDs connected via USB.
There are several adapters available online, that allow you to connect SATA
HDDs via USB, and Libreboot is capable of booting from them the normal way.
Consult the documentation for your Linux/BSD operating system, so that you can
know how to install it with *full disk encryption*.

The current theory (unproven) is that this will at least prevent malicious
drives from wrongly manipulating data being read from or written to the drive,
since it can't access your LUKS key if it's only ever in RAM, provided that the
HDD doesn't have DMA (USB devices don't have DMA). The worst that it could do
in this case is destroy your data. Of course, you should make sure never to put
any keyfiles in the LUKS header. **Take what this paragraph says with a pinch
of salt. This is still under discussion, and none of this is proven.**

See also: [this Vice article](https://www.vice.com/en_us/article/ypwkwk/the-nsas-undetectable-hard-drive-hack-was-first-demonstrated-a-year-ago)

### NIC (ethernet controller) 

Ethernet NICs will typically run firmware inside, which is responsible for
initializing the device internally. Theoretically, it could be configured to
drop packets, or even modify them.

With proper IOMMU, it might be possible to mitigate the DMA-related issues. A
USB NIC can also be used, which does not have DMA.

### Sound card 

Sound hardware (integrated or discrete) typically has firmware on it (DSP) for
processing input/output. Again, a USB DAC is a good workaround.

### Webcam 

Webcams have firmware integrated into them that process the image input into
the camera; adjusting focus, white balancing and so on. Can use USB webcam
hardware, to work around potential DMA issues; integrated webcams (on laptops,
for instance) are discouraged by the libreboot project, for security reasons.

### USB host controller 

USB host controllers require firmware. Sometimes, this has to be supplied by
coreboot itself.

### WWAN firmware 

Note that WWAN is unrelated to WiFi.

Some laptops might have a simcard reader in them, with a card for handling
WWAN, connecting to a 3g/4g (e.g. GSM) network. This is the same technology
used in mobile phones, for remote network access (e.g. internet).

The baseband processor inside the WWAN chip will have its own embedded
operating system, most likely proprietary. Use of this technology also implies
the same privacy issues as with mobile phones (remote tracking by the GSM
network, by triangulating the signal).

On some laptops, these cards use USB (internally), so won't have DMA, but it's
still a massive freedom and privacy issue. If you have an internal WWAN
chip/card, the libreboot project recommends that you disable and (ideally, if
possible) physically remove the hardware. If you absolutely must use this
technology, an external USB dongle is much better because it can be easily
removed when you don't need it, thereby disabling any external entities from
tracking your location.

Use of ethernet or WiFi is recommended where possible, as opposed to mobile
networks, as these are generally much safer.

