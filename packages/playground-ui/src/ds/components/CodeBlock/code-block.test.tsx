// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { TooltipProvider } from '../Tooltip';
import { CodeBlock } from './code-block';

afterEach(() => {
  cleanup();
});

describe('CodeBlock', () => {
  it('renders the code text after the Code refactor', () => {
    render(
      <TooltipProvider>
        <CodeBlock code="pnpm dlx mastra init" />
      </TooltipProvider>,
    );

    expect(screen.getByText('pnpm dlx mastra init')).toBeDefined();
  });
});
