import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReferralForm from './Form';
import HubSpotBooking from '../HubSpotBooking';
import { Analytics, segmentAnalytics } from '@/lib/segment-analytics';

type QuestionID = 'initial' | 'referred' | 'welcome_back' | 'new_user' | 'referral_form';
type AnswerOption = 'SI' | 'NO';

interface FinalStepProps {
  title?: string;
}

function FinalStep({ title }: FinalStepProps) {

  segmentAnalytics.page('Book Page', {
    content_name: 'Bioenneagram Final Step Calendar',
    title: 'Bioenneagram Final Step Calendar',
    page_title: 'Bioenneagram Final Step Calendar',
    page_path: '/book/final-step',
    path: '/book/final-step',
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
}

const questions: Record<QuestionID, { id: string; text: string; step: number; options: Partial<Record<AnswerOption, QuestionID>> }> = {
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

const QuestionFlow = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionID>('initial');
  const [, setAnswers] = useState<Record<string, AnswerOption>>({});
  const [showBooking, setShowBooking] = useState(false);
  const [skipToBooking, setSkipToBooking] = useState(false);
  const startTime = useRef(Date.now());

  const handleAnswer = (answer: AnswerOption) => {

    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));

    Analytics.questions.trackAnswer({
      questionId: currentQuestion,
      questionText: questions[currentQuestion].text,
      answer: answer,
      sequence: questions[currentQuestion].step,
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
      segmentAnalytics.page('Book Page', {
        content_name: 'Bioenneagram Final Step Calendar',
        title: 'Bioenneagram Final Step Calendar',
        page_title: 'Bioenneagram Final Step Calendar',
        page_path: '/book/final-step',
        path: '/book/final-step',
      });
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

    segmentAnalytics.page('Book Page', {
      content_name: 'Bioenneagram Step ' + questions[currentQuestion].step,
      title: 'Bioenneagram Step ' + questions[currentQuestion].step,
      page_title: 'Bioenneagram Step ' + questions[currentQuestion].step,
      page_path: '/book/step-' + questions[currentQuestion].step,
      path: '/book/step-' + questions[currentQuestion].step,
    });

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