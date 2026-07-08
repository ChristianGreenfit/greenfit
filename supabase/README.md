# GreenFit — Backend abonnement (Supabase)

Port du plugin WordPress `vv-abonnement` vers Supabase (Postgres + Edge Functions).

## Architecture

```
Site React (Tarifs → InscriptionModal)
        │  POST /create-order  { months, optionIds, client }
        ▼
Edge Function create-order
   1. valide les données          (validation.ts)
   2. calcule le montant serveur  (catalog.ts)
   3. enregistre user + order     (db.ts)
   4. Saferpay Initialize         (saferpay.ts)
   5. renvoie { redirectUrl }
        │
        ▼  redirection navigateur
Page de paiement Saferpay (carte)
        │  retour succès
        ▼
Edge Function checkout-confirm
   1. Assert  + 2. Capture        (saferpay.ts)
   3. createContract SOAP         (contract.ts)  ← à finaliser avec le WSDL
   4. emails client + centre      (email.ts)
   5. redirige vers /resultat?state=success|fail|error
```

## Correspondance des contrats

| Formule | Prix   | Contrat (`sIDContrat`)                 |
|---------|--------|----------------------------------------|
| 3 mois  | 369 CHF | `2016040507190991_2015012617502346`   |
| 6 mois  | 499 CHF | `2023091810523634_2015012617502346`   |
| 12 mois | 850 CHF | `2023090412512030_2015012617502346`   |

## Mise en place

```bash
# 1. Installer la CLI Supabase puis lier le projet
supabase link --project-ref <project-ref>

# 2. Appliquer le schéma
supabase db push

# 3. Déclarer les secrets (voir .env.example)
supabase secrets set \
  SAFERPAY_CUSTOMER_ID=... SAFERPAY_TERMINAL_ID=... \
  SAFERPAY_JSON_KEY=... SAFERPAY_JSON_SECRET=... \
  SAFERPAY_TEST=true \
  SOAP_ENDPOINT=... SOAP_NAMESPACE=... SOAP_PASSWORD=... \
  RESEND_API_KEY=... ADMIN_EMAIL=info@green-fit.ch \
  SITE_URL=https://www.green-fit.ch \
  FUNCTIONS_URL=https://<project-ref>.supabase.co/functions/v1 \
  ALLOWED_ORIGINS=https://www.green-fit.ch

# 4. Déployer les fonctions
supabase functions deploy create-order
supabase functions deploy checkout-confirm --no-verify-jwt
```

> `checkout-confirm` est appelée par Saferpay (redirection navigateur) : elle
> doit être publique, d'où `--no-verify-jwt`.

## SOAP — création de contrat (gsinfo.ch)

Câblé d'après le WSDL `MAW_WebService` :
- endpoint : `http://myfitness.gsinfo.ch/MAW_WEBSERVICE_WEB/awws/MAW_WebService.awws`
- style document/literal, namespace `urn:MAW_WebService`
- méthode `WS_Client_Contract_and_Articles_Create`, 25 paramètres dans l'ordre du schéma
- `sLogin=-1`, `sMotdePasse=""`, `sMethodeChiffrage=0` (comme le plugin)
- réponse url-décodée ; `ERR:` ou entier négatif = échec, sinon succès

> Le bug historique de `Soap.php` (qui transformait une erreur `ERR:` en succès)
> a été **corrigé** dans `_shared/contract.ts`.

## Reste à finaliser

1. **IDs articles des options** : compléter `articleId` dans `_shared/catalog.ts`
   (valeurs `option_N_id` du back-office WordPress) pour que les options soient
   ajoutées au contrat via `sListeIdArticles`.
2. **Saferpay** : confirmer les identifiants de l'**API JSON** en production
   (le plugin `CheckoutController` utilise l'API JSON, pas l'ancienne interface
   « Hosting »), régénérer les clés, configurer les URLs de retour, tester en
   `SAFERPAY_TEST=true`.
3. **Encodage** : le service MAW est ANSI ; surveiller les accents dans les
   noms/villes lors des premiers tests réels.
