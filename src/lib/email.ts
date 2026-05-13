import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(
  email: string,
  booking: { id: string; routeName: string; fromStop: string; toStop: string; startDate: Date }
) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith("re_placeholder")) {
    console.log("[email] RESEND_API_KEY not configured, skipping email.");
    return;
  }

  await resend.emails.send({
    from: "BusTransport <noreply@bustransport.app>",
    to: email,
    subject: "Booking Requested – BusTransport",
    html: `
      <h2>Booking Requested!</h2>
      <p>Your booking has been submitted and is awaiting contractor confirmation.</p>
      <table>
        <tr><td><strong>Booking ID</strong></td><td>${booking.id}</td></tr>
        <tr><td><strong>Route</strong></td><td>${booking.routeName}</td></tr>
        <tr><td><strong>From</strong></td><td>${booking.fromStop}</td></tr>
        <tr><td><strong>To</strong></td><td>${booking.toStop}</td></tr>
        <tr><td><strong>Start Date</strong></td><td>${booking.startDate.toDateString()}</td></tr>
      </table>
      <p>You will be notified once the contractor confirms your booking.</p>
    `,
  });
}
