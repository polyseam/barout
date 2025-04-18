// A template is just a function from your context type to a rendered string.
type Template<T> = (ctx: T) => string;

/**
 * Compiles a template string into a function that produces a string output by replacing
 * placeholder expressions with values extracted from a provided context object.
 *
 * The template supports two kinds of placeholders:
 *  - Triple-brace expressions with optional wrapping quotes (e.g., `{{{ foo }}}`), which
 *    insert unescaped values.
 *  - Double-brace expressions (e.g., `{{ foo }}`), which insert escaped values.
 *
 * Both placeholder types use dot-notation to safely access nested properties in the context.
 * If a property is not found or its value is null or undefined, it is replaced by an empty string.
 *
 * @template T - The type of the context object.
 * @param tmpl - The template string containing placeholder expressions.
 * @returns A function that accepts a context of type T and returns the interpolated string.
 */
export function compile<T extends object>(tmpl: string): Template<T> {
  // 1) Capture optional wrapping quote + triple‐brace, backreference the same quote
  const rawPattern = /(['"])?\{\{\{\s*([\w.]+)\s*\}\}\}\1/g;
  // 2) Capture regular double‐brace
  const escPattern = /\{\{\s*([\w.]+)\s*\}\}/g;

  // Safely walk a dot‐path off of any unknown object
  function getValue(root: unknown, path: string): unknown {
    return path.split(".").reduce<unknown>((acc, key) => {
      if (
        acc !== null &&
        acc !== undefined &&
        typeof acc === "object" &&
        key in (acc as Record<string, unknown>)
      ) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, root);
  }

  return (ctx: T): string =>
    tmpl
      // Handle {{{ foo }}} (and strip any wrapping quotes)
      .replace(
        rawPattern,
        (
          _match: string,
          _quote: string | undefined,
          key: string,
        ): string => {
          const val = getValue(ctx, key);
          return val == null ? "" : String(val);
        },
      )
      // Then handle {{ foo }} as before
      .replace(
        escPattern,
        (_match: string, key: string): string => {
          const val = getValue(ctx, key);
          return val == null ? "" : String(val);
        },
      );
}
