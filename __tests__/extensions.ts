import { compareTree } from "@lezer/markdown/test/compare-tree";
import { SpecParser } from "@lezer/markdown/test/spec";
import { parser } from "../src";

/*
  Copyright (C) 2020 by Marijn Haverbeke <marijnh@gmail.com> and others
  https://github.com/lezer-parser/markdown/blob/f49eb8c8c82cfe45aa213ca1fe2cebc95305b88b/LICENSE
*/
const specParser = new SpecParser(parser, {
  __proto__: null as any,
  T: "Task",
  t: "TaskMarker",
  /* End Copyright */
  EM: "Embed",
  eM: "EmbedMark",
  H: "Hashtag",
  hm: "HashtagMark",
  hl: "HashtagLabel",
  IL: "InternalLink",
  iM: "InternalMark",
  iP: "InternalPath",
  iS: "InternalSubpath",
  iD: "InternalDisplay",
  FN: "Footnote",
  fM: "FootnoteMark",
  fL: "FootnoteLabel",
  FR: "FootnoteReference",
  YF: "YAMLFrontMatter",
  ym: "YAMLMarker",
  yc: "YAMLContent",
});

/*
  Copyright (C) 2020 by Marijn Haverbeke <marijnh@gmail.com> and others
  https://github.com/lezer-parser/markdown/blob/f49eb8c8c82cfe45aa213ca1fe2cebc95305b88b/LICENSE
*/
function test(name: string, spec: string, p = parser, only = false) {
  let f = it;
  if (only) {
    f = it.only;
  }
  f(name, () => {
    const { tree, doc } = specParser.parse(spec, name);
    compareTree(p.parse(doc), tree);
  });
}
/* End Copyright */

describe("Obsidian Extension", () => {
  test(
    "Footnotes",
    `
{P:Some info{FN:{fM:[^}{fL:1}{fM:]}}}

{P:Some more info{FN:{fM:[^}{fL:a$wacky^foot-note}{fM:]}}}
  `
  );

  test(
    "Footnote Reference (Simple)",
    `
{FR:{fM:[^}{fL:1}{fM:]:} Some basic info}
{FR:{fM:[^}{fL:2}{fM:]:} Some {St:{e:**}bold{e:**}} info}
  `
  );

  test(
    "Footnote Reference (Multiline)",
    `
{FR:{fM:[^}{fL:1}{fM:]:} Line 1
Line 2}
{FR:{fM:[^}{fL:2}{fM:]:} Line 3
Line 4
Line 5}
  `
  );

  test(
    "Footnote Reference (Interspersed with Bullets)",
    `
{FR:{fM:[^}{fL:1}{fM:]:} Line 1}
{BL:{LI:{l:-} {P:Line 2
{FN:{fM:[^}{fL:2}{fM:]}}: Line 3}}}

{FR:{fM:[^}{fL:2}{fM:]:} Line 5}
{BL:{LI:{l:-} {P:Line 6}}}
  `
  );

  test(
    "Hashtag",
    `
{P:Some text. {H:{hm:#}{hl:tag}} {H:{hm:#}{hl:other-tag9}}^not part
{H:{hm:#}{hl:ñáø√}}}

{P:Test number #1234}
  `
  );

  test(
    "Internal Link (bare link)",
    `
{P:before {IL:{iM:[[}{iP:Some File}{iM:]]}} after}
  `
  );

  test(
    "Internal Link (heading link)",
    `
{P:{IL:{iM:[[}{iP:Some File}{iS:#heading}{iM:]]}}}
  `
  );

  test(
    "Internal Link (block heading link)",
    `
{P:{IL:{iM:[[}{iP:Some File}{iS:#^blockid}{iM:]]}}}
  `
  );

  test(
    "Internal Link (display text)",
    `
{P:{IL:{iM:[[}{iP:Some File}{iM:|}{iD:something else}{iM:]]}}}
  `
  );

  test(
    "Internal Link (heading and display text)",
    `
{P:{IL:{iM:[[}{iP:Some File}{iS:#heading}{iM:|}{iD:something else}{iM:]]}}}
  `
  );

  test(
    "Internal Embed (file)",
    `
{P:{EM:{eM:!}{IL:{iM:[[}{iP:moon.jpg}{iM:]]}}}}
  `
  );

  test(
    "Internal Embed (file)",
    `
{P:{EM:{eM:!}{IL:{iM:[[}{iP:markdown file}{iS:#a heading}{iM:]]}}}}
  `
  );

  /*
  Copyright (C) 2020 by Marijn Haverbeke <marijnh@gmail.com> and others
  https://github.com/lezer-parser/markdown/blob/f49eb8c8c82cfe45aa213ca1fe2cebc95305b88b/LICENSE
*/
  test(
    "Task list (in unordered list)",
    `
{BL:{LI:{l:-} {T:{t:[ ]} foo}}
{LI:{l:-} {T:{t:[x]} bar}}}`
  );

  test(
    "Task list (in nested list)",
    `
{BL:{LI:{l:-} {T:{t:[x]} foo}
  {BL:{LI:{l:-} {T:{t:[ ]} bar}}
  {LI:{l:-} {T:{t:[x]} baz}}}}
{LI:{l:-} {T:{t:[ ]} bim}}}`
  );

  test(
    "Task list (in ordered list)",
    `
{OL:{LI:{l:1.} {T:{t:[X]} Okay}}}`
  );

  test(
    "Task list (versus setext header)",
    `
{OL:{LI:{l:1.} {SH1:{Ln:{L:[}X{L:]}} foo
   {h:===}}}}`
  );
  /* End Copyright */
  test(
    "Task list (different markers)",
    `
{BL:{LI:{l:-} {T:{t:[a]} foo}}
{LI:{l:-} {T:{t:[[]} bar}}
{LI:{l:-} {T:{t:[]]} baz}}
{LI:{l:-} {T:{t:[\\]} bim}}}
    `
  );

  test(
    "YAMLFrontMatter",
    `
{YF:{ym:---}
{yc:tags: blah}
{ym:---}}

{HR:---}

{P:some text}

{SH2:A header
{h:---}}
  `
  );

  test(
    "YAMLFrontMatter (trailing text)",
    `
{YF:{ym:---}
{yc:tags: blah}
{ym:---}}{P:test}

{HR:---}

{P:some text}

{SH2:A header
{h:---}}
  `
  );

  test(
    "Not YAMLFrontMatter (no close)",
    `
{HR:---}

{P:some text}

{SH1:A header
{h:===}}
  `
  );

  test(
    "Not YAMLFrontMatter (close indented)",
    `
{HR:---}

{P:some text}

 {HR:---}
  `
  );

  test(
    "Not YAMLFrontMatter (space after open)",
    `
{HR:--- }

{P:some text}

{HR:---}
  `
  );

  test(
    "Not YAMLFrontMatter (data before open)",
    `
{P:some text}

{HR:---}

{P:some text}

{HR:---}
  `
  );
});
