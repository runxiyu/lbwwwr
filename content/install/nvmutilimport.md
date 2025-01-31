nvmutil assimilation
====================

Detailed revision history can be found in the Git repository; for code,
look at `lbmk.git` and for documentation, look at `lbwww.git`.

Assimilation by Libreboot
=========================

With no additional changes to nvmutil, the project became part of lbmk,
which is the Libreboot build system. Please refer to Libreboot's imported
version of the nvmutil documentation: [nvmutil.md](nvmutil)

This code and documentation import was performed on November 17th, 2022.

Future changes to nvmutil (in `lbmk.git`) shall be included in regular
Libreboot release announcements, under `news/`, so please be sure to
check that from now on.

For historical and reference purposes, the original nvmutil repository
shall be [preserved on notabug](https://notabug.org/osboot/nvmutil).

nvmutil 20221106
================

Very minor bugfix release:

* Pledge now changed to `stdio rpath` (instead of `stdio wpath`), only
  when the `dump` command is used. (pledge is only used on OpenBSD
  systems; an ifdef rule prevents its use on other systems)
* Documentation inaccuracies fixed (pertaining to nvmutil exit statuses)
* Documentation generally tidied up a bit

nvmutil 20221103
================

Not much has changed, as this just fixes minor bugs and behavioural
quirks seen in the previous release:

* Prototypes now fully declared, with variable names
* Fix implicit type conversion in readFromFile()
* Always exit with zero status if the file was successfully modified.
  Previously, nvmutil would exit non-zero if one of the parts was invalid,
  even if the other was OK (and successfully modified)
* Always exit with zero status when running dump, if at least one
  part contained a valid checksum and the file is of the correct size,
  fully readable. Previously, nvmutil would exit non-zero if one or both
  checksums was correct, but it now only does this if both are invalid

nvmutil 20220828
================

No new features have been added. This is a code cleanup and bugfix release.

* General code cleanup (e.g. simpler argument handling)
* Do not print errno 0 (fixes error when using the libc in OpenBSD)
* Improved errno handling
* Endianness portability re-implemented
* The `dump` command no longer warns about multicast MAC addresses
  (such a warning is unnecessary, and up to the user to prevent)
* The `setmac` command still prevents multicast MAC addresses being
  set, but no longer specifically warns about them (the documentation
  says not to use them already. No need to re-implement documentation
  in code)
* Bug fix: errno now set, when an invalid file size is detected. The
  previous nvmutil version would exit (no operation) when the file size
  was wrong, but it would return with zero status. It now returns with
  non-zero status
* The compiled binary size is still roughly the same as in the last
  release; the endianness checks increase the size, but other optimizations
  were made (e.g. cleaner argument handling). Tested with tcc on an x86\_64
  machine, where a 0.16% binary size increase was observed.

nvmutil 20220815
================

No new features have been added. This is a code cleanup and bugfix release.

* Further 7% reduction in binary size, compared to the previous release.
  This is tested with `tcc` in an x86\_64 machine. On my tests, `tcc`
  produces a 10540 byte binary in the previous release; in this release
  I got 9796 bytes.
* It should be noted that `nvmmac` from the older nvmutils is 9892 bytes
  compiled with `tcc` on my test system; that's with the help/version
  output text removed from nvmmac. *This* nvmutil release contains
  so many more features and safety checks than just that lone `nvmmac`
  utility, yet the `nvmutil` binary is 1% smaller in size! That's how
  efficient the `nvmutil` code is, and there is probably room for further
  improvement of code efficiency.
* Endianness portability code deleted; it was untested, and still is, so
  now nvmutil will detect the host endianness and exit, if the host is
  big endian (nearly all hosts these days are little endian, and it's
  very unlikely that you will use a big endian host).
  (the code will be properly tested and ported to big-endian hosts for the
  next release)
* The `status` variable is no longer used; instead, `errno` is used
  exclusively and extensively. Error handling is much simpler, and much
  more unixy as a result.
* Error messages are more terse
* Fix build issues with clang, from the previous release
* The `dump` command no longer states whether the MAC address is local
  or global; this can be easily done by yourself, and this change slightly
  reduces code bloat in nvmutil. The code still warns you if the MAC address
  is multicast

nvmutil 20220810
================

* 3.4% reduction in binary size (as tested with tcc on x86\_64),
  due to code optimizations, *while* adding new checks and new features.
* Random MAC address generation now takes multicast/unicast and
  local/global MAC addresses into account. The generator now *forces*
  local MAC addresses to be generated; the only way to set a global
  address is to set the corresponding nibble statically.
  Multicast and all-zero MAC addresses are *no longer permitted* in code.
* The `dump` command now warns when the address is multicast, if set by
  another tool or older nvmutil that way (it will also return non-zero
  status upon exit). In addition, it will say whether the address is
  locally or globally assigned.
* nvmutil now aborts when you try to open a directory
* Even more terse error/feedback messages than in the last release,
  while still being friendly and informative
* word/setWord now done in a more efficient, endian-specific way
  on x86\_64 platforms; if non-x86\_64, it falls back to the portable
  functions
* The code has been simplified in general, and tidied up compared to
  the previous release
* The `setmac` command can now be used without specifying a MAC address,
  which will cause the same behaviour as `setmac ??:??:??:??:??:??`

nvmutil 20220808
================

Released on 8 August 2022. Changes:

* Vastly reduced binary size (21% reduction); the source line
  count has reduced by roughly the same amount (slightly higher
  than 21%, because of the extra stuff compilers add).
  This is *with* new features and behaviours added; the code
  is just that much more efficient, and I've thoroughly audited it.
* OpenBSD `pledge(2)` now used, if available at build time
  (ifdef rule used, so it still compiles on Linux/FreeBSD)
* New feature: `setmac` is now able to set *random* MAC addresses.
  This is done by reading from `/dev/urandom`. It is done
  conditionally, per-nibble, as specified by the user. For example,
  you can specify `??:??:??:??:??:??` and every nibble will be
  random, or you could set some of them statically. For
  example: `00:1f:16:??:4?:?2`
* The `read()` and `pwrite()` functions are now used for reading
  and writing files; older nvmutil versions used fopen/fseek/ftell
  and so on. The read/write functions are POSIX, and enable
  more robust file handling.
* On `showmac` and `dump`, `O_RDONLY` is now set when
  executing `read()`. This means that these commands can now be
  used on read-only files.
* Makefile: `-Os` flag used, instead of `-O2`
* Error messages and feedback are much more user-friendly,
  and useful in general, while being much more terse.
* The returned status on exit is *much* stricter. For example,
  the `dump` command will always cause an `EXIT_FAILURE` status
  when at least *one* part in the NVM image has a bad checksum.
  When writing a new MAC address, it will *work* only on valid
  parts like before, but *now* nvmutil will return with `EXIT_FAILURE`
  if *one OR* both parts are bad; older nvmutil versions *always*
  returned `EXIT_SUCCESS` after modifying the file.
* The `help` and `version` commands have been removed; it is
  best to simply read the documentation. Programs should not
  include documentation inside themselves, but documentation should
  always be supplied separately, alongside that program. This
  change alone accounts for roughly 1/3 (33%) of the code size
  reduction; the other 2/3 of that reduction is due to increased
  code efficiency in general.

Regarding code size reduction
-----------------------------

My test setup is an x86\_64 machine with `tcc` used
as the compiler; the libc doesn't really matter, if
you use dynamic linking. Command:

	make CC=tcc

Observations (dynamic linking with libc files):

* 20220808: 10.67KB
* 20220802 (unmodified): 13.51KB
* 20220802 (help/version command removed): 12.56KB

SLOC (source lines of code):

* 20220808: 321 lines
* 20220802 (unmodified): 421 lines
* 20220802 (help/version command removed): 373 lines

These numbers were obtained using the [`sloccount` program
by David A. Wheeler](https://dwheeler.com/sloccount/).

This means that the actual reduction in compiled *logic* is
about 1.89KB, or a 15% reduction, in nvmutil 20220808. By *logic*,
I mean all code excluding the help function; this distinction is
important, because the help/version commands are unavailable in
nvmutil 20220808, but they were available in nvmutil 20220802.

Extra note: I also tested compressed sizes. With `tar` piped to `xz -9e`,
I saw: about 3KB if compiled with tcc, and 5KB using gcc. Clang
produces binaries of similar size, when compared with GCC.

Since the performance of nvmutil is largely disk-bound, I really
recommend compiling it with `tcc`, not GCC or Clang because the
binary sizes are much larger with those compilers, even with
optimization flags; despite this, the Makefile in nvmutil
assumes GCC/Clang and sets `CFLAGS` to `-Os`.

nvmutil 20220802
================

Released on 2 August 2022. Changes:

* Another major code cleanup
* More reliable argument handling
* Files now loaded *after* verifying arguments
* Files no longer written unless all checks pass
  (files were previously written unconditionally, even
  if no changes were made, wasting disk i/o)
* Makefile now explicitly declares CFLAGS
  (strictest flags possible, warnings treated as errors)
* More secure handling of strings; strnlen used instead
  of strlen, strncmp used instead of strcmp, number of
  characters limited
* New command added: show mac
  (show what mac addresses are stored in both parts)
* More human-friendly messages and help text
* help/version commands actually listed in help output

nvmutil 20220731
================

Released on 31 July 2022. Changes:

* Major code cleanup
* Most operations now abort, if being performed
  on invalid files.
* More robust error handling
* More user-friendly error messages
* The `malloc` function is no longer used

That's it. Bug fixes and safety features added. Enjoy!

nvmutil 20220728
================

Initial release. It is functionally equivalent to the
older `nvmutils`, developed for the osboot project. This
newer version is reduced to a single source file instead
of many, and builds as a single binary instead of many.
