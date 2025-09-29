/**
 * @fileoverview Enforce blank lines around multiline or custom JSX elements
 */

"use strict";

module.exports = {
  meta: {
    type: "layout",
    docs: {
      description:
        "Enforce blank lines around multiline JS/TS blocks and JSX elements",
      recommended: false,
    },
    fixable: "whitespace",
    schema: [],
    messages: {
      needPaddingBefore: "Missing blank line before element.",
      needPaddingAfter: "Missing blank line after element.",
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    function getIndent(node) {
      const line = sourceCode.lines[node.loc.start.line - 1];
      return line.match(/^\s*/)[0] || "";
    }

    function isCustomOrMultiline(node) {
      if (node.type !== "JSXElement") {
        return false;
      }
      const name = node.openingElement.name;
      const isCustom =
        name &&
        ((name.type === "JSXIdentifier" && /^[A-Z]/.test(name.name)) ||
          name.type === "JSXMemberExpression");
      const isMultiline = node.loc.start.line !== node.loc.end.line;
      return isCustom || isMultiline;
    }

    function isInsideSvg(node) {
      let current = node.parent;
      while (current) {
        if (
          current.type === "JSXElement" &&
          current.openingElement.name.type === "JSXIdentifier" &&
          current.openingElement.name.name === "svg"
        ) {
          return true;
        }
        current = current.parent;
      }
      return false;
    }

    function isMultilineNode(node) {
      return node.loc && node.loc.start.line !== node.loc.end.line;
    }

    function isRelevantNode(node) {
      const multilineTypes = [
        "BlockStatement",
        "ObjectExpression",
        "FunctionDeclaration",
        "FunctionExpression",
        "ArrowFunctionExpression",
        "VariableDeclaration",
        "CallExpression",
      ];

      if (node.parent && node.parent.type === "ArrayExpression") return false;

      return multilineTypes.includes(node.type) && isMultilineNode(node);
    }

    return {
      JSXElement(node) {
        const parent = node.parent;
        if (!parent || !Array.isArray(parent.children) || isInsideSvg(node)) {
          return;
        }

        // consider only JSX elements (skip comments, text, etc.)
        const children = parent.children.filter((c) => {
          return c.type === "JSXElement";
        });

        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const prev = children[i - 1];
          const next = children[i + 1];
          const indent = getIndent(child);

          if (!isCustomOrMultiline(child)) {
            continue;
          }

          // --- BEFORE ---
          if (prev) {
            const beforeLines = child.loc.start.line - prev.loc.end.line - 1;
            if (beforeLines === 0) {
              context.report({
                node: child.openingElement,
                messageId: "needPaddingBefore",
                fix(fixer) {
                  return fixer.replaceTextRange(
                    [prev.range[1], child.range[0]],
                    "\n\n" + indent
                  );
                },
              });
            }
          }

          // --- AFTER ---
          if (next) {
            const afterLines = next.loc.start.line - child.loc.end.line - 1;
            if (afterLines === 0) {
              context.report({
                node: child.openingElement,
                messageId: "needPaddingAfter",
                fix(fixer) {
                  return fixer.replaceTextRange(
                    [child.range[1], next.range[0]],
                    "\n\n" + getIndent(next)
                  );
                },
              });
            }
          }
        }
      },

      "BlockStatement, ObjectExpression, ArrayExpression, FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, VariableDeclaration, CallExpression"(
        node
      ) {
        if (!isRelevantNode(node)) return;

        const parent = node.parent;
        if (!parent) return;

        const siblings =
          parent.type === "BlockStatement" ? parent.body : [node];
        if (siblings.length <= 1) return;

        const index = siblings.indexOf(node);
        const firstToken = sourceCode.getFirstToken(node);
        const lastToken = sourceCode.getLastToken(node);
        if (!firstToken || !lastToken) return;

        const prevToken = sourceCode.getTokenBefore(firstToken, {
          includeComments: true,
        });
        const nextToken = sourceCode.getTokenAfter(lastToken, {
          includeComments: true,
        });
        const indent = getIndent(node);

        // --- BEFORE ---
        if (index > 0 && prevToken) {
          const beforeLines = node.loc.start.line - prevToken.loc.end.line - 1;
          if (beforeLines === 0) {
            context.report({
              node,
              messageId: "needPaddingBefore",
              fix(fixer) {
                return fixer.replaceTextRange(
                  [prevToken.range[1], firstToken.range[0]],
                  "\n" +
                    indent +
                    sourceCode.text.slice(
                      prevToken.range[1],
                      firstToken.range[0]
                    )
                );
              },
            });
          }
        }

        // --- AFTER ---
        if (index < siblings.length - 1 && nextToken) {
          const afterLines = nextToken.loc.start.line - node.loc.end.line - 1;
          if (afterLines === 0) {
            context.report({
              node,
              messageId: "needPaddingAfter",
              fix(fixer) {
                return fixer.replaceTextRange(
                  [lastToken.range[1], nextToken.range[0]],
                  "\n" +
                    indent +
                    sourceCode.text.slice(
                      lastToken.range[1],
                      nextToken.range[0]
                    )
                );
              },
            });
          }
        }
      },
    };
  },
};
