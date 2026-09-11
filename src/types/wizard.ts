export type WizardStepId = "config" | "questions";

export interface WizardStepItem {
  id: WizardStepId;
  stepNumber: number;
  label: string;
  status: "active" | "completed" | "disabled";
}
