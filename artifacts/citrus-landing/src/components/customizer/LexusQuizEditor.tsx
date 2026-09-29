import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, RotateCcw } from "lucide-react";
import type { QuizQuestion } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// The 6 outcome codes are fixed so every option's score vector always
// has exactly these keys. Only the questions/options/point-values are
// customizable.
const VEHICLES = ["ES", "NX", "RX", "RZ", "TX", "TZ"] as const;

// Mirrors the game's own built-in questions (see DEFAULT_QUIZ in
// lexus_energy_quiz_tuned_v018.html) — used only as the editor's starting
// point when a draft has no custom quiz saved yet, so editing starts from
// something real instead of a blank question.
export const DEFAULT_LEXUS_QUIZ: QuizQuestion[] = [
  {
    text: "How far does the road usually take you?",
    options: [
      { text: "A quick trip around town — under 25 miles", scores: { ES: 3, NX: 0, RX: 1, RZ: 0, TX: 0, TZ: 1 } },
      { text: "An easy daily commute — 25–50 miles", scores: { ES: 0, NX: 3, RX: 0, RZ: 1, TX: 0, TZ: 0 } },
      { text: "However far it takes — 100+ miles", scores: { ES: 0, NX: 0, RX: 3, RZ: 0, TX: 0, TZ: 0 } },
    ],
  },
  {
    text: "Who's usually along for the drive?",
    options: [
      { text: "Just me, no compromises", scores: { ES: 1, NX: 3, RX: 0, RZ: 0, TX: 0, TZ: 0 } },
      { text: "A tight crew — 2–4 people", scores: { ES: 0, NX: 0, RX: 0, RZ: 3, TX: 0, TZ: 1 } },
      { text: "Everyone's coming — 5–6 people", scores: { ES: 0, NX: 0, RX: 3, RZ: 1, TX: 1, TZ: 0 } },
    ],
  },
  {
    text: "Describe your everyday drive.",
    options: [
      { text: "City streets, sharp turns, tight spots", scores: { ES: 1, NX: 2, RX: 1, RZ: 1, TX: 0, TZ: 0 } },
      { text: "Highway miles, cruise control earned", scores: { ES: 0, NX: 0, RX: 0, RZ: 2, TX: 0, TZ: 3 } },
      { text: "Long hauls that reward a good ride", scores: { ES: 0, NX: 0, RX: 0, RZ: 0, TX: 3, TZ: 0 } },
    ],
  },
  {
    text: "What should it be ready for?",
    options: [
      { text: "Getting you there, exactly on time", scores: { ES: 1, NX: 0, RX: 0, RZ: 1, TX: 0, TZ: 3 } },
      { text: "Family first — every seat matters", scores: { ES: 2, NX: 0, RX: 2, RZ: 0, TX: 1, TZ: 0 } },
      { text: "People and gear, no trade-offs", scores: { ES: 0, NX: 2, RX: 0, RZ: 0, TX: 2, TZ: 0 } },
    ],
  },
  {
    text: "Plans change. Where does the day take you?",
    options: [
      { text: "Somewhere close, decided on a whim", scores: { ES: 3, NX: 0, RX: 0, RZ: 0, TX: 0, TZ: 1 } },
      { text: "Worth the drive — 100+ miles out", scores: { ES: 1, NX: 2, RX: 0, RZ: 0, TX: 2, TZ: 0 } },
      { text: "A weekend worth chasing", scores: { ES: 0, NX: 0, RX: 0, RZ: 3, TX: 0, TZ: 1 } },
    ],
  },
];

function emptyOption() {
  return { text: "", scores: { ES: 0, NX: 0, RX: 0, RZ: 0, TX: 0, TZ: 0 } };
}
function emptyQuestion(): QuizQuestion {
  return { text: "", options: [emptyOption(), emptyOption()] };
}

interface LexusQuizEditorProps {
  quiz: QuizQuestion[];
  onChange: (quiz: QuizQuestion[]) => void;
}

/** Lets a customer fully rebuild the MCQ Energy Quiz — add/remove/reorder
 *  questions and options, and set exactly how many points each option adds
 *  toward each of the 6 fixed result codes. Flows into the live preview the
 *  same way every other branding field does (see BrandThemeMessage.quiz). */
export function LexusQuizEditor({ quiz, onChange }: LexusQuizEditorProps) {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  const updateQuestion = (qi: number, patch: Partial<QuizQuestion>) => {
    onChange(quiz.map((q, i) => (i === qi ? { ...q, ...patch } : q)));
  };

  const moveQuestion = (qi: number, dir: -1 | 1) => {
    const target = qi + dir;
    if (target < 0 || target >= quiz.length) return;
    const next = [...quiz];
    [next[qi], next[target]] = [next[target], next[qi]];
    onChange(next);
  };

  const removeQuestion = (qi: number) => {
    if (quiz.length <= 1) return;
    onChange(quiz.filter((_, i) => i !== qi));
  };

  const addQuestion = () => {
    onChange([...quiz, emptyQuestion()]);
    setOpenItem(`q-${quiz.length}`);
  };

  const updateOption = (qi: number, oi: number, patch: Partial<QuizQuestion["options"][number]>) => {
    const q = quiz[qi];
    updateQuestion(qi, { options: q.options.map((o, i) => (i === oi ? { ...o, ...patch } : o)) });
  };

  const removeOption = (qi: number, oi: number) => {
    const q = quiz[qi];
    if (q.options.length <= 2) return;
    updateQuestion(qi, { options: q.options.filter((_, i) => i !== oi) });
  };

  const addOption = (qi: number) => {
    const q = quiz[qi];
    updateQuestion(qi, { options: [...q.options, emptyOption()] });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Energy Quiz questions</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => onChange(structuredClone(DEFAULT_LEXUS_QUIZ))}
            data-testid="button-reset-quiz"
          >
            <RotateCcw size={13} /> Reset to default
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Every answer adds points toward each result (ES, NX, RX, RZ, TX, TZ) — the one with the highest
          total when the quiz ends is the result recorded for that session.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem} className="space-y-2">
          {quiz.map((q, qi) => (
            <AccordionItem key={qi} value={`q-${qi}`} className="border border-border rounded-lg px-3">
              <div className="flex items-center gap-1">
                <AccordionTrigger className="flex-1 text-sm py-3 hover:no-underline">
                  <span className="truncate text-left">
                    Q{qi + 1}. {q.text || <span className="text-muted-foreground">Untitled question</span>}
                  </span>
                </AccordionTrigger>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  disabled={qi === 0}
                  onClick={() => moveQuestion(qi, -1)}
                  aria-label="Move question up"
                >
                  <ChevronUp size={14} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  disabled={qi === quiz.length - 1}
                  onClick={() => moveQuestion(qi, 1)}
                  aria-label="Move question down"
                >
                  <ChevronDown size={14} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-destructive"
                  disabled={quiz.length <= 1}
                  onClick={() => removeQuestion(qi)}
                  aria-label="Remove question"
                  data-testid={`button-remove-question-${qi}`}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              <AccordionContent className="space-y-4 pb-4">
                <div className="space-y-1">
                  <Label htmlFor={`q-text-${qi}`} className="text-xs text-muted-foreground">
                    Question text
                  </Label>
                  <Input
                    id={`q-text-${qi}`}
                    value={q.text}
                    onChange={(e) => updateQuestion(qi, { text: e.target.value })}
                    data-testid={`input-question-text-${qi}`}
                  />
                </div>

                <div className="space-y-3">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="rounded-md border border-border p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={opt.text}
                          placeholder={`Option ${oi + 1}`}
                          onChange={(e) => updateOption(qi, oi, { text: e.target.value })}
                          className="text-sm"
                          data-testid={`input-option-text-${qi}-${oi}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-destructive"
                          disabled={q.options.length <= 2}
                          onClick={() => removeOption(qi, oi)}
                          aria-label="Remove option"
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                      <div className="grid grid-cols-6 gap-1.5">
                        {VEHICLES.map((v) => (
                          <div key={v} className="space-y-0.5">
                            <Label className="text-[10px] text-muted-foreground block text-center">{v}</Label>
                            <Input
                              type="number"
                              value={opt.scores[v]}
                              onChange={(e) =>
                                updateOption(qi, oi, {
                                  scores: { ...opt.scores, [v]: Number(e.target.value) || 0 },
                                })
                              }
                              className="h-8 px-1 text-center text-xs"
                              data-testid={`input-score-${qi}-${oi}-${v}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 w-full"
                    onClick={() => addOption(qi)}
                    data-testid={`button-add-option-${qi}`}
                  >
                    <Plus size={13} /> Add option
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Button type="button" variant="outline" className="gap-1.5 w-full" onClick={addQuestion} data-testid="button-add-question">
          <Plus size={14} /> Add question
        </Button>
      </CardContent>
    </Card>
  );
}
