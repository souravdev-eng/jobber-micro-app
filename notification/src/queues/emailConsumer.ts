import { Logger } from 'winston';
import { Channel, ConsumeMessage } from 'amqplib'
import { winstonLogger, } from '@jobber-micro/sheared';
import { config } from '@notifications/config';
import { createConnection } from '@notifications/queues/connection';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug')


const consumeAuthEmailMessages = async (channel: Channel): Promise<void> => {
    try {
        if (!channel) {
            channel = await createConnection() as Channel;
        }
        const exchangeName = 'jobber-email-notification';
        const routingKey = 'auth-email'
        const queueName = 'auth-email-queue'

        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        const queue = await channel.assertQueue(queueName, { durable: true });

    } catch (error) {
        log.log('error', 'Notification EmailConsumer consumeAuthEmailMessages() method error', error)
    }

};