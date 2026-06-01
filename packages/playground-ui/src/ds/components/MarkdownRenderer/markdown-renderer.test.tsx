// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { TooltipProvider } from '../Tooltip';
import { MarkdownRenderer } from './markdown-renderer';

afterEach(() => {
  cleanup();
});

describe('MarkdownRenderer', () => {
  it('renders fenced code blocks after the Code refactor', () => {
    render(
      <TooltipProvider>
        <MarkdownRenderer>{'```typescript\nconst ok = true;\n```'}</MarkdownRenderer>
      </TooltipProvider>,
    );

    expect(screen.getByText('const ok = true;')).toBeDefined();
  });
});
