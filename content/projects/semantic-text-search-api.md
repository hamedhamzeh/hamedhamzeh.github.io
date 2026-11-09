---
title: Semantic Text Search API
subtitle: Quera MLOps Minicamp
description: Packaged a versioned text encoder and built a FastAPI service that finds similar texts with Qdrant and retrieves their records from PostgreSQL.
category: MLOps
date: '2026-06-24'
replaces: mlops-02
card:
  title: Semantic Text Search API
  label: MLOps · Quera Minicamp
  description: Packaged a versioned text encoder and built a FastAPI service that finds similar texts with Qdrant and retrieves their records from PostgreSQL.
image: /images/projects/mlops/semantic-search.webp
tech:
  - MiniLM
  - PyTorch
  - FastAPI
  - Qdrant
  - PostgreSQL
  - Docker
media:
  images:
    search-flow:
      src: /images/projects/mlops/semantic-search.webp
      title: From a text query to ranked matches
      alt: MiniLM encodes a query, Qdrant finds similar vectors, and PostgreSQL supplies the matching text and emotion labels.
      caption: The API uses vector similarity to rank matches and PostgreSQL to retrieve their records.
      width: 1200
      height: 675
    search-response:
      src: /images/projects/mlops/semantic-search-response.webp
      title: FastAPI semantic search response
      alt: A saved Swagger response shows HTTP 200 and two visible joy-labeled matches for the query “I am so happy right now.”
      caption: The saved local search returned five matches. The first two are visible here, with record identifiers redacted.
      width: 430
      height: 373
---

## Overview

The service takes a phrase and finds texts with similar meaning in an emotion-labeled corpus. It returns the original text, a similarity score, and the emotion label for each match, ranked by similarity. A caller can choose how many results to return and filter them by language or emotion.

My goal was to learn how to package a pretrained encoder as a versioned artifact and use it in a search service that I could run and test locally.

1. I bundled the MiniLM weights, tokenizer, and inference code, then ran tests on the encoder’s output.
2. I built a Dockerized FastAPI service that verifies the bundle at startup and exposes it for inference.
3. I connected Qdrant for similarity search and PostgreSQL to retrieve the original text and labels for each match.

In the example below, in a saved local run, the query "**I am so happy right now**" returned five matches. The first two were "**I'm so happy for you !**" and "**I am so so happy for you. <3**". Both carried the label joy in the corpus.

<div className="project-technical-figures project-technical-figures--compact">
  <ImageBlock id="search-response" display="card" />
</div>

## My Contribution

I packaged the pretrained MiniLM encoder and implemented the model loader, FastAPI endpoints, and retrieval logic. I connected the service to the course's Qdrant index and PostgreSQL corpus. Quera provided the indexed corpus, Docker scaffolding, and starter test suites.

## How It Works

<div className="project-technical-figures project-technical-figures--compact">
  <ImageBlock id="search-flow" display="card" />
</div>

1. **Package the encoder.** The versioned bundle contains pinned MiniLM weights, tokenizer files, metadata, and inference code. A SHA-256 manifest records the expected hash of each bundled file.
2. **Load and embed.** The service verifies the manifest before loading the encoder. The inference code pools token outputs and normalizes each resulting 384-dimensional vector.
3. **Retrieve matches.** Qdrant ranks nearby vectors and applies filters such as language and emotion. The service looks up the matching IDs in PostgreSQL and returns the text and labels in search order.

## Results and Scope

The saved encoder run passed **23 tests**, covering tokenization, output shape, normalization, determinism, and edge cases. The separate service test run recorded **9 passes and 6 skips**. The skipped checks depended on a loaded bundle or reachable backends. The Swagger response above records a successful local request with the search stack running.

## Task Repositories

1. Package the pretrained MiniLM encoder with its tokenizer, inference code, and SHA-256 manifest. [HW3_A](https://github.com/hamedhamzeh/mlops-bootcamp/tree/main/hw22_deployment/HW3_A)
2. Serve the bundle through FastAPI and Docker, using Qdrant for vector search and PostgreSQL for record lookup. [HW3_B](https://github.com/hamedhamzeh/mlops-bootcamp/tree/main/hw22_deployment/HW3_B)
