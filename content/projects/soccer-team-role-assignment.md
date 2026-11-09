---
title: 'AISoccerCoach: Team & Role Assignment'
subtitle: 'Learning appearance features to group soccer players by team and role.'
description: 'Developing soccer team and role assignment through triplet learning, 19 archived model versions, and a 15-model development benchmark.'
category: Computer Vision
date: '2025-09-28'
replaces: computer-vision-02
card:
  label: AISoccerCoach · Computer Vision
  title: Team & Role Assignment
  description: Assigning soccer teams and roles from appearance embeddings and tracked player crops.
image: /videos/aisoccercoach-team-assignment/posters/01_showcase.webp
tech:
  - Python
  - TensorFlow / Keras
  - Metric learning
  - OpenCV
media:
  images:
    same-video-triplet:
      src: /images/projects/team-assignment/same-video-triplet.webp
      title: Same-video triplet sampling
      alt: Five crops from one video show an anchor and positive from Team A, with one negative each from Team B, goalkeeper, and referee.
      width: 960
      height: 420
      caption: One anchor, one positive, and three negatives sampled from the same video.
    benchmark-progression:
      src: /images/projects/team-assignment/benchmark-progression.webp
      title: Development benchmark progression
      alt: Two panels show equal-group clustering accuracy across MobileNet V4 to V12 and ResNet V1 to V6 on the same development benchmark.
      width: 1800
      height: 1380
      caption: Development benchmark scores across both backbones. Both panels use the same scale.
    training-loss:
      src: /images/projects/team-assignment/mobilenet-v6-loss.webp
      title: MobileNet V6 training and validation loss
      alt: Original MobileNet V6 training and validation triplet-loss curves over 20 plotted epochs. Both decline, with fluctuations in validation loss.
      width: 567
      height: 455
      caption: Training and validation triplet loss during the MobileNet V6 run.
    embedding-inspection:
      src: /images/projects/team-assignment/mobilenet-v12-tsne.webp
      title: MobileNet V12 qualitative embedding inspection
      alt: MobileNet V12 t-SNE visualization compares predicted clusters and labeled groups. Two large team groups and two smaller role groups are visible.
      width: 1790
      height: 790
      caption: MobileNet V12 t-SNE projection for visual inspection of team and role groupings.
  videoGalleries:
    demonstrations:
      - src: /videos/aisoccercoach-team-assignment/01_Showcase.mp4
        poster: /videos/aisoccercoach-team-assignment/posters/01_showcase.webp
        title: Results showcase
        description: Four saved MobileNet V12 assignment overlays from broadcast and amateur footage.
        transcript: The montage plays four saved assignment overlays, starting with two broadcast clips and then two amateur clips. The legend identifies blue as Team A, green as Team B, red as goalkeeper, and magenta as referee. Team A and Team B are local to each clip. The displayed IDs come from the tracker. Visible mistakes are part of the saved predictions. Independent match-level evaluation is pending.
        width: 1920
        height: 1080
      - src: /videos/aisoccercoach-team-assignment/01_Inference.mp4
        poster: /videos/aisoccercoach-team-assignment/posters/01_inference.webp
        title: Inference walkthrough
        description: Follow one tracked frame through crop extraction, MobileNet V12 embeddings, two K-means passes, and track smoothing.
        transcript: The broadcast footage plays for two seconds and freezes. Seventeen neutral tracker boxes become a grid of crops. Track 14 illustrates conversion to a 124 by 124 RGB image and a normalized 512-dimensional embedding. A two-dimensional t-SNE projection shows every saved embedding in the displayed interval and marks the same observation. K-means forms four groups using the full embeddings. Upstream YOLO class votes identify goalkeeper and referee groups. A second K-means pass splits the remaining observations into two teams. A real sequence from track 14 shows how majority smoothing changes labels while keeping the tracker ID. Playback resumes from the frozen frame with the saved predictions.
        width: 1920
        height: 1080
      - src: /videos/aisoccercoach-team-assignment/03_Training.mp4
        poster: /videos/aisoccercoach-team-assignment/posters/03_training.webp
        title: Training walkthrough
        description: See how same-video sampling, a shared MobileNetV2 encoder, and triplet loss train an appearance representation.
        transcript: Match footage introduces the task. Five real crops from one archived training-video group illustrate sampling. The anchor and positive share a class. The other team, goalkeeper, and referee provide the three sampled negatives. Shared MobileNetV2 weights map all five crops into one embedding space. The triplet-loss animation uses their thumbnails to illustrate pulling the positive embedding toward the anchor and pushing the closest sampled negative away by a margin. The video ends with the saved assignment overlay.
        width: 1920
        height: 1080
---

## Overview

Assigning teams and roles in soccer video is challenging when uniforms vary between matches and detections contain occlusion, motion blur, or background clutter. This work presents a hierarchical pipeline integrating appearance learning, semantic role interpretation, and temporal label aggregation. A shared MobileNetV2 or ResNet50 encoder is trained using same-video triplets, balanced anchor sampling within each video, and a configurable sampled-negative objective to produce normalized appearance embeddings. During inference, an initial clustering stage organizes participant appearances, while detector-derived cues identify goalkeeper and referee groups. The remaining observations are then reclustered into the two outfield teams. A final consistency stage applies per-track majority smoothing and optional goalkeeper constraints while preserving incoming tracking identities. On a development benchmark of 5,581 crops from 36 video groups, the MobileNet V12 configuration achieved 97.31% mean per-group clustering accuracy after ground-truth label alignment. The architecture provides an offline, modular workflow for converting tracked participant detections into local team and role annotations.

## Demonstrations

The showcase plays saved predictions across four clips. The inference walkthrough follows one tracked frame from crops to final labels. The training walkthrough shows how the encoder learned appearance similarity. All three use MobileNet V12 artifacts. The development benchmark below evaluates crop clustering separately.

<VideoGallery id="demonstrations" />

## Problem

A traditional approach is to estimate jersey colors from player crops using tools such as OpenCV, then group players by color. Changes in lighting, shadows, and camera exposure can make the same kit look different across frames. In small or blurred crops, the pitch or a player in front can account for more pixels than the jersey itself.

The groups also depend on the match. A team can wear a different kit in the next video, while goalkeepers and referees form smaller groups alongside the two outfield teams. The task is to learn which crops share a team or role within a match, so two different teammates can form a positive training pair.

## Method

<ol className="research-flow research-flow--four" aria-label="Team and role assignment pipeline">
  <li><strong>Tracked crops</strong><span>Read external boxes and IDs, then resize valid person crops.</span></li>
  <li><strong>Appearance embeddings</strong><span>Represent each crop with a learned, normalized feature vector.</span></li>
  <li><strong>Team and role grouping</strong><span>Interpret role clusters with detector hints and split remaining people into two teams.</span></li>
  <li><strong>Label consistency</strong><span>Apply per-track majority smoothing and an optional goalkeeper constraint.</span></li>
</ol>

### Embed externally tracked observations

The pipeline reads a video interval with frame-aligned boxes and IDs from an external tracker. It resizes valid crops to 124 × 124 pixels, converts them to RGB, and scales pixel values to [0, 1]. The encoder produces normalized appearance vectors in batches.

### Interpret roles and form two teams

The first K-means pass forms up to four appearance clusters. If the most frequent detector label in a cluster is goalkeeper or referee, the cluster receives that role. A second pass splits the remaining crops into two teams. Mean horizontal image position determines the clip-local Team A and Team B labels. Goalkeepers receive a role only.

### Smooth labels within incoming tracks

Offline processing uses the full selected interval. When a label reaches the configured majority threshold, the pipeline applies it across that track and preserves the original ID. An optional rule uses detector hints to retain at most one goalkeeper per frame.

### Implementation

The package separates training, crop evaluation, and video assignment. An optional adapter supplies tracking inputs. The assignment run saves labels, tracker IDs, embeddings, diagnostics, a silent overlay, and the configuration with input and model hashes. Later consolidation verified model loading, reproduction of saved labels, and complete video decoding.

## Training

### Data and same-video sampling

I built a dataset with **64,780 training crops from 107 video groups** and **1,720 validation crops from 14 groups**. Each crop was labeled as one of the two outfield teams, goalkeeper, or referee. I split the data by match, so footage from any given match goes into only one split.

I used triplets to teach the model which appearances belong together. The anchor is the reference crop, the positive is another crop from the same team or role, and negatives come from other classes. Sampling within one video keeps those labels meaningful as kits change between matches. I gave each class a turn as the anchor so the more numerous outfield crops would not crowd out goalkeeper and referee examples.

<div className="project-technical-figures team-assignment-figure">
  <ImageBlock id="same-video-triplet" display="card" />
</div>

### Architecture and objective

I compared MobileNetV2 and ResNet50 to explore the tradeoff between clustering accuracy and compute. Both encoders start from ImageNet weights and are fine-tuned on 124 × 124 RGB crops. Global average pooling and a learned projection turn each crop into a compact vector, and L2 normalization puts the vectors on a common scale. MobileNet V12 produces 512 features per crop and ResNet V6 produces 256.

Triplet loss trains the encoder to place the positive closer to the anchor than the nearest sampled negative by a margin. Sampling three negatives in later runs gave the loss more chances to encounter a confusing example. I monitored training and validation loss to see how the objective behaved on each split.

<div className="project-technical-figures team-assignment-figure team-assignment-figure--loss">
  <ImageBlock id="training-loss" display="card" />
</div>

### How the experiments evolved

1. **Role examples and separation.** Early MobileNet runs confused goalkeepers and referees. I expanded the examples for both roles and tested a larger margin. The mean benchmark score was 58.72% for V4 and 92.34% for V5.
2. **Embedding size and training length.** I varied the margin, training length, and vector size to see how much capacity the task needed. Scores fluctuated across V6–V8 before V9 reached 95.05% with 512 dimensions.
3. **Negative sampling and training budget.** V10 and V11 tested three negatives and scored below V9. V12 kept three negatives and used larger batches and more steps per epoch. That combination gave the highest mean across groups at 97.31%.
4. **Backbone comparison.** I ran the ResNet50 experiments alongside MobileNetV2. ResNet V6 reached 95.91% by group mean and came within one correct crop of V12 when pooling all crops.

<div className="project-technical-figures team-assignment-figure">
  <ImageBlock id="benchmark-progression" display="card" />
</div>

<details className="portfolio-detail-disclosure">
  <summary>Complete training history — 19 model versions</summary>

The table brings together the encoder dimensions and training settings for both model families.

<div className="publication-metrics-table project-metrics-table" role="region" aria-label="All 19 archived training configurations" tabIndex="0">
  <table>
    <thead><tr><th scope="col">Model</th><th scope="col">Dim.</th><th scope="col">Margin</th><th scope="col">Negatives</th><th scope="col">Batch</th><th scope="col">LR</th><th scope="col">Epochs</th><th scope="col">Steps / epoch</th></tr></thead>
    <tbody>
      <tr><th scope="row">MobileNet V0</th><td>128</td><td>0.2</td><td>1</td><td>8</td><td>0.0001</td><td>5</td><td>100</td></tr>
      <tr><th scope="row">MobileNet V1</th><td>128</td><td>0.2</td><td>1</td><td>8</td><td>0.0001</td><td>10</td><td>100</td></tr>
      <tr><th scope="row">MobileNet V2</th><td>128</td><td>0.2</td><td>1</td><td>8</td><td>0.0001</td><td>20</td><td>100</td></tr>
      <tr><th scope="row">MobileNet V3</th><td>128</td><td>0.5</td><td>1</td><td>8</td><td>0.0001</td><td>50</td><td>100</td></tr>
      <tr><th scope="row">MobileNet V4</th><td>128</td><td>0.2</td><td>1</td><td>8</td><td>0.0001</td><td>10</td><td>100</td></tr>
      <tr><th scope="row">MobileNet V5</th><td>128</td><td>1.0</td><td>1</td><td>8</td><td>0.0001</td><td>20</td><td>100</td></tr>
      <tr><th scope="row">MobileNet V6</th><td>128</td><td>1.0</td><td>1</td><td>8</td><td>0.0001</td><td>20</td><td>100</td></tr>
      <tr><th scope="row">MobileNet V7</th><td>128</td><td>1.2</td><td>1</td><td>8</td><td>0.0001</td><td>50</td><td>100</td></tr>
      <tr><th scope="row">MobileNet V8</th><td>256</td><td>1.0</td><td>1</td><td>8</td><td>0.0001</td><td>50</td><td>100</td></tr>
      <tr><th scope="row">MobileNet V9</th><td>512</td><td>2.0</td><td>1</td><td>8</td><td>0.0001</td><td>50</td><td>100</td></tr>
      <tr><th scope="row">MobileNet V10</th><td>256</td><td>1.0</td><td>3</td><td>8</td><td>0.0001</td><td>30</td><td>100</td></tr>
      <tr><th scope="row">MobileNet V11</th><td>512</td><td>2.0</td><td>3</td><td>8</td><td>0.0001</td><td>30</td><td>100</td></tr>
      <tr><th scope="row">MobileNet V12</th><td>512</td><td>2.0</td><td>3</td><td>16</td><td>0.0001</td><td>20</td><td>1000</td></tr>
      <tr><th scope="row">ResNet V1</th><td>256</td><td>1.0</td><td>1</td><td>16</td><td>0.0001</td><td>40</td><td>100</td></tr>
      <tr><th scope="row">ResNet V2</th><td>128</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
      <tr><th scope="row">ResNet V3</th><td>128</td><td>1.0</td><td>1</td><td>16</td><td>1e-05</td><td>40</td><td>100</td></tr>
      <tr><th scope="row">ResNet V4</th><td>200</td><td>1.5</td><td>1</td><td>16</td><td>1e-05</td><td>40</td><td>100</td></tr>
      <tr><th scope="row">ResNet V5</th><td>256</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
      <tr><th scope="row">ResNet V6</th><td>256</td><td>1.5</td><td>1</td><td>16</td><td>1e-05</td><td>15</td><td>1000</td></tr>
    </tbody>
  </table>
</div>

</details>

### Checkpoints and qualitative inspection

During training, validation triplet loss selected the training checkpoint, while a kNN diagnostic on the validation embeddings selected the standalone encoder. Those signals can favor different epochs. The consolidated training workflow selects both exports using validation triplet loss so they come from the same epoch.

<div className="project-technical-figures team-assignment-figure">
  <ImageBlock id="embedding-inspection" display="card" />
</div>

I used t-SNE to inspect how the learned features grouped similar appearances. The V12 example shows two large team groups and two smaller role groups. In the labeled panel, Class 3 denotes referees.

## Results

**15 trained models** were compared on a development benchmark of **5,581 crops from 36 video groups**. Each model was scored on the same crops so I could compare how well its embeddings separated teams and roles.

### What the metric measures

K-means is used to cluster each video group's embeddings into four groups. Cluster IDs are arbitrary, so I used Hungarian matching to align them with the labeled teams and roles before counting correct crops.

**Mean per group** gives each of the 36 groups equal weight. **Pooled crop accuracy** divides the total number of correctly aligned crops by 5,581, so larger groups contribute more. Both metrics use the saved cluster assignments and measure crop grouping.

I used the benchmark to compare settings and select a model. Its images were held out from training, and **136 crops also appear in validation**. Independent match-level evaluation is pending.

### Three candidates, different tradeoffs

<div className="publication-metrics-table project-metrics-table" role="region" aria-label="Three model-selection candidates on the development benchmark" tabIndex="0">
  <table>
    <thead><tr><th scope="col">Model</th><th scope="col">Mean per group</th><th scope="col">Pooled crops</th><th scope="col">Worst group</th><th scope="col">Correct crops</th></tr></thead>
    <tbody>
      <tr><th scope="row">MobileNet V12</th><td>97.31%</td><td>97.06%</td><td>76.61%</td><td>5,417 / 5,581</td></tr>
      <tr><th scope="row">ResNet V6</th><td>95.91%</td><td>97.04%</td><td>71.43%</td><td>5,416 / 5,581</td></tr>
      <tr><th scope="row">MobileNet V9</th><td>95.05%</td><td>94.84%</td><td>82.71%</td><td>5,293 / 5,581</td></tr>
    </tbody>
  </table>
</div>

**I use MobileNet V12 in the demonstrations** because it scored highest when each video group counted equally. That metric gives performance on small groups the same weight as performance on larger ones.

**ResNet V6 is almost tied when crops are pooled:** V12 has 5,417 correct crops and V6 has 5,416. Their 1.40 percentage-point difference in group means therefore corresponds to just one crop overall. V12 wins 13 groups, V6 wins seven, and 16 tie; different group sizes and complementary failures explain why the summaries differ.

For example, V12 scores 76.61% on `v141_difficult` while V6 scores 100%. On `v102`, V12 scores 98.33% while V6 scores 71.67%. The two encoders handle different groups well.

**MobileNet V9 has the strongest worst-group score, 82.71%,** despite its lower mean. It ranks first on this benchmark if performance on the weakest group is the priority.

<details className="portfolio-detail-disclosure">
  <summary>Complete benchmark comparison — 15 models</summary>

Ordered by equal-group mean. Every row uses the same 36 groups and 5,581 crops, with ground-truth cluster alignment performed independently within each group.

<div className="publication-metrics-table project-metrics-table" role="region" aria-label="All 15 models on the common development benchmark" tabIndex="0">
  <table>
    <thead><tr><th scope="col">Model</th><th scope="col">Mean per group</th><th scope="col">Pooled crops</th><th scope="col">Worst group</th><th scope="col">Correct crops</th></tr></thead>
    <tbody>
      <tr><th scope="row">MobileNet V12</th><td>97.31%</td><td>97.06%</td><td>76.61%</td><td>5,417 / 5,581</td></tr>
      <tr><th scope="row">ResNet V6</th><td>95.91%</td><td>97.04%</td><td>71.43%</td><td>5,416 / 5,581</td></tr>
      <tr><th scope="row">ResNet V4</th><td>95.39%</td><td>94.97%</td><td>77.97%</td><td>5,300 / 5,581</td></tr>
      <tr><th scope="row">ResNet V3</th><td>95.34%</td><td>95.81%</td><td>70.37%</td><td>5,347 / 5,581</td></tr>
      <tr><th scope="row">MobileNet V9</th><td>95.05%</td><td>94.84%</td><td>82.71%</td><td>5,293 / 5,581</td></tr>
      <tr><th scope="row">ResNet V5</th><td>93.19%</td><td>92.99%</td><td>69.64%</td><td>5,190 / 5,581</td></tr>
      <tr><th scope="row">ResNet V2</th><td>92.83%</td><td>92.78%</td><td>54.63%</td><td>5,178 / 5,581</td></tr>
      <tr><th scope="row">MobileNet V11</th><td>92.43%</td><td>92.22%</td><td>74.07%</td><td>5,147 / 5,581</td></tr>
      <tr><th scope="row">MobileNet V5</th><td>92.34%</td><td>91.79%</td><td>72.22%</td><td>5,123 / 5,581</td></tr>
      <tr><th scope="row">MobileNet V6</th><td>92.23%</td><td>92.58%</td><td>70.37%</td><td>5,167 / 5,581</td></tr>
      <tr><th scope="row">MobileNet V7</th><td>92.19%</td><td>91.83%</td><td>70.37%</td><td>5,125 / 5,581</td></tr>
      <tr><th scope="row">MobileNet V10</th><td>91.91%</td><td>91.36%</td><td>66.07%</td><td>5,099 / 5,581</td></tr>
      <tr><th scope="row">MobileNet V8</th><td>90.88%</td><td>90.77%</td><td>68.75%</td><td>5,066 / 5,581</td></tr>
      <tr><th scope="row">ResNet V1</th><td>85.92%</td><td>85.88%</td><td>62.11%</td><td>4,793 / 5,581</td></tr>
      <tr><th scope="row">MobileNet V4</th><td>58.72%</td><td>57.41%</td><td>37.30%</td><td>3,204 / 5,581</td></tr>
    </tbody>
  </table>
</div>

</details>

## Limitations

- **Appearance ambiguity:** Similar uniforms, small crops, blur, and background pixels can merge classes or split one class into several clusters.
- **Role assumptions:** Role interpretation depends on detector hints and the initial cluster structure. A clip may contain fewer appearance groups than expected, and the single-goalkeeper option can suppress a valid second goalkeeper.
- **Local semantics:** Team A/B numbering is clip-local. Goalkeepers have no team assignment, and the output provides no calibrated assignment confidence.
- **Upstream tracking:** Missing boxes and ID switches affect both grouping and smoothing. Incoming IDs are preserved rather than corrected.
- **Offline processing:** Whole-interval clustering and smoothing can use future observations. No controlled real-time throughput claim is made.

## Future work

Test alternatives for clips with missing roles, similar kits, and two visible goalkeepers. Evaluate the smoothing and goalkeeper rules with controlled comparisons, and investigate assigning goalkeepers to teams. Any confidence or rejection policy should be validated against held-out data before being presented as reliable.

Interested in the code, data, or implementation details? [Email me](mailto:hamed.hamze2212@gmail.com) to discuss access.
