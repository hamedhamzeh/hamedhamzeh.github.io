---
title: Predicting Asphalt Binder Stiffness with Machine Learning
description: This manuscript is under review. We’ll share the full results and further details here after publication.
category: ML Projects
card:
  title: Predicting Asphalt Binder Stiffness
  label: ML Projects · Under review
  description: Comparing machine learning models to predict the stiffness of Sasobit-modified asphalt binders.
image: /images/projects/sasobit-binder-stiffness/sasobit-pellets.webp
media:
  images:
    workflow:
      src: /images/projects/sasobit-binder-stiffness/study-workflow.webp
      title: Schematic Illustration of Research Processes
      alt: The study workflow goes from laboratory testing of asphalt binders and dataset preparation through preprocessing, regression and ensemble modeling, and Bayesian tuning. The final stage compares models using accuracy metrics, Taylor diagrams, and SHAP analysis.
      width: 1248
      height: 832
---

## Abstract

Warm Mix Asphalt (WMA) technologies, utilizing additives like Sasobit, offer a sustainable alternative to traditional Hot Mix Asphalt (HMA) by reducing production temperatures and environmental impact. The rheological performance of asphalt binders, quantified by G\*, is critical for predicting pavement performance, particularly rutting resistance. Traditional laboratory characterization is resource-intensive, motivating the use of Artificial Intelligence and Machine Learning for predictive modelling. This study aims to develop and compare the performance of several ML and deep learning algorithms for predicting G\* of Sasobit-modified asphalt binders.

A comprehensive dataset, featuring four input variables, was utilized, and the predictive accuracy of various models, including ANN, GPR and XGB was evaluated using statistical metrics such as RMSE and R². In addition, three stacking ensemble models were developed, combining ANN, GPR, and XGB as base learners with different meta-learners optimized via Bayesian search. The results show that all models achieved high predictive accuracy, with GPR (R² = 0.9875, RMSE = 0.314) and the stacking ensemble with XGB as the meta-learner (R² = 0.9851, RMSE = 0.3431) outperforming the others. This study demonstrates that AI models can reliably predict Sasobit-modified binder properties, minimizing laboratory effort and supporting more efficient mixture design and pavement performance improvement.

## Research Workflow

<figure className="project-technical-figures project-technical-figures--compact">
  <figcaption className="text-center">Schematic Illustration of Research Processes</figcaption>
  <ImageBlock id="workflow" display="card" />
</figure>
