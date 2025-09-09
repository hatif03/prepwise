"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InterviewModal = ({ isOpen, onClose }: InterviewModalProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: "",
    type: "Technical",
    level: "Mid",
    techStack: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Basic info, 2: Questions management
  const [questions, setQuestions] = useState<string[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState("");

  const generateQuestions = async () => {
    setIsGeneratingQuestions(true);
    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: formData.role,
          type: formData.type,
          level: formData.level,
          techStack: formData.techStack
            .split(",")
            .map((tech) => tech.trim())
            .filter(Boolean),
        }),
      });

      if (response.ok) {
        const { questions: generatedQuestions } = await response.json();
        setQuestions(generatedQuestions);
      } else {
        console.error("Failed to generate questions");
        // Fallback: add some default questions
        setQuestions([
          `Tell me about your experience with ${formData.role}`,
          `What challenges have you faced in your previous role?`,
          `How do you approach problem-solving?`,
        ]);
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      // Fallback: add some default questions
      setQuestions([
        `Tell me about your experience with ${formData.role}`,
        `What challenges have you faced in your previous role?`,
        `How do you approach problem-solving?`,
      ]);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const editQuestion = (index: number) => {
    setEditingQuestion(index);
    setNewQuestion(questions[index]);
  };

  const saveEdit = () => {
    if (editingQuestion !== null && newQuestion.trim()) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestion] = newQuestion.trim();
      setQuestions(updatedQuestions);
      setEditingQuestion(null);
      setNewQuestion("");
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create a new interview with the provided details and questions
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          questions,
        }),
      });

      if (response.ok) {
        const { interviewId } = await response.json();
        // Redirect to the interview page
        router.push(`/interview/${interviewId}`);
      } else {
        console.error("Failed to create interview");
        // Fallback: redirect to general interview page
        router.push("/interview");
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      // Fallback: redirect to general interview page
      router.push("/interview");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-lg shadow-xl border border-border w-full max-w-md mx-4 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <Image
                src="/robot.png"
                alt="AI Interviewer"
                width={24}
                height={24}
                className="opacity-80"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Start New Interview
              </h2>
              <p className="text-sm text-muted-foreground">
                Tell us about your interview
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <Image
              src="/window.svg"
              alt="Close"
              width={16}
              height={16}
              className="opacity-60"
            />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {step === 1 ? (
            <>
              {/* Role Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-sm font-medium text-foreground"
                >
                  Interview Role *
                </Label>
                <Input
                  id="role"
                  type="text"
                  placeholder="e.g., Frontend Developer, Data Scientist, Product Manager"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {/* Type Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="type"
                  className="text-sm font-medium text-foreground"
                >
                  Interview Type *
                </Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all duration-200"
                >
                  <option value="Technical">Technical</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="Situational">Situational</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              {/* Level Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="level"
                  className="text-sm font-medium text-foreground"
                >
                  Experience Level *
                </Label>
                <select
                  id="level"
                  value={formData.level}
                  onChange={(e) => handleInputChange("level", e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all duration-200"
                >
                  <option value="Entry">Entry Level (0-2 years)</option>
                  <option value="Mid">Mid Level (3-5 years)</option>
                  <option value="Senior">Senior Level (6+ years)</option>
                </select>
              </div>

              {/* Tech Stack Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="techStack"
                  className="text-sm font-medium text-foreground"
                >
                  Technologies (Optional)
                </Label>
                <Input
                  id="techStack"
                  type="text"
                  placeholder="e.g., React, Python, SQL, AWS (comma-separated)"
                  value={formData.techStack}
                  onChange={(e) =>
                    handleInputChange("techStack", e.target.value)
                  }
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple technologies with commas
                </p>
              </div>

              {/* Next Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.role.trim()}
                  className="flex-1"
                >
                  Next: Generate Questions
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Questions Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Interview Questions
                  </h3>
                  <Button
                    type="button"
                    onClick={generateQuestions}
                    disabled={isGeneratingQuestions}
                    variant="outline"
                    size="sm"
                  >
                    {isGeneratingQuestions ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Image
                          src="/robot.png"
                          alt="Generate"
                          width={16}
                          height={16}
                          className="mr-2 opacity-80"
                        />
                        Generate Questions
                      </>
                    )}
                  </Button>
                </div>

                {/* Questions List */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {questions.map((question, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 bg-muted rounded-lg border border-border"
                    >
                      <span className="text-sm font-medium text-muted-foreground mt-1">
                        {index + 1}.
                      </span>
                      {editingQuestion === index ? (
                        <div className="flex-1 flex gap-2">
                          <Input
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            className="flex-1"
                            placeholder="Enter question..."
                          />
                          <Button
                            type="button"
                            onClick={saveEdit}
                            size="sm"
                            variant="outline"
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              setEditingQuestion(null);
                              setNewQuestion("");
                            }}
                            size="sm"
                            variant="ghost"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <p className="flex-1 text-sm text-foreground">
                            {question}
                          </p>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              onClick={() => editQuestion(index)}
                              size="sm"
                              variant="ghost"
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              onClick={() => removeQuestion(index)}
                              size="sm"
                              variant="ghost"
                            >
                              Remove
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Question */}
                <div className="flex gap-2">
                  <Input
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Add a custom question..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && addQuestion()}
                  />
                  <Button
                    type="button"
                    onClick={addQuestion}
                    disabled={!newQuestion.trim()}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={questions.length === 0 || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Image
                        src="/robot.png"
                        alt="Start"
                        width={16}
                        height={16}
                        className="mr-2 opacity-80"
                      />
                      Create & Start Interview
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default InterviewModal;
