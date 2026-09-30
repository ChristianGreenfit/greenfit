export const YEARLY_PROMO = {
  id: 'octobre-2026',
  months: 12,
  discountChf: 100,
  endDate: '2026-10-31',
}

export function zurichYmd(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Zurich',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function isYearlyPromoActive(date = new Date()) {
  return zurichYmd(date) <= YEARLY_PROMO.endDate
}

export function applyPlanPromo(plan, date = new Date()) {
  if (!plan) {
    return { active: false, discount: 0, catalogPrice: 0, price: 0 }
  }
  const catalogPrice = Number(plan.price) || 0
  const active =
    isYearlyPromoActive(date) && Number(plan.months) === YEARLY_PROMO.months
  const discount = active ? YEARLY_PROMO.discountChf : 0
  return {
    active,
    id: active ? YEARLY_PROMO.id : null,
    discount,
    catalogPrice,
    price: Math.max(0, catalogPrice - discount),
  }
}
