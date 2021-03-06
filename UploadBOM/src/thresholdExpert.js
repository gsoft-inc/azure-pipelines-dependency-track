import { localize } from "./localization";

class ThresholdExpert {
  constructor(criticalCount, highCount, mediumCount, lowCount, unassignedCount) {
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

    this.criticalCount = criticalCount;
    this.highCount = highCount;
    this.mediumCount = mediumCount;
    this.lowCount = lowCount;
    this.unassignedCount = unassignedCount;
  }

  areThresholdsValidated() {
    return this.criticalCount >= 0 ||
      this.highCount >= 0 ||
      this.mediumCount >= 0 ||
      this.lowCount >= 0 ||
      this.unassignedCount >= 0;
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
  }
}
export default ThresholdExpert;