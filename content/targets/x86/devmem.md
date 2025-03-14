---
title: Disabling /dev/mem protections
toc: true
---

This section applies to any program that makes use of lower memory
below 1MB. This applies to `flashprog` and `dell-flash-unlock` plus any other
tool that uses lower memory and/or port I/O

Port I/O is up to you, BUT it is recommended that you re-disable lower memory
access once you no longer need it, as this is a useful security layer against
any wrongful operations that you may later inadvertently run as root.

## Also disable Secure Boot

If you're using a UEFI setup, it's probably because you're using
a latter Intel platform and want to flash Libreboot internally, from
the factory firmware to Libreboot.

If the factory firmware implements UEFI, and this is how you boot when
using the factory firmware, please ensure that Secure Boot is disabled,
because it will interfere with lower memory accesses if left enabled.

## Flash errors

This section relates to installing Libreboot on supported targets.

Right out of the gate, some users may experience errors with flashprog when
using the internal programmer. They are:

### /dev/mem access error

If running `flashprog -p internal` for software based flashing, and you
get an error related to `/dev/mem` access, you should reboot with
`iomem=relaxed` kernel parameter before running flashprog, or use a kernel that
has `CONFIG_STRICT_DEVMEM` not enabled.

On NetBSD and OpenBSD systems, the equivalent to `iomem=relaxed` in this case
is `kernel.securelevel=-1`; see [NetBSD securelevel
manual](https://wiki.netbsd.org/tutorials/kernel_secure_levels/)
and [OpenBSD securelevel manual](https://man.openbsd.org/securelevel).

### Could not get I/O privileges

Error message: `ERROR: Could not get I/O privileges (Function not implemented)`

If you get this while running `flashprog -p internal -w filename.rom` (or any
internal flash operation), note that flashprog heavily uses ioperm/iopl
functions to operate the internal flasher, at least on x86 machines.

You need to enable `CONFIG_X86_IOPL_IOPERM` in your Linux kernel (see [this LWN
article](https://lwn.net/Articles/804143/)). This is a *build-time* option, so
you must [re-compile your
kernel](https://www.cyberciti.biz/tips/compiling-linux-kernel-26.html), or find
a build that has this option enabled (IOPL emulation). Many default kernel
configurations now disable this option.

**BSD users:** On OpenBSD and NetBSD if you get similar errors, note that it
should work here, but you need to boot with `kern.securelevel=-1`.
See: [NetBSD securelevel manual](https://wiki.netbsd.org/tutorials/kernel_secure_levels/)
and [OpenBSD securelevel manpage](https://man.openbsd.org/securelevel).

Otherwise, if you get such errors, it may just be that you're not root. You
must run flashprog as root, at least to use the internal flasher (using external
USB flashing dongles doesn't normally require root).

BSD kernels seem to still enable IOPL by default. However, many modern
Linux setups disable it by default these days, so it may be in the future
that most users will start needing to compile their own kernels.
