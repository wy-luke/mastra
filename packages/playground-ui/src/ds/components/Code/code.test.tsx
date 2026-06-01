// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Code } from './code';

const { highlightMock } = vi.hoisted(() => ({
  highlightMock: vi.fn(),
}));

vi.mock('../CodeEditor/code-editor', () => ({
  highlight: highlightMock,
}));

afterEach(() => {
  cleanup();
  highlightMock.mockReset();
});

describe('Code', () => {
  it('renders plain code while highlighting is pending', () => {
    highlightMock.mockReturnValue(new Promise(() => {}));

    const { container } = render(<Code code="const status = 'pending';" lang="typescript" />);

    expect(container.querySelector('pre')?.textContent).toBe("const status = 'pending';");
    expect(container.querySelector('code')).toBeNull();
  });

  it('renders highlighted tokens with dual-theme CSS variables', async () => {
    highlightMock.mockResolvedValue([
      [
        {
          content: 'const',
          htmlStyle: {
            '--shiki-light': '#cf222e',
            '--shiki-dark': '#ff7b72',
            '--shiki-light-bg': '#ffffff',
            '--shiki-dark-bg': '#24292e',
          },
        },
        {
          content: ' status',
          htmlStyle: {
            '--shiki-light': '#24292f',
            '--shiki-dark': '#c9d1d9',
          },
        },
      ],
    ]);

    render(<Code code="const status = 'done';" lang="typescript" />);

    const token = await screen.findByText('const');
    await waitFor(() => {
      expect(token.style.getPropertyValue('--shiki-light')).toBe('#cf222e');
    });
    expect(token.style.getPropertyValue('--shiki-dark')).toBe('#ff7b72');
    expect(token.style.getPropertyValue('--shiki-light-bg')).toBe('#ffffff');
    expect(token.style.getPropertyValue('--shiki-dark-bg')).toBe('#24292e');
    expect(token.classList.contains('text-shiki-light')).toBe(true);
    expect(token.classList.contains('bg-shiki-light-bg')).toBe(true);
    expect(token.classList.contains('dark:text-shiki-dark')).toBe(true);
    expect(token.classList.contains('dark:bg-shiki-dark-bg')).toBe(true);
  });

  it('falls back to the current plain code while a new highlight is pending', async () => {
    highlightMock
      .mockResolvedValueOnce([
        [
          {
            content: 'oldCode',
            htmlStyle: {
              '--shiki-light': '#24292f',
              '--shiki-dark': '#c9d1d9',
            },
          },
        ],
      ])
      .mockReturnValueOnce(new Promise(() => {}));

    const { container, rerender } = render(<Code code="oldCode" lang="typescript" />);

    expect(await screen.findByText('oldCode')).toBeDefined();
    await waitFor(() => {
      expect(container.querySelector('code')).not.toBeNull();
    });

    rerender(<Code code="newCode" lang="typescript" />);

    expect(container.querySelector('pre')?.textContent).toBe('newCode');
    expect(container.querySelector('code')).toBeNull();
  });

  it('renders plain text without highlighting when no language is provided', () => {
    const { container } = render(<Code code="plain text" />);

    expect(container.querySelector('pre')?.textContent).toBe('plain text');
    expect(container.querySelector('code')).toBeNull();
    expect(highlightMock).not.toHaveBeenCalled();
  });
});
