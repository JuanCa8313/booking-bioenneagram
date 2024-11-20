import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReferralForm from './Form';
import HubSpotBooking from '../HubSpotBooking';
import { Analytics } from '@/lib/segment-analytics';

type QuestionID = 'initial' | 'referred' | 'welcome_back' | 'new_user' | 'referral_form';
type AnswerOption = 'SI' | 'NO';

interface FinalStepProps {
  title?: string;
}

const FinalStep = ({ title }: FinalStepProps) => (
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

const questions: Record<QuestionID, { id: string; text: string; options: Partial<Record<AnswerOption, QuestionID>> }> = {
  initial: {
    id: 'initial',
    text: "¿ES TU PRIMERA VEZ CON NOSOTROS?",
    options: {
      SI: "referred",
      NO: "welcome_back"
    }
  },
  referred: {
    id: 'referred',
    text: "¿ERES REFERIDO?",
    options: {
      SI: "referral_form",
      NO: "new_user"
    }
  },
  welcome_back: {
    id: 'welcome_back',
    text: "¡BIENVENIDO DE VUELTA!",
    options: {}
  },
  new_user: {
    id: 'new_user',
    text: "¡BIENVENIDO A BIOENNEGRAM!",
    options: {}
  },
  referral_form: {
    id: 'referral_form',
    text: "",
    options: {}
  }
};

const QuestionFlow = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionID>('initial');
  const [, setAnswers] = useState<Record<string, AnswerOption>>({});
  const [showBooking, setShowBooking] = useState(false);
  const [skipToBooking, setSkipToBooking] = useState(false);
  const startTime = useRef(Date.now());
  const questionSequence = useRef(0);

  useEffect(() => {
    // segmentAnalytics.page('Questions', 'Initial Question');
  }, []);

  const handleAnswer = (answer: AnswerOption) => {
    questionSequence.current += 1;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));

    Analytics.questions.trackAnswer({
      questionId: currentQuestion,
      questionText: questions[currentQuestion].text,
      answer: answer,
      sequence: questionSequence.current
    });

    const nextQuestion = questions[currentQuestion].options[answer];
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      if (nextQuestion === 'welcome_back' || nextQuestion === 'new_user') {
        setShowBooking(true);
      }
    }
  };

  // Renderizado condicional usando una variable
  let content;

  if (currentQuestion === 'referral_form') {
    if (skipToBooking || showBooking) {
      content = <HubSpotBooking />;
    } else {
      content = (
        <div className="space-y-6">
          <ReferralForm
            onSuccess={() => setShowBooking(true)}
            onSkip={() => {
              setSkipToBooking(true);
              Analytics.forms.trackCompletion({
                formName: 'ReferralForm',
                timeToComplete: Date.now() - startTime.current,
                completionMethod: 'skip'
              });
            }}
          />
        </div>
      );
    }
  } else if (Object.keys(questions[currentQuestion].options).length === 0) {
    content = <FinalStep title={questions[currentQuestion].text} />;
  } else {
    content = (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {questions[currentQuestion].text}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          <Button
            onClick={() => handleAnswer('SI')}
            className="w-32 bg-primary hover:bg-primary-dark"
          >
            SI
          </Button>
          <Button
            onClick={() => handleAnswer('NO')}
            className="w-32 bg-primary hover:bg-primary-dark"
          >
            NO
          </Button>
        </CardContent>
      </Card>
    );
  }

  return content;
};

export default QuestionFlow;