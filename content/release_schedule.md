---
title: Release Schedule
toc: true
---

## Release cycle

| Month   | Release type      |
| -       | -                 |
| April   | Testing release 1 |
| June    | Stable release 1  |
| October | Testing release 2 |
| June    | Stable release 2  |

## Revisions

Each release can have any number of revisions, where tarballs are re-generated
and re-uploaded, replacing old ones.

In revisions to testing releases, any number of improvements can be made,
including massive updating of upstream code revisions. Testing releases will
stop receiving new revisions about 3&ndash;4 weeks before the corresponding
stable release.

Stable release revisions must not fundamentally alter the substance of a given
stable release. Revisions only include critical bug fixes and special additions
deemed desirable and safe.

## Reasoning

In the past, a problem Libreboot has had was that we'd do testing releases, but
not do revisions on them; then by the time a stable release came around, some
upstream revisions would be about 4-6 months out of date (typically).

With this new formalised structure, we can be as close to upstream as possible
by the time of each stable release, for each given upstream e.g. coreboot.

This release schedule will also provide greater opportunity for coverage of
Libreboot releases, since people know then what to expect and what dates to put
in their calendars.

## Version numbers

Versions are of form `Libreboot YY.MM`.

For example, the April 2025 release shall be Libreboot 25.04.

### Y2.1k compliance

If Libreboot still exists in the year 2100, then those releases will be e.g.
Libreboot 100.04 for April 2100 release.

## Release codenames

Each release comes with a codename consisting of two alliterative words.

## Credits

[Britney Lozza](https://janethemotherfucker.github.io/) was the one who suggested
to me that I use this new release number and codename scheme, and I previously
came up with the plan to use an April/June and October/December testing/stable
release schedule.
