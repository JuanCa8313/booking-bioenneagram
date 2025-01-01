// components/QuestionCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePageTracking } from '@/hooks/usePageTracking';
import type { Question, AnswerOption } from '@/types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: AnswerOption) => void;
}

export const QuestionCard = ({ question, onAnswer }: QuestionCardProps) => {
  usePageTracking(`Bioenneagram Step ${question.step}`, {
    path: `/book/step-${question.step}`
  });

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">{question.text}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center gap-4">
        {Object.keys(question.options).map((option) => (
          <Button
            key={option}
            onClick={() => onAnswer(option as AnswerOption)}
            className="w-32 bg-primary hover:bg-primary-dark"
          >
            {option}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};