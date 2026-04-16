"use client";

import { ArrowLeft, Heart, MapPin, MessageSquare, Tag, User } from "lucide-react";
import { InfoCard } from "@/components/common/info-card";
import { ThemeButton } from "@/components/common/theme-controls";
import type { Project, ThemeStyles } from "@/types/prototype";

export function ProjectDetailCard({
  project,
  isFavorite,
  themeStyles,
  onBack,
  onToggleFavorite,
  onOpenChat,
}: {
  project: Project | null;
  isFavorite: boolean;
  themeStyles: ThemeStyles;
  onBack: () => void;
  onToggleFavorite: () => void;
  onOpenChat?: () => void;
}) {
  if (!project) {
    return (
      <InfoCard themeStyles={themeStyles} className="p-8 text-center">
        <p className="text-base font-medium" style={{ color: themeStyles.text }}>
          No project selected
        </p>
      </InfoCard>
    );
  }

  const isUserProject = "visibility" in project;
  const joinStatus = "joinStatus" in project ? project.joinStatus : "joined";

  return (
    <div className="space-y-6">
      <ThemeButton themeStyles={themeStyles} onClick={onBack}>
        <ArrowLeft className="mr-2 inline h-4 w-4" />
        Back to projects
      </ThemeButton>

      <InfoCard themeStyles={themeStyles} className="p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight" style={{ color: themeStyles.text }}>
                {project.title}
              </h1>
              <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: themeStyles.pill, color: themeStyles.muted }}>
                {project.category}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5" style={{ color: themeStyles.muted }}>
                <User className="h-4 w-4" />
                {project.creator}
              </span>
              <span className="inline-flex items-center gap-1.5" style={{ color: themeStyles.muted }}>
                <MapPin className="h-4 w-4" />
                {project.location}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isUserProject ? (
              <ThemeButton themeStyles={themeStyles} onClick={onToggleFavorite}>
                <Heart className={`mr-2 inline h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "Saved" : "Save"}
              </ThemeButton>
            ) : null}

            {joinStatus === "joined" && onOpenChat ? (
              <ThemeButton themeStyles={themeStyles} active onClick={onOpenChat}>
                <MessageSquare className="mr-2 inline h-4 w-4" />
                Open project chat
              </ThemeButton>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: themeStyles.text }}>
              About this project
            </h2>
            <p className="mt-3 text-sm leading-7" style={{ color: themeStyles.muted }}>
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs" style={{ backgroundColor: themeStyles.pill, color: themeStyles.muted }}>
                  <Tag className="h-3.5 w-3.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border p-4" style={{ backgroundColor: themeStyles.panel, borderColor: themeStyles.border }}>
              <p className="text-sm" style={{ color: themeStyles.muted }}>Region</p>
              <p className="mt-2 text-base font-semibold" style={{ color: themeStyles.text }}>
                {project.city}, {project.state}
              </p>
            </div>
            <div className="rounded-2xl border p-4" style={{ backgroundColor: themeStyles.panel, borderColor: themeStyles.border }}>
              <p className="text-sm" style={{ color: themeStyles.muted }}>Privacy</p>
              <p className="mt-2 text-base font-semibold" style={{ color: themeStyles.text }}>
                {project.privacy === "public" ? "Public / instant join" : "Private / approval required"}
              </p>
            </div>
            {isUserProject ? (
              <div className="rounded-2xl border p-4" style={{ backgroundColor: themeStyles.panel, borderColor: themeStyles.border }}>
                <p className="text-sm" style={{ color: themeStyles.muted }}>Visibility</p>
                <p className="mt-2 text-base font-semibold" style={{ color: themeStyles.text }}>
                  {project.visibility}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </InfoCard>
    </div>
  );
}
