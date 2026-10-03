export interface ExamNavigationFooterProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onConfirmSubmit: () => void;
  isBusy?: boolean;
  isSubmitting?: boolean;
  pendingCount?: number;
}
/* eslint-disable @typescript-eslint/no-unused-vars */
export function ExamNavigationFooter({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onConfirmSubmit,
  isBusy,
  isSubmitting,
  pendingCount,
}: ExamNavigationFooterProps) {
  return null;
}
/* eslint-enable @typescript-eslint/no-unused-vars */
