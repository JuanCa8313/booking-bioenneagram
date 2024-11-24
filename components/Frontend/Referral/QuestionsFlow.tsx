import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReferralForm from './Form';
import HubSpotBooking from '../HubSpotBooking';
import { Analytics, segmentAnalytics } from '@/lib/segment-analytics';

// Types
type QuestionID = 'initial' | 'referred' | 'welcome_back' | 'new_user' | 'referral_form';
type AnswerOption = 'SI' | 'NO';

interface Question {
  id: QuestionID;
  text: string;
  step: number;
  options: Partial<Record<AnswerOption, QuestionID>>;
}

interface FinalStepProps {
  title?: string;
}

// Constants
const QUESTIONS: Record<QuestionID, Question> = {
  initial: {
    id: 'initial',
    text: "¿ES TU PRIMERA VEZ CON NOSOTROS?",
    step: 1,
    options: {
      SI: "referred",
      NO: "welcome_back"
    }
  },
  referred: {
    id: 'referred',
    text: "¿ERES REFERIDO?",
    step: 2,
    options: {
      SI: "referral_form",
      NO: "new_user"
    }
  },
  welcome_back: {
    id: 'welcome_back',
    text: "¡BIENVENIDO DE VUELTA!",
    step: 4,
    options: {}
  },
  new_user: {
    id: 'new_user',
    text: "¡BIENVENIDO A BIOENNEGRAM!",
    step: 4,
    options: {}
  },
  referral_form: {
    id: 'referral_form',
    step: 3,
    text: "",
    options: {}
  }
};

// Hooks
const usePageTracking = (pageName: string, pageData: Record<string, string>) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      segmentAnalytics.page('Book Page', {
        content_name: pageName,
        title: pageName,
        page_title: pageName,
        page_path: pageData.path,
        path: pageData.path,
        ...pageData
      });
    }
  }, [pageName, pageData]);
};

// Components
const FinalStep = ({ title }: FinalStepProps) => {
  usePageTracking('Bioenneagram Final Step Calendar', {
    path: '/book/final-step'
  });

  return (
    <div className="space-y-6">
      {title && (
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {title}
            </CardTitle>
          </CardHeader>
        </Card>
      )}
      <HubSpotBooking />
    </div>
  );
};

const QuestionCard = ({
  question,
  onAnswer
}: {
  question: Question,
  onAnswer: (answer: AnswerOption) => void
}) => {
  usePageTracking(`Bioenneagram Step ${question.step}`, {
    path: `/book/step-${question.step}`
  });

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          {question.text}
        </CardTitle>
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

// Main Component
const QuestionFlow = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionID>('initial');
  const [answers, setAnswers] = useState<Record<string, AnswerOption>>({});
  const [showBooking, setShowBooking] = useState(false);
  const [skipToBooking, setSkipToBooking] = useState(false);
  const startTime = useRef(Date.now());

  const handleAnswer = (answer: AnswerOption) => {
    const question = QUESTIONS[currentQuestion];

    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));

    Analytics.questions.trackAnswer({
      questionId: currentQuestion,
      questionText: question.text,
      answer: answer,
      sequence: question.step,
    });

    const nextQuestion = question.options[answer];
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      if (nextQuestion === 'welcome_back' || nextQuestion === 'new_user') {
        setShowBooking(true);
      }
    }
  };

  const handleReferralSkip = () => {
    setSkipToBooking(true);
    Analytics.forms.trackCompletion({
      formName: 'ReferralForm',
      timeToComplete: Date.now() - startTime.current,
      completionMethod: 'skip'
    });
  };

  if (currentQuestion === 'referral_form') {
    if (skipToBooking || showBooking) {
      return <HubSpotBooking />;
    }

    return (
      <div className="space-y-6">
        <ReferralForm
          onSuccess={() => setShowBooking(true)}
          onSkip={handleReferralSkip}
        />
      </div>
    );
  }

  const currentQuestionData = QUESTIONS[currentQuestion];

  if (Object.keys(currentQuestionData.options).length === 0) {
    return <FinalStep title={currentQuestionData.text} />;
  }

  return (
    <QuestionCard
      question={currentQuestionData}
      onAnswer={handleAnswer}
    />
  );
};

export default QuestionFlow;