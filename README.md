# Dependency Track for Azure DevOps Pipelines
Azure DevOps extension for submitting BOM reports to Dependency-Track

## Parameters
| Name    | Id |      Description      |  Required |
|---------|-|:-------------:|------|
| BOM File Path | bomFilePath |  The path where the BOM file is located. (e.g. 'directory/**/bom.xml'). | True |
| Project Id | dtrackProjId |    The guid of the project in Dependency Track   | True |
| API Key | dtrackAPIKey | The Dependency Track API key | True |
| Dependency Track URI | dtrackURI | The URL to the Dependency Track platform | True |
| Certificate Authority Public Certificate | caFilePath | File path to PEM encoded CA certificate. This setting is used when Dependency Track is using a self-signed certificate or an internal CA provider for it's TLS configuration. | False |

## Usage Example
    trigger:
    - master

    pool:
      vmImage: 'ubuntu-latest'

    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '10.x'
      displayName: 'Install Node.js'

    - script: |
        npm install
        npm install -g @cyclonedx/bom
      displayName: 'npm install'

    - script: |
        cyclonedx-bom -d -o '$(Agent.TempDirectory)/bom.xml'
      displayName: 'Create BOM'

    - task: upload-bom-dtrack-task@1
      displayName: 'Upload BOM to https://dtrack.example.com/'
      inputs:
        bomFilePath: '$(Agent.TempDirectory)/bom.xml'
        dtrackProjId: '00000000-0000-0000-0000-000000000000'
        dtrackAPIKey: '$(dtrackAPIKey)'
        dtrackURI: 'https://dtrack.example.com/'

## Installation
Dependency Track for Azure DevOps Pipelines can be installed from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=GSoft.dependency-track-vsts).

## License
Copyright © 2020, GSoft inc. This code is licensed under the Apache License, Version 2.0. You may obtain a copy of this license at https://github.com/gsoft-inc/gsoft-license/blob/master/LICENSE.

Dependency-Track is Copyright (c) Steve Springett. All Rights Reserved.
https://github.com/DependencyTrack/dependency-track
