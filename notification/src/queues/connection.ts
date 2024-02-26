import { Logger } from 'winston';
import { winstonLogger } from '@jobber-micro/sheared';
import client, { Channel, Connection } from 'amqplib'

import { config } from '@notifications/config'

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationQueueConnection', 'debug')


async function createConnection(): Promise<Channel | undefined> {
    try {
        const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
        const channel: Channel = await connection.createChannel();
        log.info('Notification server connected to RabbitMQ successful...')
        closeConnection(channel, connection);
        return channel
    } catch (error) {
        log.error('Connection to RabbitMQ failed. Retrying in 10 seconds...')
        log.log('error', 'NotificationQueueServer createConnection() method error', error)
        return undefined;
    }
}

function closeConnection(channel: Channel, connection: Connection): void {
    process.once('SIGINT', async () => {
        log.info('Closing connection to RabbitMQ...')
        await channel.close();
        await connection.close();
    })
}



export { createConnection };