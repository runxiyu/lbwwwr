---
title: Download Libreboot
toc: true
---

<!-- TODO: Safety warning should be a shortcode -->

## GPG signing keys

Libreboot releases are signed with [GnuPG](https://www.gnupg.org). Newest keys go first.

| First release | Fingerprint                                                                      |
| -             | -                                                                                |
| 20241206      | [`8BB1 F7D2 8CF7 696D BF4F 7192 5C65 4067 D383 B1FF`](/keys/20241206.asc) |
| 20160907      | [`98CC DDF8 E560 47F4 75C0 44BD D0C6 2464 FA8B 4856`](/keys/20160907.asc) |
| 20160818      | [`CDC9 CAE3 2CB4 B7FC 84FD C804 969A 9795 05E8 C5B2`](/keys/20160818.asc) |

## Development versions

The rest of this page lists release version. If you want to run bleeding edge
versions (usually for development), please refer to the [contributing
guide](../contributing/).

## HTTPS mirrors

These mirrors are recommended, since they use TLS encryption via HTTPS.

| Location                    | URL                                                          |
| -                           | -                                                            |
| Princeton University, USA   | <https://mirror.math.princeton.edu/pub/libreboot/>           |
| shapovalov.website, Ukraine | <https://mirror.shapovalov.website/libreboot/>               |
| University of Kent, UK      | <https://www.mirrorservice.org/sites/libreboot.org/release/> |
| MIT, USA                    | <https://mirrors.mit.edu/libreboot/>                         |
| koddos.net, Netherlands     | <https://mirror.koddos.net/libreboot/>                       |
| koddos.net, Hong Kong       | <https://mirror-hk.koddos.net/libreboot/>                    |
| cyberbits.eu, France        | <https://mirror.cyberbits.eu/libreboot/>                     |

## rsync mirrors

| Location                    | URL                                                      |
| -                           | -                                                        |
| University of Kent, UK      | <rsync://rsync.mirrorservice.org/libreboot.org/release/> |
| Princeton university, USA   | <rsync://mirror.math.princeton.edu/pub/libreboot/>       |
| shapovalov.website, Ukraine | <rsync://rsync.shapovalov.website/libreboot/>            |
| linux.ro, Romania           | <rsync://ftp.linux.ro/libreboot/>                        |
| koddos.net, Netherlands     | <rsync://mirror.koddos.net/libreboot/>                   |
| koddos.net, Hong Kong       | <rsync://mirror-hk.koddos.net/libreboot/>                |

## Creating your own rsync mirror

<!-- TODO: Use a details shortcode -->

Useful for mirroring Libreboot's entire set of release archives. You can put
an rsync command into crontab and pull the files into a directory on your
web server.

If you are going to mirror the entire set, it is recommended that you allocate
at least 25GiB. Libreboot's rsync is currently about 12GiB, so allocating 25GiB
will afford you plenty of space for the future. At minimum, you should ensure
that at least 15-20GiB of space is available, for your Libreboot mirror.

*It is highly recommended that you use the libreboot.org mirror*, if you wish
to host an official mirror. Otherwise, if you simply want to create your own
local mirror, you should use one of the other mirrors, which sync from
libreboot.org.

Before you create the mirror, make a directory on your web server. For 
example:

	mkdir /var/www/html/libreboot/

Now you can run rsync, for instance:

	rsync -avz --delete-after rsync://rsync.libreboot.org/mirrormirror/ /var/www/html/libreboot/

You might put this in an hourly crontab. For example:

	crontab -e

Then in crontab, add this line and save/exit (hourly crontab):

	0 * * * * rsync -avz --delete-after rsync://rsync.libreboot.org/mirrormirror/ /var/www/html/libreboot/

The ending slash in rsync paths are significant.

Note: `rsync.libreboot.org` is not directly accessible by the public, except
those whose IPs are whitelisted. For bandwidth reasons, the firewall running on
libreboot.org blocks incoming rsync requests, except by specific IPs. If you
wish to run an rsync mirror, sync from one of the third party mirrors above and
set up your mirror. You can then contact Leah Rowe, to have your IP addresses
whitelisted for rsync usage &mdash; if the IP addresses match DNS A/AAAA
records for your rsync host, this can be used. A script runs in an hourly
crontab on libreboot.org, that fetches the A/AAAA records of whitelisted rsync
mirrors, automatically adding rules permitting them to get through the
firewall.

If you wish to regularly keep your rsync mirror updated, you can add it to a
[crontab](https://man7.org/linux/man-pages/man5/crontab.5.html).
