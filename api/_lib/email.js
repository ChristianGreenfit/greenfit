// ============================================================
// Envoi d'emails via SMTP (boîte info@green-fit.ch) — nodemailer.
// Email client : confirmation + prochaines étapes (carte) + horaires.
// Email centre : récap commande + données client.
// DA : fond blanc, violet #7c3aed / vert #22c55e (site GreenFit).
// ============================================================

import nodemailer from "nodemailer";
import { config } from "./config.js";

const BRAND = {
  purple: "#7c3aed",
  purpleDark: "#5b21b6",
  green: "#22c55e",
  greenDark: "#15803d",
  ink: "#0e1014",
  muted: "#6b7280",
  soft: "#f7f8f6",
  line: "#e8ebe6",
  white: "#ffffff",
};

const RECEPTION_HOURS = [
  { days: "Lundi – jeudi", hours: "8h30 – 13h30 / 16h30 – 21h00" },
  { days: "Vendredi", hours: "8h30 – 13h30 / 16h30 – 19h00" },
  { days: "Samedi", hours: "9h00 – 12h00" },
  { days: "Dimanche", hours: "Fermé" },
];

const CONTACT = {
  address1: "Industriestrasse 16",
  address2: "3970 Salquenen / Sierre",
  phone: "027 565 41 31",
  phoneHref: "+41275654131",
  email: "info@green-fit.ch",
  maps:
    "https://maps.google.com/?q=Industriestrasse+16,+3970+Salquenen",
};

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  if (!config.smtp.host || !config.smtp.user) return null;
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure || config.smtp.port === 465,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
  });
  return transporter;
}

function money(v) {
  return "CHF " + Number(v).toFixed(2);
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function siteBase() {
  return (config.siteUrl || "https://greenfit-nu.vercel.app").replace(/\/$/, "");
}

function logoUrl() {
  return `${siteBase()}/logo-mark.png`;
}

function layout({ title, preheader, body }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>${esc(title)}</title>
<!--[if mso]><style>body,table,td{font-family:Arial,sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:${BRAND.white};-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.white};">
  <tr>
    <td align="center" style="padding:28px 16px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${BRAND.white};">

        <!-- Accent barre -->
        <tr>
          <td style="height:4px;line-height:4px;font-size:0;background:linear-gradient(90deg,${BRAND.purple} 0%,${BRAND.green} 100%);border-radius:4px 4px 0 0;">&nbsp;</td>
        </tr>

        <!-- Logo -->
        <tr>
          <td align="center" style="padding:28px 24px 12px;text-align:center;">
            <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
              <tr>
                <td align="center" style="text-align:center;">
                  <a href="${esc(siteBase())}" target="_blank" style="text-decoration:none;display:inline-block;">
                    <img src="${esc(logoUrl())}" alt="GreenFit" width="64" height="64"
                      style="display:block;margin:0 auto;border:0;outline:none;width:64px;height:64px;" />
                  </a>
                  <div style="font-family:'Sora',Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;letter-spacing:-0.02em;color:${BRAND.ink};margin-top:10px;text-align:center;">GreenFit</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Contenu -->
        <tr>
          <td style="padding:8px 24px 8px;font-family:Arial,Helvetica,sans-serif;color:${BRAND.ink};">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:28px 24px 8px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${BRAND.line};">
              <tr>
                <td style="padding-top:20px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${BRAND.muted};text-align:center;">
                  <strong style="color:${BRAND.ink};">GreenFit</strong><br />
                  ${esc(CONTACT.address1)} · ${esc(CONTACT.address2)}<br />
                  <a href="tel:${esc(CONTACT.phoneHref)}" style="color:${BRAND.purple};text-decoration:none;">${esc(CONTACT.phone)}</a>
                  ·
                  <a href="mailto:${esc(CONTACT.email)}" style="color:${BRAND.purple};text-decoration:none;">${esc(CONTACT.email)}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function sectionTitle(text) {
  return `<h2 style="margin:28px 0 12px;font-family:'Sora',Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;letter-spacing:-0.01em;color:${BRAND.ink};">${esc(text)}</h2>`;
}

function infoRows(rows) {
  const cells = rows
    .map(
      ([label, value], i) => `
    <tr>
      <td style="padding:10px 0;border-bottom:${i === rows.length - 1 ? "0" : `1px solid ${BRAND.line}`};font-size:13px;color:${BRAND.muted};width:42%;vertical-align:top;">${esc(label)}</td>
      <td style="padding:10px 0;border-bottom:${i === rows.length - 1 ? "0" : `1px solid ${BRAND.line}`};font-size:13px;color:${BRAND.ink};font-weight:600;text-align:right;vertical-align:top;">${value}</td>
    </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.soft};border-radius:14px;padding:4px 16px;">
    <tr><td style="padding:4px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${cells}</table>
    </td></tr>
  </table>`;
}

function step(n, title, text) {
  return `
  <tr>
    <td style="padding:0 0 14px;vertical-align:top;width:36px;">
      <div style="width:28px;height:28px;border-radius:999px;background:${BRAND.purple};color:${BRAND.white};font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;line-height:28px;text-align:center;">${n}</div>
    </td>
    <td style="padding:0 0 14px 10px;vertical-align:top;">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:${BRAND.ink};margin-bottom:2px;">${esc(title)}</div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:${BRAND.muted};">${text}</div>
    </td>
  </tr>`;
}

function hoursTable() {
  const rows = RECEPTION_HOURS.map(
    (slot, i) => `
    <tr>
      <td style="padding:9px 0;border-bottom:${i === RECEPTION_HOURS.length - 1 ? "0" : `1px solid ${BRAND.line}`};font-size:13px;color:${BRAND.ink};font-weight:600;">${esc(slot.days)}</td>
      <td style="padding:9px 0;border-bottom:${i === RECEPTION_HOURS.length - 1 ? "0" : `1px solid ${BRAND.line}`};font-size:13px;color:${BRAND.muted};text-align:right;">${esc(slot.hours)}</td>
    </tr>`,
  ).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${BRAND.line};border-radius:14px;">
    <tr><td style="padding:4px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
    </td></tr>
  </table>
  <p style="margin:10px 0 0;font-size:12px;line-height:1.5;color:${BRAND.muted};">Fitness adhérents : 24&nbsp;h/24 · Jours fériés : réception fermée.</p>`;
}

function clientHtml(d) {
  const prenom = esc(d.prenom || "");
  const optionsHtml = d.optionsList?.length
    ? esc(d.optionsList.join(", "))
    : "—";

  const body = `
    <p style="margin:18px 0 6px;font-family:'Sora',Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;letter-spacing:-0.02em;line-height:1.2;color:${BRAND.ink};">
      Paiement confirmé${prenom ? `, ${prenom}` : ""}&nbsp;!
    </p>
    <p style="margin:0 0 4px;font-size:14px;line-height:1.6;color:${BRAND.muted};">
      Merci pour votre inscription chez GreenFit. Votre abonnement est bien enregistré.
    </p>

    ${sectionTitle("Votre abonnement")}
    ${infoRows([
      ["Formule", esc(d.title)],
      ["Options", optionsHtml],
      ["Montant payé", `<span style="color:${BRAND.greenDark}">${esc(money(d.price))}</span>`],
      ["Réf. commande", `#${esc(d.orderId)}`],
    ])}

    ${sectionTitle("Prochaines étapes")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${BRAND.line};border-radius:14px;">
      <tr><td style="padding:16px 16px 4px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${step(
            "1",
            "Venez à la réception",
            "Passez au centre pour récupérer votre <strong style=\"color:" +
              BRAND.ink +
              "\">carte d’accès</strong>. Présentez-vous avec une pièce d’identité.",
          )}
          ${step(
            "2",
            "Activez votre accès",
            "Notre équipe active votre abonnement et vous explique le fonctionnement du centre.",
          )}
          ${step(
            "3",
            "Commencez l’entraînement",
            "Une fois la carte reçue, le fitness vous est accessible <strong style=\"color:" +
              BRAND.ink +
              "\">24&nbsp;h/24</strong>.",
          )}
        </table>
      </td></tr>
    </table>

    ${sectionTitle("Horaires de l’accueil")}
    ${hoursTable()}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
      <tr>
        <td align="center">
          <a href="${esc(CONTACT.maps)}" target="_blank"
             style="display:inline-block;background:${BRAND.purple};color:${BRAND.white};font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:999px;">
            Voir l’itinéraire
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:${BRAND.muted};">
      Une question&nbsp;? Répondez à cet email ou appelez-nous au
      <a href="tel:${esc(CONTACT.phoneHref)}" style="color:${BRAND.purple};text-decoration:none;font-weight:600;">${esc(CONTACT.phone)}</a>.
      <br /><br />
      À très bientôt,<br />
      <strong style="color:${BRAND.ink};">L’équipe GreenFit</strong>
    </p>
  `;

  return layout({
    title: "GreenFit — Confirmation d’inscription",
    preheader:
      "Paiement confirmé. Venez récupérer votre carte d’accès à la réception.",
    body,
  });
}

function adminHtml(d) {
  const optionsHtml = d.optionsList?.length
    ? esc(d.optionsList.join(", "))
    : "—";

  const body = `
    <p style="margin:18px 0 6px;font-family:'Sora',Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;letter-spacing:-0.02em;color:${BRAND.ink};">
      Nouvelle inscription #${esc(d.orderId)}
    </p>
    <p style="margin:0 0 4px;font-size:14px;line-height:1.6;color:${BRAND.muted};">
      Une commande vient d’être payée en ligne. Voici le récapitulatif.
    </p>

    ${sectionTitle("Abonnement")}
    ${infoRows([
      ["Code contrat", esc(d.contractId)],
      ["Type", esc(d.title)],
      ["Options", optionsHtml],
      ["Prix", esc(money(d.price))],
    ])}

    ${sectionTitle("Client")}
    ${infoRows([
      ["Civilité", esc(d.civilite)],
      ["Nom / Prénom", `${esc(d.nom)} ${esc(d.prenom)}`],
      ["Adresse", esc(d.adresse)],
      ["NPA / Lieu", `${esc(d.npa)} ${esc(d.ville)}`],
      ["Email", esc(d.email)],
      ["Téléphone", esc(d.telephone)],
      ["Date de naissance", esc(d.dateNaissance)],
    ])}
  `;

  return layout({
    title: `Demande d'inscription (#${d.orderId})`,
    preheader: `${d.prenom || ""} ${d.nom || ""} — ${d.title || "Abonnement"}`,
    body,
  });
}

async function send(to, subject, html) {
  const t = getTransporter();
  if (!t) {
    console.warn("[email] SMTP non configuré — email non envoyé:", subject);
    return;
  }
  try {
    // Infomaniak exige que From = boîte authentifiée (SMTP_USER)
    const fromAddr = config.smtp.user || config.email.fromEmail;
    await t.sendMail({
      from: `"GreenFit" <${fromAddr}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("[email] échec envoi:", String(err));
  }
}

export async function sendOrderEmails(d) {
  await send(
    config.email.adminEmail,
    `Demande d'inscription (#${d.orderId})`,
    adminHtml(d),
  );
  if (d.email) {
    await send(
      d.email,
      "GreenFit — Confirmation d’inscription",
      clientHtml(d),
    );
  }
}

/** Aperçu HTML (navigateur / diagnostic) — données d'exemple. */
export function renderClientEmailPreview() {
  return clientHtml({
    orderId: 42,
    contractId: "2016040507190991_2015012617502346",
    title: "Abonnement 3 mois",
    price: 429,
    optionsList: [
      "Programme personnalisé / Inbody analyse corporelle (CHF 60)",
    ],
    civilite: "Monsieur",
    prenom: "Alex",
    nom: "Dupont",
    adresse: "Rue de l'Exemple 12",
    npa: "3970",
    ville: "Salquenen",
    email: "alex.dupont@example.com",
    telephone: "(+41)0791234567",
    dateNaissance: "15.03.1992",
  });
}
