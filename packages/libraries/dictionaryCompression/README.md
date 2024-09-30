# @zxcvbn-ts/dictionary-compression

This repository provides utilities for compression and decompression to optimize the bundle size of zxcvbn-ts language packages. It helps reduce the package size for both NPM downloads and client-side usage.

## Purpose
The primary goal of this repository is to centralize the compression logic used across all zxcvbn-ts language packages. This avoids duplication of code and ensures that language packages remain lightweight.

## Usage
By default, all zxcvbn-ts language packages already include this functionality. As a user of zxcvbn-ts, you do not need to interact with or directly use this repository. It serves as a shared resource for the language packages themselves, not for end-users.

## Why This Repository?
Without this repository, each zxcvbn-ts language package would need to include its own compression and decompression logic, leading to larger bundle sizes. By consolidating this logic here, we ensure a more efficient and maintainable approach to handling language package compression.