export const resetPasswordMail = (link: string) => `Para recuperar tu contraseña, haz click en el siguiente enlace: ${link}`;

export const resetPasswordHTMLMail = (link: string) =>
  `
<div>
¡Hola! Para recuperar tu contraseña, hacé click <a href="${link}">acá</a><br>
</div>
`;

export const createPasswordMail = (link: string) =>
  `¡Hola! Tu usuarix para colaborar en Dónde ya está dado de alta para que lo puedas usar.
Para continuar y reestablecer tu contraseña, hacé click en el siguiente enlace: ${link}`;

export const createPasswordHTMLMail = (link: string) =>
  `
<div>
¡Hola! Tu usuarix para colaborar en Dónde ya está dado de alta para que lo puedas usar.
Para continuar y reestablecer tu contraseña, hacé click <a href="${link}">acá</a><br>
</div>
`;
