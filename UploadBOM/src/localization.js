import {loc} from "azure-pipelines-task-lib/task"

function localize(key, ...params) {
  if(params !== undefined && params.length > 0) {
    return loc(key, ...params);
  }
  
  return loc(key)
}
export {localize};