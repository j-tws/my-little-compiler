# A super small Ruby to JS compiler

A very small Ruby to JS compiler. Started with the tutorial https://citw.dev/tutorial/create-your-own-compiler and eventually added expanded further to understand basic compiler mechanism.

## What is a compiler?

A compiler is a special program that translates a programming language's source code into machine code, bytecode, or another programming language. In this case for this compiler, it will translate Ruby code to JS code.

## Why bother learning?

Most people do not really think about compilers in their daily jobs. However compilers are almost everywhere around you, and lots of the tools are based on concepts borrowed from compilers.

Thus I've decided to just learn the basics for personal interest.

# Process

Most compiler will involve these four steps:

1. Lexical Analysis
2. Syntactic Analysis
3. Transformation
4. Code Generation

### Lexical Analysis

Lexical analysis takes the raw code and splits it apart into these things called tokens by something called a `tokenizer`.

Tokens are an array of so called `token`, which are essentially objects that describe information about the syntax, or so called `lexical grammar`.

For the following code:

```
text = 'hello world'
```

After going through a tokenizer it will look something like this:

```
[
  { type: 'name', value: 'text' },
  { type: 'assignmentOperator', value: '=' },
  { type: 'singleQuote', value: "'" },
  { type: 'name', value: 'hello' },
  { type: 'name', value: 'world' },
  { type: 'singleQuote', value: "'" },
]
```

### Syntactic Analysis

Syntactic analysis takes the array of tokens and restructure them into a representation that describes each part of the syntax and the relation to one and another. This is often known as an intermediate representation or **AST (Abstract Tree Synax)**

An abstract tree syntax from the above tokens will look like this:

```
{
  type: 'program',
  body: [
    { type: 'LocalVariable', name: 'text', declarations:
      [
        { type: 'StringLiteral, value: 'hello world' },
      ]
    },
  ]
}
```

### Transformation

The next type of the compiler stage is transformation. This takes the original AST that was built in reference to Ruby lexical grammar, and transform it into JS AST.

Some AST have similar elements within it that look very similar. These are objects with a type property. Each of these are known as an AST Node. These nodes have defined properties on them that describes an isolated part of the tree.

We can have a node of `StringLiteral`:

```
{
  type: 'StringLiteral',
  value: 'hello world'
}
```

or maybe a node called `LocalVariable`:

```
{
  type: 'LocalVariable',
  name: 'text',
  declarations: [...nested nodes here]
}
```

When transforming the AST we can manipulate nodes by adding/removing/editing properties, or add/remove nodes, or even leaving the original AST alone and create an entirely new one based on it.

Since we are "translating" into a new language, we are going to focus on creating an entirely new AST that is specific to the target language.

### Traversal

In order to navigate these nodes, we will need to traverse through them. This traversal process goes to each node in the AST depth first.

```
{
  type: 'program',
  body: [
    { type: 'LocalVariable', name: 'text', declarations:
      [
        { type: 'StringLiteral, value: 'hello world' },
      ]
    },
  ]
}
```

So for the above AST we will go:

1. `program` - Starting at the top level of the AST
2. `LocalVariable` (text) - Moving to the first element of the body
3. `StringLiteral` (hello world) - Moving to the first element of the `LocalVariable`'s declaration

If we were to manipulate this AST directly, instead of creating a seperate AST, we would likely introduce all sorts of abstractions here. But just visiting each node in the tree is enough for what we are trying to do.

We "visit" each node of the tree because that is a common verb that is used to represent operations on element of an object structure.

### Visitors

The basic idea here is that we are going to create a "visitor" object that has methods that will accept different node types

```
const visitors = {
  LocalVariable() {},
  StringLiteral() {},
  ...
}
```

When we traverse our AST, we will call the methods on this visitor whenever we "enter" or "visit" a node of matching type.

In order to make this useful we will also pass the node and a reference to the parent node (in case if needed).

```
const visitors = {
  LocalVariable(node, parent) {},
  StringLiteral(node, parent) {},
  ...
}
```

However, there also exists the possibility of calling things on "exit". Imagine our tree structure from the before in list form:

```
- Program
  - LocalVaraible
    - StringLiteral
```

As we traverse down, we're going to reach branches with dead ends. As we finish each branch of the tree we "exit" it. So going down the tree we "enter" each node, and going back up we "exit".

```
-> Program (enter)
  -> LocalVariable (enter)
    -> StringLiteral (enter)
    <- StringLiteral (exit)
  <- LocalVariable (exit)
<- Program (enter)
```

In order to support that, the final form of our visitor will look like this:

```
const visitor = {
  StringLiteral: {
    enter(node, parent) {},
    exit(node, parent) {},
  }
}
```

### Code Generation

At last, the final phase of a compiler is code generation. Sometimes compilers will do things that overlap with transformation, but for the most part of, code generation means just take our transformed AST and string-ify the code back out.

Effectively our code generator will know how to "print" out all of the different node types of the AST, and it will recursively call itself to print nested nodes until everything is printed out into one long string of code.

## Use Cases

:white_check_mark: Simple variable assignment

- String assignment
- Integer assignment
- String interpolation assignment

:white_check_mark: Conditionals

- If statement

## Further reading

https://github.com/jamiebuilds/the-super-tiny-compiler
