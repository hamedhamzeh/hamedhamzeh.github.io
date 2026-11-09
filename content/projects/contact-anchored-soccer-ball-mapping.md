---
title: 'AISoccerCoach: Contact-Anchored Ball Mapping'
subtitle: 'Estimating a 2D ball path from single-camera soccer broadcasts.'
description: 'A computer-vision pipeline combining trajectory analysis, vision-language contact classification, and geometric player identification to estimate a 2D ball path.'
category: Computer Vision
date: '2026-10-12'
replaces: computer-vision-01
card:
  label: AISoccerCoach · Computer Vision
  title: Contact-Anchored Ball Mapping
  description: Estimating a 2D ball path from soccer broadcasts using contact detection and player tracking.
image: /videos/aisoccercoach-BallMapping/posters/01_comparison.webp
tech:
  - Python
  - OpenCV
  - Qwen3-VL
  - Projective geometry
media:
  videoGalleries:
    trajectory-candidates:
      - src: /videos/aisoccercoach-BallMapping/04_Trajectory_Candidates.mp4
        poster: /videos/aisoccercoach-BallMapping/posters/04_trajectory_candidates.webp
        title: How trajectory changes become candidates
        description: A shot and a header replay at half speed around contact, followed by a three-second freeze explaining the trajectory-change proposal. The remaining footage plays at normal speed.
        transcript: The first sequence shows a shot outside the box. Playback slows to half speed before the shot and freezes just afterward for three seconds. The enlarged view and original trajectory overlay show a sharp motion change that proposes an event candidate. Normal-speed playback resumes. The second sequence shows a header near goal, with the same slow-motion and freeze treatment to highlight a direction change. Contact is checked in the next stage; candidate timing is approximate.
        width: 1920
        height: 1080
    demonstrations:
      - src: /videos/aisoccercoach-BallMapping/01_Comparison.mp4
        poster: /videos/aisoccercoach-BallMapping/posters/01_comparison.webp
        title: Direct homography vs. contact-anchored mapping
        description: The same footage and source frames are compared side by side using direct homography and a contact-anchored 2D estimate.
        width: 1920
        height: 1080
      - src: /videos/aisoccercoach-BallMapping/02_Showcase.mp4
        poster: /videos/aisoccercoach-BallMapping/posters/02_showcase.webp
        title: From broadcast footage to a pitch view
        description: Three examples show a wide attack, a penalty-area attack, and a build-up sequence alongside mapped player positions and the estimated ball position.
        width: 1920
        height: 1080
      - src: /videos/aisoccercoach-BallMapping/03_Explainer.mp4
        poster: /videos/aisoccercoach-BallMapping/posters/03_explainer.webp
        title: How contact anchors become a path
        description: Two accepted player contacts provide projected foot-point anchors, joined by a linearly interpolated 2D path. Ball height is not recovered.
        width: 1920
        height: 1080
---

## Overview

Soccer broadcast footage provides a useful view of play, but converting the ball's movement into a top-down pitch view becomes difficult when it leaves the ground. A pitch homography describes the pitch plane: projecting an airborne ball directly through it can produce misleading positions during crosses, long passes, and shots.

This project explores a contact-anchored alternative. It proposes possible trajectory changes, uses a vision-language model to classify their visible cause, and identifies the likely player for predicted player contacts. Accepted contacts provide anchors for an estimated 2D path, with linear interpolation between them.

The current ball-mapping stage is complete as an experimental implementation. The result is a rerunnable pipeline and visual comparison with direct homography. Its output estimates a 2D path; it does not recover ball height or reconstruct the physical airborne trajectory.

## Demonstrations

The three demonstrations compare direct homography with the contact-anchored method, show three example sequences, and explain how accepted contacts become an estimated path. These videos illustrate the method's behavior.

<VideoGallery id="demonstrations" />

## Problem

For an object on the pitch plane, homography provides a practical way to transform image coordinates into a top-down reference. An airborne ball violates that planar assumption. Camera movement, tracking gaps, and false detections can also create apparent trajectory changes that do not correspond to physical contact.

The central design question is therefore: can contact events provide useful reference points for a 2D ball path, while avoiding continuous projection of the airborne ball?

The pipeline separates three decisions: whether a trajectory change has visible contact evidence, which player is associated with a predicted player contact, and whether the available observations can form a mapping anchor. These decisions remain estimates, and an error at one stage can propagate into the final path.

## Method

<ol className="research-flow research-flow--four" aria-label="Contact-anchored mapping pipeline">
  <li><strong>Trajectory candidates</strong><span>Find motion changes and supported track gaps with local camera compensation.</span></li>
  <li><strong>Contact classification</strong><span>Classify visible player, pitch, or unconfirmed contact using close-view Qwen inference.</span></li>
  <li><strong>Player identification</strong><span>Select a likely tracker ID using image-space distance around the candidate event.</span></li>
  <li><strong>Contact anchors</strong><span>Project accepted contact proxies and interpolate an estimated 2D path between them.</span></li>
</ol>

### Inputs and alignment

The pipeline consumes a source video and saved ball tracks, player tracks, and per-frame homographies. Detection, tracking, and homography estimation take place upstream. Optional pitch-landmark correspondences help assess homography reliability during candidate generation.

### Stage 1 — Propose trajectory changes

The candidate generator compares ball motion before and after each eligible frame, combining changes in velocity, speed, direction, and motion-fit quality. Local camera compensation reduces apparent changes caused by camera movement. Supported track gaps provide additional proposals, while peak selection and temporal suppression reduce duplicates. These are candidates for inspection, not confirmed contacts.

Ten candidate-generation modes were tested, covering individual motion cues, player proximity, raw and camera-compensated composites, gap-based proposals, and a hybrid. The selected hybrid combines trajectory changes with supported gaps, without player-assisted scoring. It uses eight tracking frames on either side, an eight-frame suppression radius, and a trajectory-score threshold of 0.40; bounded gaps of up to two frames can be filled, with gap proposals spanning two to eight frames.

<div className="project-stage-video">
  <VideoGallery id="trajectory-candidates" showTitle="false" />
</div>

**Sensitivity and upstream errors.** Parameter tuning strongly affects candidate count. Lower thresholds produce more proposals and require model inference on more clips; higher thresholds can miss genuine events with subtle motion changes. Ball detection and tracking are equally important: jitter or false detections can create spurious changes, while occlusions, gaps, and over-smoothed tracks can hide or mis-time real events.

### Stage 2A — Classify visible contact

Each candidate becomes a static 512 × 512 close crop with a yellow tracked-ball box. The pipeline selects sixteen consecutive source frames around the event, clipped at video boundaries, and supplies all decoded frames to Qwen3-VL-4B-Instruct. Deterministic generation produces a contact decision and a short explanation.

The three decisions are player contact, pitch contact, and no confirmed contact. Player contact includes visible interaction with a foot, leg, head, torso, or another body part. The current pitch-contact label also includes goal netting, a distinction that matters for later mapping. No confirmed contact expresses insufficient visible evidence; it does not prove that no physical contact happened.

### Stage 2B — Identify the player

For a predicted player contact, the pipeline searches allowed tracker IDs using the distance from the ball center to each player's bounding-box region in the source image. It retains each player's minimum distance within ±100 milliseconds of the automatic candidate event and selects the nearest eligible player.

The development experiments compared four geometric configurations and four VLM configurations. Image-space distance over the temporal window returned the most correct IDs, so it was selected for the integrated pipeline.

Player selection resolves distance ties by tracker ID and retries the full candidate clip when the initial window contains no usable player–ball pair. Both behaviors are configurable. There is currently no distance or confidence cutoff, and proximity alone cannot verify physical contact. Tracker IDs identify local tracks, rather than permanent player identities or jersey numbers.

### Stage 3 — Build contact anchors and estimate the path

A player-contact anchor projects the selected player's bounding-box bottom center through the event-frame homography. This is a foot-point proxy, including when the actual contact occurs higher on the body. A pitch-contact anchor projects the tracked ball center. Unconfirmed contacts produce no anchor; missing observations, unresolved identities, and invalid projections are recorded as skipped events.

Linear interpolation joins consecutive accepted anchors. The pipeline does not extrapolate before the first anchor or after the last. Output frames distinguish anchors, interpolated estimates, and unavailable positions. In the rendered pitch view, solid markers represent anchors and rings represent interpolated estimates.

## Results

### Contact classification — 371 labeled development clips

Ground truth for 371 candidate clips was created through manual review, assigning contact labels and refining event timing. The contact-classification set contains 183 player contacts, 69 pitch contacts, and 119 no-confirmed-contact clips from 40 source videos. The same sample paths and labels were used to compare close and wide views under two prompts.

V0 and V1 are prompt variants for the same Qwen model. V0 focused on the interaction causing the trajectory change near the candidate event. V1 required more explicit physical-contact and motion-change evidence and treated the tracked ball box more cautiously. Several instructions changed together, so the comparison does not isolate a single wording change.

<div className="publication-metrics-table project-metrics-table" role="region" aria-label="Contact classification on 371 development clips" tabIndex="0">
  <table>
    <thead><tr><th scope="col">Configuration</th><th scope="col">Correct / 371</th><th scope="col">Accuracy</th><th scope="col">Balanced accuracy</th><th scope="col">Macro-F1</th></tr></thead>
    <tbody>
      <tr><th scope="row">Close / V0 (selected)</th><td>283</td><td>76.28%</td><td>71.11%</td><td>72.13%</td></tr>
      <tr><th scope="row">Close / V1</th><td>253</td><td>68.19%</td><td>68.85%</td><td>66.76%</td></tr>
      <tr><th scope="row">Wide / V0</th><td>205</td><td>55.26%</td><td>48.59%</td><td>47.29%</td></tr>
      <tr><th scope="row">Wide / V1</th><td>175</td><td>47.17%</td><td>50.38%</td><td>47.32%</td></tr>
    </tbody>
  </table>
</div>

Accuracy includes input failures as incorrect. Balanced accuracy and macro-F1 use valid predictions. Each wide run has one shared input failure; both close runs have 371 valid predictions.

The selected close/V0 configuration has the following class-specific results.

<div className="publication-metrics-table project-metrics-table" role="region" aria-label="Close V0 class metrics on 371 development clips" tabIndex="0">
  <table>
    <thead><tr><th scope="col">Class</th><th scope="col">Precision</th><th scope="col">Recall</th><th scope="col">F1</th></tr></thead>
    <tbody>
      <tr><th scope="row">Player contact</th><td>82.05%</td><td>87.43%</td><td>84.66%</td></tr>
      <tr><th scope="row">Pitch contact</th><td>69.81%</td><td>53.62%</td><td>60.66%</td></tr>
      <tr><th scope="row">No confirmed contact</th><td>69.92%</td><td>72.27%</td><td>71.07%</td></tr>
    </tbody>
  </table>
</div>

Close view performed better under both prompts. V1 increased close-view player-contact precision to 87.41% and reduced false player-contact predictions from 35 to 17, but missed player contacts increased from 23 to 65. Close/V0 therefore provided the stronger overall balance on this development set.

These results informed configuration selection on the same labeled clips. They are not a held-out benchmark, and overlapping clips within videos are not independent match-level observations.

### Player identification — 195 classifier-selected clips

The identity study used 195 successful close/V0 player-contact predictions: 156 identifiable contacts, four ambiguous cases, and 35 cases without visible player contact. Manual annotation checked visible contact and readable tracker labels, recording the touching player's ID where resolvable and distinguishing ambiguous identity from unsupported contact.

The identity prompts were compared separately from the contact-classification prompts. V0 included guidance on the target interaction's timing and following the touching player across adjacent frames. V1 emphasized physical-contact verification without that temporal guidance. Supplying an allowed-ID list eliminated out-of-list outputs but reduced correct-ID coverage under both prompts.

On the 156 identifiable contacts, **correct-ID coverage** counts correct IDs divided by all 156 contacts. **Conditional precision** counts correct IDs divided by the IDs returned on those same contacts. Wrong IDs and abstentions reduce correct-ID coverage; abstentions are excluded from conditional precision.

<div className="publication-metrics-table project-metrics-table" role="region" aria-label="Selected geometry and strongest VLM by correct-ID coverage" tabIndex="0">
  <table>
    <thead><tr><th scope="col">Configuration</th><th scope="col">Correct / 156</th><th scope="col">Correct-ID coverage</th><th scope="col">Conditional precision</th><th scope="col">IDs on 35 no-contact cases</th></tr></thead>
    <tbody>
      <tr><th scope="row">Image, ±100 ms (selected)</th><td>124</td><td>79.49%</td><td>92.54%</td><td>30</td></tr>
      <tr><th scope="row">VLM V0, no allowed IDs</th><td>70</td><td>44.87%</td><td>70.00%</td><td>17</td></tr>
    </tbody>
  </table>
</div>

<details className="portfolio-detail-disclosure">
  <summary>Compare all eight player-identification configurations</summary>

<div className="publication-metrics-table project-metrics-table" role="region" aria-label="All eight player identification configurations" tabIndex="0">
  <table>
    <thead><tr><th scope="col">Configuration</th><th scope="col">Correct / 156</th><th scope="col">Wrong / 156</th><th scope="col">Abstained / 156</th><th scope="col">Correct-ID coverage</th><th scope="col">Conditional precision</th><th scope="col">IDs on 35 no-contact cases</th></tr></thead>
    <tbody>
      <tr><th scope="row">Image, ±100 ms (selected)</th><td>124</td><td>10</td><td>22</td><td>79.49%</td><td>92.54%</td><td>30</td></tr>
      <tr><th scope="row">Image, event frame</th><td>94</td><td>6</td><td>56</td><td>60.26%</td><td>94.00%</td><td>29</td></tr>
      <tr><th scope="row">Pitch, ±100 ms</th><td>116</td><td>34</td><td>6</td><td>74.36%</td><td>77.33%</td><td>33</td></tr>
      <tr><th scope="row">Pitch, event frame</th><td>84</td><td>16</td><td>56</td><td>53.85%</td><td>84.00%</td><td>29</td></tr>
      <tr><th scope="row">VLM V0, no allowed IDs</th><td>70</td><td>30</td><td>56</td><td>44.87%</td><td>70.00%</td><td>17</td></tr>
      <tr><th scope="row">VLM V0, allowed IDs</th><td>47</td><td>21</td><td>88</td><td>30.13%</td><td>69.12%</td><td>9</td></tr>
      <tr><th scope="row">VLM V1, no allowed IDs</th><td>68</td><td>56</td><td>32</td><td>43.59%</td><td>54.84%</td><td>25</td></tr>
      <tr><th scope="row">VLM V1, allowed IDs</th><td>53</td><td>36</td><td>67</td><td>33.97%</td><td>59.55%</td><td>18</td></tr>
    </tbody>
  </table>
</div>

</details>

The selected geometric approach returned 54 more correct IDs than the strongest VLM by correct-ID coverage. Its high conditional precision does not make it a contact verifier: it assigned IDs on 30 of the 35 no-contact cases. Including every returned ID in this annotated cohort, its confirmed exact-ID precision is 75.15%, with one ID on an ambiguous case remaining unverified.

Geometric evaluation used human-annotated event timing. The integrated pipeline uses automatic candidate timing, tie resolution, and clip fallback. These development results therefore do not measure its end-to-end identity performance.

## Limitations

- **Missed events and error propagation:** The pipeline depends on capturing every meaningful contact. A missed event can connect anchors across an unobserved trajectory change and invalidate the estimated path through that interval. Detection gaps, tracking errors, and classification mistakes can therefore compromise the result.
- **Airborne geometry:** Homography cannot recover ball height. Player foot points remain proxies, including for headers and other aerial contacts.
- **Surface ambiguity:** The pitch-contact class includes netting; recognizing that class does not guarantee valid ground-plane projection.
- **Timing and identity:** Approximate candidate timing, tracker ID switches, and proximity-based selection can produce incorrect anchors.

## Future work

The next priority is to train a stronger ball detector, improve tracking through occlusion, and train a lightweight temporal contact classifier. The VLM served as an experimental baseline for investigating the approach; a dedicated classifier should be benchmarked for contact accuracy, event recall, and inference cost.

Player selection needs validated acceptance thresholds and abstention behavior. Ground and net contact should be distinguished. The complete pipeline should then be frozen and tested on independent video groups, measuring event recall, automatic event timing, player identity, and final normalized-position error.

Interested in the code, data, or implementation details? [Email me](mailto:hamed.hamze2212@gmail.com) to discuss access.
