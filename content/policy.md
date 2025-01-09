---
title: Binary Blob Reduction Policy
---

## Introduction

This article describes the *principles* that govern the Libreboot project.
**For information about how they apply in practice to each board, refer to the
[freedom status](../freedom_status/) page.**

Libreboot's policy is to provide as much software freedom as possible to each
user, on each and every bit of hardware supported, and to support as much
hardware from coreboot as is feasible. The user should be able to study all
source code, documentation, and other resources, and/or modify/redistribute it.
Libreboot achieves this by being a coreboot distribution, easing the process of
configuring and installing coreboot.

## Project scope

Libreboot is concerned with what goes into the main boot flash IC. There may be
[other pieces of firmware to consider](../other_firmware), such as the embedded
controller firmware, HDD/SSD firmware, and the Intel ME and AMD PSP firmware.
While these are not in the scope of Libreboot, we do occasionally try to
mitigate the effects of the more invasive ones such as the ME.

## What is a binary blob?

A binary blob is any executable for which no libre source code exists, i.e. one
that you cannot study and modify in a reasonable manner. They should be avoided
if possible and reasonable.

## The binary blob reduction policy

Coreboot is mostly libre software but requires vendor blobs on some platforms.
The following policy describes how Libreboot handles these blobs.

* If, for one piece of hardware, both libre and vendor firmware are available
  and usable, then libre code should be used.
* If, for one piece of hardware, both libre and vendor firmware are available
  but the libre one is broken to the extent that it impairs usability, the
  vendor one should be used instead.
* Methods to neuter the Intel Management Engine and the AMD Platform Security
  Processor must be provided if available.
* On configurations with two graphics devices where only one has libre init
  code, it is acceptable for Libreboot to support both devices, and accommodate
  the required vendor code on the device that lacks libre init code.
* Notwithstanding any other provision of this list, [CPU microcode
  updates](microcode/) are permitted.
* Vendor files must never be deleted from releases even if they are unused.
  That way, even if the Libreboot build system does not yet integrate support
  for a given board, someone who downloads libreboot can still make changes to
  their local version of the build system, if they wish, to provide a
  configuration for their hardware.

## Configurability

The principles of the binary blob reduction policy should apply to the
**default** configuration. Libreboot is meant to be configurable and
customizable.

Some users may want to create a setup that is less libre than the default one,
and Libreboot tries to not get into the way of users who choose to do so. We do
not lecture the user.

<!-- TODO -->
