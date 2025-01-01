// QuestionFlow.tsx
'use client';
import { useState, useRef } from 'react';
import { Analytics } from '@/lib/segment-analytics';
import { QuestionCard } from './QuestionCard';
import { FinalStep } from './FinalStep';
import ReferralForm from './Form';
import { QUESTIONS } from '@/constants';
import type { QuestionID, AnswerOption } from '@/types';

const QuestionFlow = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionID>('initial');
  const [showBooking, setShowBooking] = useState(false);
  const [skipToBooking, setSkipToBooking] = useState(false);
  const startTime = useRef(Date.now());

  const handleAnswer = (answer: AnswerOption) => {
    const question = QUESTIONS[currentQuestion];

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
      return <FinalStep title="¡BIENVENIDO A BIOENNEGRAM!" />;
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