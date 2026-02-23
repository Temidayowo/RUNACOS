import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { membershipRegistrationSchema } from "@/lib/validations/membership";
import { nanoid } from "nanoid";

function generateMemberId(): string {
  const year = new Date().getFullYear();
  const seq = nanoid(4).toUpperCase();
  return `RUN-CS-${year}-${seq}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = membershipRegistrationSchema.parse(body);

    // Check for duplicates
    const [existingEmail, existingMatric] = await Promise.all([
      prisma.member.findUnique({ where: { email: validated.email } }),
      prisma.member.findUnique({ where: { matricNumber: validated.matricNumber } }),
    ]);

    if (existingEmail) {
      return NextResponse.json(
        { error: "A member with this email already exists" },
        { status: 409 }
      );
    }

    if (existingMatric) {
      return NextResponse.json(
        { error: "A member with this matric number already exists" },
        { status: 409 }
      );
    }

    // Generate unique member ID
    let memberId = generateMemberId();
    while (await prisma.member.findUnique({ where: { memberId } })) {
      memberId = generateMemberId();
    }

    const member = await prisma.member.create({
      data: {
        memberId,
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phone: validated.phone,
        matricNumber: validated.matricNumber,
        level: validated.level,
        gender: validated.gender,
        department: validated.department,
        faculty: validated.faculty,
        stateOfOrigin: validated.stateOfOrigin,
        admissionYear: validated.admissionYear,
        academicSession: validated.academicSession,
        semester: validated.semester,
        passportUrl: validated.passportUrl,
      },
    });

    return NextResponse.json({ data: member }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to register member" }, { status: 500 });
  }
}
