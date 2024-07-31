# jupyterlab-xssguard

[![Github Actions Status](https://github.com/jfrog/jupyterlab-xssguard/workflows/Build/badge.svg)](https://github.com/jfrog/jupyterlab-xssguard/actions/workflows/build.yml)

This extension is still experimental, not for production use.

A JupyterLab extension that mitigates XSS attacks by sandboxing the HTML output element of code cells.

The extension works by embedding the HTML output of code cells inside a sandboxed iframe, that disallows access to its parent document.

In case of an XSS attack such as [CVE-2024-27132](https://research.jfrog.com/vulnerabilities/mlflow-untrusted-recipe-xss-jfsa-2024-000631930/), the JavaScript payload will not be able to escape the plugin's sandbox to run arbitrary Python code or access sensitive DOM elements.

### No XSSGuard

![before](images/before.png)

### With XSSGuard

![after](images/after.png)

## Requirements

- JupyterLab >= 4.0.0

## Installation

We recommend installing the extension through JupyterLab's Extension Manager -

![install](images/install.png)

For a standalone installation, execute:

```bash
pip install jupyterlab-xssguard
```
