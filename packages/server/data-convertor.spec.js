const { parse, serialize } = require("./data-convertor");

test("parse valid string", () => {
  const expected = {
    complete: false,
    text: "test todo.txt parser +todo-txt-web",
    priority: "A",
    contexts: [],
    projects: ["todo-txt-web"],
  };

  const actual = parse("(A) test todo.txt parser +todo-txt-web");

  expect(actual[0]).toMatchObject(expected);
});

test("parse custom fields", () => {
  const expected = {
    complete: false,
    text:
      "test todo.txt parser +todo-txt-web due:2020-10-20 repeat:14d times:5",
    priority: "A",
    contexts: [],
    projects: ["todo-txt-web"],
    due: new Date("2020-10-20").getTime(),
    repeat: "14d",
    times: 5,
  };

  const actual = parse(
    "(A) test todo.txt parser +todo-txt-web due:2020-10-20 repeat:14d times:5"
  );

  expect(actual[0]).toMatchObject(expected);
});

test("serialize data to text", () => {
  const expected = `(A) test todo.txt serializer +todo-txt-web
x (B) test todo.txt parser @dev`;
  const actual = serialize([
    {
      complete: false,
      priority: "A",
      text: "test todo.txt serializer +todo-txt-web",
      projects: ["todo-txt-web"],
    },
    {
      complete: true,
      text: "test todo.txt parser @dev",
      contexts: ["dev"],
      priority: "B",
    },
  ]);
  expect(actual).toEqual(expected);
});
