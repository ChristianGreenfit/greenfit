/**
 * Crée une commande et récupère l'URL de paiement Saferpay.
 * Appelle la fonction serverless Vercel `/api/create-order` (même origine).
 * @returns {Promise<{redirectUrl?: string, orderId?: number, errors?: string[]}>}
 */
export async function createOrder({ months, optionIds, client }) {
  try {
    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ months, optionIds, client }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return { errors: data.errors || ['Une erreur est survenue, réessayez.'] }
    }
    return data
  } catch {
    return { errors: ['Impossible de contacter le serveur de paiement.'] }
  }
}
