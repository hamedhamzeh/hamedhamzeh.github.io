---
title: 'AISoccerCoach: Player & Ball Action Detection'
description: 'Recognizing player actions and ball events from tracked soccer footage.'
category: Computer Vision
date: '2026-02-24'
card:
  label: AISoccerCoach · Computer Vision
  title: Player & Ball Action Detection
  description: 'Classifying actions like kicking, receiving, and dribbling from short clips centered on players and the ball.'
image: /images/projects/computer-vision/soccer-action-detection.webp
media:
  videoGalleries:
    demonstration:
      - src: /videos/aisoccercoach-action-detection/action-detection-showcase.mp4
        poster: /videos/aisoccercoach-action-detection/posters/showcase.webp
        title: Player and ball action detection
        transcript: Three slow-motion match excerpts play in sequence. Argentina versus Croatia shows an attack near goal. Cameroon versus Brazil shows play across the penalty area. Spain versus Morocco shows a run from midfield toward goal. The overlays place predicted actions above tracked players, track IDs below them, and the current ball prediction in the upper left.
        width: 1920
        height: 1080
---

## Overview

This project presents a video analysis pipeline for recognizing player actions and ball events in soccer footage. Given frame-aligned player and ball tracks, the pipeline extracts short clips centered on each tracked subject. Separate classifiers combine features from a fine-tuned Perception Encoder with temporal convolutions to recognize 14 player actions and eight ball events. Predictions from overlapping windows are aggregated and overlaid on the source video to show when actions occur and which tracks they are associated with. Grad-CAM was used to inspect confident player-classification errors across checkpoints. On a development benchmark of 180 labeled ball clips, the best-performing configuration by macro-F1 achieved 76.2%.

## Demonstration

Three saved outputs show the pipeline's predictions overlaid on the original match footage. Each clip keeps its original slow-motion playback.

<VideoGallery id="demonstration" showTitle="false" />

## Full Case Study Coming Soon

I’ll share the experiments and decisions behind this demo here soon.
