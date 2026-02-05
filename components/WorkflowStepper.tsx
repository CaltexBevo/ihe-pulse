'use client';

import type { WorkflowStep } from '@/lib/data/prompts';

interface WorkflowStepperProps {
  steps: WorkflowStep[];
}

export default function WorkflowStepper({ steps }: WorkflowStepperProps) {
  return (
    <>
      {/* Desktop: 2 rows of 4 */}
      <div className="hidden md:block">
        {[0, 4].map((rowStart) => (
          <div key={rowStart} className="flex items-start mb-8 last:mb-0">
            {steps.slice(rowStart, rowStart + 4).map((step, i) => (
              <div key={step.number} className="flex items-start flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pulse to-synapse flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {step.number}
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-white">
                    {step.title}
                  </h4>
                  <p className="mt-1 text-xs text-gray-400 max-w-[140px]">
                    {step.description}
                  </p>
                </div>
                {i < 3 && (
                  <div className="flex-shrink-0 mt-6 w-8 h-px bg-gradient-to-r from-pulse/40 to-synapse/40" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile: vertical stack */}
      <div className="md:hidden space-y-4">
        {steps.map((step, i) => (
          <div key={step.number} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pulse to-synapse flex items-center justify-center text-white font-bold text-sm shrink-0">
                {step.number}
              </div>
              {i < steps.length - 1 && (
                <div className="w-px h-8 bg-gradient-to-b from-pulse/40 to-synapse/40 mt-2" />
              )}
            </div>
            <div className="pt-2">
              <h4 className="text-sm font-semibold text-white">
                {step.title}
              </h4>
              <p className="mt-0.5 text-xs text-gray-400">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
