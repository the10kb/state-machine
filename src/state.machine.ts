export interface IState<DATA= any> {
    name: string;

    startTime ?: number;
    currentTime ?: number;
    elapsedTimeFromStart ?: number;
    counter ?: number;
    started ?: boolean;

    start  ?: ( state: this, data: DATA ) => void;
    update: ( state: this, data: DATA ) => string | void;
    stop   ?: ( state: this, data: DATA ) => void;
}

export class StateMachine<STATE extends IState = IState, DATA = any> {
    public states: STATE[];
    public current: STATE;

    constructor(private data: DATA) {}

    public start(startState: string, forceRestart: boolean = false) {
        if ( !forceRestart && this.current && this.current.name == startState ) {
            return;
        }

        this.stop();
        this.current = this.get(startState);
        this.current.startTime = this.getNowTime();
        this.current.started = true;
        this.current.counter = 0;
        // tslint:disable-next-line:no-unused-expression
        this.current.start && this.current.start(this.current, this.data);
    }

    public update() {
        if ( this.current ) {

            this.current.currentTime = this.getNowTime();
            this.current.elapsedTimeFromStart = this.current.currentTime - this.current.startTime;
            const next = this.current.update(this.current, this.data);
            this.current.counter++;
            if ( typeof next != "undefined" && next != this.current.name ) {
                this.start(next);
            }
        }
    }

    public stop() {
        this.states.forEach((s) => {
            if ( s.started ) {
                s.started = false;
                // tslint:disable-next-line:no-unused-expression
                s.stop && s.stop(s, this.data);
            }
        });
        this.current = null;
    }

    public get(name: string): STATE {
        return this.states.find((s) => s.name == name);
    }

    public destroy() {
        this.states = [];
        this.current = null;
    }

    protected getNowTime() {
        return Date.now();
    }
}
