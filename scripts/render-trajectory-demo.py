"""Render the Stage 1 shot/header demo without changing its source clips.

Dev-only dependencies: OpenCV, NumPy, Pillow, and FFmpeg on PATH.
Inputs are private local overlays; only the finished MP4/poster belong in public/.
The two freeze frames were visually selected just after contact, not inferred
from the candidate CSV (candidate timing and visible contact can differ).
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
import hashlib
import json
import math
from pathlib import Path
import shutil
import subprocess
import tempfile

import cv2
from PIL import Image, ImageDraw, ImageFont


WIDTH, HEIGHT, FPS = 1920, 1080, 25
BG, PANEL = (9, 21, 31), (17, 31, 43)
TEAL, WHITE, MUTED = (116, 214, 197), (235, 240, 245), (177, 189, 202)
VIDEO_BOX = (48, 174, 1376, 774)
ZOOM_BOX = (1488, 238, 384, 288)


@dataclass
class Scene:
    path: Path
    label: str
    crop: tuple[int, int, int, int]
    freeze_frame: int = 163
    slow_start: float = 2.6


class Source:
    def __init__(self, path: Path):
        self.capture = cv2.VideoCapture(str(path))
        self.fps = self.capture.get(cv2.CAP_PROP_FPS)
        self.count = int(self.capture.get(cv2.CAP_PROP_FRAME_COUNT))
        if not self.capture.isOpened() or not math.isfinite(self.fps) or self.fps <= 0 or self.count <= 0:
            raise ValueError(f"Cannot read video: {path}")
        self.index = -1
        self.image: Image.Image | None = None

    def at(self, frame: int) -> Image.Image:
        if frame < self.index:
            raise ValueError("Source frames must be read in chronological order")
        while self.index < frame:
            ok, pixels = self.capture.read()
            if not ok:
                raise ValueError(f"Decode failed at source frame {self.index + 1}")
            self.index += 1
            if self.index == frame:
                self.image = Image.fromarray(cv2.cvtColor(pixels, cv2.COLOR_BGR2RGB))
        if self.image is None:
            raise ValueError("No source frame")
        return self.image

    def close(self) -> None:
        self.capture.release()


def digest(path: Path) -> str:
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def render(args: argparse.Namespace) -> None:
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("FFmpeg must be on PATH")
    scenes = [
        Scene(args.shot.resolve(), "Shot", (470, 300, 950, 660)),
        Scene(args.header.resolve(), "Header", (430, 440, 910, 800)),
    ]
    hashes = {str(scene.path): digest(scene.path) for scene in scenes}
    if args.output.exists() and not args.overwrite:
        raise FileExistsError("Output exists; use --overwrite to rerender")
    fonts: dict[tuple[int, bool], ImageFont.FreeTypeFont] = {}

    def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
        key = (size, bold)
        if key not in fonts:
            fonts[key] = ImageFont.truetype(str(args.bold_font if bold else args.font), size)
        return fonts[key]

    def layout(scene: Scene, scene_index: int, phase: str) -> Image.Image:
        canvas = Image.new("RGB", (WIDTH, HEIGHT), BG)
        draw = ImageDraw.Draw(canvas)
        draw.rectangle((48, 42, 56, 114), fill=TEAL)
        draw.text((78, 33), "How trajectory changes become candidates", font=font(46, True), fill=WHITE)
        draw.text((80, 96), "Shot and header examples | automatic candidate generation", font=font(26), fill=MUTED)
        draw.rounded_rectangle((1464, 174, 1896, 948), radius=10, fill=PANEL)
        state = {"normal": "ORIGINAL SPEED · 1×", "slow": "CONTACT WINDOW · 0.5×", "freeze": "PAUSED · 3 SECONDS"}[phase]
        draw.text((1488, 192), state, font=font(23, True), fill=TEAL)
        if phase == "normal":
            draw.text((1488, 263), "Follow the ball", font=font(30, True), fill=WHITE)
            for row, (color, label) in enumerate([
                ((250, 207, 48), "Recent ball path"),
                ((41, 205, 225), "Before candidate"),
                ((241, 44, 223), "After candidate"),
            ]):
                y = 345 + row * 58
                draw.line((1490, y + 14, 1532, y + 14), fill=color, width=5)
                draw.text((1548, y - 2), label, font=font(24), fill=WHITE)
            draw.multiline_text((1488, 565), "Motion changes propose\ncandidates. Visible\ncontact is checked\nin the next stage.", font=font(27), fill=MUTED, spacing=13)
        else:
            draw.rectangle((1486, 236, 1874, 528), outline=TEAL, width=2)
            heading = f"After the {scene.label.lower()}" if phase == "freeze" else "Watch the contact"
            draw.text((1488, 568), heading, font=font(30, True), fill=TEAL if phase == "freeze" else WHITE)
            if phase == "freeze":
                message = "Sharp motion change\nproposes an event\ncandidate." if scene_index == 0 else "A direction change\nproposes an event\ncandidate."
                draw.multiline_text((1488, 628), message, font=font(29, True), fill=WHITE, spacing=12)
                draw.multiline_text((1488, 810), "Contact is checked\nin the next stage.", font=font(24), fill=MUTED, spacing=9)
            else:
                draw.multiline_text((1488, 628), "Replay at 0.5×.\nThe original trajectory\noverlay stays visible.", font=font(27), fill=MUTED, spacing=13)
        draw.text((48, 978), f"{scene_index + 1:02d} / 02   {scene.label}: trajectory-change proposal", font=font(29, True), fill=TEAL)
        for i in range(2):
            x = 1488 + i * 196
            draw.rounded_rectangle((x, 996, x + 176, 1005), radius=4, fill=TEAL if i == scene_index else (39, 55, 70))
        draw.text((48, 1032), "Candidate timing is approximate; a motion change alone does not confirm contact.", font=font(22), fill=MUTED)
        return canvas

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.poster.parent.mkdir(parents=True, exist_ok=True)
    if args.review_dir:
        args.review_dir.mkdir(parents=True, exist_ok=True)
    timeline: list[dict] = []
    total_frames = 0
    poster: Image.Image | None = None
    with tempfile.TemporaryDirectory(prefix="trajectory-demo-") as temp:
        encoded = Path(temp) / "render.mp4"
        command = [ffmpeg, "-hide_banner", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{WIDTH}x{HEIGHT}", "-r", str(FPS), "-i", "pipe:0", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-threads", "4", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(encoded)]
        with (Path(temp) / "ffmpeg.log").open("w+") as log:
            process = subprocess.Popen(command, stdin=subprocess.PIPE, stderr=log)
            try:
                for scene_index, scene in enumerate(scenes):
                    source = Source(scene.path)
                    try:
                        if scene.freeze_frame >= source.count:
                            raise ValueError("Freeze frame is outside the source clip")
                        slow_frame = round(scene.slow_start * source.fps)
                        segments = [
                            ("normal", 0, slow_frame, 1.0),
                            ("slow", slow_frame, scene.freeze_frame + 1, 0.5),
                            ("freeze", scene.freeze_frame, scene.freeze_frame + 1, 0.0),
                            ("normal", scene.freeze_frame + 1, source.count, 1.0),
                        ]
                        for segment_index, (phase, start, stop, speed) in enumerate(segments):
                            count = 3 * FPS if phase == "freeze" else round((stop - start) / source.fps / speed * FPS)
                            timeline.append({"scene": scene.label, "phase": phase, "start_frame": total_frames, "end_frame": total_frames + count, "source_start_frame": start, "source_end_frame_exclusive": stop, "source_fps": source.fps, "speed": speed})
                            background = layout(scene, scene_index, phase)
                            for i in range(count):
                                frame_index = start if phase == "freeze" else min(stop - 1, start + int(i / FPS * speed * source.fps))
                                pixels = source.at(frame_index)
                                canvas = background.copy()
                                x, y, w, h = VIDEO_BOX
                                canvas.paste(pixels.resize((w, h), Image.Resampling.LANCZOS), (x, y))
                                if phase != "normal":
                                    x, y, w, h = ZOOM_BOX
                                    canvas.paste(pixels.crop(scene.crop).resize((w, h), Image.Resampling.LANCZOS), (x, y))
                                draw = ImageDraw.Draw(canvas)
                                draw.text((1150, 980), f"Source {frame_index / source.fps:.2f}s", font=font(22), fill=MUTED)
                                if i == 0:
                                    if phase == "freeze" and poster is None:
                                        poster = canvas.copy()
                                    if args.review_dir:
                                        canvas.save(args.review_dir / f"{scene_index + 1}-{segment_index}-{phase}.jpg", quality=94)
                                process.stdin.write(canvas.tobytes())
                                total_frames += 1
                            print(f"{scene.label}: {phase}, {count} frames", flush=True)
                    finally:
                        source.close()
                process.stdin.close()
                if process.wait() != 0:
                    log.seek(0)
                    raise RuntimeError(log.read())
            except BaseException:
                process.kill()
                process.wait()
                raise
        check = Source(encoded)
        decoded = 0
        while check.capture.read()[0]:
            decoded += 1
        if decoded != total_frames or abs(check.fps - FPS) > 0.001:
            raise RuntimeError("Encoded frame count/FPS verification failed")
        check.close()
        if any(digest(Path(path)) != value for path, value in hashes.items()):
            raise RuntimeError("Source clips changed during rendering")
        if poster is None:
            raise RuntimeError("No poster was rendered")
        poster.resize((960, 540), Image.Resampling.LANCZOS).save(args.poster, "WEBP", quality=88)
        shutil.copyfile(encoded, args.output)
    if args.review_dir:
        (args.review_dir / "timeline.json").write_text(json.dumps({"fps": FPS, "frames": total_frames, "duration_seconds": total_frames / FPS, "segments": timeline, "source_files_unchanged": True}, indent=2), encoding="utf-8")
    print(f"Verified {total_frames} frames / {total_frames / FPS:.2f}s: {args.output}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--shot", type=Path, required=True)
    parser.add_argument("--header", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path("public/videos/aisoccercoach-BallMapping/04_Trajectory_Candidates.mp4"))
    parser.add_argument("--poster", type=Path, default=Path("public/videos/aisoccercoach-BallMapping/posters/04_trajectory_candidates.webp"))
    parser.add_argument("--font", type=Path, default=Path("C:/Windows/Fonts/segoeui.ttf"))
    parser.add_argument("--bold-font", type=Path, default=Path("C:/Windows/Fonts/segoeuib.ttf"))
    parser.add_argument("--review-dir", type=Path)
    parser.add_argument("--overwrite", action="store_true")
    render(parser.parse_args())
