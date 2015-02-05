import { EventEmitter } from 'events';


export default class Publisher extends EventEmitter {
    constructor() {
        EventEmitter.call(this);
        this.emitters = new WeakMap();
    }

    observe({ publisher = arguments[0] }) {
        // Allow a module to be passed provided it exports a property named publisher.
        // Otherwise assume the provided argument is the emitter itself.
        if (!(publisher === this) && !this.emitters.has(publisher)) {
            let handler = (...args) => {
                this.emit('log', ...args);
            };

            this.emitters.set(publisher, handler);
            publisher.on('log', handler);
        }
        return this;
    }

    unobserve({ publisher = arguments[0] }) {
        // Allow a module to be passed provided it exports a property named publisher.
        // Otherwise assume the provided argument is the emitter itself.
        if (this.emitters.has(publisher)) {
            let handler = this.emitters.get(publisher);
            publisher.removeListener('log', handler);
            this.emitters.delete(publisher);
        }
        return this;
    }

    clear() {
        this.emitters = new WeakMap();
        return this;
    }
}