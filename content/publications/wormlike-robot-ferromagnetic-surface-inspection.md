---
title: 'A Wormlike Robot for Ferromagnetic Surface Inspection: A Novel System Inspired by Caterpillars'
description: 'A published journal article about a wormlike robot for ferromagnetic surface inspection.'
authors:
  - name: Parisa Parhami
    citationName: P. Parhami
  - name: Mohammad Hossein Salehpour
    citationName: M. H. Salehpour
  - name: Hamed Hamzeh
    citationName: H. Hamzeh
    isHighlighted: true
  - name: Rezvan Nasiri
    citationName: R. Nasiri
  - name: Hadi Moradi
    citationName: H. Moradi
venue: IEEE Robotics & Automation Magazine (Early Access)
year: 2026
type: Journal article
status: Published
image: /images/assets/wormlike-robot-poster.webp
url: https://ieeexplore.ieee.org/document/11551324
linkLabel: View on IEEE Xplore
doi: 10.1109/MRA.2026.3683248
media:
  galleries:
    design:
      - src: /images/publications/wormlike-robot/problem-statement.webp
        alt: Diagram of the challenges of ferromagnetic-surface inspection and the four design goals of maneuverability, stability and robustness, and energy efficiency
        width: 1379
        height: 791
        title: Problem statement and design objectives
        caption: The robot targets maneuverability, stability and robustness, and energy efficiency for inspecting ferromagnetic structures.
      - src: /images/publications/wormlike-robot/design-parts.webp
        alt: Labeled diagram of the robot module components, including magnets, flexible belt, DC motor, and spring joints
        width: 618
        height: 405
        title: Module components
        caption: Each driving section carries the magnets, flexible belt, motor, pulleys, and a Hall-effect sensor.
      - src: /images/publications/wormlike-robot/design-dimensions.webp
        alt: Dimensioned drawing of a module with its attachment configurations on flat and curved surfaces
        width: 516
        height: 398
        title: Dimensions and attachment
        caption: A module measures about 8.5 × 12.5 × 6.5 cm and adapts to flat and curved surfaces.
    results:
      - src: /images/publications/wormlike-robot/experiments-corner-transitions.webp
        alt: Time-lapse frames of the robot performing internal and external corner transitions
        width: 1401
        height: 373
        title: Corner transitions
        caption: The robot completed internal and external 90° corner transitions in various gravity orientations.
      - src: /images/publications/wormlike-robot/experiments-pipe-falling.webp
        alt: Time-lapse frames of pipe climbing and of a single module holding the robot during a fall
        width: 1401
        height: 192
        title: Pipe inspection and falling robustness
        caption: The robot climbed a 15 cm pipe, and one attached module held the rest of the robot in the worst-case falling test.
      - src: /images/publications/wormlike-robot/energy-forward-velocity.webp
        alt: Plot of forward velocity against oscillation frequency for simple and bio-inspired locomotion
        width: 453
        height: 465
        title: Forward velocity
        caption: Worm-like locomotion raises forward velocity by up to 10.2% over simple locomotion.
      - src: /images/publications/wormlike-robot/energy-cost-of-transport.webp
        alt: Plot of cost of transportation against oscillation frequency for simple and bio-inspired locomotion
        width: 429
        height: 466
        title: Cost of transportation
        caption: The same locomotion lowers the cost of transportation by up to 6.7% (p = 0.0002).
  videoGalleries:
    experiments:
      - src: '/videos/wormlike-robot/Experiment 1 (Inside Corner Transition).mp4'
        poster: /videos/wormlike-robot/posters/inside-corner-transition.webp
        title: Inside corner transition
        description: The robot moves from a horizontal surface onto a vertical ferromagnetic surface, shown from three views.
        width: 1280
        height: 720
      - src: /videos/wormlike-robot/turning-silent.mp4
        poster: /videos/wormlike-robot/posters/turning.webp
        title: Turning
        description: The robot changes direction while adhering to a vertical panel.
        width: 1280
        height: 720
      - src: '/videos/wormlike-robot/Experiment 4 (Pipe Circling & Climbing).mp4'
        poster: /videos/wormlike-robot/posters/pipe-circling-climbing.webp
        title: Pipe circling and climbing
        description: The robot moves around the inside of a pipe and climbs its surface.
        width: 1280
        height: 720
      - src: /videos/wormlike-robot/energy-efficiency-silent.mp4
        poster: /videos/wormlike-robot/posters/energy-efficiency.webp
        title: Energy efficiency experiment
        description: The clip compares two locomotion patterns used in the energy-efficiency experiment.
        width: 1280
        height: 720
      - src: /videos/wormlike-robot/roughness-silent.mp4
        poster: /videos/wormlike-robot/posters/roughness.webp
        title: Surface roughness experiment
        description: The robot is tested on a textured surface with different magnet configurations.
        width: 1280
        height: 720
---

## Overview

The Wormlike Inspection Robot is a bio-inspired system for inspecting ferromagnetic structures such as steel pipes, vessels, and walls. Inspired by the segmented body of a silkworm, it links three identical modules with spring joints. This flexible, modular body can follow curved surfaces and cross corners that are difficult for a rigid inspection robot to reach.

Each module carries a passive magnetic adhesion system, so the robot holds on without spending energy to generate adhesion — including during a power loss. The paper evaluates the design's maneuverability, stability, robustness, and energy efficiency through analytical models and physical experiments.

## Demonstrations

<VideoGallery id="experiments" showTitle="false" />

## Robot design

The design targets four goals at once.

<ol className="research-flow research-flow--four" aria-label="Design objectives">
  <li><strong>Maneuverability</strong><span>Reach confined spaces and traverse internal and external corners, cylinders, and pipes with a three-module body.</span></li>
  <li><strong>Stability</strong><span>Stay attached during complex maneuvers with a passive magnetic adhesion system.</span></li>
  <li><strong>Energy efficiency</strong><span>Exploit the natural dynamics of cyclic crawling through a compliant, spring-linked body.</span></li>
  <li><strong>Robustness</strong><span>Keep maneuverability and stability in uncertain conditions and survive partial falls.</span></li>
</ol>

WEach module weighs about 400 g and measures roughly 8.5 × 12.5 × 6.5 cm. It has two identical driving sections joined by a passive central joint, allowing the module to adapt to uneven surfaces and edges. Each section includes a DC motor, timing pulleys, and a Hall-effect sensor for speed feedback. Lightweight PLA and Plexiglas parts help keep the center of mass close to the surface, reducing the chance of sliding.

We embedded neodymium magnets near the outer surface of 3D-printed flexible belts. This keeps the magnets close to the metal while letting the belts conform to irregularities; the grip needs no power to remain attached. Pairs of replaceable springs connect adjacent modules, helping the body bend around corners and supporting cyclic, worm-like locomotion over longer distances.

<Gallery id="design" showCaptions="false" />

## Results and analysis

The analytical model asks whether each module has enough magnetic grip to resist sliding as the direction of gravity changes. Corner transitions are especially demanding because only one magnet may be in contact while the body rotates across an edge. The model also identifies a design trade-off for turning: stiffer spring joints increase the minimum turning radius, while stronger adhesion permits a tighter turn. For a partial fall, the required adhesion is based on the case where one module must support the others.

The physical tests covered five internal and five external 90° corner transitions at different orientations to gravity. The robot completed a wall U-turn at its 25 cm minimum turning radius and climbed and circled a 15 cm pipe. In a demanding fall test, one attached module held equal-mass substitutes for the detached modules, plus an additional module. During some corner transitions, modules that briefly detached were brought back into contact by the rest of the body.

To see whether the compliant body could make travel more efficient, we compared simple locomotion with a cyclic pattern that oscillates the middle module relative to the outer two. We ran ten trials at each of nine frequencies on a 4 m flat, non-ferromagnetic path. At the estimated natural frequency of 1.5 Hz, the cyclic pattern increased forward speed by 7.4% and reduced cost of transportation by 5.6%. The strongest measured result came at 0.4 Hz: 10.2% higher speed and 6.7% lower cost of transportation. That lower-frequency result suggests the robot's nonlinear dynamics matter alongside its estimated natural frequency.

<Gallery id="results" showCaptions="false" />

<div className="publication-metrics-table" role="region" aria-label="Design and experiment metrics" tabIndex="0">
  <table>
    <thead>
      <tr><th scope="col">Metric</th><th scope="col">Value</th></tr>
    </thead>
    <tbody>
      <tr><td>Min. adhesion force for falling robustness</td><td>≈ 33 N</td></tr>
      <tr><td>Min. turning radius</td><td>25 cm</td></tr>
      <tr><td>Pipe diameters (inside / outside)</td><td>≥ 20 cm / ≥ 15 cm</td></tr>
      <tr><td>Forward-velocity gain at 0.4 Hz</td><td>+10.2%</td></tr>
      <tr><td>Cost-of-transport reduction at 0.4 Hz</td><td>−6.7%</td></tr>
    </tbody>
  </table>
</div>

## Limitations

- **Simplified dynamics:** The analytical models ignore the wheels' rolling dynamics, which is valid only at constant speed or when acceleration is small.
- **Fall testing:** Falling robustness was verified with equal-mass substitutes rather than full failure modes.
- **Test surface:** The energy-efficiency gains were measured on a flat, non-ferromagnetic path, not during on-surface inspection.

Future work includes tuning the joint stiffness, adding image-based scanning and path planning, and tracking planned paths under stability constraints.
