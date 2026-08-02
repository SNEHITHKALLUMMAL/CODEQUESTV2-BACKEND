import { ImportanceLevel, QuestionType } from "../../../shared/types/enums";
import type { CourseSeed } from "../types";

export const cssCourse: CourseSeed = {
  slug: "css",
  title: "CSS — Cascading Style Sheets",
  description:
    "Master CSS from fundamentals to advanced layout: selectors, the box model, Flexbox, Grid, animations, responsive design, and modern best practices.",
  order: 2,
  modules: [
    {
      slug: "introduction-to-css",
      title: "Module 1: Introduction to CSS",
      importance: ImportanceLevel.STANDARD,
      topics: ["What is CSS?", "Why CSS is used", "CSS3", "How CSS works", "Browser DevTools", "VS Code + Live Server"],
      practicals: [{ title: "Style Your First HTML Page", instructionsHint: "apply basic colors and fonts" }],
      quiz: {
        title: "Module 1 Quiz — Introduction to CSS",
        questions: [
          { type: QuestionType.MCQ, question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style System", "Computer Styled Sheets", "Colorful Style Syntax"], correctAnswer: "Cascading Style Sheets", explanation: "CSS = Cascading Style Sheets, used to style HTML documents." },
          { type: QuestionType.MCQ, question: "Which browser tool lets you inspect and live-edit CSS?", options: ["Terminal", "DevTools", "Task Manager", "Package Manager"], correctAnswer: "DevTools", explanation: "Browser DevTools allow inspecting elements and editing styles live." },
          { type: QuestionType.FILL_BLANK, question: "CSS controls the presentation, while ____ controls the structure/content of a web page.", options: [], correctAnswer: "HTML", explanation: "HTML provides structure; CSS provides presentation." },
        ],
      },
    },
    {
      slug: "ways-to-add-css",
      title: "Module 2: Ways to Add CSS",
      importance: ImportanceLevel.STANDARD,
      topics: ["Inline CSS", "Internal CSS", "External CSS", "CSS Comments, Syntax, and Cascade"],
      practicals: [{ title: "Convert Inline Styles to External CSS", instructionsHint: "refactor a page's styling" }],
      quiz: {
        title: "Module 2 Quiz — Ways to Add CSS",
        questions: [
          { type: QuestionType.MCQ, question: "Which method of adding CSS is recommended for large, maintainable projects?", options: ["Inline CSS", "Internal CSS", "External CSS", "None, always use inline"], correctAnswer: "External CSS", explanation: "External stylesheets are reusable across pages and easiest to maintain." },
          { type: QuestionType.MCQ, question: "Inline CSS is applied using which HTML attribute?", options: ["class", "id", "style", "css"], correctAnswer: "style", explanation: "The style attribute applies CSS directly to a single element." },
          { type: QuestionType.FILL_BLANK, question: "When multiple rules conflict, CSS resolves them using specificity and the ____ (the 'C' in CSS).", options: [], correctAnswer: "cascade", explanation: "The cascade determines which competing style rule applies." },
        ],
      },
    },
    {
      slug: "css-selectors",
      title: "Module 3: CSS Selectors",
      importance: ImportanceLevel.CRITICAL,
      topics: ["Universal Selector", "Element Selector", "Class Selector", "ID Selector", "Group Selector"],
      practicals: [{ title: "Style a Navigation Menu", instructionsHint: "using class and descendant selectors" }],
      quiz: {
        title: "Module 3 Quiz — CSS Selectors",
        questions: [
          { type: QuestionType.MCQ, question: "Which selector targets elements by class?", options: [".classname", "#classname", "*classname", "classname"], correctAnswer: ".classname", explanation: "A leading dot (.) selects elements with the matching class attribute." },
          { type: QuestionType.MCQ, question: "Which selector has the highest specificity among these?", options: ["Element selector", "Class selector", "ID selector", "Universal selector"], correctAnswer: "ID selector", explanation: "ID selectors (#id) are more specific than class or element selectors." },
          { type: QuestionType.FILL_BLANK, question: "The ____ selector, written as *, applies a rule to every element on the page.", options: [], correctAnswer: "universal", explanation: "The universal selector (*) matches all elements." },
        ],
      },
    },
    {
      slug: "colors-and-backgrounds",
      title: "Module 4: Colors and Backgrounds",
      importance: ImportanceLevel.STANDARD,
      topics: [
        "Color Names, HEX, RGB(A), HSL(A)",
        "Background Color",
        "Background Image",
        "Background Repeat, Position, Size, Attachment",
        "Linear and Radial Gradients",
      ],
      practicals: [{ title: "Design a Colorful Landing Page", instructionsHint: "using gradients and background images" }],
      quiz: {
        title: "Module 4 Quiz — Colors and Backgrounds",
        questions: [
          { type: QuestionType.MCQ, question: "Which color format includes an alpha (transparency) channel alongside red/green/blue?", options: ["HEX", "RGB", "RGBA", "Named colors"], correctAnswer: "RGBA", explanation: "RGBA adds an alpha channel (0–1) for opacity to RGB." },
          { type: QuestionType.MCQ, question: "Which property prevents a background image from tiling/repeating?", options: ["background-size", "background-repeat: no-repeat", "background-position", "background-clip"], correctAnswer: "background-repeat: no-repeat", explanation: "background-repeat: no-repeat stops the image from tiling." },
          { type: QuestionType.FILL_BLANK, question: "A background that transitions smoothly between two or more colors in a straight line is a ____ gradient.", options: [], correctAnswer: "linear", explanation: "linear-gradient() creates a gradient along a straight line." },
        ],
      },
    },
    {
      slug: "css-units",
      title: "Module 5: CSS Units",
      importance: ImportanceLevel.STANDARD,
      topics: ["px", "% (percentage)", "em", "rem", "vw / vh", "vmin / vmax", "auto"],
      practicals: [{ title: "Compare Different Units", instructionsHint: "resize elements using px, %, em, rem, vw/vh" }],
      quiz: {
        title: "Module 5 Quiz — CSS Units",
        questions: [
          { type: QuestionType.MCQ, question: "Which unit is relative to the root element's font size?", options: ["em", "rem", "px", "vh"], correctAnswer: "rem", explanation: "rem = 'root em', relative to the <html> element's font-size." },
          { type: QuestionType.MCQ, question: "Which unit is relative to 1% of the viewport height?", options: ["vh", "vw", "em", "%"], correctAnswer: "vh", explanation: "1vh equals 1% of the viewport's height." },
          { type: QuestionType.FILL_BLANK, question: "The ____ unit is a fixed, absolute unit that does not scale with parent font size.", options: [], correctAnswer: "px", explanation: "px (pixels) is an absolute unit, unlike em/rem/%/vw/vh." },
        ],
      },
    },
    {
      slug: "text-and-fonts",
      title: "Module 6: Text and Fonts",
      importance: ImportanceLevel.STANDARD,
      topics: [
        "font-family, Web Safe Fonts, Google Fonts",
        "font-size, font-style, font-weight",
        "text-align, text-transform, text-decoration, text-shadow",
        "letter-spacing, word-spacing, line-height, white-space",
      ],
      practicals: [{ title: "Create a Blog Article Layout", instructionsHint: "with custom fonts and spacing" }],
      quiz: {
        title: "Module 6 Quiz — Text and Fonts",
        questions: [
          { type: QuestionType.MCQ, question: "Which property controls the space between lines of text?", options: ["letter-spacing", "word-spacing", "line-height", "text-indent"], correctAnswer: "line-height", explanation: "line-height sets the vertical spacing between lines." },
          { type: QuestionType.MCQ, question: "Which property would convert text to all uppercase without changing the underlying HTML?", options: ["font-variant", "text-transform: uppercase", "text-decoration: uppercase", "font-weight: bold"], correctAnswer: "text-transform: uppercase", explanation: "text-transform: uppercase visually capitalizes text." },
          { type: QuestionType.FILL_BLANK, question: "If a custom font fails to load, the browser falls back to the next font listed in the font-____ stack.", options: [], correctAnswer: "family", explanation: "font-family accepts a comma-separated fallback list." },
        ],
      },
    },
    {
      slug: "box-model",
      title: "Module 7: Box Model",
      importance: ImportanceLevel.CRITICAL,
      topics: ["Content, Padding, Border, Margin", "Width and Height", "box-sizing", "Border Radius", "Outline"],
      practicals: [{ title: "Design Profile Cards", instructionsHint: "using padding, border-radius, and box-sizing" }],
      quiz: {
        title: "Module 7 Quiz — Box Model",
        questions: [
          { type: QuestionType.MCQ, question: "In order from innermost to outermost, what is the correct box model layer order?", options: ["Margin, Border, Padding, Content", "Content, Padding, Border, Margin", "Content, Border, Padding, Margin", "Padding, Content, Border, Margin"], correctAnswer: "Content, Padding, Border, Margin", explanation: "The box model, from the center outward: content → padding → border → margin." },
          { type: QuestionType.MCQ, question: "Which box-sizing value makes width/height include padding and border?", options: ["content-box", "border-box", "padding-box", "margin-box"], correctAnswer: "border-box", explanation: "box-sizing: border-box includes padding and border within the specified width/height." },
          { type: QuestionType.FILL_BLANK, question: "The property that rounds the corners of an element's border is border-____.", options: [], correctAnswer: "radius", explanation: "border-radius rounds the corners of an element's box." },
        ],
      },
    },
    {
      slug: "display-properties",
      title: "Module 8: Display Properties",
      importance: ImportanceLevel.STANDARD,
      topics: ["Block", "Inline", "Inline-block", "None", "Visibility"],
      practicals: [{ title: "Arrange Content Using Display Types", instructionsHint: "compare block/inline/inline-block layouts" }],
      quiz: {
        title: "Module 8 Quiz — Display Properties",
        questions: [
          { type: QuestionType.MCQ, question: "Which display value allows an element to sit next to others while still accepting width/height?", options: ["block", "inline", "inline-block", "none"], correctAnswer: "inline-block", explanation: "inline-block flows inline but respects width/height/margin like a block." },
          { type: QuestionType.MCQ, question: "Which property hides an element but still reserves its space in the layout?", options: ["display: none", "visibility: hidden", "opacity: 0", "position: absolute"], correctAnswer: "visibility: hidden", explanation: "visibility: hidden hides the element visually but keeps its layout space, unlike display: none." },
          { type: QuestionType.FILL_BLANK, question: "display: ____ removes an element entirely from the document flow, freeing up its space.", options: [], correctAnswer: "none", explanation: "display: none removes the element from rendering and layout entirely." },
        ],
      },
    },
    {
      slug: "positioning",
      title: "Module 9: Positioning",
      importance: ImportanceLevel.IMPORTANT,
      topics: ["Static Position", "Relative Position", "Absolute Position", "Fixed Position", "Sticky Position", "z-index"],
      practicals: [{ title: "Sticky Navigation Bar", instructionsHint: "using position: sticky" }],
      quiz: {
        title: "Module 9 Quiz — Positioning",
        questions: [
          { type: QuestionType.MCQ, question: "Which position value keeps an element fixed relative to the viewport even while scrolling?", options: ["relative", "absolute", "fixed", "static"], correctAnswer: "fixed", explanation: "position: fixed anchors an element to the viewport, ignoring scroll." },
          { type: QuestionType.MCQ, question: "An absolutely positioned element is positioned relative to its nearest ancestor with which position value?", options: ["static", "any positioned (non-static) ancestor", "fixed only", "It's always relative to the viewport"], correctAnswer: "any positioned (non-static) ancestor", explanation: "absolute positions relative to the nearest ancestor that isn't position: static." },
          { type: QuestionType.FILL_BLANK, question: "The ____ property controls which overlapping positioned element appears on top.", options: [], correctAnswer: "z-index", explanation: "z-index controls the stacking order of positioned elements." },
        ],
      },
    },
    {
      slug: "flexbox",
      title: "Module 10: Flexbox",
      importance: ImportanceLevel.CRITICAL,
      topics: [
        "Flex Container and Flex Items",
        "flex-direction",
        "justify-content",
        "align-items and align-content",
        "flex-wrap",
        "gap",
        "flex-grow, flex-shrink, flex-basis",
        "order",
        "align-self",
      ],
      practicals: [
        { title: "Responsive Card Layout", instructionsHint: "using flex-wrap and gap" },
        { title: "Navigation Bar", instructionsHint: "using justify-content and align-items" },
      ],
      quiz: {
        title: "Module 10 Quiz — Flexbox",
        questions: [
          { type: QuestionType.MCQ, question: "Which property distributes flex items along the main axis?", options: ["align-items", "justify-content", "flex-wrap", "order"], correctAnswer: "justify-content", explanation: "justify-content aligns items along the main axis (row by default)." },
          { type: QuestionType.MCQ, question: "Which property aligns flex items along the cross axis?", options: ["justify-content", "align-items", "flex-direction", "gap"], correctAnswer: "align-items", explanation: "align-items aligns items along the cross axis." },
          { type: QuestionType.FILL_BLANK, question: "Setting display: ____ on a container turns its direct children into flex items.", options: [], correctAnswer: "flex", explanation: "display: flex activates flexbox layout for the container's children." },
        ],
      },
    },
    {
      slug: "css-grid",
      title: "Module 11: CSS Grid (Basics)",
      importance: ImportanceLevel.IMPORTANT,
      topics: ["Grid Container and Grid Items", "Rows and Columns", "Gap", "Grid Areas", "repeat()", "minmax()"],
      practicals: [{ title: "Dashboard Layout", instructionsHint: "using grid-template-columns and grid-template-areas" }],
      quiz: {
        title: "Module 11 Quiz — CSS Grid",
        questions: [
          { type: QuestionType.MCQ, question: "Which property defines the number and width of columns in a grid?", options: ["grid-template-rows", "grid-template-columns", "grid-gap", "grid-area"], correctAnswer: "grid-template-columns", explanation: "grid-template-columns defines column tracks for the grid container." },
          { type: QuestionType.MCQ, question: "Which function lets a track size be flexible between a minimum and maximum?", options: ["repeat()", "minmax()", "clamp()", "fit-content()"], correctAnswer: "minmax()", explanation: "minmax(min, max) defines a size range for a grid track." },
          { type: QuestionType.FILL_BLANK, question: "repeat(3, 1fr) is shorthand for three equal columns, each taking 1 fractional (____) unit.", options: [], correctAnswer: "fr", explanation: "The fr unit represents a fraction of the available space in the grid container." },
        ],
      },
    },
    {
      slug: "lists-and-tables-css",
      title: "Module 12: Lists and Tables (CSS)",
      importance: ImportanceLevel.STANDARD,
      topics: ["List Style", "Table Borders", "Border Collapse", "Cell Padding", "Zebra Stripes"],
      practicals: [{ title: "Student Marks Table", instructionsHint: "styled with zebra stripes and collapsed borders" }],
      quiz: {
        title: "Module 12 Quiz — Lists and Tables",
        questions: [
          { type: QuestionType.MCQ, question: "Which property removes the default bullet from a list item?", options: ["list-style: none", "list-type: none", "bullet: none", "display: none"], correctAnswer: "list-style: none", explanation: "list-style: none removes markers from list items." },
          { type: QuestionType.MCQ, question: "Which property merges adjacent table cell borders into a single border?", options: ["border-spacing", "border-collapse: collapse", "border-merge", "table-layout: fixed"], correctAnswer: "border-collapse: collapse", explanation: "border-collapse: collapse merges adjacent borders into one." },
          { type: QuestionType.FILL_BLANK, question: "Alternating row background colors in a table, commonly called ____ stripes, are usually done with nth-child(even/odd).", options: [], correctAnswer: "zebra", explanation: "Zebra striping alternates row colors for readability, via :nth-child()." },
        ],
      },
    },
    {
      slug: "forms-styling",
      title: "Module 13: Forms Styling",
      importance: ImportanceLevel.IMPORTANT,
      topics: ["Input Styling", "Buttons", "Textarea and Select Styling", "Placeholder Styling", "Focus Effects", "Disabled Field Styling"],
      practicals: [
        { title: "Styled Login Form", instructionsHint: "with custom focus states" },
        { title: "Styled Registration Form", instructionsHint: "with styled buttons and inputs" },
      ],
      quiz: {
        title: "Module 13 Quiz — Forms Styling",
        questions: [
          { type: QuestionType.MCQ, question: "Which pseudo-class styles an input while the user is typing in it?", options: [":hover", ":focus", ":active", ":visited"], correctAnswer: ":focus", explanation: ":focus applies while the element has keyboard/input focus." },
          { type: QuestionType.MCQ, question: "Which pseudo-element styles the placeholder text of an input?", options: ["::before", "::placeholder", "::after", ":empty"], correctAnswer: "::placeholder", explanation: "::placeholder targets the placeholder text styling." },
          { type: QuestionType.FILL_BLANK, question: "The pseudo-class that targets a form field with the disabled attribute is :____.", options: [], correctAnswer: "disabled", explanation: ":disabled selects form elements that are disabled." },
        ],
      },
    },
    {
      slug: "transitions",
      title: "Module 14: Transitions",
      importance: ImportanceLevel.STANDARD,
      topics: ["transition property", "Duration", "Delay", "Timing Functions"],
      practicals: [{ title: "Animated Buttons", instructionsHint: "with hover transitions" }],
      quiz: {
        title: "Module 14 Quiz — Transitions",
        questions: [
          { type: QuestionType.MCQ, question: "Which shorthand property defines what, how long, and how a style change animates?", options: ["animation", "transition", "transform", "keyframes"], correctAnswer: "transition", explanation: "transition combines property, duration, timing-function, and delay." },
          { type: QuestionType.MCQ, question: "Which timing function starts slow, speeds up, then slows down again?", options: ["linear", "ease-in", "ease-out", "ease-in-out"], correctAnswer: "ease-in-out", explanation: "ease-in-out eases at both the start and end of the transition." },
          { type: QuestionType.FILL_BLANK, question: "transition-____ specifies how long, in seconds or milliseconds, the transition takes.", options: [], correctAnswer: "duration", explanation: "transition-duration sets the length of the transition." },
        ],
      },
    },
    {
      slug: "transformations",
      title: "Module 15: Transformations",
      importance: ImportanceLevel.STANDARD,
      topics: ["Translate", "Rotate", "Scale", "Skew"],
      practicals: [{ title: "Image Hover Effects", instructionsHint: "using scale and rotate on hover" }],
      quiz: {
        title: "Module 15 Quiz — Transformations",
        questions: [
          { type: QuestionType.MCQ, question: "Which transform function resizes an element?", options: ["translate()", "rotate()", "scale()", "skew()"], correctAnswer: "scale()", explanation: "scale() resizes an element along the x and/or y axis." },
          { type: QuestionType.MCQ, question: "Which transform function moves an element without affecting document flow?", options: ["translate()", "rotate()", "scale()", "skew()"], correctAnswer: "translate()", explanation: "translate() shifts an element's position visually, leaving layout flow unaffected." },
          { type: QuestionType.FILL_BLANK, question: "rotate(45deg) rotates an element by 45 ____ around its transform origin.", options: [], correctAnswer: "degrees", explanation: "Rotation angles in CSS transforms are typically specified in degrees (deg)." },
        ],
      },
    },
    {
      slug: "animations",
      title: "Module 16: Animations",
      importance: ImportanceLevel.STANDARD,
      topics: ["@keyframes", "Animation Name and Duration", "Animation Delay", "Iteration Count", "Direction", "Fill Mode"],
      practicals: [
        { title: "Loading Spinner", instructionsHint: "using @keyframes rotate animation" },
        { title: "Bouncing Ball", instructionsHint: "using @keyframes with translateY" },
      ],
      quiz: {
        title: "Module 16 Quiz — Animations",
        questions: [
          { type: QuestionType.MCQ, question: "Which rule defines the intermediate steps of a CSS animation?", options: ["@media", "@keyframes", "@font-face", "@supports"], correctAnswer: "@keyframes", explanation: "@keyframes defines the stages/percentages of an animation sequence." },
          { type: QuestionType.MCQ, question: "Which property makes an animation repeat forever?", options: ["animation-duration: infinite", "animation-iteration-count: infinite", "animation-direction: infinite", "animation-fill-mode: infinite"], correctAnswer: "animation-iteration-count: infinite", explanation: "animation-iteration-count: infinite loops the animation endlessly." },
          { type: QuestionType.FILL_BLANK, question: "animation-fill-mode: ____ keeps the animation's final keyframe styles applied after it ends.", options: [], correctAnswer: "forwards", explanation: "forwards retains the computed values of the last keyframe after the animation completes." },
        ],
      },
    },
    {
      slug: "responsive-design",
      title: "Module 17: Responsive Design",
      importance: ImportanceLevel.CRITICAL,
      topics: ["Mobile First Design", "Media Queries", "Breakpoints", "Responsive Images", "Responsive Text", "Flexible Layouts"],
      practicals: [{ title: "Responsive Portfolio Website", instructionsHint: "using media queries across breakpoints" }],
      quiz: {
        title: "Module 17 Quiz — Responsive Design",
        questions: [
          { type: QuestionType.MCQ, question: "Which at-rule applies styles conditionally based on screen size?", options: ["@import", "@media", "@font-face", "@keyframes"], correctAnswer: "@media", explanation: "@media queries apply CSS rules only when certain conditions (like viewport width) are met." },
          { type: QuestionType.MCQ, question: "In 'mobile-first' design, base styles target which screens, with media queries adding styles for larger ones?", options: ["Desktop screens", "Mobile screens", "Print media", "TV screens"], correctAnswer: "Mobile screens", explanation: "Mobile-first starts with small-screen styles and progressively enhances for larger viewports." },
          { type: QuestionType.FILL_BLANK, question: "The specific screen widths at which a layout's design changes are called ____.", options: [], correctAnswer: "breakpoints", explanation: "Breakpoints are the viewport widths where media queries change the layout." },
        ],
      },
    },
    {
      slug: "css-variables",
      title: "Module 18: CSS Variables",
      importance: ImportanceLevel.IMPORTANT,
      topics: ["Custom Properties", "The :root selector", "Reusing Variables with var()"],
      practicals: [{ title: "Dark/Light Color Themes", instructionsHint: "using CSS custom properties toggled by a class" }],
      quiz: {
        title: "Module 18 Quiz — CSS Variables",
        questions: [
          { type: QuestionType.MCQ, question: "How is a CSS custom property declared?", options: ["$primary-color: blue;", "--primary-color: blue;", "@primary-color: blue;", "var-primary-color: blue;"], correctAnswer: "--primary-color: blue;", explanation: "Custom properties are declared with a double-dash prefix, e.g. --primary-color." },
          { type: QuestionType.MCQ, question: "Which function retrieves the value of a custom property?", options: ["get()", "var()", "calc()", "attr()"], correctAnswer: "var()", explanation: "var(--name) reads a custom property's current value." },
          { type: QuestionType.FILL_BLANK, question: "Custom properties are conventionally declared on the :____ pseudo-class so they're globally available.", options: [], correctAnswer: "root", explanation: ":root targets the highest-level element (html), making variables globally scoped." },
        ],
      },
    },
    {
      slug: "best-practices",
      title: "Module 19: Best Practices",
      importance: ImportanceLevel.IMPORTANT,
      topics: ["File Organization", "Naming Conventions", "Reusable Classes", "CSS Reset", "Avoiding Inline Styles"],
      practicals: [{ title: "Refactor a Page to Use Clean, Reusable CSS", instructionsHint: "apply naming conventions and remove inline styles" }],
      quiz: {
        title: "Module 19 Quiz — Best Practices",
        questions: [
          { type: QuestionType.MCQ, question: "Why is a CSS reset (or normalize.css) commonly used?", options: ["To add animations by default", "To remove inconsistent default browser styling before custom styles are applied", "To minify the CSS file", "To enable Flexbox"], correctAnswer: "To remove inconsistent default browser styling before custom styles are applied", explanation: "A reset neutralizes browser default styles so designs render consistently across browsers." },
          { type: QuestionType.MCQ, question: "Why should inline styles generally be avoided in production code?", options: ["They load faster", "They hurt reusability and maintainability, and increase specificity conflicts", "They are deprecated in HTML5", "Browsers don't support them"], correctAnswer: "They hurt reusability and maintainability, and increase specificity conflicts", explanation: "Inline styles can't be reused, are hard to override, and mix concerns." },
          { type: QuestionType.FILL_BLANK, question: "A popular class naming convention that structures classes as block__element--modifier is called ____.", options: [], correctAnswer: "BEM", explanation: "BEM (Block Element Modifier) is a widely used CSS naming methodology." },
        ],
      },
    },
  ],
};
