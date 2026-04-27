export function bookingWhatsAppMessage(service: string, date: string, time: string): string {
  return `Hola! Quisiera agendar una cita para "${service}" el ${date} a las ${time}.`
}
