import { NextResponse } from "next/server"

export async function GET() {
  const organizations = [
    {
      uuid: "o1",
      name: "Open Elements",
      legalName: "Open Elements GmbH",
      streetAddress: "Musterstraße 123",
      postalCode: "12345",
      city: "Berlin",
      country: "Deutschland",
      email: "info@openelements.com",
      telephone: "+49 123 456789",
      founder: "John Doe",
      registerNumber: "HRB 123456",
      registerCourt: "Amtsgericht Berlin",
      vatNumber: "DE123456789",
      url: "https://openelements.com",
    },
  ]

  return NextResponse.json(organizations)
}
