---
title: 'Design of a Remote Controlled Puppet Robot Imitating a Manual Driven Puppet Using Deep Learning Pose Detection'
description: 'A modular Wi-Fi-controlled puppet robot that uses a custom YOLOv8 pose model to translate seven detected puppet keypoints into real-time head and arm motion.'
authors:
  - name: Hamed Hamzeh
    citationName: H. Hamzeh
    isHighlighted: true
  - name: Kiarash Shahroozi
    citationName: K. Shahroozi
  - name: Ahmad Nabipour
    citationName: A. Nabipour
  - name: Parham Kazemi
    citationName: P. Kazemi
  - name: Mohammad Malek-Zahedi
    citationName: M. Malek-Zahedi
  - name: Mehdi Hallajian
    citationName: M. Hallajian
  - name: Hadi Moradi
    citationName: H. Moradi
venue: 2024 12th RSI International Conference on Robotics and Mechatronics (ICRoM)
year: 2024
type: Conference paper
status: Published
image: /videos/puppet-robot/posters/puppet-demo-1.webp
url: https://ieeexplore.ieee.org/document/10903519
linkLabel: View on IEEE Xplore
doi: 10.1109/ICRoM64545.2024.10903519
presentation:
  label: Oral presentation
  note: Selected for oral presentation at ICRoM 2024.
  gallery:
    triggerLabel: View presentation certificate
    dialogLabel: ICRoM 2024 presentation certificate
    images:
      - src: /images/assets/ICROM 2024.webp
        alt: ICRoM 2024 certificate confirming the puppet robot paper was presented in oral format
        width: 1636
        height: 1181
        title: ICRoM 2024 presentation certificate
        caption: 12th RSI International Conference on Robotics and Mechatronics · December 2024
media:
  images:
    pose-annotations:
      src: /images/publications/puppet-robot/pose-annotations.webp
      alt: Seven-point puppet pose template beside an annotated puppet image
      width: 605
      height: 355
      caption: The custom annotation scheme maps the head, neck, shoulders, wrists, and pelvis to the robot's structure.
  galleries:
    mechanical-design:
      - src: /images/publications/puppet-robot/cad-and-prototype.webp
        alt: CAD model beside the assembled puppet robot prototype
        width: 715
        height: 430
        title: CAD model and prototype
        caption: The adjustable CAD design and its manufactured prototype.
      - src: /images/publications/puppet-robot/base-assembly.webp
        alt: Assembled and exploded CAD views of the puppet robot base
        width: 665
        height: 420
        title: Base and rotation mechanism
        caption: The base houses the full-body rotation servo, bearing, spacers, and Plexiglas structure.
      - src: /images/publications/puppet-robot/body-assembly.webp
        alt: Assembled and exploded CAD views of the puppet robot arms and head mechanism
        width: 595
        height: 630
        title: Arms and head mechanism
        caption: Adjustable arm and head assemblies driven by three SG90 servo motors.
      - src: /images/publications/puppet-robot/mobile-base.webp
        alt: Puppet robot prototype mounted on a two-motor mobile base
        width: 570
        height: 915
        title: Optional mobile base
        caption: A detachable two-motor, three-wheel platform supports mobile operation on flat surfaces.
  videoGalleries:
    demonstrations:
      - src: '/videos/puppet-robot/Pupeet Video1-1.mp4'
        poster: /videos/puppet-robot/posters/puppet-demo-1.webp
        title: Puppet-mounted response
        description: The detected motion of a manually operated puppet drives a second puppet mounted on the robot.
        width: 1280
        height: 720
      - src: '/videos/puppet-robot/Pupeet Video2-1.mp4'
        poster: /videos/puppet-robot/posters/puppet-demo-2.webp
        title: Pose-to-motion test
        description: The uncovered mechanism responds while the custom model detects the reference puppet's keypoints.
        width: 1280
        height: 720
      - src: '/videos/puppet-robot/Pupeet Video3-1.mp4'
        poster: /videos/puppet-robot/posters/puppet-demo-3.webp
        title: Arm and head tracking
        description: A side-by-side test shows detected upper-body motion mapped to the robot's arms and head.
        width: 1280
        height: 720
---

## Overview

Traditional puppet manipulation often places the operator close to the performance area, creating a crowded setup and limiting where the puppet can be positioned. This paper presents a compact, cost-effective robot that moves the operator away from the puppet while retaining real-time control.

The system combines an adjustable mechanical platform with a custom YOLOv8 pose model. It observes a manually operated puppet, estimates seven keypoints, filters the detected motion, and sends joint commands over Wi-Fi so the robotic puppet can imitate the reference motion. Education, entertainment, and teleoperation are proposed applications; the paper does not report a clinical or classroom study.

## Demonstrations

<VideoGallery id="demonstrations" showTitle="false" />

## Architecture

The prototype forms an end-to-end perception and control loop rather than using pose detection as a standalone demonstration.

<ol className="research-flow" aria-label="Puppet robot control pipeline">
  <li><strong>Reference motion</strong><span>A human operator moves a puppet within the camera view.</span></li>
  <li><strong>Pose estimation</strong><span>YOLOv8 detects a bounding box and seven puppet keypoints in each frame.</span></li>
  <li><strong>Motion filtering</strong><span>Kalman and threshold-based filters reduce jitter and reject abrupt changes.</span></li>
  <li><strong>Joint mapping</strong><span>Relative keypoint positions are converted into target angles for the head and arm joints.</span></li>
  <li><strong>Wireless actuation</strong><span>Commands travel over Wi-Fi to the NodeMCU, which updates the servo positions.</span></li>
</ol>

The current vision pipeline drives the robot's head and arms. Although the hardware also includes full-body rotation and can attach to a mobile base, those motions are not yet controlled by the trained model.

## Mechanical design

The stationary robot measures approximately 160 mm high, 90 mm wide, and 75 mm deep with its arms retracted. Its two 80 mm arms, 50 mm head structure, and main body can be adjusted for puppets of different sizes.

Most structural parts are 3D-printed in PLA, while Plexiglas provides a rigid base. Two SG90 servos move the arms, a third SG90 moves the head, and an SG-5010 Pro servo rotates the body. The modular construction keeps the motors accessible for maintenance and allows the stationary unit to be mounted on an optional base with two DC motors and three wheels.

<Gallery id="mechanical-design" showCaptions="false" />

## Model and results

The custom dataset contains 2,000 puppet images annotated in Roboflow with a bounding box and seven keypoints: head, neck, left and right shoulders, left and right wrists, and pelvis. These points mirror the robot's articulated structure and provide the geometry needed to map observed motion to its joints.

Rotation, resizing, and brightness augmentation were used to diversify the training data. The learning rate and batch size were tuned during training, while bounding-box and pose losses were tracked on both training and validation data.

<ImageBlock id="pose-annotations" display="card" />

The paper reports 91.4% overall accuracy and 0.91 mean average precision, alongside a false-positive rate of 0.08, a false-negative rate of 0.12, and a mean squared error of 0.015. These values reproduce the paper's evaluation and are not intended as a cross-model benchmark.

<div className="publication-metrics-table" role="region" aria-label="Model evaluation metrics" tabIndex="0">
  <table>
    <thead>
      <tr><th scope="col">Metric</th><th scope="col">Value</th></tr>
    </thead>
    <tbody>
      <tr><td>Overall Accuracy</td><td>91.4%</td></tr>
      <tr><td>False Positive Rate (FPR)</td><td>0.08</td></tr>
      <tr><td>False Negative Rate (FNR)</td><td>0.12</td></tr>
      <tr><td>Mean Squared Error (MSE)</td><td>0.015</td></tr>
      <tr><td>Mean Average Precision (mAP)</td><td>0.91</td></tr>
      <tr><td>Training Loss</td><td>0.082</td></tr>
    </tbody>
  </table>
</div>

## Control

Detected keypoints are converted into commands for the physical robot. The distance between the neck and wrist points informs the shoulder positions, while the relative head and neck positions control the head servo. A Kalman filter smooths frame-to-frame variation, and threshold-based filtering rejects changes that are too abrupt to represent plausible motion.

After filtering and joint mapping, the processed commands are transmitted over Wi-Fi to the NodeMCU. Servo targets are updated as new frames arrive, allowing the prototype to respond continuously within the limits of its current mechanical and vision configuration.

## Limitations

- **One-puppet dataset:** The model was trained on a single puppet, limiting evidence of generalization to different puppet shapes and appearances.
- **Partial motion mapping:** The trained system controls the head and arms but does not infer whole-body rotation or mobile-base motion.
- **Planned extensions:** The paper proposes adding rotation information, expanding the dataset, improving augmentation, and using pruning or quantization for edge deployment.
