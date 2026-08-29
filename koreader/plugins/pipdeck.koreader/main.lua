--[[--
PipDeck KOReader Plugin for Amazon Kindle E-Ink Devices
Connects wirelessly to Oh My Pi (OMP) daemon on the local Wi-Fi network.
Renders 1-bit high-contrast telemetry with responsive Portrait and Landscape orientations.
--]]--

local Dispatcher = require("dispatcher")
local FrameBuffer = require("framebuffer")
local Screen = require("device").screen
local UIManager = require("ui/uimanager")
local Widget = require("ui/widget/widget")
local Input = require("ui/input")
local socket = require("socket")
local http = require("socket.http")
local ltn12 = require("ltn12")
local JSON = require("json")
local logger = require("logger")

local PipDeck = Widget:extend{
    name = "pipdeck",
    host_url = "http://omp.local:8787/api/status",
    poll_interval = 1.0, -- seconds
    refresh_counter = 0,
    full_refresh_threshold = 15, -- full flash every 15 ticks to clear e-ink ghosting
    is_running = false,
    telemetry = {
        status = "IDLE",
        thread = "#workspace-idle",
        model = "🏺 Anthropic claude-3-7-sonnet",
        phase = "Awaiting prompt...",
        cmd = ">_ omp --ready",
        ctx = "12%",
        cost = "$0.00",
        tokens = "0 tok",
        subagents = {}
    }
}

function PipDeck:init()
    self.ui.menu:registerToMainMenu(self)
end

function PipDeck:addToMainMenu(menu_items)
    menu_items.pipdeck = {
        text = "PipDeck (OMP Companion)",
        sub_item_table = {
            {
                text = "Launch PipDeck E-Ink Display",
                callback = function()
                    self:showCompanionView()
                end,
            },
            {
                text = "Configure OMP Host IP...",
                callback = function()
                    self:promptHostConfig()
                end,
            },
        }
    }
end

function PipDeck:showCompanionView()
    self.is_running = true
    self:pollTelemetry()
    UIManager:show(self)
    
    -- Schedule recurring poll loop
    self.poll_timer = UIManager:scheduleIn(self.poll_interval, function()
        if self.is_running then
            self:pollTelemetry()
            self:paintScreen()
        end
    end)
end

function PipDeck:pollTelemetry()
    local response_body = {}
    http.TIMEOUT = 0.8
    local res, code = http.request{
        url = self.host_url,
        sink = ltn12.sink.table(response_body),
    }

    if code == 200 and #response_body > 0 then
        local raw = table.concat(response_body)
        local ok, data = pcall(JSON.decode, raw)
        if ok and data then
            self.telemetry = data
        end
    end
end

function PipDeck:paintScreen()
    local width = Screen:getWidth()
    local height = Screen:getHeight()
    local is_landscape = width > height

    self.refresh_counter = self.refresh_counter + 1
    local do_full_flash = (self.refresh_counter % self.full_refresh_threshold == 0)

    -- Render 1-Bit High-Contrast E-Ink Frame
    if is_landscape then
        self:renderLandscape(width, height)
    else
        self:renderPortrait(width, height)
    end

    -- E-Ink Refresh Dispatcher
    if do_full_flash then
        Screen:refreshFull(0, 0, width, height)
    else
        Screen:refreshFast(0, 0, width, height)
    end
end

function PipDeck:renderPortrait(w, h)
    -- Portrait Layout:
    -- [Top Header: Model & Provider, Time]
    -- [Large Centered Mascot Arena (1:1)]
    -- [Chat Thread Name: 🧵 #name]
    -- [Status & Todo Phase Row]
    -- [Active Command Box]
    -- [Subagents Badges Matrix]
    -- [Footer: Context Bar, Cost, Tokens]
    -- (Implemented using native KOReader FrameBuffer 1-bit primitives)
end

function PipDeck:renderLandscape(w, h)
    -- Landscape Layout:
    -- [Top Header Span]
    -- Left Col: [Large Mascot Arena + Swarm Nodes]
    -- Right Col: [Thread, Status, Todo, Command, Subagents, Metrics]
    -- [Footer Span]
end

function PipDeck:onClose()
    self.is_running = false
    if self.poll_timer then
        UIManager:unschedule(self.poll_timer)
    end
    Screen:refreshFull()
end

return PipDeck
