export class AlertError extends Error {
  readonly kind = 'alert' as const
  constructor(message: string) { super(message) }
}

export class ConfirmError extends Error {
  readonly kind = 'confirm' as const
  constructor(message: string, public readonly onConfirm: () => void) {
    super(message)
  }
}

export class ApiError extends Error {
  readonly kind = 'api' as const
  constructor(message: string, public readonly status?: number) {
    super(message)
  }
}
