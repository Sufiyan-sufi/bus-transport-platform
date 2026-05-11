import { NextResponse } from "next/server";

export async function GET() {
  // In a real app, this might come from a DB or .env
  const paymentInstructions = {
    bankName: "Emirates NBD",
    accountName: "Qoderx Transport Services",
    accountNumber: "1234567890",
    iban: "AE12 0000 0000 1234 5678 90",
    swiftCode: "ENBD AEAD",
    instructions: "Please mention your Booking ID in the transfer remarks. Send transfer proof to payments@qoderx.com",
  };

  return NextResponse.json(paymentInstructions);
}
