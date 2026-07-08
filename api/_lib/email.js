// ============================================================
// Envoi d'emails — port de sendEmail()
// Deux emails : un au centre (admin) et un au client, via l'API Resend.
// ============================================================

import { config } from "./config.js";

function money(v) {
  return "CHF " + Number(v).toFixed(2);
}

function adminHtml(d) {
  const options = d.optionsList.length
    ? `<p><strong>Options :</strong><br>${d.optionsList.join("<br>")}</p>`
    : "";
  return `
    <h2>Demande d'inscription (#${d.orderId})</h2>
    <p><strong>${d.title}</strong> — ${money(d.price)}</p>
    <p><strong>Contrat :</strong> ${d.contractId}</p>
    ${options}
    <hr>
    <p>
      ${d.civilite} ${d.prenom} ${d.nom}<br>
      ${d.adresse}<br>
      ${d.npa} ${d.ville}<br>
      Tél : ${d.telephone}<br>
      Email : ${d.email}<br>
      Né(e) le : ${d.dateNaissance}
    </p>`;
}

function clientHtml(d) {
  return `
    <h2>Green-Fit : votre demande d'inscription</h2>
    <p>Bonjour ${d.prenom},</p>
    <p>Nous confirmons la réception de votre inscription à l'<strong>${d.title}</strong>
    (${money(d.price)}). Vous recevrez sous peu vos identifiants de connexion.</p>
    <p>Nous nous réjouissons de vous accueillir chez Green-Fit !</p>`;
}

async function send(to, subject, html) {
  if (!config.email.resendApiKey) {
    console.warn("[email] RESEND_API_KEY manquant — email non envoyé:", subject);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.email.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: config.email.fromEmail, to, subject, html }),
    });
    if (!res.ok) {
      console.error("[email] échec envoi:", await res.text());
    }
  } catch (err) {
    console.error("[email] exception:", String(err));
  }
}

export async function sendOrderEmails(d) {
  await send(
    config.email.adminEmail,
    `Demande d'inscription (#${d.orderId})`,
    adminHtml(d),
  );
  if (d.email) {
    await send(d.email, "Green-Fit : Votre demande d'inscription", clientHtml(d));
  }
}
