import { YamuxStream } from "@chainsafe/libp2p-yamux/dist/src/stream";
import { randomUUID } from "crypto";
import { Readable, Transform } from "stream";
import { pipe } from "it-pipe";
import { Subject } from "rxjs";
import { decode, encode } from "it-length-prefixed";
import sleep from "../modules/utils/sleep.js";

export class Connection {
    public id: string;

    public messages: Subject<Buffer> = new Subject();
    public closed: Subject<void> = new Subject();

    private stream: YamuxStream;
    private transform: Transform;

    constructor (stream: YamuxStream) {
        this.id = randomUUID();
        this.stream = stream;

        this.setupStreams();
        this.setupListeners();
    }

    private setupListeners () {
        
    }

    private setupStreams () {
        this.setupTransform();
        this.setupPipes();
    }

    private setupTransform () {
        this.transform = new Transform({
            transform (chunk, encoding, callback)  {
                this.push(chunk);;
                callback();
            }
        });
    }

    private setupPipes() {
        pipe(this.stream.source, source => decode(source), async (source) => {
            for await (const msg of source) {
                const buf = Buffer.from(msg.subarray(0, msg.length));
                
                this.messages.next(buf);
            }

            this.closed.next();
        });

        pipe(this.transform, encode, this.stream.sink);
    }

    async write (data: Buffer) {
        if (!this.stream.timeline.open) return false;

        try {
            await this.transform.write(data);
        } catch (error) {
            await sleep(100);
            return this.write(data);
        }

        return true;
    }

    async end (data?: Buffer) {
        if (data) {
            await pipe(
                Readable.from([data]),
                source => encode(source),
                this.stream.sink
            );
        }

        await this.stream.close();
    }

}