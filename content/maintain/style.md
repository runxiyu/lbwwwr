---
title: lbmk coding style and design
---

For context, please also read the main [lbmk maintenance manual](../).

You should *read* the logic in lbmk yourself, to really know what is meant by
some of the concepts explained here. This article will no doubt be incomplete,
and several practises may persist in spite of it; nonetheless, this article
shall serve as a reference for lbmk development.

## Plain POSIX sh

We do not allow the use of Bashism.

Please read the [POSIX introduction to shell
scripting](https://pubs.opengroup.org/onlinepubs/009604499/utilities/xcu_chap02.html)
and [Ghost in the Shell](https://vermaden.wordpress.com/ghost-in-the-shell/).

## Principles

Keep most board-specific things in `config/`. The logic in the scripts should
be as simple as possible.

## No Makefiles

We have Makefiles in some C programs, under `util/`, and projects that we import
may use Makefiles, but lbmk itself does not contain any Makefiles. Instead, we
do everything in shell scripts.

This approach has certain drawbacks, but for the most part it ensures that the
code is more readable.

## Coding style

We generally follow [OpenBSD kernel style](https://man.openbsd.org/style.9). It
was designed for C but we hereby adapt it for shell scripts too.

We prefer this style because it is extremely readable and forces you to write
better code.

## main on top

<!-- TODO: This section is probably outdated as there are no longer multiple
scripts -->

In every lbmk script, it is our intention that there be a `main()` function.
All logic should be inside a function, and `main()` should be the function that
executes first; at the bottom of each script, insert this line:

	main $@

This will execute `main()`, passing any arguments (from the user's shell) to it.

## Top-down logic

*Every* function should be *below* the calling function. Therefore, if multiple
functions call a given function, that function should be below the final one
that called it.

## Example

```
#!/usr/bin/env sh

. "include/lib.sh"

main()
{
	foo
	bar
	do_something_else
}

foo()
{
	printf "I'm a function that does stuff.\n"
	bar || $err "foo: an error occurred"
	do_something_else
}

bar()
{
	printf "I'm another function that does stuff.\n"
	some_other_command || printf "WARNING: bar: something something" 1>&2
}

do_something_else()
{
	complicated_function bla bla bla || \
	    $err "do_something_else: something happened that wasn't nice"
}

complicated_function()
{
	printf "I'm a complicated function, provided as helper"
	printf " function for do_something_else()\n"

	do_some_complicated_stuff || return 1
}

main $@
```

PWD is always root of lbmk
--------------------------

In any script executed by lbmk, under `script/`, the work directory is relative
to the main `lbmk` script. In other words, all scripts under `script/` also
assume this.

This is actually one of the reasons for that design, as also alluded to in
the main [lbmk maintenance manual](index).

main should only be a simple skeleton
-------------------------------------

The `main()` function should not implement much logic itself. Each script in
lbmk is its own program. The `main()` function should contain the overall
structure of the entire logic, with subfunctions providing actual functionality.

Subfunctions can then have their own subfunctions, declared below themselves, in
this top-down style. For example, a function that builds SeaBIOS payloads might
be below a function that builds ROM images with SeaBIOS payloads inside them,
when building coreboot ROM images.

One task, one script
====================

Not literally *one task*, but one theme, one *kind* of overall task. For
example, `script/build/roms` builds final ROM images of coreboot,
containing payloads; that same script does not also build cross compilers or
tell you the current weather forecast. This is an analog of the Unix design
philosophy which says: write one program that does one thing well, and then
another program that does another thing very well; programs communicate with
each other via the universal method, namely text.

Error handling
==============

Where feasible, a script should do:

	set -e -u

If `-e` isn't feasible, perhaps try just `-u` - if neither is feasible, then
that is OK. Judge it case by case.

However, neither of these should be relied upon exclusively. When a script runs
*any* kind of command that could return with error status, that error status
must be handled.

The general rule is to call `err()`, which is provided in lbmk by
the file `include/lib.sh`. This is inspired by the way `err()` is called in
BSD programs (from `err.h`, a non-standard BSD libc extension).

Where a script must perform certain cleanup before exiting, the script should
implement its own `fail()` function that performs cleanup, and then
calls `err()`. The `err()` function takes a string as argument, which will be
printed to the screen.

If `$err` is being called from `main()`, just write the error message. However,
if it's being called from another function, you should write the function name.
For example:

	$err "function_name: this shit doesn't work. fix it."

Do not directly exit
--------------------

Please try to use `err` for all error exits.

The main `lbmk` script has its own exit function, for handling zero or non-zero
exits. Zero means success, and non-zero means error.

A script should either return zero status, or call `err()`.

An individual function may, in some cases, return 1 or 0 itself, which would
then be handled accordingly by the calling function.

How to handle errors
--------------------

There are some instances where errors should be *ignored*, in which case you
might do:

	command || :

The `||` means: if `command` exits with non-zero (error) status, do this, and
then after the `||` is what to do: similarly, `&&` instead would mean: if the
command succeeded, then do this.

Never mix `&&` and `||`

If/else blocks
==============

Keep these simple, and where possible, maybe don't use them at all! For
example:

```
if [ "${var}" = "foo" ]; then
	do_something
fi
```

You might instead do:

```
[ "${var}" != "foo" ] || \
	do_something
```

or

```
[ "${var}" = "foo" ] && \
	do something
```

Warnings
--------

In C, the `stderr` file is 2 as represented by `int fd` style. In shell scripts,
it's the same: 1 for standard output, 2 for errors/warnings. The `err` function
in lbmk writes to 2 (stderr).

If you want to output something that is a warning, or otherwise an error that
should not yield an exit, you should do something like this:

	printf "function_name: this is dodgy stuff. fix it maybe?\n" 1>&2

Avoid passing arguments excessively
===================================

In functions, use of arguments passed to them can be useful, but in general,
they should be avoided; use global variables when feasible.

Do not exceed 80 characters per line
====================================

See: RFC 3676

Excessively long code lines are really annoying to read.

Use tab-based indentation
=========================

A new line should begin with tab indentation, in a function.

Multi-line commands
-------------------

Use \\ at the end, as you would, but use *four spaces* to indent on the
follow-up line. For example:

```
function_name()
{
	really stupidly long command that may also return error state || \
	    $err "function_name: you fucked up. try again."
}
```

Use printf!
===========

Don't use `echo` unless there's some compelling reason to do so.

The `printf` functionality is more standard, across various sh implementations.

env
===

Don't do:

	#!/bin/sh

Do:

	#!/usr/bin/env sh

This is more portable, between various Unix systems.

Be portable!
============

In addition to not using bashisms, commands that lbmk uses must also
be portable; where possible, third party projects should be tweaked.

This is actually something that is currently lacking or otherwise untested
in Libreboot; it's currently assumed that only Linux (specifically GNU+Linux)
will work, because many of the projects that Libreboot makes use of will use
bashisms, or other GNUisms (e.g. GNU-specific C extensions or GNU Make specific
behaviour in Makefiles).

Work+testing is sorely needed, in this area. It would be nice if Libreboot
could be built on BSD systems, for example.

Do as little as possible
========================

Don't over-engineer anything. Write as simply as you can, to perform a single
task. This is basically the same as what has been written elsewhere, but it's
re-stated this way to illustrate a point:

Libreboot's build system is designed to be as efficient as possible. It
intentionally *avoids* implementing many things that are unnecessary for the
user. The purpose of Libreboot is to provide coreboot ROM images as efficiently
as possible, with desirable configurations that users want. Do that in as few
steps as possible, in the most streamlined way possible, while still providing
a degree of configurability - this is the mentality behind lbmk design.
