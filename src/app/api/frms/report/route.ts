import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reportFaultSchema } from "@/lib/validations/frms";
import { generateReferenceId } from "@/lib/reference-id";
import { sendFaultConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = reportFaultSchema.parse(body);

    const referenceId = generateReferenceId();

    const fault = await prisma.fault.create({
      data: {
        referenceId,
        ...validated,
        statusHistory: {
          create: {
            status: "OPEN",
            note: "Fault report submitted",
          },
        },
      },
      include: {
        category: true,
        statusHistory: true,
      },
    });

    // Send confirmation email with tracking code
    let emailSent = false;
    try {
      await sendFaultConfirmation({
        referenceId,
        email: validated.email,
        name: validated.name,
        location: validated.location,
        category: fault.category.name,
      });
      emailSent = true;
    } catch {}

    return NextResponse.json({ data: fault, emailSent }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit fault report" }, { status: 500 });
  }
}
