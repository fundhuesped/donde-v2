const signupRequestHTMLMail = (firstName: any, lastName: any, organizationName: any, organizationCountry: any) =>
  `
<div>
Hola!<br>
${firstName} ${lastName} de ${organizationName} de ${organizationCountry} solicitó sumarse para colaborar con Dónde.<br>
Ingresá <a href="https://donde.huesped.org.ar">acá</a> para más información.<br>
</div>
`;

export default signupRequestHTMLMail;
