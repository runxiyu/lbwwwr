---
title: Dell Latitude thermal throttling
x-toc-enable: true
---

On some Dell Latitude laptops, you may encounter random shutdowns on
heavy load. We believe this is because the SMSC EC is overly conservative
by default; it is in charge of handling thermals and fan control on this
machine. Our theory is that coreboot needs to write certain EC commands
to allow higher temperatures; see [issue 202](https://codeberg.org/libreboot/lbmk/issues/202).

Basically, what you need to do is:

* Use high quality thermal paste (don't use the same dried up paste that the
  laptop came with, if you bought it on ebay for example). Arctic MX-6 is good.
* Check that the fan works reliably

Also: the [`intel_pstate`](https://www.kernel.org/doc/html/v4.12/admin-guide/pm/intel_pstate.html) driver can be used to artificially cap CPU speed. See:

When you use this machine, it is recommended that you cap the CPU speed once
you've booted into Linux. Set it to something like 50% at first. Then run a
stress test, for example:

	stress -c x

Where `x` is the number of CPU cores, e.g. 2. Monitor the temperatures using
something like `xsensors`, making sure the CPU doesn't exceed 80c temperature.

You can also monitor CPU speeds in Linux like so:

	watch -n .2 grep MHz /proc/cpuinfo

This will let you know what speed you're at. You can use this to determine
whether the `intel_pstate` driver is working. How to cap speed to 50 percent, as
in the above example:

	echo 50 > /sys/devices/system/cpu/cpufreq/intel_pstate/max_perf_pct

Gradually increase the CPU speed (up to 100 on `max_perf_pct`), waiting a few
minutes each time. You should ensure that your machine does not exceed 80C.

Dell's thermal safety is far too protective by default, on some of these, and
we don't yet know how to properly configure it. Running a CPU below 80c in
temperature and never higher than that, is a good idea anyway, for the
long term life of your CPU.

Regardless, thermal shutdown is extremely reliable on this machine, but Dell
makes it shut down *earlier*, before it can even start to CPU throttle.
