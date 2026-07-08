// ============================================================
// Envoi d'emails via SMTP (boîte info@green-fit.ch) avec nodemailer.
// Reprend fidèlement les 2 gabarits HTML du site WordPress :
//   - client : new-order-client.html
//   - centre : new-order.html
// ============================================================

import nodemailer from "nodemailer";
import { config } from "./config.js";

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

const STYLE =
  `*{margin:0;padding:0}*{font-family:"Helvetica Neue","Helvetica",Helvetica,Arial,sans-serif}img{max-width:100%}body{-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:none;width:100% !important;height:100%}a{color:#2ba6cb}table.head-wrap{width:100%}.header.container table td.logo{padding:15px}table.body-wrap{width:100%}table.footer-wrap{width:100%;clear:both !important}.footer-wrap .container td.content p{border-top:1px solid #d7d7d7;padding-top:15px;font-size:10px;font-weight:bold}h1,h2,h3,h4,h5,h6{font-family:"HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;line-height:1.1;margin-bottom:15px;color:#000}h4{font-weight:500;font-size:23px}p,ul{margin-bottom:10px;font-weight:normal;font-size:14px;line-height:1.6}.container{display:block !important;max-width:600px !important;margin:0 auto !important;clear:both !important}.content{padding:15px;max-width:600px;margin:0 auto;display:block}.content table{width:100%}.table-info{margin-bottom:15px;border-spacing:0}.table-info td,.table-info th{padding:10px 7px;text-align:left}.table-info tr td{border-bottom:1px solid #f6f6f6}.table-info tr:last-child td{border-bottom:0}.title-info{margin:25px 0 0}`;

function layout(bodyInner) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=device-width" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<style type="text/css">${STYLE}</style>
</head>
<body bgcolor="#FFFFFF">
<table class="head-wrap" bgcolor="#000000">
  <tr><td></td><td class="header container">
    <div class="content">
      <table bgcolor="#000000"><tr><td align="center">
        <a href="https://green-fit.ch/" target="_blank">
          <img src="http://green-fit.ch/wp-content/uploads/2016/09/logo-greenfit.png" height="80" alt="GreenFit" title="GreenFit"/>
        </a>
      </td></tr></table>
    </div>
  </td><td></td></tr>
</table>
<table class="body-wrap">
  <tr><td></td><td class="container" bgcolor="#FFFFFF">
    <div class="content"><table><tr><td>${bodyInner}</td></tr></table></div>
  </td><td></td></tr>
</table>
<table class="footer-wrap">
  <tr><td></td><td class="container">
    <div class="content"><table><tr><td align="center">
      <p><a href="https://green-fit.ch" target="_blank">GreenFit</a></p>
    </td></tr></table></div>
  </td><td></td></tr>
</table>
</body>
</html>`;
}

function clientHtml(d) {
  const options = d.optionsList.length ? d.optionsList.join("<br>") : "-";
  return layout(`
    <p><b>Bonjour!</b></p>
    <p>Nous avons bien reçu votre demande d'inscription, vous trouverez ci-dessous le récapitulatif de votre demande</p>
    <br>
    <h4 class="title-info">Abonnement</h4>
    <br>
    <table width="100%" class="table-info">
      <tr><td><strong>Type</strong></td><td>${d.title}</td></tr>
      <tr><td valign="top" style="vertical-align: top"><strong>Options souscrites</strong></td><td>${options}</td></tr>
      <tr><td><strong>Prix</strong></td><td>${money(d.price)}</td></tr>
    </table>
    <br>
    <p>Nous nous rejouissons par avance de vous accueillir! Nous vous informons que votre abonnement ainsi que les éventuelles options ne seront effectifs qu'à reception de votre paiement. Pour toute question n'hésitez pas à nous contacter.</p>
    <p>Cordialement.</p>
    <p>L'équipe Green Fit</p>
    <p>Industriestrasse 16 <br>
      3960 Sierre / Salgesch<br>
      Tél: 027 565 41 31<br>
      Email: <a href="mailto:info@green-fit.ch">info@green-fit.ch</a></p>`);
}

function adminHtml(d) {
  const options = d.optionsList.length ? d.optionsList.join("<br>") : "-";
  return layout(`
    <p><b>Bonjour!</b></p>
    <p>Vous avez reçu une demande d'inscription ! Vous trouverez ci-dessous les informations nécéssaires au traitement du dossier</p>
    <br>
    <h4 class="title-info">Abonnement</h4>
    <br>
    <table width="100%" class="table-info">
      <tr><td><strong>Code</strong></td><td>${d.contractId}</td></tr>
      <tr><td><strong>Type</strong></td><td>${d.title}</td></tr>
      <tr><td valign="top" style="vertical-align: top"><strong>Options souscrites</strong></td><td>${options}</td></tr>
      <tr><td><strong>Prix</strong></td><td>${money(d.price)}</td></tr>
    </table>
    <br>
    <h4 class="title-info">Données personnelles</h4>
    <br>
    <table width="100%" class="table-info">
      <tr><td><strong>Civilité</strong></td><td>${d.civilite}</td></tr>
      <tr><td><strong>Nom / Prénom</strong></td><td>${d.nom} ${d.prenom}</td></tr>
      <tr><td><strong>Adresse</strong></td><td>${d.adresse}</td></tr>
      <tr><td><strong>NPA / Lieu</strong></td><td>${d.npa} ${d.ville}</td></tr>
      <tr><td><strong>Email</strong></td><td>${d.email}</td></tr>
      <tr><td><strong>Téléphone</strong></td><td>${d.telephone}</td></tr>
      <tr><td><strong>Date de naissance</strong></td><td>${d.dateNaissance}</td></tr>
    </table>`);
}

async function send(to, subject, html) {
  const t = getTransporter();
  if (!t) {
    console.warn("[email] SMTP non configuré — email non envoyé:", subject);
    return;
  }
  try {
    await t.sendMail({ from: config.email.fromEmail, to, subject, html });
  } catch (err) {
    console.error("[email] échec envoi:", String(err));
  }
}

export async function sendOrderEmails(d) {
  // Email au centre (admin)
  await send(
    config.email.adminEmail,
    `Demande d'inscription (#${d.orderId})`,
    adminHtml(d),
  );
  // Email au client
  if (d.email) {
    await send(d.email, "Green Fit: Votre demande d'inscription", clientHtml(d));
  }
}
