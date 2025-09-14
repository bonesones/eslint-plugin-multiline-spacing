"use strict";

/**
 * Enforce blank lines around multiline/custom JSX children.
 * Fixes replace entire area between siblings (no accumulation) and preserve indentation.
 */

module.exports = {
  meta: {
    type: "layout",
    docs: {
      description:
        "Require blank lines around multiline or custom JSX children, disallow blank lines between consecutive single-line natives.",
    },
    fixable: "whitespace",
    messages: {
      fixedSpacing: "Adjust blank lines around JSX element.",
    },
    schema: [],
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    function isCustom(node) {
      if (!node || node.type !== "JSXElement") {
        return false;
      }
      const name = node.openingElement && node.openingElement.name;
      if (!name) {
        return false;
      }
      if (name.type === "JSXIdentifier") {
        return /^[A-Z]/.test(name.name);
      }
      if (name.type === "JSXMemberExpression") {
        return true;
      } // Icons.ForkOutlined etc
      return false;
    }

    function isMultiline(node) {
      return node.loc.start.line !== node.loc.end.line;
    }

    function isSingleLine(node) {
      return node.loc.start.line === node.loc.end.line;
    }

    function getIndentOfLine(lineNumber) {
      const line = sourceCode.lines[lineNumber - 1] || "";
      const m = line.match(/^\s*/);
      return m ? m[0] : "";
    }

    return {
      JSXElement(node) {
        const parent = node.parent;
        if (!parent || parent.type !== "JSXElement") {
          return;
        }

        // collect JSXElement children only (ignore text/comments/fragments for now)
        const children = parent.children.filter((c) => {
          return c && c.type === "JSXElement";
        });
        if (children.length === 0) {
          return;
        }

        const idx = children.indexOf(node);
        if (idx === -1) {
          return;
        }

        // helpers for prev/next sibling tokens/locations
        const prev = children[idx - 1] || null;
        const next = children[idx + 1] || null;

        // compute prev end line and next start line safely (fall back to parent's opening/closing)
        const prevEndLine = prev
          ? prev.loc.end.line
          : parent.openingElement
          ? parent.openingElement.loc.end.line
          : node.loc.start.line - 1;
        const nextStartLine = next
          ? next.loc.start.line
          : parent.closingElement
          ? parent.closingElement.loc.start.line
          : node.loc.end.line + 1;

        // current gaps (number of blank lines between prev and node, and node and next)
        const gapBefore = node.loc.start.line - prevEndLine - 1;
        const gapAfter = nextStartLine - node.loc.end.line - 1;

        // types
        const nodeIsCustom = isCustom(node);
        const nodeIsMultiline = isMultiline(node);
        const nodeIsSingle = isSingleLine(node);

        const prevIsCustom = prev ? isCustom(prev) : false;
        const prevIsMultiline = prev ? isMultiline(prev) : false;
        const prevIsSingle = prev ? isSingleLine(prev) : false;

        const nextIsCustom = next ? isCustom(next) : false;
        const nextIsMultiline = next ? isMultiline(next) : false;
        const nextIsSingle = next ? isSingleLine(next) : false;

        const isOnly = children.length === 1;
        const isFirst = idx === 0;
        const isLast = idx === children.length - 1;

        // decide desired gaps (0 or 1 blank line) for BEFORE and AFTER this node
        let wantBefore = 0;
        let wantAfter = 0;

        if (isOnly) {
          wantBefore = 0;
          wantAfter = 0;
        } else {
          // gap BEFORE:
          if (isFirst) {
            // always 0 before first child
            wantBefore = 0;
          } else {
            // if both prev and node are single native (not custom/multiline) => 0
            if (
              prevIsSingle &&
              nodeIsSingle &&
              !prevIsCustom &&
              !nodeIsCustom
            ) {
              wantBefore = 0;
            } else {
              // if any of prev or node is custom/multiline => want 1
              if (
                prevIsCustom ||
                prevIsMultiline ||
                nodeIsCustom ||
                nodeIsMultiline
              ) {
                wantBefore = 1;
              } else {
                wantBefore = 0;
              }
            }
          }

          // gap AFTER:
          if (isLast) {
            wantAfter = 0;
          } else {
            if (
              nodeIsSingle &&
              nextIsSingle &&
              !nodeIsCustom &&
              !nextIsCustom
            ) {
              wantAfter = 0;
            } else {
              if (
                nodeIsCustom ||
                nodeIsMultiline ||
                nextIsCustom ||
                nextIsMultiline
              ) {
                wantAfter = 1;
              } else {
                wantAfter = 0;
              }
            }
          }
        }

        // if current gaps already match desired — nothing to do
        if (gapBefore === wantBefore && gapAfter === wantAfter) {
          return;
        }

        // compute replacement boundaries
        const replaceStartBefore = prev
          ? prev.range[1]
          : parent.openingElement
          ? parent.openingElement.range[1]
          : node.range[0];
        const replaceEndAfter = next
          ? next.range[0]
          : parent.closingElement
          ? parent.closingElement.range[0]
          : node.range[1];

        // indentation choices:
        // for "before" we use indent of node start line (so node keeps its left padding)
        // for "after" we prefer indent of next node start line (so next keeps its left padding), fallback to node indent
        const indentNode = getIndentOfLine(node.loc.start.line);
        const indentNext = next
          ? getIndentOfLine(next.loc.start.line)
          : indentNode;

        const replacementBefore =
          wantBefore === 0 ? "\n" + indentNode : "\n\n" + indentNode;
        const replacementAfter =
          wantAfter === 0 ? "\n" + indentNext : "\n\n" + indentNext;

        // Report and provide fixer that replaces both ranges (before and after) as needed.
        context.report({
          node,
          messageId: "fixedSpacing",
          fix(fixer) {
            const fixes = [];
            if (gapBefore !== wantBefore) {
              fixes.push(
                fixer.replaceTextRange(
                  [replaceStartBefore, node.range[0]],
                  replacementBefore
                )
              );
            }
            if (gapAfter !== wantAfter) {
              fixes.push(
                fixer.replaceTextRange(
                  [node.range[1], replaceEndAfter],
                  replacementAfter
                )
              );
            }
            return fixes;
          },
        });
      },
    };
  },
};
