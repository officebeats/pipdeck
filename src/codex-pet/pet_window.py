#!/usr/bin/env python3
import os
import sys

# Prevent NVIDIA Wayland WebKit DMA-BUF crash
os.environ["WEBKIT_DISABLE_DMABUF_RENDERER"] = "1"

import gi
gi.require_version('Gtk', '3.0')
gi.require_version('WebKit2', '4.1')
from gi.repository import Gtk, Gdk, WebKit2

PORT = 8790
PET_URL = f"http://localhost:{PORT}/pet"

class CodexPetWindow:
    def __init__(self):
        self.window = Gtk.Window(type=Gtk.WindowType.TOPLEVEL)
        self.window.set_title("Pip: Codex Mascot Pet")
        self.window.set_default_size(52, 88)
        self.window.set_decorated(False)
        self.window.set_app_paintable(True)
        self.window.set_keep_above(True)
        self.window.set_role("pip-codex-mascot-pet")

        screen = self.window.get_screen()
        visual = screen.get_rgba_visual()
        if visual:
            self.window.set_visual(visual)

        css = Gtk.CssProvider()
        css.load_from_data(b"""
        window, .background, frame, decoration {
            background-color: rgba(0, 0, 0, 0);
            background-image: none;
        }
        """)
        Gtk.StyleContext.add_provider_for_screen(
            screen, css, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        )

        self.webview = WebKit2.WebView()
        transparent_bg = Gdk.RGBA(0, 0, 0, 0)
        self.webview.set_background_color(transparent_bg)

        self.window.add_events(Gdk.EventMask.BUTTON_PRESS_MASK)
        self.window.connect("button-press-event", self.on_button_press)
        self.window.connect("destroy", Gtk.main_quit)

        self.webview.load_uri(PET_URL)
        self.window.add(self.webview)
        self.window.show_all()

    def on_button_press(self, widget, event):
        if event.button == 1:
            self.window.begin_move_drag(event.button, int(event.x_root), int(event.y_root), event.time)

def main():
    CodexPetWindow()
    Gtk.main()

if __name__ == "__main__":
    main()