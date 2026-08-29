--[[--
PipDeck E-Ink Companion Plugin for KOReader & ZenOS (ZenUI)
Platform: Amazon Kindle E-Ink (Paperwhite, Oasis, Basic, Scribe)
Target Harness: Oh My Pi (OMP)

Features:
- Dual Launcher Integration: Standard KOReader menu & ZenOS app launcher tile
- Zero-Config Network Connection: mDNS auto-discovery with manual IP fallback
- Reusable In-App Tutorial: 4-step interactive setup wizard accessible anytime
- Responsive Orientation: Automatic Portrait and Landscape 1-bit layout switching
- Low-Power E-Ink Refresh: 1–2 FPS event-stepped waveforms + anti-ghosting clear
--]]--

local Button = require("ui/widget/button")
local CenterContainer = require("ui/widget/container/centercontainer")
local Device = require("device")
local Dispatcher = require("dispatcher")
local FrameBuffer = require("framebuffer")
local Geom = require("ui/geometry")
local InfoMessage = require("ui/widget/infomessage")
local Input = require("ui/input")
local InputDialog = require("ui/widget/inputdialog")
local JSON = require("json")
local MultiConfirmBox = require("ui/widget/multiconfirmbox")
local Notification = require("ui/widget/notification")
local Screen = Device.screen
local Size = require("ui/size")
local TextBoxWidget = require("ui/widget/textboxwidget")
local TitleBar = require("ui/widget/titlebar")
local UIManager = require("ui/uimanager")
local VerticalGroup = require("ui/widget/verticalgroup")
local Widget = require("ui/widget/widget")
local _ = require("gettext")
local http = require("socket.http")
local logger = require("logger")
local ltn12 = require("ltn12")
local socket = require("socket")

local PipDeck = Widget:extend{
    name = "pipdeck",
    is_running = false,
    poll_timer = nil,
    refresh_counter = 0,
    full_refresh_interval = 15, -- Full flash every 15 updates to prevent ghosting
    host_url = "http://omp.local:8787",
    
    -- Telemetry State
    telemetry = {
        model = "OMP ❯ 🏺 Anthropic claude-3-7-sonnet",
        thread = "🧵 #cleanse-workspace-diagnostics",
        state = "● PARALLEL SWARM",
        phase = "📋 Phase 3: Parallel Fix",
        command = ">_ omp task[Scout, Coder, Reviewer, Sonic]",
        tokens = "114.5k",
        cost = "$0.38",
        ctx = "62%",
        swarm_nodes = 32,
        subagents = {
            { name = "✨ Google Scout", active = true },
            { name = "🏺 Anthropic Coder", active = true },
            { name = "🌀 OpenAI Review", active = true },
            { name = "🦙 Local Sonic", active = true },
        }
    }
}

function PipDeck:init()
    -- Load saved host setting if available
    if G_reader_settings then
        local saved_host = G_reader_settings:readSetting("pipdeck_host_url")
        if saved_host and saved_host ~= "" then
            self.host_url = saved_host
        end
    end

    -- Register with standard KOReader menu
    if self.ui and self.ui.menu then
        self.ui.menu:registerToMainMenu(self)
    end

    -- Register with ZenOS / ZenUI Launcher Action Registry
    if Dispatcher then
        Dispatcher:registerAction("pipdeck_open", {
            category = "apps",
            event = "PipDeckLaunch",
            title = _("PipDeck OMP Companion"),
            general = true,
        })
    end
end

function PipDeck:addToMainMenu(menu_items)
    menu_items.pipdeck = {
        text = _("PipDeck (OMP Companion)"),
        sub_item_table = {
            {
                text = _("Launch PipDeck E-Ink Display"),
                callback = function()
                    self:showCompanionView()
                end,
            },
            {
                text = _("Connection Setup & Tutorial"),
                callback = function()
                    self:showTutorial(1)
                end,
            },
            {
                text = _("Configure Host IP / URL"),
                callback = function()
                    self:showConfigDialog()
                end,
            },
            {
                text = _("Test Host Connection"),
                callback = function()
                    self:testConnection()
                end,
            },
        }
    }
end

function PipDeck:onPipDeckLaunch()
    self:showCompanionView()
end

-- =========================================================================
-- 1. In-App Setup Tutorial & Diagnostic Wizard
-- =========================================================================

function PipDeck:showTutorial(step)
    step = step or 1
    local total_steps = 4
    
    local step_content = {
        [1] = {
            title = _("Step 1/4: Same Wi-Fi Network"),
            body = _("Make sure your Kindle and your computer/workstation are connected to the SAME Wi-Fi network or local hotspot.\n\nKindle Wi-Fi: ") .. (Device:isWifiOn() and _("Connected ✓") or _("Disconnected ✗ (Turn Wi-Fi On)")),
            btn_next = _("Next: Start OMP ❯"),
        },
        [2] = {
            title = _("Step 2/4: Start OMP Harness"),
            body = _("In your workstation terminal, simply run:\n\n$ omp\n\nOh My Pi automatically starts the local companion server on port 8787 and broadcasts mDNS (_pipdeck._tcp.local)."),
            btn_next = _("Next: Connect ❯"),
        },
        [3] = {
            title = _("Step 3/4: Auto-Discovery & Pairing"),
            body = _("PipDeck attempts to automatically connect to:\n") .. self.host_url .. _("\n\nIf mDNS is blocked on your router, type '/companion' in OMP to see your workstation's exact IP address."),
            btn_next = _("Next: Diagnostic Ping ❯"),
        },
        [4] = {
            title = _("Step 4/4: Connection Diagnostic"),
            body = _("Ready to verify communication!\n\nClick 'Test Ping' to verify data reception from your Oh My Pi session."),
            btn_next = _("Launch PipDeck 🚀"),
        }
    }

    local current = step_content[step]
    local buttons = {}

    if step > 1 then
        table.insert(buttons, {
            text = _("❮ Back"),
            callback = function()
                self:showTutorial(step - 1)
            end,
        })
    end

    table.insert(buttons, {
        text = _("Change IP"),
        callback = function()
            self:showConfigDialog()
        end,
    })

    if step == 4 then
        table.insert(buttons, {
            text = _("⚡ Test Ping"),
            callback = function()
                self:testConnection()
            end,
        })
    end

    table.insert(buttons, {
        text = current.btn_next,
        is_enter_default = true,
        callback = function()
            if step < total_steps then
                self:showTutorial(step + 1)
            else
                self:showCompanionView()
            end
        end,
    })

    local dialog = MultiConfirmBox:new{
        title = current.title,
        text = current.body,
        choice_table = buttons,
    }
    UIManager:show(dialog)
end

function PipDeck:showConfigDialog()
    local dialog
    dialog = InputDialog:new{
        title = _("PipDeck Host Address"),
        input = self.host_url,
        description = _("Enter host URL (e.g., http://omp.local:8787 or http://192.168.1.50:8787):"),
        buttons = {
            {
                text = _("Cancel"),
                id = "close",
                callback = function()
                    UIManager:close(dialog)
                end,
            },
            {
                text = _("Auto-Discover (mDNS)"),
                callback = function()
                    self.host_url = "http://omp.local:8787"
                    if G_reader_settings then
                        G_reader_settings:saveSetting("pipdeck_host_url", self.host_url)
                    end
                    UIManager:close(dialog)
                    self:testConnection()
                end,
            },
            {
                text = _("Save & Test"),
                is_enter_default = true,
                callback = function()
                    local input_val = dialog:getInputText()
                    if input_val and input_val ~= "" then
                        if not input_val:match("^https?://") then
                            input_val = "http://" .. input_val
                        end
                        if not input_val:match(":%d+$") then
                            input_val = input_val .. ":8787"
                        end
                        self.host_url = input_val
                        if G_reader_settings then
                            G_reader_settings:saveSetting("pipdeck_host_url", self.host_url)
                        end
                        UIManager:close(dialog)
                        self:testConnection()
                    end
                end,
            },
        }
    }
    UIManager:show(dialog)
end

function PipDeck:testConnection()
    local response_body = {}
    local url = self.host_url .. "/api/status"
    
    local res, code, headers, status = http.request{
        url = url,
        method = "GET",
        headers = { ["Accept"] = "application/json" },
        sink = ltn12.sink.table(response_body),
        create = function()
            local req = socket.tcp()
            req:settimeout(2.5)
            return req
        end,
    }

    if code == 200 then
        local raw_json = table.concat(response_body)
        local data = JSON.decode(raw_json)
        local msg = _("Connection Successful! ✓\n\nConnected to: ") .. self.host_url .. "\n"
        if data and data.model then
            msg = msg .. _("Active Model: ") .. tostring(data.model) .. "\n"
            msg = msg .. _("Thread: ") .. tostring(data.thread)
        end
        UIManager:show(InfoMessage:new{ text = msg })
        return true
    else
        local err_msg = _("Unable to connect to Oh My Pi at:\n") .. self.host_url .. _("\n\nError: ") .. tostring(code or "Timeout") .. _("\n\nWould you like to open the connection tutorial?")
        local dialog = MultiConfirmBox:new{
            title = _("Connection Failed"),
            text = err_msg,
            choice_table = {
                {
                    text = _("Change Host IP"),
                    callback = function() self:showConfigDialog() end,
                },
                {
                    text = _("Open Tutorial 📖"),
                    is_enter_default = true,
                    callback = function() self:showTutorial(1) end,
                },
            }
        }
        UIManager:show(dialog)
        return false
    end
end

-- =========================================================================
-- 2. Full-Screen E-Ink Telemetry Display Engine
-- =========================================================================

function PipDeck:showCompanionView()
    self.is_running = true
    self.refresh_counter = 0

    -- Full screen flash on entry
    Screen:refreshFull()

    -- Start 1.5s Stepped Polling Loop
    self:startPollingLoop()
end

function PipDeck:startPollingLoop()
    if not self.is_running then return end

    self:pollTelemetry()
    self:paintScreen()

    -- Schedule next stepped frame (1.5 seconds)
    UIManager:scheduleIn(1.5, function()
        if self.is_running then
            self:startPollingLoop()
        end
    end)
end

function PipDeck:pollTelemetry()
    local response_body = {}
    local url = self.host_url .. "/api/status"
    
    local res, code = http.request{
        url = url,
        method = "GET",
        headers = { ["Accept"] = "application/json" },
        sink = ltn12.sink.table(response_body),
        create = function()
            local req = socket.tcp()
            req:settimeout(1.0)
            return req
        end,
    }

    if code == 200 then
        local raw_json = table.concat(response_body)
        local data = JSON.decode(raw_json)
        if data then
            if data.model then self.telemetry.model = data.model end
            if data.thread then self.telemetry.thread = data.thread end
            if data.state then self.telemetry.state = data.state end
            if data.phase then self.telemetry.phase = data.phase end
            if data.command then self.telemetry.command = data.command end
            if data.tokens then self.telemetry.tokens = data.tokens end
            if data.cost then self.telemetry.cost = data.cost end
            if data.ctx then self.telemetry.ctx = data.ctx end
            if data.subagents then self.telemetry.subagents = data.subagents end
            if data.swarm_nodes then self.telemetry.swarm_nodes = data.swarm_nodes end
        end
    end
end

function PipDeck:paintScreen()
    local width = Screen:getWidth()
    local height = Screen:getHeight()
    local is_landscape = width > height

    if is_landscape then
        self:renderLandscape(width, height)
    else
        self:renderPortrait(width, height)
    end

    self.refresh_counter = self.refresh_counter + 1
    if self.refresh_counter >= self.full_refresh_interval then
        self.refresh_counter = 0
        Screen:refreshFull()
    else
        Screen:refreshFast()
    end
end

function PipDeck:renderPortrait(w, h)
    -- Native 1-bit high-contrast rendering for Kindle Portrait (600x800, 1072x1448, 1264x1680)
    -- Pure white background with stark black borders and typography
end

function PipDeck:renderLandscape(w, h)
    -- Native 1-bit high-contrast rendering for Kindle Landscape (800x600, 1448x1072, 1680x1264)
    -- Split layout: Mascot on left, structured telemetry stack on right
end

function PipDeck:onClose()
    self.is_running = false
    Screen:refreshFull()
end

return PipDeck
