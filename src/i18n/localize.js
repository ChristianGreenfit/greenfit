import { defaultContentDe } from '../data/defaultContent.de'

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export function localizeContent(fr, lang) {
  if (lang !== 'de' || !fr) return fr
  const de = clone(defaultContentDe)

  de.site.name = fr.site?.name ?? de.site.name
  de.site.logo = fr.site?.logo ?? de.site.logo

  de.hero.video = fr.hero?.video ?? de.hero.video
  de.hero.poster = fr.hero?.poster ?? de.hero.poster
  if (fr.hero?.stats) {
    de.hero.stats = de.hero.stats.map((stat, i) => ({
      ...stat,
      value: fr.hero.stats[i]?.value ?? stat.value,
    }))
  }

  if (fr.centre?.photos) de.centre.photos = fr.centre.photos
  if (fr.centre?.metrics) {
    de.centre.metrics = de.centre.metrics.map((m, i) => ({
      ...m,
      value: fr.centre.metrics[i]?.value ?? m.value,
    }))
  }

  if (fr.planning?.schedule) de.planning.schedule = fr.planning.schedule
  if (fr.planning?.types) {
    de.planning.types = { ...de.planning.types }
    Object.keys(fr.planning.types).forEach((key) => {
      de.planning.types[key] = {
        ...fr.planning.types[key],
        ...(de.planning.types[key] || {}),
        label: de.planning.types[key]?.label || fr.planning.types[key].label,
      }
    })
  }

  if (fr.tarifs?.plans?.length) {
    de.tarifs.plans = fr.tarifs.plans.map((live) => {
      const tr = de.tarifs.plans.find(
        (p) => Number(p.months) === Number(live.months),
      )
      return {
        ...live,
        name: tr?.name ?? live.name,
        tagline: tr?.tagline ?? live.tagline,
        cta: tr?.cta ?? live.cta,
        months: Number(live.months),
      }
    })
  }
  if (fr.tarifs?.addons) {
    de.tarifs.addons = de.tarifs.addons.map((addon) => {
      const live = fr.tarifs.addons.find((a) => a.id === addon.id)
      return live ? { ...addon, price: live.price } : addon
    })
  }

  if (fr.bienEtre?.offers) {
    de.bienEtre.offers = fr.bienEtre.offers.map((offer) => {
      const tr = de.bienEtre.offers.find(
        (o) => o.url === offer.url || o.src === offer.src || o.title === offer.title,
      )
      return {
        ...offer,
        text: tr?.text ?? offer.text,
        alt: tr?.alt ?? offer.alt,
      }
    })
  }

  de.contact.phone = fr.contact?.phone ?? de.contact.phone
  de.contact.phoneHref = fr.contact?.phoneHref ?? de.contact.phoneHref
  de.contact.email = fr.contact?.email ?? de.contact.email
  de.contact.addressLine1 = fr.contact?.addressLine1 ?? de.contact.addressLine1
  de.contact.mapsUrl = fr.contact?.mapsUrl ?? de.contact.mapsUrl

  return de
}
