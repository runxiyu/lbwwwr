---
title: Product Codenames
---

TODO: this page could do with an update. More info, about more boards

Introduction
============

This document lists product codenames for some hardware.
Please note that just because a certain device is listed here does NOT mean
that it is supported in libreboot. For supported devices refer to the
installation documentation.

### A note on GPUs

Some laptops come with and without a discrete GPU (dGPU). Whether the
motherboard includes one or not can be determined by (in descending order
of reliability):

-   often thorough disassembly and searching for the actual chip
-   looking at white PCB markings near RAM slots / under keyboard
    and comparing with some known codenames (if not available FRU ID sticker)
    listed below.
-   sometimes by looking at heatsink grills: on
    discrete GPU laptops these will look orange and on integrated ones
    they will appear silver.

List of models and codenames
============================

### Codenames

-   Samsung Chromebook 2 13": peach-pi
-   Samsung Chromebook 2 11": peach-pit
-   HP Chromebook 11 G1: spring
-   Samsung Chromebook XE303: snow
-   HP Chromebook 14 G3: nyan-blaze
-   Acer Chromebook 13: (CB5-311, C810) nyan-big
-   ASUS Chromebit CS10: veyron-mickey
-   ASUS Chromebook Flip C100PA: veyron-minnie
-   ASUS Chromebook C201PA: veyron-speedy
-   Hisense Chromebook C11 and more: veyron-jerry
-   ASUS Chromebook Flip C101: bob
-   Samsung Chromebook Plus (v1): kevin

-   ThinkPad X60: KS Note (Sumo)
-   ThinkPad X60s (slim): KS Note-2 / KS-2 (Kabuki)
-   ThinkPad X60 Tablet: Dali (Same PCB as KS Note-2, different EC firmware)

-   ThinkPad X200: Mocha-1
-   ThinkPad X200s (slim): Pecan-1
-   ThinkPad X200 Tablet: Caramel-1

-   ThinkPad R400/T400: Malibu-3
    -   with discrete GPU (dGPU), at board revision 0: "MLB3D-0
    -   with only integrated GPU (iGPU), at board revision 0: "MLB3I-0"

-   ThinkPad T500/W500: Coronado-5
    - with dGPU (radeon): "COR5D-0" (last number is the board revision)
    - with only iGPU: "COR5I-0"

-   ThinkPad T400s (slim): Shinai-MV
-   ThinkPad R500: Waikiki-3

-   T6x (whole family): Davinci. They don't have codename label in
silkscreen so you need to use FRU label of the board, which is placed
under RAM sticks.
-   T60:
    -   with dGPU (radeon): Magi-0 (last number is the board revision)
    -   with iGPU: Lisa-0

-   R60(e): RP-1, RP-2 - Rockwell / Picasso

-   With ThinkPads on Intel platforms newer than Montevina (Except T410),
    the codenames become more consistent. All boards have the following
    appended based on the type of graphics they have:
    -   with dGPU: SWG (SWitchable Graphics)
    -   with only iGPU: UMA (Unified Memory Access)

-   These are the known model codenames:
    -   ThinkPad T410: NOZOMI-1 # EXT/INT
    -   ThinkPad T410s: SHINAI-2 # SWG/UMA
    -   ThinkPad T420: NOZOMI-3 # SWG/UMA
    -   ThinkPad T420s: SHINAI-3 # SWG/UMA
    -   ThinkPad T430: NOZOMI-4 # SWG/UMA
    -   ThinkPad T430s: SHINAI-4 # SWG/UMA
    -   ThinkPad T520: KENDO-1
    -   ThinkPad W520: KENDO-1 WS
    -   ThinkPad T520: KENDO-3
    -   ThinkPad W520: KENDO-3 WS
    -   ThinkPad T530: KENDO-4
    -   ThinkPad W530: KENDO-4 WS
-   ThinkPad T-series dock codenames:
    -   Advanced Mini Dock - Donatello
    -   Advanced Mini Dock (lacking SuperIO) - Donatello-lite
    -   Advanced Dock - Rodin
    -   Dock II - Aswan
    -   Mini Dock - Seville
    -   Port Replicator II - Seville-lite

### Miscellaneous
-   [Calistoga](https://ark.intel.com/products/codename/5950/Calistoga):
945GM/945PM chipset family name
-   Napa: calistoga based platform
-   [Cantiga](https://ark.intel.com/products/codename/26552/Cantiga):
GM45/GS45/PM45 chipset family name.
    This is the chipset used in T400,X200 and similar.
-   Montevina: cantiga based platform.
-   PMH: the Power Management Hub is a gate array for managing the power
    up/down sequence. It is additionally tasked with extending EC's I/O.
    Its later version was called "Thinker-1", and eventually it was merged
    with PMIC (Rinkan) as ThinkEngine (Do not confuse it with EC chip which is also
    has ThinkEngine logo on ThinkPad boards)
-   Kozak, Tsurumai, Rinkan: These are successive versions of power management
    ICs for Notebook PCs. Tsurumai chip marking is "TB62501F" and datasheet
    of it fully describes its operation.

See also
========
-   Many more Intel codenames can be found at
    [Wikipedia](https://en.wikipedia.org/wiki/List_of_Intel_codenames).
-   For ThinkPads see [Documentation/thinkpad/codenames.csv @ Coreboot]
(https://review.coreboot.org/cgit/coreboot.git/tree/Documentation/thinkpad/codenames.csv)
-   For Chromebooks see [Developer information for ChromeOS devices]
(https://www.chromium.org/chromium-os/developer-information-for-chrome-os-devices/)
