import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import HubSpotBooking from '../HubSpotBooking';
import { usePageTracking } from '@/hooks/usePageTracking';
import type { FinalStepProps } from '@/types';

export const FinalStep = ({ title }: FinalStepProps) => {
  usePageTracking('Bioenneagram Final Step Calendar', {
    path: '/book/final-step'
  });

  return (
    <div className="space-y-6">
      {title && (
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl">{title}</CardTitle>
          </CardHeader>
        </Card>
      )}
      <HubSpotBooking />
    </div>
  );
};