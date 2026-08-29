#!/bin/sh
# Toggle PipDeck Theme
SETTINGS_FILE="/mnt/us/koreader/settings.reader.lua"
if [ -f "$SETTINGS_FILE" ]; then
    if grep -q '\["pipdeck_theme"\] = "dark"' "$SETTINGS_FILE"; then
        sed -i 's/\["pipdeck_theme"\] = "dark"/\["pipdeck_theme"\] = "light"/' "$SETTINGS_FILE"
    else
        sed -i 's/\["pipdeck_theme"\] = "light"/\["pipdeck_theme"\] = "dark"/' "$SETTINGS_FILE" 2>/dev/null || echo '["pipdeck_theme"] = "dark",' >> "$SETTINGS_FILE"
    fi
fi
