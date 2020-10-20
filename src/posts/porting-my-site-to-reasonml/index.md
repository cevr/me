---
title: "Porting my site to Reason"
date: "2020-10-20"
---

I've heard of [ReasonML](https://reasonml.github.io/) for a while now.

It's a language that always intrigued me since I'm a fan of FP patterns.
Well, I finally got around to really diving deep into it (aside from todos 😅).

Reason is not too different from JS/TS so the port was mainly about stripping away all the TypeScript types and letting the compiler infer the rest.

I've got to say, my favourite thing about Reason is the [Rescript](https://rescript-lang.org/) compiler. The inference it provides is great! It makes it so you only have to provide types at the very bottom level.

What do I mean?

Take for example this code:

```reason
module Component = {
  [@react.component]
  let make = (~name) => <div> React.string(name) </div>
}

// using the component
<Component name="Bob"/>
```

As you can see, I haven't declared a single type. The prop `name` is inferred to be a string because it's used with `React.string`!

The type of `React.string` is something like this:

```reason
module React {
  let string: string => string = //..
}
```

A major pain point I have though is that modeling data can be a bit of a hassle. There is no extending base types within Reason/Rescript (there is in ocaml), so something as simple as this requires copy pasting:

```ts
interface Person {
  name: sting;
}

interface Employee extends Person {
  company: string;
}
```

The Reason equivalent is:

```reason
type person = {
  name: string
};

type employee = {
  name: string,
  company: string
}
```

Yeah...

Overall, I really enjoy using Reason/Rescript. Just the inference itself is enough for me to reach for it whenever I can!
