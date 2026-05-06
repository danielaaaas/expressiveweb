# Isometric Room Kit Workflow

Use this process to create many rooms quickly without redrawing from zero.

## 1) Duplicate from kit

- Copy `elements/iso-room-kit.svg` to a room file, e.g. `elements/room-bathroom.svg`.
- Keep the shell angle exactly the same for all rooms.

## 2) Compose room with props

- Start with `#shell-square`.
- Move/add/remove prop symbols (`#prop-vanity`, `#prop-bathtub`, etc).
- Only tweak color values after layout is approved.

## 3) Add clickable hotspots

- In the final room SVG, add a hidden guide layer or explicit hotspot rects.
- In HTML/CSS/JS, map each hotspot to notebook content:
  - id/name
  - room id
  - message text

## 4) Keep exports consistent

- Same viewBox for all rooms.
- Same scale and angle.
- Avoid anti-aliased edges (keep crisp pixel edges).

## 5) Integration pattern

- Render room art in the diorama stage.
- Keep interactive UI (mirror input / buttons / steam) separate from art layer.
- Do not bake text input UI into room art.

## Suggested order for each new room

1. Geometry/silhouette approval
2. Furniture layout approval
3. Color pass
4. Detail pass
5. Hotspot wiring

## 6) Notebook shell SVGs (el primer hogar)

Shells live under `elements/room-shell*.svg` (viewBox `0 0 416 398` for the notebook `<object>`). `java/main.js` maps rooms in `notebookShellForRoom()`; anything not listed uses `room-shell-only.svg`.

| Room id(s) | Shell file |
|-------------|------------|
| `master-bedroom` (and legacy `bedroom-one`) | `room-shell-master-bedroom.svg` |
| `kitchen` | `room-shell-kitchen-fridge.svg` |
| `main-hallway`, `front-hallway`, `front-closet` | `room-shell-no-window.svg` |
| (default) | `room-shell-only.svg` |

**XML hygiene:** `<title>` / `<desc>` / text nodes must be valid XML (no raw control characters; use `&amp;` for `&`). CI runs `xmllint --noout` on every `elements/*.svg` when those files change.

Validate locally after editing:

```bash
find elements -name '*.svg' -print0 | xargs -0 -I{} xmllint --noout {}
```
