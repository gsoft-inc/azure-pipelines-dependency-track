import { localize } from "./localization";

class ThresholdExpert {
  constructor(criticalCount, 
    highCount, 
    mediumCount, 
    lowCount, 
    unassignedCount,
    policyViolationsFail,
    policyViolationsWarn,
    policyViolationsInfo,
    policyViolationsTotal) {
    if (!Number.isInteger(criticalCount)) {
      throw new Error(localize('ThresholdInNotAnInteger', localize('Critical')));
    }

    if (!Number.isInteger(highCount)) {
      throw new Error(localize('ThresholdInNotAnInteger', localize('High')));
    }

    if (!Number.isInteger(mediumCount)) {
      throw new Error(localize('ThresholdInNotAnInteger', localize('Medium')));
    }

    if (!Number.isInteger(lowCount)) {
      throw new Error(localize('ThresholdInNotAnInteger', localize('Low')));
    }

    if (!Number.isInteger(unassignedCount)) {
      throw new Error(localize('ThresholdInNotAnInteger', localize('Unassigned')));
    }

     if (!Number.isInteger(policyViolationsFail)) {
      throw new Error(localize('ThresholdInNotAnInteger', localize('policyViolationsFail')));
    }

     if (!Number.isInteger(policyViolationsWarn)) {
      throw new Error(localize('ThresholdInNotAnInteger', localize('policyViolationsWarn')));
    }

     if (!Number.isInteger(policyViolationsInfo)) {
      throw new Error(localize('ThresholdInNotAnInteger', localize('policyViolationsInfo')));
    }

     if (!Number.isInteger(policyViolationsTotal)) {
      throw new Error(localize('ThresholdInNotAnInteger', localize('policyViolationsTotal')));
    }

    this.criticalCount = criticalCount;
    this.highCount = highCount;
    this.mediumCount = mediumCount;
    this.lowCount = lowCount;
    this.unassignedCount = unassignedCount;
    this.policyViolationsFail = policyViolationsFail;
    this.policyViolationsWarn = policyViolationsWarn;
    this.policyViolationsInfo = policyViolationsInfo;
    this.policyViolationsTotal = policyViolationsTotal;
  }

  areThresholdsValidated() {
    return this.criticalCount >= 0 ||
      this.highCount >= 0 ||
      this.mediumCount >= 0 ||
      this.lowCount >= 0 ||
      this.unassignedCount >= 0 ||
      this.policyViolationsFail >= 0 ||
      this.policyViolationsWarn >= 0 ||
      this.policyViolationsInfo >= 0 ||
      this.policyViolationsTotal >= 0;
  }

  validateThresholds(metrics) {
    if (this.criticalCount >= 0 && metrics.critical > this.criticalCount) {
      throw new Error(localize('VulnCountThresholdSurpassed', localize('Critical')));
    }

    if (this.highCount >= 0 && metrics.high > this.highCount) {
      throw new Error(localize('VulnCountThresholdSurpassed', localize('High')));
    }

    if (this.mediumCount >= 0 && metrics.medium > this.mediumCount) {
      throw new Error(localize('VulnCountThresholdSurpassed', localize('Medium')));
    }

    if (this.lowCount >= 0 && metrics.low > this.lowCount) {
      throw new Error(localize('VulnCountThresholdSurpassed', localize('Low')));
    }

    if (this.unassignedCount >= 0 && metrics.unassigned > this.unassignedCount) {
      throw new Error(localize('VulnCountThresholdSurpassed', localize('Unassigned')));
    }   

     if (this.policyViolationsFail >= 0 && metrics.policyViolationsFail > this.policyViolationsFail) {
      throw new Error(localize('VulnCountThresholdSurpassed', localize('policyViolationsFail')));
    }

     if (this.policyViolationsWarn >= 0 && metrics.policyViolationsWarn > this.policyViolationsWarn) {
      throw new Error(localize('VulnCountThresholdSurpassed', localize('policyViolationsWarn')));
    }

     if (this.policyViolationsInfo >= 0 && metrics.policyViolationsInfo > this.policyViolationsInfo) {
      throw new Error(localize('VulnCountThresholdSurpassed', localize('policyViolationsInfo')));
    }

     if (this.policyViolationsTotal >= 0 && metrics.policyViolationsTotal > this.policyViolationsTotal) {
      throw new Error(localize('VulnCountThresholdSurpassed', localize('policyViolationsTotal')));
    }
  }
}
export default ThresholdExpert;