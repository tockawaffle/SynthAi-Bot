export default interface redisPorts extends Document {
    _id: string;
    ports: [
        {
            port: number;
            status: string;
            user: string;
            sessionStartedAt: Date;
        }
    ];
}
