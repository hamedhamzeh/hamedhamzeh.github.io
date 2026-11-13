---
title: Detecting Smoking and Phone Use in CCTV Footage
description: A workplace safety project combining YOLO training, person tracking, and video alerts for signs of smoking and phone use.
category: Computer Vision
date: '2026-01-13'
replaces: computer-vision-05
card:
  title: Smoking & Phone Use Detection
  label: Computer Vision · Workplace safety
  description: A computer vision system that tracks people in workplace CCTV footage and raises alerts when signs of smoking or phone use persist.
image: /images/projects/computer-vision/cctv-smoking-phone-detection.webp
media:
  videoGalleries:
    demonstrations:
      - src: /videos/cctv-smoking-phone-detection/smoking-showcase.mp4
        poster: /videos/cctv-smoking-phone-detection/posters/smoking-showcase.webp
        title: Smoking detection showcase
        description: Four sample clips show the saved person tracks, detections of cigarette-holding hands, and smoking alerts.
        transcript: The montage shows a street conversation, a crowd in Ottawa, two people outside a building, and two people seated outdoors. Tracking boxes follow people, smaller boxes mark detected cigarette-holding hands, and red alerts identify tracks that met the pipeline’s timing threshold.
        width: 1920
        height: 1080
      - src: /videos/cctv-smoking-phone-detection/phone-showcase.mp4
        poster: /videos/cctv-smoking-phone-detection/posters/phone-showcase.webp
        title: Phone use detection showcase
        description: Two fixed-camera MEVA clips show a phone call on a stairwell and texting at a table.
        transcript: The stairwell clip starts 5.30 seconds into the saved v0 inference video. The second clip shows a seated person texting, with the saved v1 inference overlay. The system draws person tracks and phone boxes and displays an alert when a track meets the timing threshold.
        width: 1920
        height: 1080
      - src: /videos/cctv-smoking-phone-detection/pipeline-walkthrough.mp4
        poster: /videos/cctv-smoking-phone-detection/posters/pipeline-walkthrough.webp
        title: Detection pipeline walkthrough
        description: Follow one smoking sample from the full frame through person detection, crop extraction, and the on-screen alert.
        transcript: The footage freezes on a frame with two people. Person detections appear, and an expanded box around the person on the right becomes the crop for the second model. A close-up shows the model’s box around the hand and cigarette. The grip and hand shape give the model more context than the small cigarette alone. Playback resumes with the saved overlay, showing the smoothed detection and the alert after the cue persists for the required time.
        width: 1920
        height: 1080
---

## Overview

In a wide CCTV shot, a phone may be barely visible and a cigarette can occupy only a few pixels. Distance, motion blur, and changes in lighting make those cues easy to miss. For workplace safety monitoring, the system also needs to decide when the evidence is consistent enough to flag an event for review.

I trained the object detectors and built two video pipelines, one for smoking and one for phone use. Both follow people across frames, look for behavior cues within each person's crop, and write an annotated video with tracking boxes and on-screen alerts.

## Demonstrations

I sourced these sample clips online to showcase the project’s final inference results. I kept them out of training and trained the detectors on separate datasets of CCTV imagery for real-world workplace safety scenarios.

<VideoGallery id="demonstrations" />

## Data and Training

### Choose labels that preserve context

I worked with two separate datasets: roughly **14,000 images** for phone detection and **7,000 images** for smoking detection. Before training, I checked annotation consistency and removed invalid labels. For phone detection, I labeled the phone itself. For smoking, I labeled the hand holding the cigarette, up to the wrist. That gave the detector a larger region to learn from and preserved the grip and hand shape when the cigarette was hard to see.

### Test head labels during training

I trained separate Ultralytics YOLO detectors and compared versions with and without a head class. My hypothesis was that learning to detect heads alongside phones or smoking-related hands could help the model learn the visual context around each target. The archived runs also varied other training settings, so those experiments leave the effect of head labels on their own unresolved.

## Video Pipeline

<ol className="research-flow research-flow--four" aria-label="CCTV behavior detection pipeline">
  <li><strong>Track people</strong><span>Detect people in the full frame and assign track IDs across frames.</span></li>
  <li><strong>Inspect each crop</strong><span>Expand each person box and search the crop for the phone or cigarette-holding hand.</span></li>
  <li><strong>Stabilize detections</strong><span>Track behavior cues within each person crop and smooth the displayed boxes.</span></li>
  <li><strong>Check and alert</strong><span>Check how long the cue persists for each person and draw alerts on the output video.</span></li>
</ol>

The person crop restricts the search to a likely region and lets the second detector devote its input resolution to that person. I expanded the crop slightly to give hands near the edge of the person box room to stay in view.

I kept the alert decision separate from the frame-by-frame detector. A cue has to persist for a set duration before the system shows an alert. A brief missed detection can leave the timer running because blur or occlusion can hide a cue for a few frames. A longer gap resets it. For phone use, persistence filters out isolated detections, though a phone held in view can still trigger an alert even when the person is simply carrying it.

## Limitations and Next Steps

The second stage depends on finding the person first. If the person detector misses someone in a crowded or distant view, the behavior detector has no crop to inspect. Even inside a crop, a hand or phone can be hidden, and some gestures resemble the target behaviors from certain angles.

The next step would be to merge the datasets and review them for missing cross-labels, such as a phone in a smoking image. I would then compare phone-only labels with labels that include the hand holding the phone, and test a unified detector. One proposed alert check would use overlap between the head and hand boxes as an additional cue for active use. Its value would need to be tested across camera angles and against clips of people simply holding a phone.
