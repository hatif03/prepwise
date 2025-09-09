"use client";

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIconsClient from "./DisplayTechIconsClient";

import { cn, getRandomInterviewCover } from "@/lib/utils";

interface InterviewCardClientProps {
  interviewId: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
  feedback?: {
    totalScore: number;
    finalAssessment: string;
    createdAt: string;
  } | null;
}

const InterviewCardClient = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  feedback,
}: InterviewCardClientProps) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-accent text-accent-foreground",
      Mixed: "bg-secondary text-secondary-foreground",
      Technical: "bg-primary text-primary-foreground",
    }[normalizedType] || "bg-secondary text-secondary-foreground";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="group relative w-full max-w-sm">
      <div className="card-border h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="card-interview">
          {/* Header Section */}
          <div className="relative">
            {/* Type Badge */}
            <div
              className={cn(
                "absolute -top-2 -right-2 w-fit px-3 py-1.5 rounded-full shadow-sm z-10",
                badgeColor
              )}
            >
              <p className="badge-text text-xs font-medium">{normalizedType}</p>
            </div>

            {/* Interview Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center border border-border/50 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={getRandomInterviewCover()}
                  alt="Interview Type"
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>

            {/* Interview Title */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-1 capitalize">
                {role} Interview
              </h3>
              <p className="text-sm text-muted-foreground">
                {normalizedType} • {techstack?.length || 0} technologies
              </p>
            </div>
          </div>

          {/* Status Section */}
          <div className="mb-6">
            {feedback ? (
              <div className="space-y-3">
                {/* Score Display */}
                <div className="flex items-center justify-between bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-3 border border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Image
                        src="/star.svg"
                        width={16}
                        height={16}
                        alt="score"
                        className="text-secondary-foreground"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Score
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Out of 100
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary-foreground">
                      {feedback.totalScore}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Image
                    src="/calendar.svg"
                    width={16}
                    height={16}
                    alt="date"
                    className="opacity-60"
                  />
                  <span>Completed on {formattedDate}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Available Status */}
                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-3 border border-border/50">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-accent-foreground">
                    Available Now
                  </p>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Image
                    src="/calendar.svg"
                    width={16}
                    height={16}
                    alt="date"
                    className="opacity-60"
                  />
                  <span>Created on {formattedDate}</span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {feedback?.finalAssessment ||
                "Practice your interview skills with our AI-powered interviewer. Get instant feedback and improve your performance."}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <DisplayTechIconsClient techStack={techstack} />
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            <Button
              className="w-full"
              size="default"
              variant={feedback ? "secondary" : "default"}
            >
              <Link
                href={
                  feedback
                    ? `/interview/${interviewId}/feedback`
                    : `/interview/${interviewId}`
                }
                className="w-full flex items-center justify-center gap-2"
              >
                {feedback ? (
                  <>
                    <Image
                      src="/star.svg"
                      width={16}
                      height={16}
                      alt="feedback"
                      className="opacity-80"
                    />
                    View Feedback
                  </>
                ) : (
                  <>
                    <Image
                      src="/robot.png"
                      width={16}
                      height={16}
                      alt="start"
                      className="opacity-80"
                    />
                    Start Interview
                  </>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCardClient;
