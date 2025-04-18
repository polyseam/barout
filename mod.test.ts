import { assertEquals } from "@std/assert";
import { compile } from "./mod.ts";

Deno.test(function basicTest() {
  const greet = compile<{ who: string }>("hello, {{ who }}");
  const result = greet({ who: "world" });
  assertEquals(result, "hello, world");
});

Deno.test(function tripleBraceSingleQuotes() {
  const numeric = compile("const x = '{{{ x }}}';");
  const result = numeric({ x: 42, foo: "" });
  assertEquals(result, "const x = 42;");
});

Deno.test(function tripleBraceDoubleQuotes() {
  const doubleNumeric = compile<{ x: number }>('const x = "{{{ x }}}";');
  const result = doubleNumeric({ x: 42 });
  assertEquals(result, "const x = 42;");
});

Deno.test(function tripleBraceObjectLiteral() {
  const containsLiteralObj = compile<{ foo: string }>(
    'const x = "{{{ foo }}}";',
  );
  const result = containsLiteralObj({ foo: '{ "bar": "baz" }' });
  assertEquals(result, 'const x = { "bar": "baz" };');
});
