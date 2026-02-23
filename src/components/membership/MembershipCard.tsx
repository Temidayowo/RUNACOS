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
            <div className="absolute inset-0 bg-gradient-to-br from-midnight via-navy-800 to-navy-700" />
            <div className="absolute inset-0 bg-grid-dots opacity-10" />
            {/* Circuit trace accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-electric to-cyan" />
          </>
        )}

        <div className="relative flex h-full flex-col justify-between p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="flex items-center text-lg font-bold tracking-wide font-heading">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="R"
                  className="inline-block h-6 w-6 object-contain"
                  crossOrigin="anonymous"
                  style={{ filter: "brightness(0) invert(1)", marginRight: 1 }}
                />
                <span>UNACOS</span>
              </h3>
              <p className="text-xs font-mono text-white/60">Membership Card</p>
            </div>
            <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm">
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
              <p className="text-[10px] uppercase tracking-wider text-white/50 font-mono">
                Name
              </p>
              <p className="text-base font-semibold font-heading">
                {firstName} {lastName}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/50 font-mono">
                  Matric No
                </p>
                <p className="text-sm font-mono font-medium">{matricNumber}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/50 font-mono">
                  Level
                </p>
                <p className="text-sm font-mono font-medium">{level}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {department && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/50 font-mono">
                    Department
                  </p>
                  <p className="text-sm font-medium">{department}</p>
                </div>
              )}
              {faculty && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/50 font-mono">
                    Faculty
                  </p>
                  <p className="text-sm font-medium">{faculty}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/50 font-mono">
                  Member ID
                </p>
                <p className="text-sm font-mono font-medium text-electric">{memberId}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/50 font-mono">
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
            <p className="text-[10px] text-white/50 font-mono">
              Association of Computer Science Students
            </p>
            <p className="text-[10px] text-white/50 font-mono">
              Redeemer&apos;s University, Ede
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
