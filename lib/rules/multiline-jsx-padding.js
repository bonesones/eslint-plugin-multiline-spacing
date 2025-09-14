/**
 * @fileoverview Enforce empty lines around multiline JSX blocks and custom components,
 * except when they are the only child.
 */

"use strict";

module.exports = {
  meta: {
    type: "layout",
    fixable: "whitespace",
    docs: {
      description:
        "require empty lines around multiline JSX elements and custom components (except single child)",
      category: "Stylistic Issues",
      recommended: false,
    },
    schema: [],
    messages: {
      needPadding: "JSX element should be surrounded by empty lines.",
      unexpectedPadding: "Unnecessary empty lines around single child element.",
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    function isPascalCase(name) {
      return /^[A-Z]/.test(name);
    }

    function isMultiline(node) {
      return node.loc.start.line !== node.loc.end.line;
    }

    function isOnlyChild(node) {
      const parent = node.parent;
      if (!parent || !Array.isArray(parent.children)) return false;

      // Считаем только JSXElement / JSXFragment
      const elements = parent.children.filter(
        (c) => c.type === "JSXElement" || c.type === "JSXFragment"
      );
      return elements.length === 1;
    }

    return {
      JSXElement(node) {
        const opening = node.openingElement;
        if (!opening) return;

        const name = opening.name.name || "";
        const pascal = isPascalCase(name);
        const multiline = isMultiline(node);

        // Новое условие: если это единственный ребёнок, правило не срабатывает
        if (isOnlyChild(node)) return;

        const prevToken = sourceCode.getTokenBefore(node, {
          includeComments: true,
        });
        const nextToken = sourceCode.getTokenAfter(node, {
          includeComments: true,
        });

        const beforeText = sourceCode.text.slice(
          prevToken.range[1],
          node.range[0]
        );
        const afterText = sourceCode.text.slice(
          node.range[1],
          nextToken.range[0]
        );

        const hasEmptyLineBefore = /\n\s*\n/.test(beforeText);
        const hasEmptyLineAfter = /\n\s*\n/.test(afterText);

        const needsPadding = pascal || multiline;

        if (needsPadding) {
          if (!hasEmptyLineBefore || !hasEmptyLineAfter) {
            context.report({
              node,
              messageId: "needPadding",
              fix(fixer) {
                const fixes = [];
                if (!hasEmptyLineBefore) {
                  fixes.push(fixer.insertTextBefore(node, "\n"));
                }
                if (!hasEmptyLineAfter) {
                  fixes.push(fixer.insertTextAfter(node, "\n"));
                }
                return fixes;
              },
            });
          }
        } else {
          // Не нужен padding, но есть лишние пустые строки
          if (hasEmptyLineBefore || hasEmptyLineAfter) {
            context.report({
              node,
              messageId: "unexpectedPadding",
              fix(fixer) {
                const fixes = [];
                if (hasEmptyLineBefore) {
                  const newBefore = beforeText.replace(/\n\s*\n/, "\n");
                  fixes.push(
                    fixer.replaceTextRange(
                      [prevToken.range[1], node.range[0]],
                      newBefore
                    )
                  );
                }
                if (hasEmptyLineAfter) {
                  const newAfter = afterText.replace(/\n\s*\n/, "\n");
                  fixes.push(
                    fixer.replaceTextRange(
                      [node.range[1], nextToken.range[0]],
                      newAfter
                    )
                  );
                }
                return fixes;
              },
            });
          }
        }
      },
    };
  },
};
