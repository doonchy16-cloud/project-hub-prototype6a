"use client";

import { CheckCircle2, Heart, Lock, MapPin, MessageSquare, Tag, User, Users } from "lucide-react";
import { InfoCard } from "@/components/common/info-card";
import { ThemeButton } from "@/components/common/theme-controls";
import type { Project, ThemeStyles } from "@/types/prototype";

export function ProjectCard({
  project,
  themeStyles,
  isFavorite,
  onToggleFavorite,
  onOpen,
  onJoin,
  onOpenChat,
}: {
  project: Project;
  themeStyles: ThemeStyles;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
  onJoin?: () => void;
  onOpenChat?: () => void;
}) {
  const isUserProject = "visibility" in project;
  const joinStatus = "joinStatus" in project ? project.joinStatus : "joined";
  const privacy = project.privacy;
  const reasons = "reasons" in project && Array.isArray(project.reasons) ? project.reasons : [];

  return (
    <InfoCard themeStyles={themeStyles} className="p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex min-w-0 gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold"
            style={{ backgroundColor: themeStyles.pill, color: themeStyles.text }}
          >
            {project.thumbnail || project.title.slice(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold" style={{ color: themeStyles.text }}>
                {project.title}
              </h3>
              <span
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ backgroundColor: themeStyles.pill, color: themeStyles.muted }}
              >
                {project.category}
              </span>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ backgroundColor: themeStyles.pill, color: themeStyles.muted }}
              >
                {privacy === "private" ? <Lock className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
                {privacy === "private" ? "Private project" : "Public project"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: themeStyles.muted }}>
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {project.creator}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {project.location}
              </span>
            </div>

            <p className="max-w-3xl text-sm leading-7" style={{ color: themeStyles.muted }}>
              {project.description}
            </p>

            {reasons.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {reasons.map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ backgroundColor: "#dbeafe", color: "#1d4ed8" }}
                  >
                    {reason}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                  style={{ backgroundColor: themeStyles.pill, color: themeStyles.muted }}
                >
                  <Tag className="h-3.5 w-3.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 xl:w-[280px] xl:justify-end">
          {!isUserProject ? (
            <button
              type="button"
              onClick={onToggleFavorite}
              className="rounded-full border p-2 transition"
              style={{
                backgroundColor: isFavorite ? "#fee2e2" : themeStyles.card,
                borderColor: isFavorite ? "#fecaca" : themeStyles.border,
                color: isFavorite ? "#e11d48" : themeStyles.text,
              }}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          ) : null}

          <ThemeButton themeStyles={themeStyles} onClick={onOpen}>
            Open
          </ThemeButton>

          {joinStatus === "joined" ? (
            <ThemeButton themeStyles={themeStyles} active onClick={onOpenChat}>
              <MessageSquare className="mr-2 inline h-4 w-4" />
              Open chat
            </ThemeButton>
          ) : joinStatus === "requested" ? (
            <div
              className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium"
              style={{ borderColor: themeStyles.border, color: themeStyles.muted }}
            >
              <CheckCircle2 className="h-4 w-4" />
              Request sent
            </div>
          ) : onJoin ? (
            <ThemeButton themeStyles={themeStyles} active={privacy === "public"} onClick={onJoin}>
              {privacy === "public" ? "Join project" : "Request to join"}
            </ThemeButton>
          ) : null}
        </div>
      </div>
    </InfoCard>
  );
}
