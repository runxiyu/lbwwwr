---
title: Apply for board maintainer/tester
---

This page is very new, and these guidelines/procedures will be revised over
time. We are, as of April 2023, formalising our testing / release engineering
procedures somewhat. The Libreboot project is *expanding* to support a lot
more hardware these days.

Libreboot strives to make Coreboot accessible for as many users as possible.
To accomplish this goal, we must add as many boards as possible.
As the total number of supported boards increases it becomes more and more difficult
for our main contributors to test every single release for every single supported board.
We therefore need the help of the community in testing releases before they are
distributed to users.

You do *not* need to be a developer in order to be a board maintainer.
All you need to do in order to become a board maintainer is:

+ Be contactable via email when new testing binaries are available
+ Have the correct equipment ready to externally flash your board
+ Have the board you wish to maintain

Once you become a board maintainer, your real name and screen name can
be added to the public list on the Libreboot contributors page.
You can, of course, choose to forego the public listing (we will ask for
permission, before publishing your name).

To apply for such a posting, email
Leah Rowe via [leah@libreboot.org](mailto:leah@libreboot.org)
Do not be afraid to apply to maintain a board with another listed
maintainer or multiple maintainers; more is better.

Please read the following sections to understand the specifics of
maintaining a board.

NOTE: If there are already testers for a given motherboard, *you* can still
provide testing for the same motherboard if that's what you have. The more the
merrier!

## Be Contactable

You should monitor whatever email you provide in your application.
There is no specific time-frame for how long it should take after
you receive the email until you report the status of your board.
You should make best efforts to respond within a few days.
If you are the *only* maintainer for your board then please take
into consideration that your input is especially vital.

## Have External Flashing Equipment

The roms you test will of course be untested.
To avoid having a bricked machine, you need to have external flashing
equipment available for your board to recover from a broken rom.

In most cases you can refer to the [SPI guide.](../install/spi.html)
In rarer cases -such as some ARM chromebooks- your board might be flashed in a different way.
Refer to [Coreboot's documentation](https://doc.coreboot.org/)
or ask on IRC if you are unsure.

## Testing Procedure

You will receive an email when roms are ready for testing.
The email will link to an open issue on our [current git hosting platform.](/git.html#lbmk-libreboot-make)

Whether you receive an email from a libreboot.org email
domain or one of our developer's email you should verify (for
your own security)
that the downloaded roms are signed with the [official key.](/download.html#gpg-signing-key)

When your testing is complete, comment on the issue linked in
the dispatch email as follows:

board: `your board`

status: `pass/fail`

note: [insert any notes if relevant]

For example, a board status comment might look like this:

    board: t440p_12mb
    status: fail
    note: GRUB throws error 'something_is_b0rked'
