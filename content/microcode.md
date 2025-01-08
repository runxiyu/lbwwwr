---
title: Microcode
---

Microcode updates configure logic gates in your CPU that implement the
instruction set architecture. These updates fix CPU bugs, including
vulnerabilities. The CPU already has non-libre microcode burned into the ROM
anyway, so it's a choice between *broken x86* and *x86*. Libreboot provides
both images with and without microcode.

Removal of microcode updates will affect system stability in a negative way,
introducing non-standard broken behaviour and it may result in the machine
being unable to boot properly. In other cases, doing so may break features such
as S3 suspend/resume.

- [Video about reverse engineering microcode](https://yewtu.be/watch?v=W3FbTMqYi4U)
- [Another video about reverse engineering microcode](https://yewtu.be/watch?v=I6dQfnb3y0I)
- [Git repo for that project](https://github.com/RUB-SysSec/Microcode)


## But I really want to remove microcode!

On most boards:
```
cbfstool filename.rom remove -n cpu_microcode_blob.bin
```

On ASUS KFSN4-DRE, KCMA-D8 and KGPE-D16 boards, do this instead:

```
cbfstool filename.rom remove -n microcode_amd.bin
cbfstool filename.rom remove -n microcode_amd_fam15h.bin
```

## Non-microcode images

Releases after Libreboot 20230423 provide separate ROMs with microcode
excluded, alongside default ones with microcode included.
