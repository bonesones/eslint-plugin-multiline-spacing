/**
 * @fileoverview Enforce blank lines around multiline or custom JSX elements
 */

"use strict";

module.exports = {
  meta: {
    type: "layout",
    docs: {
      description:
        "Enforce blank lines around multiline or custom JSX elements, except when first/last child or when both are single-line simple elements",
      recommended: false,
    },
    fixable: "whitespace",
    schema: [],
    messages: {
      needPaddingBefore: "Missing blank line before JSX element.",
      needPaddingAfter: "Missing blank line after JSX element.",
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
    };
  },
};
