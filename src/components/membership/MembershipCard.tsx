"use client";

interface MembershipCardProps {
  firstName: string;
  lastName: string;
  matricNumber: string;
  level: string;
  memberId: string;
  passportUrl: string;
  paidAt: string | null;
  department?: string;
  faculty?: string;
  academicSession?: string;
  semester?: string;
  badgeTemplateUrl?: string;
}

export function MembershipCard({
  firstName,
  lastName,
  matricNumber,
  level,
  memberId,
  passportUrl,
  paidAt,
  department,
  faculty,
  academicSession,
  semester,
  badgeTemplateUrl,
}: MembershipCardProps) {
  const sessionLabel = academicSession
    ? `${academicSession} Session`
    : paidAt
      ? `${new Date(paidAt).getFullYear() - 1}/${new Date(paidAt).getFullYear()} Session`
      : "2025/2026 Session";

  return (
    <div
      className="mx-auto overflow-hidden rounded-2xl shadow-lg"
      style={{ maxWidth: 600, aspectRatio: "600/380" }}
    >
      <div className="relative h-full w-full text-white">
        {/* Background: badge template or default gradient */}
        {badgeTemplateUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={badgeTemplateUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-black/55" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700" />
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          </>
        )}

        <div className="relative flex h-full flex-col justify-between p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold tracking-wide">RUNACOS</h3>
              <p className="text-xs text-white/70">Membership Card</p>
            </div>
            <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 border-white/30 bg-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={passportUrl}
                alt="Passport"
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 space-y-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/60">
                Name
              </p>
              <p className="text-base font-semibold">
                {firstName} {lastName}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/60">
                  Matric No
                </p>
                <p className="text-sm font-medium">{matricNumber}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/60">
                  Level
                </p>
                <p className="text-sm font-medium">{level}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {department && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/60">
                    Department
                  </p>
                  <p className="text-sm font-medium">{department}</p>
                </div>
              )}
              {faculty && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/60">
                    Faculty
                  </p>
                  <p className="text-sm font-medium">{faculty}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/60">
                  Member ID
                </p>
                <p className="text-sm font-mono font-medium">{memberId}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/60">
                  Valid
                </p>
                <p className="text-sm font-medium">
                  {sessionLabel}
                  {semester ? ` (${semester})` : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 border-t border-white/10 pt-3">
            <p className="text-[10px] text-white/60">
              Association of Computer Science Students
            </p>
            <p className="text-[10px] text-white/60">
              Redeemer&apos;s University, Ede
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
