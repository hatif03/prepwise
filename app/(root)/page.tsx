"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCardClient from "@/components/InterviewCardClient";
import InterviewModal from "@/components/InterviewModal";

interface Interview {
  id: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  profileURL?: string;
}

function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [userInterviews, setUserInterviews] = useState<Interview[]>([]);
  const [allInterviews, setAllInterviews] = useState<Interview[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data and interviews
    const fetchData = async () => {
      try {
        // Fetch user interviews
        const userInterviewsResponse = await fetch("/api/interviews?type=user");
        if (userInterviewsResponse.ok) {
          const userData = await userInterviewsResponse.json();
          setUserInterviews(userData.interviews || []);
        }

        // Fetch available interviews (all interviews)
        const availableInterviewsResponse = await fetch(
          "/api/interviews?type=available"
        );
        if (availableInterviewsResponse.ok) {
          const availableData = await availableInterviewsResponse.json();
          setAllInterviews(availableData.interviews || []);
        }

        // Set mock user data for now (you can fetch this from user profile API later)
        setUser({
          id: "user_123",
          name: "John Doe",
          profileURL: "/user-avatar.png",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hasPastInterviews = userInterviews.length > 0;
  const hasUpcomingInterviews = allInterviews.length > 0;

  const refreshData = async () => {
    try {
      // Fetch user interviews
      const userInterviewsResponse = await fetch("/api/interviews?type=user");
      if (userInterviewsResponse.ok) {
        const userData = await userInterviewsResponse.json();
        setUserInterviews(userData.interviews || []);
      }

      // Fetch available interviews (all interviews)
      const availableInterviewsResponse = await fetch(
        "/api/interviews?type=available"
      );
      if (availableInterviewsResponse.ok) {
        const availableData = await availableInterviewsResponse.json();
        setAllInterviews(availableData.interviews || []);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 rounded-2xl shadow-2xl border border-border/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 px-8 py-20 lg:px-16 lg:py-24">
          {/* Left Content */}
          <div className="flex flex-col gap-8 max-w-2xl text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-sm rounded-full border border-accent/30 w-fit mx-auto lg:mx-0">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-accent-foreground">
                AI-Powered Interview Practice
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                Master Your Next
                <span className="block bg-gradient-to-r from-accent-foreground to-accent-foreground/80 bg-clip-text text-transparent">
                  Interview
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-primary-foreground/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Practice with real interview questions, get instant AI feedback,
                and build confidence for your dream job.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setIsModalOpen(true)}
              >
                <Image
                  src="/robot.png"
                  alt="Start Interview"
                  width={20}
                  height={20}
                  className="mr-3"
                />
                Start Practice Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
              >
                <Image
                  src="/star.svg"
                  alt="View Examples"
                  width={20}
                  height={20}
                  className="mr-3"
                />
                View Examples
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-4">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary-foreground">
                  1000+
                </div>
                <div className="text-sm text-primary-foreground/70">
                  Questions
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary-foreground">
                  50+
                </div>
                <div className="text-sm text-primary-foreground/70">
                  Tech Stacks
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary-foreground">
                  24/7
                </div>
                <div className="text-sm text-primary-foreground/70">
                  Available
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative flex-shrink-0">
            {/* Main Robot Image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-accent/10 rounded-full blur-2xl"></div>
              <Image
                src="/robot.png"
                alt="AI Interviewer"
                width={400}
                height={400}
                className="relative z-10 drop-shadow-2xl"
              />

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-accent/30">
                <Image
                  src="/star.svg"
                  alt="Star"
                  width={24}
                  height={24}
                  className="animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-accent/30">
                <Image
                  src="/calendar.svg"
                  alt="Calendar"
                  width={20}
                  height={20}
                  className="animate-pulse"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-foreground mb-3">
            Your Interviews
          </h2>
          <p className="text-base text-muted-foreground">
            Track your progress and review feedback
          </p>
        </div>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews.map((interview) => (
              <InterviewCardClient
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                feedback={null}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="bg-card rounded-lg p-12 max-w-md mx-auto border border-border shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Image
                    src="/calendar.svg"
                    width={32}
                    height={32}
                    alt="calendar"
                    className="opacity-60"
                  />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No interviews yet
                </h3>
                <p className="text-muted-foreground">
                  Start your first interview to see your progress here
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-foreground mb-3">
            Available Interviews
          </h2>
          <p className="text-base text-muted-foreground">
            Choose from our curated interview experiences
          </p>
        </div>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterviews.map((interview) => (
              <InterviewCardClient
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                feedback={null}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="bg-card rounded-lg p-12 max-w-md mx-auto border border-border shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Image
                    src="/star.svg"
                    width={32}
                    height={32}
                    alt="star"
                    className="opacity-60"
                  />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No interviews available
                </h3>
                <p className="text-muted-foreground">
                  Check back later for new interview opportunities
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interview Modal */}
      <InterviewModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          refreshData(); // Refresh data when modal closes
        }}
      />
    </>
  );
}

export default Home;
