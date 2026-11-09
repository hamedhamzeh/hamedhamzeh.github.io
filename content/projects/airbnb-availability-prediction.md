---
title: Airbnb Availability Prediction Pipeline
subtitle: Quera MLOps Minicamp
description: Built a pipeline for 10,480 Airbnb listings, tracked experiments in MLflow, and served single and batch predictions through a Dockerized FastAPI API.
category: MLOps
date: '2026-06-18'
replaces: mlops-01
card:
  title: Airbnb Availability Prediction Pipeline
  label: MLOps · Quera Minicamp
  description: Built a pipeline for 10,480 Airbnb listings, tracked experiments in MLflow, and served single and batch predictions through a Dockerized FastAPI API.
image: /images/projects/mlops/airbnb-pipeline.webp
tech:
  - PostgreSQL
  - pandas
  - scikit-learn
  - MLflow
  - FastAPI
  - Docker
media:
  images:
    pipeline:
      src: /images/projects/mlops/airbnb-pipeline.webp
      title: From listing data to predictions
      alt: Listing data moves from PostgreSQL through feature preparation and MLflow experiments to a FastAPI service for single and batch predictions.
      caption: The same workflow connects dataset preparation, model selection, and inference.
      width: 1200
      height: 675
    batch-response:
      src: /images/projects/mlops/airbnb-batch-response.webp
      title: FastAPI batch prediction response
      alt: A saved Swagger response shows HTTP 200 and two predictions, each with a class, probability, and decision threshold.
      caption: A local batch request returned two predictions with their class labels, probabilities, and threshold.
      width: 425
      height: 281
    docker-sizes:
      src: /images/projects/mlops/airbnb-docker-sizes.webp
      title: Docker image size comparison
      alt: The original Docker image used 2.72 GB locally. The multi-stage image used 1.29 GB, a reduction of about 53 percent.
      caption: Local Docker image disk usage measured in the final comparison.
      width: 1040
      height: 420
---

## Overview

In this project, I worked through a practical question. How can I combine data from several database tables, train a model, and serve predictions for new inputs through an API? My goal was to practice the full path from raw data to a reproducible prediction service, with a record of how I chose the model and a consistent set of inputs at training and serving time:

1. I built and validated a dataset for 10,480 listings, using a cutoff to separate the inputs from the future calendar data that defined the label.
2. I compared models in MLflow, deliberately tested a feature that leaked future information, and selected the random forest from the eligible runs.
3. I served the selected pipeline through FastAPI, checked single and batch predictions, and compared two Docker builds.

The final service estimates whether an Airbnb listing will have low calendar availability over the next 30 days, using availability as a proxy for demand. A caller submits listing details and features derived from past reviews and calendar history. The API accepts one listing or a batch and returns a probability and a predicted class for each listing.

## My Contribution

I built the PostgreSQL feature extraction and dataset validation, compared classifiers in MLflow, and implemented the model-loading and prediction logic for the FastAPI service. I packaged the service with Docker, ran it with Compose, and compared a full-base build with a smaller multi-stage build. Quera provided the shared PostgreSQL and MLflow services, assignment notebooks, and starter API schemas and tests.

## How It Works

<div className="project-technical-figures project-technical-figures--compact">
  <ImageBlock id="pipeline" display="card" />
</div>

1. **Build the dataset.** I fixed a cutoff date and assembled one row per listing from listing attributes, reviews, and 30- and 90-day calendar history. I derived the label from the following 30 days, audited personal fields, and validated the feature set before exporting CSV and Parquet.
2. **Compare models.** I logged baselines, logistic regression variants, and a random forest in MLflow. One diagnostic run deliberately received a future availability feature that helped define the label. I excluded it from model selection and chose the random forest from the runs using only eligible features.
3. **Serve predictions.** The FastAPI app loads the selected pipeline from MLflow at startup. It validates input, arranges features in training order, and returns probabilities and classes for single or batch requests. The packaging assignment also includes Kubernetes Deployment and Service manifests.

### Data foundations

Two related exercises covered the steps before model development. I packaged a CSV pipeline for neighborhood summaries with Docker and DVC and pseudonymized fields in the input. In PostgreSQL, I compared the direct neighborhood summary query with a materialized view. The fastest read in five trials fell from 374 ms to 108 ms when reading the precomputed view.

## Results and Scope

The validated dataset contained **10,480 listings** with no duplicate listing rows at the cutoff and complete coverage for the 30-day label window. In a saved local run, the API returned two predictions in a single batch request.

<div className="project-technical-figures project-technical-figures--compact">
  <ImageBlock id="batch-response" display="card" />
</div>

The multi-stage build reduced local Docker image disk usage by about **53%**, from **2.72 GB to 1.29 GB**. The runtime image kept the application and installed dependencies on a slim Python base.

<div className="project-technical-figures project-technical-figures--compact">
  <ImageBlock id="docker-sizes" display="card" />
</div>

## Task Repositories

1. Build and validate the feature dataset for 10,480 listings. [hw11_etl-pipeline](https://github.com/hamedhamzeh/mlops-bootcamp/tree/main/hw11_etl-pipeline)
2. Compare models in MLflow and select the random forest. [hw12_mlflow](https://github.com/hamedhamzeh/mlops-bootcamp/tree/main/hw12_mlflow)
3. Serve the selected model through a FastAPI API with single and batch predictions. [hw13_fastapi-serving](https://github.com/hamedhamzeh/mlops-bootcamp/tree/main/hw13_fastapi-serving)
4. Package the service with Docker, compare image sizes, and define Kubernetes manifests. [hw21_model-serving](https://github.com/hamedhamzeh/mlops-bootcamp/tree/main/hw21_model-serving)
5. Package the CSV neighborhood-summary pipeline with Docker and DVC. [hw01_airbnd-ops](https://github.com/hamedhamzeh/mlops-bootcamp/tree/main/hw01_airbnd-ops)
6. Benchmark the neighborhood summary query against a PostgreSQL materialized view. [hw02_sql-metabase](https://github.com/hamedhamzeh/mlops-bootcamp/tree/main/hw02_sql-metabase)
