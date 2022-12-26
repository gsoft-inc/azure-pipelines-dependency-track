# Dependency Track for Azure DevOps Pipelines
Azure DevOps extension for submitting BOM reports to Dependency-Track

> Note: BOM files with Byte-Order-Marks are not supported by this extension. This is an issue with Depenedency Track prior to version 3.8.0. [See this issue for the Dependency Track fix](https://github.com/DependencyTrack/dependency-track/issues/2312) and [this issue for this extension.](https://github.com/gsoft-inc/azure-pipelines-dependency-track/issues/28)

## Parameters
### Base Settings
| Name    | Id |      Description      |  Required |
|---------|---|:-------------|------|
| BOM File Path | bomFilePath |  The path where the BOM file is located. (e.g. 'directory/**/bom.xml'). | True |
| Project Id | dtrackProjId |    The guid of the project in Dependency Track   | True |
| API Key | dtrackAPIKey | The Dependency Track API key | True |
| Dependency Track URI | dtrackURI | The URL to the Dependency Track platform | True |

### Threshold Options
Setting these options will force the task to wait for the BOM analysis to be finished and the metrics to be recalculated before finishing the task.

| Name    | Id |      Description      |  Required |
|---------|---|:-------------|------|
| Action on Threshold | thresholdAction |  The result of the task if the threshold is attained. Values are `none`, `warn`, and `error`.   | False |
| Critical Vulnerability Count | thresholdCritical | Maximum number of critical vulnerabilities to tolerate. A value of `-1` disables this threshold. | False |
| High Vulnerability Count | thresholdHigh | Maximum number of high vulnerabilities to tolerate. A value of `-1` disables this threshold. | False |
| Medium Vulnerability Count | thresholdMedium | Maximum number of medium vulnerabilities to tolerate. A value of `-1` disables this threshold. | False |
| Low Vulnerability Count | thresholdLow | Maximum number of low vulnerabilities to tolerate. A value of `-1` disables this threshold. | False |
| Unassigned Vulnerability Count | thresholdUnassigned | Maximum number of unassigned vulnerabilities to tolerate. A value of `-1` disables this threshold. | False |
| Fail Policy Violation Count | thresholdpolicyViolationsFail | Maximum number of failed policy violations to tolerate. A value of `-1` disables this threshold. | False |
| Warn Policy Violation Count | thresholdpolicyViolationsWarn | Maximum number of warn policy violations to tolerate. A value of `-1` disables this threshold. | False |
| Info Policy Violation Count | thresholdpolicyViolationsInfo | Maximum number of info policy violations to tolerate. A value of `-1` disables this threshold. | False |
| Total Policy Violation Count | thresholdpolicyViolationsTotal | Maximum number of Total policy violations to tolerate. A value of `-1` disables this threshold. | False |

### SSL Options
| Name    | Id |      Description      |  Required |
|---------|---|:-------------|------|
| Trusted CA certificate | caFilePath | File path to PEM encoded CA certificate. This setting is used when Dependency Track is using a self-signed certificate or an internal CA provider for it's TLS configuration. | False |

## Basic Usage Example
```yaml
trigger:
- master

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
  displayName: 'Install Node.js'

- script: |
    npm install
    npm install -g @cyclonedx/cyclonedx-npm
  displayName: 'npm install'

- script: |
    cyclonedx-npm --version
    cyclonedx-npm --output-file '$(Agent.TempDirectory)/bom.xml'
  displayName: 'Create BOM'

- task: upload-bom-dtrack-task@1
  displayName: 'Upload BOM to https://dtrack.example.com/'
  inputs:
    bomFilePath: '$(Agent.TempDirectory)/bom.xml'
    dtrackProjId: '00000000-0000-0000-0000-000000000000'
    dtrackAPIKey: '$(dtrackAPIKey)'
    dtrackURI: 'https://dtrack.example.com/'
```

## Thresholds Usage Example
This example finishes the pipeline with a warning if the number of low vulnerabilities surpasse zero.
![Low Threshold Surpassed Warning](https://raw.githubusercontent.com/gsoft-inc/azure-pipelines-dependency-track/master/images/pipelineThresholdWarning.png)
```yaml
trigger:
- master

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
  displayName: 'Install Node.js'

- script: |
    npm install
    npm install -g @cyclonedx/cyclonedx-npm
  displayName: 'npm install'

- script: |
    cyclonedx-npm --version
    cyclonedx-npm --output-file '$(Agent.TempDirectory)/bom.xml'
  displayName: 'Create BOM'

- task: upload-bom-dtrack-task@1
  displayName: 'Upload BOM to https://dtrack.example.com/'
  inputs:
    bomFilePath: '$(Agent.TempDirectory)/bom.xml'
    dtrackProjId: '00000000-0000-0000-0000-000000000000'
    dtrackAPIKey: '$(dtrackAPIKey)'
    dtrackURI: 'https://dtrack.example.com/'
    thresholdAction: 'warn'
    thresholdLow: '0'
```
## Installation
Dependency Track for Azure DevOps Pipelines can be installed from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=GSoft.dependency-track-vsts).

## License
Copyright © 2022, GSoft inc. This code is licensed under the Apache License, Version 2.0. You may obtain a copy of this license at https://github.com/gsoft-inc/gsoft-license/blob/master/LICENSE.

Dependency-Track is Copyright (c) Steve Springett. All Rights Reserved.
https://github.com/DependencyTrack/dependency-track
