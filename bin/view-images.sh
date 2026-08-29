#!/usr/bin/env bash
# View all PipDeck screenshots in floating image viewer (imv / xdg-open)

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." >/dev/null 2>&1 && pwd)"
cd "$DIR"

if command -v imv &>/dev/null; then
    echo "Opening screenshots with imv (Use Left/Right arrows or Space to flip)..."
    imv assets/screenshots/*.webp &
elif command -v xdg-open &>/dev/null; then
    xdg-open gallery.html &
else
    echo "Screenshots located in: $DIR/assets/screenshots/"
fi
