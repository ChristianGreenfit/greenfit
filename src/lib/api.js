const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL || ''
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

/**
 * Crée une commande et récupère l'URL de paiement Saferpay.
 * @returns {Promise<{redirectUrl?: string, orderId?: number, errors?: string[]}>}
 */
export async function createOrder({ months, optionIds, client }) {
  if (!FUNCTIONS_URL) {
    return {
      errors: [
        "Le paiement n'est pas encore configuré (VITE_FUNCTIONS_URL manquant).",
      ],
    }
  }

  try {
    const res = await fetch(`${FUNCTIONS_URL}/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
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
