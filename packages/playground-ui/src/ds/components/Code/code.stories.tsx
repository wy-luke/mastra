import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';

import { TooltipProvider } from '../Tooltip';
import { Code } from './code';

const meta: Meta<typeof Code> = {
  title: 'Elements/Code',
  component: Code,
  decorators: [
    Story => (
      <TooltipProvider>
        <div className="w-96 max-w-full p-4">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Code>;

const typescriptCode = `import { Agent } from '@mastra/core/agent';

export const agent = new Agent({
  name: 'support-agent',
  model: '__GATEWAY_OPENAI_MODEL__',
});`;

const jsonCode = JSON.stringify(
  {
    agent: 'support-agent',
    model: '__GATEWAY_OPENAI_MODEL__',
    tools: ['searchDocs', 'createTicket'],
  },
  null,
  2,
);

const shellCode = 'pnpm add @mastra/core mastra';

function useLightStoryRoot() {
  useEffect(() => {
    const root = document.documentElement;
    const previousClassName = root.className;

    root.classList.remove('dark');
    root.classList.add('light');

    return () => {
      root.className = previousClassName;
    };
  }, []);
}

export const Default: Story = {
  args: {
    code: 'pnpm dlx mastra init',
  },
};

export const WithLanguage: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Code code={typescriptCode} lang="typescript" preClassName="rounded-md bg-surface2 p-4" />
      <Code code={jsonCode} lang="json" preClassName="rounded-md bg-surface2 p-4" />
      <Code code={shellCode} lang="sh" preClassName="rounded-md bg-surface2 p-4" />
    </div>
  ),
};

export const LongCode: Story = {
  args: {
    code: `${typescriptCode}

const result = await agent.generate([
  { role: 'system', content: 'Answer with implementation details.' },
  { role: 'user', content: 'Show the current workflow status.' },
]);`,
    lang: 'typescript',
    preClassName: 'rounded-md bg-surface2 p-4',
  },
};

export const NoLanguage: Story = {
  args: {
    code: 'const unhighlighted = true;',
    preClassName: 'rounded-md bg-surface2 p-4',
  },
};

export const LightVsDark: Story = {
  render: () => {
    useLightStoryRoot();

    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-border2/40 bg-surface2 p-3">
          <p className="mb-2 text-ui-sm text-neutral3">Light</p>
          <Code code={typescriptCode} lang="typescript" preClassName="overflow-x-auto" />
        </div>
        <div className="dark rounded-md border border-border2/40 bg-surface2 p-3">
          <p className="mb-2 text-ui-sm text-neutral3">Dark</p>
          <Code code={typescriptCode} lang="typescript" preClassName="overflow-x-auto" />
        </div>
      </div>
    );
  },
};
