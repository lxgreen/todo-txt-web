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
(Z) test +server or +client project Z-priority tasks route /tasks/+server,client/Z
*/

const testGetCases = [
  {
    title: "get /task/1 returns task by number: 1",
    route: "/tasks/1",
    testedElement: 0,
    expected: {
      number: 1,
    },
  },
  {
    title: "get /tasks returns all tasks",
    route: "/tasks",
    testedElement: 9,
    expected: {
      complete: false,
      text:
        "test +server or +client project Z-priority tasks route /tasks/+server,client/Z",
    },
  },
  {
    title: "get /tasks/x returns all complete tasks",
    route: "/tasks/x",
    testedElement: 0,
    expected: {
      complete: true,
      text: "test complete task route /tasks/x due:2020-10-20",
    },
  },
  {
    title: "get /tasks/!x returns all incomplete tasks",
    route: "/tasks/!x",
    testedElement: 0,
    expected: {
      complete: false,
      text: "test incomplete task route /tasks/!x",
    },
  },
  {
    title: "get /tasks/A returns all A-priority tasks",
    route: "/tasks/A",
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
    testedElement: 0,
    expected: {
      complete: false,
      contexts: ["api"],
    },
  },
  {
    title: "get /tasks/@api,e2e returns all @api or @e2e context tasks",
    route: "/tasks/@api,e2e",
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
    testedElement: 0,
    expected: {
      complete: true,
      contexts: ["api", "e2e"],
    },
  },
  {
    title: "get /tasks/+server returns all tasks in server project",
    route: "/tasks/+server",
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
    testedElement: 1,
    expected: {
      complete: false,
      projects: ["server", "client"],
    },
  },
  {
    title:
      "get /tasks/+server,client/Z returns all Z-priority tasks in server or client projects",
    route: "/tasks/+server,client/Z",
    testedElement: 0,
    expected: {
      priority: "Z",
      projects: ["server", "client"],
    },
  },
  {
    title: "get /tasks/due/2020-10-20 returns tasks with due:2020-10-20",
    route: "/tasks/due/2020-10-20",
    testedElement: 0,
    expected: {
      text: "test complete task route /tasks/x due:2020-10-20",
      due: new Date("2020-10-20").getTime(),
    },
  },
  {
    title: "get /tasks/start/2020-10-16 returns task with that start date",
    route: "/tasks/start/2020-10-16",
    testedElement: 0,
    expected: {
      text: "test incomplete task route /tasks/!x",
      date: new Date("2020-10-16").getTime(),
    },
  },
  {
    title: "get /tasks/end/2020-10-13 returns task with that end date",
    route: "/tasks/end/2020-10-13",
    testedElement: 0,
    expected: {
      text: "test complete task route /tasks/x due:2020-10-20",
      completeDate: new Date("2020-10-13").getTime(),
    },
  },
];

const testOptionsCases = [
  {
    title:
      "options /tasks/1 with { complete: false } should update task status",
    route: "/tasks/1",
    testedElement: 0,
    data: { complete: false },
    expectedStatus: 200,
    expectedResult: {
      text: "test complete task route /tasks/x due:2020-10-20",
      complete: false,
    },
  },
  {
    title: "options /tasks/91 returns status 404",
    route: "/tasks/91",
    testedElement: 0,
    expectedStatus: 404,
  },
];

describe("/tasks routes", () => {
  beforeAll(() => {
    process.env.NODE_ENV = "test";
  });
  testGetCases.forEach((testCase) => {
    test(testCase.title, async () => {
      const res = await request(app).get(testCase.route);
      expect(res.body[testCase.testedElement]).toMatchObject(testCase.expected);
    });
  });
  testOptionsCases.forEach((testCase) => {
    test(testCase.title, async () => {
      const res = await request(app)
        .options(testCase.route)
        .send(testCase.data);
      expect(res.status).toBe(testCase.expectedStatus);
      if (testCase.expectedResult) {
        const validationRes = await request(app).get(testCase.route);
        expect(validationRes.body[testCase.testedElement]).toMatchObject(
          testCase.expectedResult
        );
      }
    });
  });
});
