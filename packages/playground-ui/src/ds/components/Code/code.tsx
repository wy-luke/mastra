import React from 'react';
import type { CSSProperties } from 'react';
import type { ThemedToken } from 'shiki';

import { highlight } from '../CodeEditor/code-editor';
import { cn } from '@/lib/utils';

export interface CodeProps {
  code: string;
  lang?: string;
  className?: string;
  preClassName?: string;
}

type ShikiCssVars = CSSProperties & Record<`--${string}`, string | number | undefined>;
type HighlightResult = {
  key: string;
  tokens: ThemedToken[][] | null;
};

const tokenClassName = 'text-shiki-light bg-shiki-light-bg dark:text-shiki-dark dark:bg-shiki-dark-bg';
const defaultPreClassName = 'font-mono text-ui-sm text-neutral5 whitespace-pre-wrap';

function getTokenStyle(token: ThemedToken): ShikiCssVars | undefined {
  const { htmlStyle } = token;

  if (!htmlStyle || typeof htmlStyle === 'string') {
    return undefined;
  }

  return htmlStyle as ShikiCssVars;
}

function CodeComponent({ code, lang, className, preClassName }: CodeProps) {
  const [highlightResult, setHighlightResult] = React.useState<HighlightResult | null>(null);
  const highlightKey = lang ? `${lang}\u0000${code}` : null;
  const tokens = highlightResult?.key === highlightKey ? highlightResult.tokens : null;
  const resolvedPreClassName = cn(defaultPreClassName, className, preClassName);

  React.useEffect(() => {
    if (!lang || !highlightKey) {
      return;
    }

    let cancelled = false;

    void highlight(code, lang)
      .then(result => {
        if (!cancelled) {
          setHighlightResult({ key: highlightKey, tokens: result });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHighlightResult({ key: highlightKey, tokens: null });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code, lang, highlightKey]);

  if (!lang || !tokens) {
    return <pre className={resolvedPreClassName}>{code}</pre>;
  }

  let codeOffset = 0;

  return (
    <pre className={resolvedPreClassName}>
      <code>
        {tokens.map((line, lineIndex) => {
          const lineOffset = codeOffset;
          let tokenOffset = lineOffset;
          const tokenSpans = line.map(token => {
            const key = tokenOffset;
            tokenOffset += token.content.length;

            return (
              <span key={key} className={tokenClassName} style={getTokenStyle(token)}>
                {token.content}
              </span>
            );
          });

          codeOffset = tokenOffset + 1;

          return (
            <React.Fragment key={lineOffset}>
              <span>{tokenSpans}</span>
              {lineIndex !== tokens.length - 1 && '\n'}
            </React.Fragment>
          );
        })}
      </code>
    </pre>
  );
}

export const Code = React.memo(CodeComponent);
Code.displayName = 'Code';
