import {StateMachine} from "../src";

describe("state-machine", () => {
    it("should switch states", () => {

        const m = new StateMachine({counter: 0});

        m.states = [
            {
                name: "start", update: (state, data) => {
                    data.counter = 20;
                    return "middle";
                },
            },
            {
                name : "middle", update: (state, data) => {
                    data.counter *= 2;
                    return "end";
                },
            },

            {
                name : "end", update: (state, data) => {
                    data.counter += 2;
                },
            },
        ];

        m.start("start");
        m.update();
        m.update();
        m.update();

        expect(m.data.counter).toBe(42);
        m.update();
        expect(m.data.counter).toBe(44);
    });
});
