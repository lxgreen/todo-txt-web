const request = require("supertest");
const app = require("../app");
/* test file
x 2020-10-13 2020-10-10 test complete task route /tasks/x due:2020-10-20
2020-10-16 test incomplete task route /tasks/!x

(A) test A priority task route /tasks/A
x (B) test B priority complete task route /tasks/B/x

test @api context tasks route /tasks/@api
test @api or @e2e context tasks route /tasks/@api,e2e
x 2020-10-13 test @api or @e2e context complete tasks route /tasks/@api,e2e/x

test +server project tasks route /tasks/+server
test +server or +client project tasks route /tasks/+server,client
(C) test +server or +client project C-priority tasks route /tasks/+server,client/C
*/

const testCases = [
  {
    title: "get /task/1 returns task by number: 1",
    route: "/tasks/1",
    method: "get",
    testedElement: 0,
    expected: {
      number: 1,
    },
  },
  {
    title: "get /tasks returns all tasks",
    route: "/tasks",
    method: "get",
    testedElement: 9,
    expected: {
      complete: false,
      text:
        "test +server or +client project C-priority tasks route /tasks/+server,client/C",
    },
  },
  {
    title: "get /tasks/x returns all complete tasks",
    route: "/tasks/x",
    method: "get",
    testedElement: 0,
    expected: {
      complete: true,
      text: "test complete task route /tasks/x due:2020-10-20",
    },
  },
  {
    title: "get /tasks/!x returns all incomplete tasks",
    route: "/tasks/!x",
    method: "get",
    testedElement: 0,
    expected: {
      complete: false,
      text: "test incomplete task route /tasks/!x",
    },
  },
  {
    title: "get /tasks/A returns all A-priority tasks",
    route: "/tasks/A",
    method: "get",
    testedElement: 0,
    expected: {
      complete: false,
      priority: "A",
      text: "test A priority task route /tasks/A",
    },
  },
  {
    title: "get /tasks/B/x returns all B-priority complete tasks",
    route: "/tasks/B/x",
    method: "get",
    testedElement: 0,
    expected: {
      complete: true,
      priority: "B",
      text: "test B priority complete task route /tasks/B/x",
    },
  },
  {
    title: "get /tasks/@api returns all @api context tasks",
    route: "/tasks/@api",
    method: "get",
    testedElement: 0,
    expected: {
      complete: false,
      contexts: ["api"],
    },
  },
  {
    title: "get /tasks/@api,e2e returns all @api or @e2e context tasks",
    route: "/tasks/@api,e2e",
    method: "get",
    testedElement: 1,
    expected: {
      complete: false,
      contexts: ["api", "e2e"],
    },
  },
  {
    title:
      "get /tasks/@api,e2e/x returns all @api or @e2e context complete tasks",
    route: "/tasks/@api,e2e/x",
    method: "get",
    testedElement: 0,
    expected: {
      complete: true,
      contexts: ["api", "e2e"],
    },
  },
  {
    title: "get /tasks/+server returns all tasks in server project",
    route: "/tasks/+server",
    method: "get",
    testedElement: 0,
    expected: {
      complete: false,
      projects: ["server"],
    },
  },
  {
    title:
      "get /tasks/+server,client returns all tasks in server or client projects",
    route: "/tasks/+server,client",
    method: "get",
    testedElement: 1,
    expected: {
      complete: false,
      projects: ["server", "client"],
    },
  },
  {
    title:
      "get /tasks/+server,client/C returns all C-priority tasks in server or client projects",
    route: "/tasks/+server,client/C",
    method: "get",
    testedElement: 0,
    expected: {
      priority: "C",
      projects: ["server", "client"],
    },
  },
  {
    title: "get /tasks/due/2020-10-20 returns tasks with due:2020-10-20",
    route: "/tasks/due/2020-10-20",
    method: "get",
    testedElement: 0,
    expected: {
      text: "test complete task route /tasks/x due:2020-10-20",
      due: new Date("2020-10-20").getTime(),
    },
  },
  {
    title: "get /tasks/start/2020-10-16 returns task with that start date",
    route: "/tasks/start/2020-10-16",
    method: "get",
    testedElement: 0,
    expected: {
      text: "test incomplete task route /tasks/!x",
      date: new Date("2020-10-16").getTime(),
    },
  },
];

describe("tasks router", () => {
  beforeAll(() => {
    process.env.NODE_ENV = "test";
  });
  testCases.forEach((testCase) => {
    test(testCase.title, async () => {
      const res = await request(app)[testCase.method](testCase.route);
      expect(res.body[testCase.testedElement]).toMatchObject(testCase.expected);
    });
  });
});
