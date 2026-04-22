export const generateWhatsAppLink = (cartItems) => {
  const number = process.env.WHATSAPP_NUMBER;
  const message = `Nuevo presupuesto solicitado:\n\n${cartItems.map(i => 
    `${i.name} - ${i.price}₲\n`).join('')}
\nIr a: https://superspuma.paraguai.com`;
  
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};