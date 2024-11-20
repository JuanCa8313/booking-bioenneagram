import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReferralForm from './Form';
import HubSpotBooking from '../HubSpotBooking';

type QuestionID = 'initial' | 'referred' | 'welcome_back' | 'new_user' | 'referral_form';
type AnswerOption = 'SI' | 'NO';

interface FinalStepProps {
  title?: string;
}

// Componente para mostrar mensaje final con calendario
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

  const handleAnswer = (answer: AnswerOption) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));

    const nextQuestion = questions[currentQuestion].options[answer];
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      // Mostrar el calendario cuando llegamos a una página final
      if (nextQuestion === 'welcome_back' || nextQuestion === 'new_user') {
        setShowBooking(true);
      }
    }
  };

  // Si estamos en el formulario de referidos
  if (currentQuestion === 'referral_form') {
    if (skipToBooking || showBooking) {
      return <HubSpotBooking />;
    }

    return (
      <div className="space-y-6">
        <ReferralForm
          onSuccess={() => setShowBooking(true)}
          onSkip={() => setSkipToBooking(true)} // Manejar el caso de "omitir"
        />
      </div>
    );
  }

  // Si llegamos a una página final
  if (Object.keys(questions[currentQuestion].options).length === 0) {
    return (
      <FinalStep title={questions[currentQuestion].text} />
    );
  }

  // Flujo normal de preguntas
  return (
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
};

export default QuestionFlow;