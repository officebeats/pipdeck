#!/bin/sh
# PipDeck KUAL Launcher for Jailbroken Amazon Kindle Devices
# Triggers KOReader with PipDeck Companion or launches native framebuffer renderer

if [ -f /mnt/us/koreader/koreader.sh ]; then
    /mnt/us/koreader/koreader.sh --action=PipDeckLaunch &
elif [ -f /mnt/us/extensions/koreader/koreader.sh ]; then
    /mnt/us/extensions/koreader/koreader.sh --action=PipDeckLaunch &
else
    # Fallback to browser pointing to local daemon or GitHub Pages
    lipc-set-prop com.lab126.appmgrd start app://com.lab126.browser?http://omp.local:8787
fi
