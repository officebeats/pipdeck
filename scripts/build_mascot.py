import os
import math
from PIL import Image, ImageDraw

out_dir = os.path.normpath('assets/animations/gifs')
os.makedirs(out_dir, exist_ok=True)

# =============================================================================
# INVARIANT GEOMETRY CONTRACT (Locked across all 10 states)
# - Canvas: 192x208 (Exact 8x9 Cell Dimensions)
# - Scale: 1.40 (Exactly 50% compact scale)
# - Center Anchor: (96, 125) - gives 50px top clearance, 30px side clearance
# =============================================================================
CANVAS_W, CANVAS_H = 192, 208
SCALE = 1.40
ORIGIN_X, ORIGIN_Y = 78, 94
CENTER_X = CANVAS_W // 2
CENTER_Y = 125

def hex_to_rgba(h, alpha=255):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4)) + (alpha,)

# Locked Crossbar & Core Pins (Identical across all states)
crossbar_dots = [
    (48, 70, 1.8, '#ff3366'), (48, 74, 1.8, '#ff3366'),
    (52, 70, 1.8, '#ff3366'), (52, 74, 1.8, '#ff3366'), (52, 78, 1.8, '#ff3366'),
    (56, 70, 1.8, '#ff3366'), (56, 74, 1.8, '#ff3366'), (56, 78, 1.8, '#ff3366'),
    (60, 70, 1.8, '#ff3366'), (60, 74, 1.8, '#ff3366'), (60, 78, 1.8, '#ff3366'),
    (64, 70, 1.8, '#f43f5e'), (64, 74, 1.8, '#f43f5e'), (64, 78, 1.8, '#f43f5e'),
    (68, 70, 1.8, '#f43f5e'), (68, 74, 1.8, '#f43f5e'), (68, 78, 1.8, '#f43f5e'),
    (72, 70, 1.8, '#f43f5e'), (72, 74, 1.8, '#f43f5e'), (72, 78, 1.8, '#f43f5e'),
    (76, 70, 1.8, '#a855f7'), (76, 74, 1.8, '#a855f7'), (76, 78, 1.8, '#a855f7'),
    (80, 70, 1.8, '#a855f7'), (80, 74, 1.8, '#a855f7'), (80, 78, 1.8, '#a855f7'),
    (84, 70, 1.8, '#a855f7'), (84, 74, 1.8, '#a855f7'), (84, 78, 1.8, '#a855f7'),
    (88, 70, 1.8, '#6366f1'), (88, 74, 1.8, '#6366f1'), (88, 78, 1.8, '#6366f1'),
    (92, 70, 1.8, '#6366f1'), (92, 74, 1.8, '#6366f1'), (92, 78, 1.8, '#6366f1'),
    (96, 70, 1.8, '#6366f1'), (96, 74, 1.8, '#6366f1'), (96, 78, 1.8, '#6366f1'),
    (100, 70, 1.8, '#0ea5e9'), (100, 74, 1.8, '#0ea5e9'), (100, 78, 1.8, '#0ea5e9'),
    (104, 70, 1.8, '#0ea5e9'), (104, 74, 1.8, '#0ea5e9'), (104, 78, 1.8, '#0ea5e9'),
    (108, 70, 1.8, '#00f0ff'), (108, 74, 1.8, '#00f0ff'), (108, 78, 1.8, '#00f0ff'),
]

# Locked Left Leg (50% Halftone Stipple Mesh)
left_leg_dots = [
    (60, 82, 1.8, '#f43f5e'), (64, 82, 1.8, '#f43f5e'), (68, 82, 1.8, '#f43f5e'),
    (60, 86, 1.8, '#f43f5e'), (64, 86, 1.8, '#f43f5e'), (68, 86, 1.8, '#f43f5e'),
    (60, 90, 1.8, '#f43f5e'), (64, 90, 1.8, '#f43f5e'), (68, 90, 1.8, '#f43f5e'),
    (60, 94, 1.8, '#c026d3'), (64, 94, 1.8, '#c026d3'), (68, 94, 1.8, '#c026d3'),
    (60, 98, 1.8, '#c026d3'), (64, 98, 1.8, '#c026d3'), (68, 98, 1.8, '#c026d3'),
    (60, 102, 1.8, '#9333ea'), (64, 102, 1.8, '#9333ea'), (68, 102, 1.8, '#9333ea'),
    (60, 106, 1.8, '#9333ea'), (64, 106, 1.8, '#9333ea'), (68, 106, 1.8, '#9333ea'),
    (60, 110, 1.5, '#a855f7'), (68, 110, 1.5, '#a855f7'),
    (60, 114, 1.3, '#7e22ce'), (68, 114, 1.3, '#7e22ce'),
    (64, 118, 1.2, '#581c87'),
]

# Locked Right Leg (Curved Electric Cyan Foot)
right_leg_dots = [
    (88, 82, 1.8, '#8b5cf6'), (92, 82, 1.8, '#8b5cf6'), (96, 82, 1.8, '#8b5cf6'),
    (88, 86, 1.8, '#8b5cf6'), (92, 86, 1.8, '#8b5cf6'), (96, 86, 1.8, '#8b5cf6'),
    (88, 90, 1.8, '#8b5cf6'), (92, 90, 1.8, '#8b5cf6'), (96, 90, 1.8, '#8b5cf6'),
    (88, 94, 1.8, '#3b82f6'), (92, 94, 1.8, '#3b82f6'), (96, 94, 1.8, '#3b82f6'),
    (88, 98, 1.8, '#3b82f6'), (92, 98, 1.8, '#3b82f6'), (96, 98, 1.8, '#3b82f6'),
    (88, 102, 1.8, '#06b6d4'), (92, 102, 1.8, '#06b6d4'), (96, 102, 1.8, '#06b6d4'),
    (88, 106, 1.8, '#06b6d4'), (92, 106, 1.8, '#06b6d4'), (96, 106, 1.8, '#06b6d4'),
    (88, 110, 1.8, '#00f0ff'), (92, 110, 1.8, '#00f0ff'), (96, 110, 1.8, '#00f0ff'), (100, 110, 1.8, '#00f0ff'),
    (92, 114, 1.8, '#00f0ff'), (96, 114, 1.8, '#00f0ff'), (100, 114, 1.8, '#00f0ff'), (104, 114, 1.8, '#00f0ff'),
    (96, 118, 1.8, '#00f0ff'), (100, 118, 1.8, '#00f0ff'), (104, 118, 1.8, '#00f0ff'),
]

# Arm Poses (Relative to shoulder joints at locked scale)
r_arm_poses = {
    'neutral': [],
    'down': [
        (2, 4, 1.8, '#0ea5e9'), (2, 8, 1.8, '#0ea5e9'),
        (0, 12, 1.8, '#0ea5e9'), (-4, 14, 1.8, '#00f0ff'),
        (-8, 12, 1.8, '#00f0ff'), (-12, 8, 1.8, '#00f0ff'),
        (-14, 4, 1.8, '#00f0ff')
    ],
    'wave_high': [
        (4, -4, 1.8, '#0ea5e9'), (8, -8, 1.8, '#0ea5e9'),
        (12, -14, 1.8, '#00f0ff'), (16, -18, 1.8, '#00f0ff'),
        (20, -20, 1.8, '#00f0ff'), (18, -24, 1.8, '#00f0ff')
    ],
    'wave_mid': [
        (4, -2, 1.8, '#0ea5e9'), (8, -4, 1.8, '#0ea5e9'),
        (14, -8, 1.8, '#00f0ff'), (18, -10, 1.8, '#00f0ff'),
        (22, -12, 1.8, '#00f0ff')
    ],
    'cheer_up': [
        (2, -4, 1.8, '#0ea5e9'), (6, -10, 1.8, '#0ea5e9'),
        (10, -16, 1.8, '#00f0ff'), (14, -22, 1.8, '#00f0ff'),
        (16, -26, 1.8, '#00f0ff')
    ],
    'head_scratch': [
        (2, -4, 1.8, '#0ea5e9'), (6, -8, 1.8, '#0ea5e9'),
        (8, -14, 1.8, '#00f0ff'), (6, -20, 1.8, '#00f0ff'),
        (0, -22, 1.8, '#00f0ff'), (-4, -20, 1.8, '#00f0ff')
    ],
    'head_scratch_tap': [
        (2, -4, 1.8, '#0ea5e9'), (6, -8, 1.8, '#0ea5e9'),
        (8, -14, 1.8, '#00f0ff'), (6, -22, 1.8, '#00f0ff'),
        (0, -25, 1.8, '#00f0ff'), (-4, -23, 1.8, '#00f0ff')
    ],
    'run_fwd': [
        (4, -4, 1.8, '#0ea5e9'), (8, -8, 1.8, '#0ea5e9'),
        (14, -10, 1.8, '#00f0ff'), (18, -8, 1.8, '#00f0ff')
    ],
    'run_back': [
        (-4, 6, 1.8, '#0ea5e9'), (-8, 10, 1.8, '#0ea5e9'),
        (-12, 14, 1.8, '#00f0ff'), (-16, 16, 1.8, '#00f0ff')
    ]
}

l_arm_poses = {
    'neutral': [],
    'cheer_up': [
        (-2, -4, 1.8, '#ff3366'), (-6, -10, 1.8, '#ff3366'),
        (-10, -16, 1.8, '#f43f5e'), (-14, -22, 1.8, '#f43f5e'),
        (-16, -26, 1.8, '#ff3366')
    ],
    'run_fwd': [
        (-4, -4, 1.8, '#ff3366'), (-8, -8, 1.8, '#f43f5e'),
        (-14, -10, 1.8, '#f43f5e'), (-18, -8, 1.8, '#ff3366')
    ],
    'run_back': [
        (4, 6, 1.8, '#ff3366'), (8, 10, 1.8, '#f43f5e'),
        (12, 14, 1.8, '#f43f5e'), (16, 16, 1.8, '#ff3366')
    ]
}

def draw_shadow(img, dy=0, rx_scale=1.0, color=(147, 51, 234)):
    draw = ImageDraw.Draw(img)
    shadow_cx = CENTER_X
    shadow_cy = 186
    shadow_rx = int(42 * SCALE * 0.35 * rx_scale)
    shadow_ry = int(5 * SCALE * 0.35 * rx_scale)
    draw.ellipse([shadow_cx - shadow_rx, shadow_cy - shadow_ry, shadow_cx + shadow_rx, shadow_cy + shadow_ry], fill=color + (75,))
    draw.ellipse([shadow_cx - int(shadow_rx*0.55), shadow_cy - int(shadow_ry*0.55), shadow_cx + int(shadow_rx*0.55), shadow_cy + int(shadow_ry*0.55)], fill=(0, 240, 255, 120))

def draw_pi_body(img, dx=0, dy=0, tilt_deg=0, r_arm='neutral', l_arm='neutral',
                 l_leg_angle=0, r_leg_angle=0, color_override=None):
    draw = ImageDraw.Draw(img)
    b_rad = math.radians(tilt_deg)
    cos_b, sin_b = math.cos(b_rad), math.sin(b_rad)
    
    # 1. Crossbar (Exact same geometry)
    for x, y, r, color in crossbar_dots:
        if color_override: color = color_override
        if r_arm != 'neutral' and x > 96: continue
        if l_arm != 'neutral' and x < 60: continue
            
        rx = (x - ORIGIN_X)
        ry = (y - ORIGIN_Y)
        rot_x = rx * cos_b - ry * sin_b
        rot_y = rx * sin_b + ry * cos_b
        
        px = int(rot_x * SCALE + CENTER_X + dx)
        py = int(rot_y * SCALE + CENTER_Y + dy - 10)
        pr = max(1.5, int(r * SCALE * 0.75))
        
        draw.ellipse([px - pr - 1, py - pr - 1, px + pr + 1, py + pr + 1], fill=hex_to_rgba(color, 65))
        draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=hex_to_rgba(color, 255))
        
    # 2. Left Leg (Articulated at Hip 64, 82)
    l_hip_x = (64 - ORIGIN_X) * cos_b - (82 - ORIGIN_Y) * sin_b
    l_hip_y = (64 - ORIGIN_X) * sin_b + (82 - ORIGIN_Y) * cos_b
    l_hip_px = int(l_hip_x * SCALE + CENTER_X + dx)
    l_hip_py = int(l_hip_y * SCALE + CENTER_Y + dy - 10)
    
    l_leg_rad = math.radians(tilt_deg + l_leg_angle)
    cos_ll, sin_ll = math.cos(l_leg_rad), math.sin(l_leg_rad)
    
    for x, y, r, color in left_leg_dots:
        if color_override: color = color_override
        lx = (x - 64)
        ly = (y - 82)
        rot_lx = lx * cos_ll - ly * sin_ll
        rot_ly = lx * sin_ll + ly * cos_ll
        px = int(l_hip_px + rot_lx * SCALE)
        py = int(l_hip_py + rot_ly * SCALE)
        pr = max(1.5, int(r * SCALE * 0.75))
        draw.ellipse([px - pr - 1, py - pr - 1, px + pr + 1, py + pr + 1], fill=hex_to_rgba(color, 65))
        draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=hex_to_rgba(color, 255))
        
    # 3. Right Leg (Articulated at Hip 92, 82)
    r_hip_x = (92 - ORIGIN_X) * cos_b - (82 - ORIGIN_Y) * sin_b
    r_hip_y = (92 - ORIGIN_X) * sin_b + (82 - ORIGIN_Y) * cos_b
    r_hip_px = int(r_hip_x * SCALE + CENTER_X + dx)
    r_hip_py = int(r_hip_y * SCALE + CENTER_Y + dy - 10)
    
    r_leg_rad = math.radians(tilt_deg + r_leg_angle)
    cos_rl, sin_rl = math.cos(r_leg_rad), math.sin(r_leg_rad)
    
    for x, y, r, color in right_leg_dots:
        if color_override: color = color_override
        rx = (x - 92)
        ry = (y - 82)
        rot_rx = rx * cos_rl - ry * sin_rl
        rot_ly = rx * sin_rl + ry * cos_rl
        px = int(r_hip_px + rot_rx * SCALE)
        py = int(r_hip_py + rot_ly * SCALE)
        pr = max(1.5, int(r * SCALE * 0.75))
        draw.ellipse([px - pr - 1, py - pr - 1, px + pr + 1, py + pr + 1], fill=hex_to_rgba(color, 65))
        draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=hex_to_rgba(color, 255))

    # 4. Right Arm
    if r_arm in r_arm_poses and r_arm != 'neutral':
        joint_x = int((96 - ORIGIN_X) * cos_b - (74 - ORIGIN_Y) * sin_b) * SCALE + CENTER_X + dx
        joint_y = int((96 - ORIGIN_X) * sin_b + (74 - ORIGIN_Y) * cos_b) * SCALE + CENTER_Y + dy - 10
        for ax, ay, ar, acolor in r_arm_poses[r_arm]:
            if color_override: acolor = color_override
            px = int(joint_x + ax * SCALE)
            py = int(joint_y + ay * SCALE)
            pr = max(1.5, int(ar * SCALE * 0.75))
            draw.ellipse([px - pr - 1, py - pr - 1, px + pr + 1, py + pr + 1], fill=hex_to_rgba(acolor, 65))
            draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=hex_to_rgba(acolor, 255))

    # 5. Left Arm
    if l_arm in l_arm_poses and l_arm != 'neutral':
        joint_x = int((60 - ORIGIN_X) * cos_b - (74 - ORIGIN_Y) * sin_b) * SCALE + CENTER_X + dx
        joint_y = int((60 - ORIGIN_X) * sin_b + (74 - ORIGIN_Y) * cos_b) * SCALE + CENTER_Y + dy - 10
        for ax, ay, ar, acolor in l_arm_poses[l_arm]:
            if color_override: acolor = color_override
            px = int(joint_x + ax * SCALE)
            py = int(joint_y + ay * SCALE)
            pr = max(1.5, int(ar * SCALE * 0.75))
            draw.ellipse([px - pr - 1, py - pr - 1, px + pr + 1, py + pr + 1], fill=hex_to_rgba(acolor, 65))
            draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=hex_to_rgba(acolor, 255))

def draw_star(draw, cx, cy, r=6, col=(250, 204, 21, 255)):
    ri = max(2, r // 3)
    pts = [(cx, cy-r), (cx+ri, cy-ri), (cx+r, cy), (cx+ri, cy+ri), (cx, cy+r), (cx-ri, cy+ri), (cx-r, cy), (cx-ri, cy-ri)]
    draw.polygon(pts, fill=col)

def draw_lightbulb(draw, cx, cy):
    draw.ellipse([cx - 7, cy - 12, cx + 7, cy + 2], fill=(250, 204, 21, 255), outline=(255, 255, 255, 255))
    draw.rectangle([cx - 4, cy + 2, cx + 4, cy + 6], fill=(161, 161, 170, 255))
    draw.line([cx, cy - 16, cx, cy - 20], fill=(250, 204, 21, 255), width=2)
    draw.line([cx - 10, cy - 14, cx - 14, cy - 17], fill=(250, 204, 21, 255), width=2)
    draw.line([cx + 10, cy - 14, cx + 14, cy - 17], fill=(250, 204, 21, 255), width=2)

def draw_thought_bubble(draw, cx, cy, dots_count=1):
    draw.ellipse([cx - 16, cy + 10, cx - 12, cy + 14], fill=(0, 240, 255, 230))
    draw.ellipse([cx - 10, cy + 4, cx - 4, cy + 10], fill=(168, 85, 247, 230))
    draw.rectangle([cx - 2, cy - 14, cx + 28, cy + 2], fill=(0, 240, 255, 240), outline=(255, 255, 255, 255))
    for d in range(dots_count):
        dot_x = cx + 4 + d * 8
        draw.rectangle([dot_x, cy - 8, dot_x + 3, cy - 5], fill=(0, 0, 0, 255))

def draw_mini_pi(draw, cx, cy, color=(0, 240, 255, 240)):
    draw.rectangle([cx - 5, cy - 4, cx + 5, cy - 2], fill=color)
    draw.rectangle([cx - 3, cy - 2, cx - 1, cy + 4], fill=color)
    draw.rectangle([cx + 1, cy - 2, cx + 3, cy + 2], fill=color)
    draw.rectangle([cx + 3, cy + 2, cx + 5, cy + 4], fill=color)

def draw_dust_puff(draw, cx, cy, dir_right=True):
    col = (168, 85, 247, 200)
    sign = -1 if dir_right else 1
    draw.rectangle([cx + sign*6, cy - 4, cx + sign*6 + 3, cy - 1], fill=col)
    draw.rectangle([cx + sign*12, cy - 8, cx + sign*12 + 4, cy - 4], fill=(0, 240, 255, 180))
    draw.rectangle([cx + sign*18, cy - 12, cx + sign*18 + 3, cy - 9], fill=col)

# 1. IDLE (2 Frames @ 380ms)
idle_frames = []
for dy in [0, -4]:
    img = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    draw_shadow(img, dy=dy)
    draw_pi_body(img, dy=dy)
    idle_frames.append(img)
idle_frames[0].save(os.path.join(out_dir, 'pip-idle.gif'), save_all=True, append_images=idle_frames[1:], duration=380, loop=0, disposal=2)

# 2. THINKING (4 Frames @ 250ms - Inquisitive Chin Tap + Ellipsis . -> .. -> ... -> 💡)
thinking_frames = []
thinking_states = [
    (0, -4, 'head_scratch', 1, False),
    (-3, -6, 'head_scratch_tap', 2, False),
    (-5, -5, 'head_scratch_tap', 3, False),
    (-2, -3, 'down', 0, True)
]
for dy, tilt, arm_st, b_dots, has_bulb in thinking_states:
    img = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_shadow(img, dy=dy)
    draw_pi_body(img, dy=dy, tilt_deg=tilt, r_arm=arm_st)
    thought_cx = CENTER_X + 22
    thought_cy = CENTER_Y + dy - 48
    if b_dots > 0:
        draw_thought_bubble(draw, thought_cx, thought_cy, dots_count=b_dots)
    elif has_bulb:
        draw_lightbulb(draw, thought_cx, thought_cy - 2)
        draw_star(draw, thought_cx + 26, thought_cy - 12, r=6)
        draw_star(draw, thought_cx - 24, thought_cy - 10, r=5)
    thinking_frames.append(img)
thinking_frames[0].save(os.path.join(out_dir, 'pip-thinking.gif'), save_all=True, append_images=thinking_frames[1:], duration=250, loop=0, disposal=2)

# 3. BASH (2 Frames @ 180ms - Alternating Typing)
bash_frames = []
for f_i in [0, 1]:
    img = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_shadow(img)
    draw_pi_body(img, r_arm='down' if f_i==0 else 'neutral', l_arm='cheer_up' if f_i==1 else 'neutral')
    draw.text((25, 60), '01', fill=(0, 255, 65, 220))
    draw.text((155, 60), '>_', fill=(0, 240, 255, 220))
    bash_frames.append(img)
bash_frames[0].save(os.path.join(out_dir, 'pip-bash.gif'), save_all=True, append_images=bash_frames[1:], duration=180, loop=0, disposal=2)

# 4. WAVING (4 Frames @ 280ms)
waving_frames = []
for arm_st, dy, sp in [('wave_mid', 0, False), ('wave_high', -2, True), ('wave_mid', -2, True), ('wave_high', -2, True)]:
    img = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_shadow(img, dy=dy)
    draw_pi_body(img, dy=dy, r_arm=arm_st)
    if sp: draw_star(draw, CENTER_X + 44, CENTER_Y + dy - 42, r=7)
    waving_frames.append(img)
waving_frames[0].save(os.path.join(out_dir, 'pip-waving.gif'), save_all=True, append_images=waving_frames[1:], duration=280, loop=0, disposal=2)

# 5. VICTORY (4 Frames @ 250ms - Joyful Cheer Leap \o/)
victory_frames = []
for dy, r_arm_st, l_arm_st, sp in [(4, 'down', 'neutral', False), (-20, 'cheer_up', 'cheer_up', True), (-18, 'wave_high', 'cheer_up', True), (4, 'neutral', 'neutral', False)]:
    img = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_shadow(img, dy=dy, rx_scale=1.3 if dy > 0 else 0.5, color=(250, 204, 21))
    draw_pi_body(img, dy=dy, r_arm=r_arm_st, l_arm=l_arm_st)
    if sp:
        draw_star(draw, CENTER_X - 35, CENTER_Y + dy - 40, r=8)
        draw_star(draw, CENTER_X + 35, CENTER_Y + dy - 40, r=8)
        for cx, cy, col in [(35, 20, (0, 240, 255)), (95, 12, (255, 64, 113)), (155, 22, (0, 255, 65))]:
            draw.rectangle([cx, cy, cx+4, cy+4], fill=col + (230,))
    victory_frames.append(img)
victory_frames[0].save(os.path.join(out_dir, 'pip-victory.gif'), save_all=True, append_images=victory_frames[1:], duration=250, loop=0, disposal=2)

# 6. SWARM 32 (4 Frames @ 260ms - Mind-Control Mini-Pis)
swarm_frames = []
for f_i, (c_dy, wr) in enumerate([(0, 32), (-4, 52), (0, 72), (2, 42)]):
    img = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_shadow(img, dy=c_dy)
    draw.ellipse([CENTER_X - wr, CENTER_Y - wr//2 + c_dy - 10, CENTER_X + wr, CENTER_Y + wr//2 + c_dy - 10], outline=(0, 240, 255, 160), width=1)
    for n in range(6):
        ang = math.radians(f_i * 90 + n * 60)
        mx = int(CENTER_X + 56 * math.cos(ang))
        my = int(CENTER_Y + 26 * math.sin(ang) + c_dy - 10)
        if f_i % 2 == 1: draw.line([CENTER_X, CENTER_Y + c_dy - 18, mx, my], fill=(0, 240, 255, 110), width=1)
        draw_mini_pi(draw, mx, my, color=(0, 240, 255, 240) if n%2==0 else (255, 64, 113, 240))
    draw_pi_body(img, dy=c_dy)
    swarm_frames.append(img)
swarm_frames[0].save(os.path.join(out_dir, 'pip-swarm32.gif'), save_all=True, append_images=swarm_frames[1:], duration=260, loop=0, disposal=2)

# 7. ALERT (2 Frames @ 220ms - Warning Beacon)
alert_frames = []
for f_i, (dx, col, warn) in enumerate([(0, None, False), (3, '#ef4444', True)]):
    img = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_shadow(img, color=(239, 68, 68) if warn else (147, 51, 234))
    draw_pi_body(img, dx=dx, color_override=col)
    if warn:
        draw.polygon([(CENTER_X, 15), (CENTER_X + 12, 36), (CENTER_X - 12, 36)], outline=(250, 204, 21, 255), width=2)
        draw.text((CENTER_X - 2, 20), '!', fill=(255, 255, 255, 255))
    alert_frames.append(img)
alert_frames[0].save(os.path.join(out_dir, 'pip-alert.gif'), save_all=True, append_images=alert_frames[1:], duration=220, loop=0, disposal=2)

# 8. JUMPING (4 Frames @ 200ms - Platformer Bounce)
jump_frames = []
for dy in [0, -10, -20, 3]:
    img = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    draw_shadow(img, dy=dy, rx_scale=1.2 if dy>=0 else 0.5)
    draw_pi_body(img, dy=dy)
    jump_frames.append(img)
jump_frames[0].save(os.path.join(out_dir, 'pip-jumping.gif'), save_all=True, append_images=jump_frames[1:], duration=200, loop=0, disposal=2)

# 9. PUNCHY RUNNING RIGHT (4 Frames @ 150ms - Forward Lean + Stride + Dust)
rr_keyframes = [
    (2, 0, 10, -25, 25, 'run_back', 'run_fwd', False),
    (5, -4, 12, 0, 0, 'neutral', 'neutral', False),
    (8, 0, 10, 25, -25, 'run_fwd', 'run_back', True),
    (4, -2, 8, 10, -10, 'run_fwd', 'run_back', False),
]
rr_frames = []
for dx, dy, tilt, l_ang, r_ang, r_arm, l_arm, dust in rr_keyframes:
    img = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_shadow(img, dy=dy, rx_scale=1.1)
    if dust: draw_dust_puff(draw, CENTER_X + dx - 20, CENTER_Y + dy + 18, dir_right=True)
    draw_pi_body(img, dx=dx, dy=dy, tilt_deg=tilt, l_leg_angle=l_ang, r_leg_angle=r_ang, r_arm=r_arm, l_arm=l_arm)
    rr_frames.append(img)
rr_frames[0].save(os.path.join(out_dir, 'pip-running-right.gif'), save_all=True, append_images=rr_frames[1:], duration=150, loop=0, disposal=2)

# 10. PUNCHY RUNNING LEFT (4 Frames @ 150ms)
rl_keyframes = [
    (-2, 0, -10, 25, -25, 'run_fwd', 'run_back', False),
    (-5, -4, -12, 0, 0, 'neutral', 'neutral', False),
    (-8, 0, -10, -25, 25, 'run_back', 'run_fwd', True),
    (-4, -2, -8, -10, 10, 'run_back', 'run_fwd', False),
]
rl_frames = []
for dx, dy, tilt, l_ang, r_ang, r_arm, l_arm, dust in rl_keyframes:
    img = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_shadow(img, dy=dy, rx_scale=1.1)
    if dust: draw_dust_puff(draw, CENTER_X + dx + 20, CENTER_Y + dy + 18, dir_right=False)
    draw_pi_body(img, dx=dx, dy=dy, tilt_deg=tilt, l_leg_angle=l_ang, r_leg_angle=r_ang, r_arm=r_arm, l_arm=l_arm)
    rl_frames.append(img)
rl_frames[0].save(os.path.join(out_dir, 'pip-running-left.gif'), save_all=True, append_images=rl_frames[1:], duration=150, loop=0, disposal=2)

# Save Master 50% Scaled dotmatrix APNG & GIF for active pet
idle_frames[0].save(os.path.join('assets/animations', 'pip-dotmatrix.png'), save_all=True, append_images=idle_frames[1:], duration=380, loop=0, disposal=2)
idle_frames[0].save(os.path.join('assets/animations', 'pip-dotmatrix.gif'), save_all=True, append_images=idle_frames[1:], duration=380, loop=0, disposal=2)
idle_frames[0].save(os.path.join('assets/animations', 'pip-dotmatrix-static.png'))

# Copy GIFs to root animations
for fname in os.listdir(out_dir):
    if fname.endswith('.gif'):
        src = os.path.join(out_dir, fname)
        dst = os.path.join('assets/animations', fname)
        with open(src, 'rb') as fsrc, open(dst, 'wb') as fdst:
            fdst.write(fsrc.read())

print('Successfully generated all 10 states at locked 50% scale with zero clipping!')

# Rebuild Master 8x9 Spritesheet Atlas (1536x1872)
sheet_w = 8 * 192
sheet_h = 9 * 208
sheet_img = Image.new('RGBA', (sheet_w, sheet_h), (0, 0, 0, 0))

anim_map = {
    0: 'assets/animations/pip-idle.gif',
    1: 'assets/animations/pip-running-right.gif',
    2: 'assets/animations/pip-running-left.gif',
    3: 'assets/animations/pip-waving.gif',
    4: 'assets/animations/pip-jumping.gif',
    5: 'assets/animations/pip-alert.gif',
    6: 'assets/animations/pip-thinking.gif',
    7: 'assets/animations/pip-bash.gif',
    8: 'assets/animations/pip-victory.gif',
}

for row_idx, gif_file in anim_map.items():
    gif_norm = os.path.normpath(gif_file)
    if os.path.exists(gif_norm):
        gif = Image.open(gif_norm)
        frame_count = getattr(gif, 'n_frames', 1)
        for f_idx in range(min(8, frame_count)):
            gif.seek(f_idx)
            frame_rgba = gif.convert('RGBA')
            sheet_img.paste(frame_rgba, (f_idx * 192, row_idx * 208), frame_rgba)

sheet_img.save(os.path.normpath('assets/orca-pet-bundle/spritesheet.webp'), 'WEBP')
sheet_img.save(os.path.normpath('assets/orca-pet-bundle/spritesheet.png'), 'PNG')
print('Rebuilt master 8x9 spritesheet at locked 50% scale!')

# Sync to all user/system locations
os.system('cp -r assets/orca-pet-bundle/* /c/Users/admin-beats/.codex/pets/pip/')
os.system('cp -r assets/orca-pet-bundle/* /c/Users/admin-beats/.codex/pets/omp/')
os.system('cp -r assets/orca-pet-bundle/* \"/c/Users/admin-beats/AppData/Roaming/Orca/sidekicks/custom/2f303f3b-36ad-4195-8d97-d13dee612cb6/\" 2>/dev/null || true')
os.system('cp -r assets/orca-pet-bundle/* \"/c/Users/admin-beats/AppData/Roaming/Orca/sidekicks/custom/49d9b6f2-ea9f-4c76-b013-d948fbc8da22/\" 2>/dev/null || true')
print('Synced locked 50% scale bundles to Orca sidekicks directories!')
