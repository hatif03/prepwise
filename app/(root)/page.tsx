import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-8 max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-3xl font-medium text-primary-foreground leading-tight">
              Get Interview-Ready with
              <span className="block text-accent-foreground">
                AI-Powered Practice
              </span>
            </h1>
            <p className="text-base text-primary-foreground/80 leading-relaxed">
              Practice real interview questions & get instant feedback from our
              advanced AI interviewer
            </p>
          </div>

          <Button asChild size="default" className="w-fit">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <div className="relative">
          <Image
            src="/robot.png"
            alt="AI Interviewer"
            width={300}
            height={300}
            className="relative max-sm:hidden animate-bounce"
          />
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
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
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
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
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
    </>
  );
}

export default Home;
