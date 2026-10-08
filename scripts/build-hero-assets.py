#!/usr/bin/env python3
"""Build the seamless-looping hero clip, portrait still and OG image.

Usage:
  python3 scripts/build-hero-assets.py path/to/intro.mp4
  python3 scripts/build-hero-assets.py intro.mp4 --crop 528:660:376:30   # w:h:x:y, skips detection

Needs: ffmpeg (with libx264, libvpx-vp9, libopus, libwebp) and numpy.
Writes: public/hero/hero.mp4, public/hero/hero.webm, public/hero/poster.webp, public/portrait-bust.webp, public/og.jpg
"""
import argparse, subprocess, sys, tempfile, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT_HERO = ROOT / "public" / "hero"
OUT_PUB = ROOT / "public"
CLIP_SECONDS = 10.0   # use about the first 10 s
XFADE = 0.5           # loop cross-fade length (s)
FPS = 24
OUT_W, OUT_H = 768, 960   # hero aspect 768/960
WHITEN = "colorlevels=rimax=0.98:gimax=0.98:bimax=0.98"


def run(cmd):
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode:
        sys.exit(f"ffmpeg failed:\n{' '.join(map(str, cmd))}\n{r.stderr.decode()[-1500:]}")
    return r.stdout


def probe(src):
    out = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
               "stream=width,height", "-of", "csv=p=0:s=x", str(src)]).decode().strip()
    w, h = map(int, out.split("x"))
    return w, h


def grab(src, t, w, h):
    raw = run(["ffmpeg", "-v", "error", "-ss", str(t), "-i", str(src), "-frames:v", "1",
               "-f", "rawvideo", "-pix_fmt", "rgb24", "-"])
    return np.frombuffer(raw, np.uint8).reshape(h, w, 3).astype(np.int16)


def detect_crop(src, w, h):
    """Bounding box of everything that differs from the (near white) backdrop,
    unioned over several frames, padded and fitted to the hero aspect ratio, centred."""
    boxes = []
    for t in (0.5, 2.5, 4.5, 6.5, 8.5):
        f = grab(src, t, w, h)
        bg = np.median(f[: h // 10, :, :].reshape(-1, 3), axis=0)
        diff = np.abs(f - bg).sum(axis=2)
        # ignore bottom-right corner (generator watermark) and soft floor shadow
        diff[int(h * 0.78):, int(w * 0.8):] = 0
        ys, xs = np.where(diff > 90)
        if len(xs) > 500:
            boxes.append((np.percentile(xs, 0.5), np.percentile(xs, 99.5),
                          np.percentile(ys, 0.2), np.percentile(ys, 99.8)))
    if not boxes:
        sys.exit("Could not detect a person. Pass --crop w:h:x:y")
    x0 = min(b[0] for b in boxes); x1 = max(b[1] for b in boxes)
    y0 = min(b[2] for b in boxes); y1 = max(b[3] for b in boxes)
    cx = (x0 + x1) / 2
    ch = (y1 - y0) * 1.06                      # head-to-toe plus a little air
    cw = ch * OUT_W / OUT_H
    if cw < (x1 - x0) * 1.15:                  # arms wide? widen, keep aspect
        cw = (x1 - x0) * 1.15; ch = cw * OUT_H / OUT_W
    ch = min(ch, h); cw = ch * OUT_W / OUT_H
    cy = (y0 + y1) / 2
    x = int(round(min(max(cx - cw / 2, 0), w - cw))); y = int(round(min(max(cy - ch / 2, 0), h - ch)))
    return int(cw) // 2 * 2, int(ch) // 2 * 2, x, y


def audio_loop(src, wav_out):
    """Sample-accurate numpy cross-fade of the audio so it loops without a click."""
    with tempfile.TemporaryDirectory() as td:
        raw = Path(td) / "a.wav"
        run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-t", str(CLIP_SECONDS), "-vn",
             "-ac", "2", "-ar", "48000", "-c:a", "pcm_s16le", str(raw)])
        with wave.open(str(raw)) as wf:
            sr, ch = wf.getframerate(), wf.getnchannels()
            a = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).reshape(-1, ch).astype(np.float64)
    n_x = int(XFADE * sr)
    main = a[n_x:].copy()                       # clip[X:D]
    head = a[:n_x]                              # clip[0:X]
    tail = main[-n_x:]
    t = np.linspace(0, np.pi / 2, n_x)[:, None]  # equal-power curve
    main[-n_x:] = tail * np.cos(t) + head * np.sin(t)
    main = np.clip(main, -32768, 32767).astype(np.int16)
    with wave.open(str(wav_out), "wb") as wf:
        wf.setnchannels(ch); wf.setsampwidth(2); wf.setframerate(sr); wf.writeframes(main.tobytes())
    return len(main) / sr


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("--crop", help="w:h:x:y")
    ap.add_argument("--portrait-time", type=float, default=5.0, help="second of the frame used for the portrait")
    ap.add_argument("--head-offset", type=float, default=0.057, help="head centre vs crop centre, as a fraction of crop width")
    ap.add_argument("--photo", help="optional front-facing photo for the portrait still")
    args = ap.parse_args()
    src = Path(args.src)
    w, h = probe(src)
    cw, chh, cx, cy = map(int, args.crop.split(":")) if args.crop else detect_crop(src, w, h)
    print(f"source {w}x{h}  crop {cw}x{chh} at x={cx} y={cy}")
    OUT_HERO.mkdir(parents=True, exist_ok=True)
    base = f"crop={cw}:{chh}:{cx}:{cy},scale={OUT_W}:{OUT_H}:flags=lanczos,{WHITEN},fps={FPS},format=yuv420p"
    L = CLIP_SECONDS - XFADE

    with tempfile.TemporaryDirectory() as td:
        wav = Path(td) / "loop.wav"
        dur = audio_loop(src, wav)
        print(f"loop length {dur:.3f}s")
        fc = (f"[0:v]trim=0:{CLIP_SECONDS},setpts=PTS-STARTPTS,{base},split[v1][v2];"
              f"[v1]trim=start={XFADE},setpts=PTS-STARTPTS[a];"
              f"[v2]trim=0:{XFADE},setpts=PTS-STARTPTS[b];"
              f"[a][b]xfade=transition=fade:duration={XFADE}:offset={L - XFADE}[v]")
        common = ["ffmpeg", "-v", "error", "-y", "-i", str(src), "-i", str(wav),
                  "-filter_complex", fc, "-map", "[v]", "-map", "1:a", "-t", f"{L}"]
        run(common + ["-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p",
                      "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", str(OUT_HERO / "hero.mp4")])
        run(common + ["-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1",
                      "-c:a", "libopus", "-b:a", "80k", str(OUT_HERO / "hero.webm")])

    # ---- portrait still: head-to-shirt, 480x600 ----
    if args.photo:
        run(["ffmpeg", "-v", "error", "-y", "-i", args.photo, "-vf",
             "scale=480:600:force_original_aspect_ratio=increase,crop=480:600",
             str(OUT_PUB / "portrait-bust.webp")])
    else:
        # a calm frame (arms down, head upright). Override with --portrait-time.
        best_t = args.portrait_time
        bw = int(cw * 0.54); bh = int(bw * 1.25)             # head to shirt
        bx = cx + cw // 2 + int(cw * args.head_offset) - bw // 2; by = cy + int(chh * 0.01)
        run(["ffmpeg", "-v", "error", "-y", "-ss", str(best_t), "-i", str(src), "-frames:v", "1",
             "-vf", f"crop={bw}:{bh}:{bx}:{by},scale=480:600:flags=lanczos,{WHITEN}",
             str(OUT_PUB / "portrait-bust.webp")])
    # ---- OG image 1200x630 ----
    run(["ffmpeg", "-v", "error", "-y", "-ss", "5", "-i", str(src), "-frames:v", "1", "-vf",
         f"crop={cw}:{chh}:{cx}:{cy},scale=-2:630:flags=lanczos,{WHITEN},pad=1200:630:(ow-iw)/2:0:color=white",
         "-q:v", "3", str(OUT_PUB / "og.jpg")])
    run(["ffmpeg", "-v", "error", "-y", "-i", str(OUT_HERO / "hero.mp4"), "-frames:v", "1", "-q:v", "70", str(OUT_HERO / "poster.webp")])
    print("done")


if __name__ == "__main__":
    main()
