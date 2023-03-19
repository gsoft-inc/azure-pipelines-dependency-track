import * as tl from "azure-pipelines-task-lib/task"

class TaskParametersUtility {
    static GetParameters() {
        let params = {
            nameOrId: tl.getInput('nameOrId', true),
            projectId: tl.getInput('dtrackProjId', false),
            projectName: tl.getInput('dtrackProjName', false),
            projectVersion: tl.getInput('dtrackProjVersion', false),
            isProjectAutoCreated: tl.getBoolInput('dtrackProjAutoCreate', false),
            bomFilePath: tl.getPathInput('bomFilePath', true, true),
            dtrackAPIKey: tl.getInput('dtrackAPIKey', true),
            dtrackURI: tl.getInput('dtrackURI', true),
            caFilePath: tl.getPathInput('caFilePath', false, true),
          
            thresholdAction: tl.getInput('thresholdAction', false) || 'none',
            thresholdCritical: tl.getInput('thresholdCritical', false) || -1,
            thresholdHigh: tl.getInput('thresholdHigh', false) || -1,
            thresholdMedium: tl.getInput('thresholdMedium', false) || -1,
            thresholdLow: tl.getInput('thresholdLow', false) || -1,
            thresholdUnassigned: tl.getInput('thresholdUnassigned', false) || -1,
          
            thresholdpolicyViolationsFail: tl.getInput('thresholdpolicyViolationsFail', false) || -1,
            thresholdpolicyViolationsWarn: tl.getInput('thresholdpolicyViolationsWarn', false) || -1,
            thresholdpolicyViolationsInfo: tl.getInput('thresholdpolicyViolationsInfo', false) || -1,
            thresholdpolicyViolationsTotal: tl.getInput('thresholdpolicyViolationsTotal', false) || -1,
        };

        return params;
    }
}
export default TaskParametersUtility;