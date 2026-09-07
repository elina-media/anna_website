/**
 * Generates a one-time Kaspi payment link for the given amount.
 *
 * Not implemented yet: the real integration (Kaspi's payment-link API,
 * "API PAY") will be wired in here once available. Until then this always
 * resolves to `null`, and callers must fall back to showing bank requisites
 * instead (see components/PayForm.tsx).
 */
export async function createKaspiPayLink(
  amountTenge: number
): Promise<string | null> {
  if (!Number.isInteger(amountTenge) || amountTenge <= 0) {
    throw new RangeError('amountTenge must be a positive integer');
  }

  return null;
}
