import { Logger } from 'winston';
import { Client } from '@elastic/elasticsearch';
import { winstonLogger } from '@jobber-micro/sheared';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@notifications/config'

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug')

const elasticSearchClient = new Client({
    node: config.ELASTIC_SEARCH_URL,
})


export async function checkConnection(): Promise<void> {
    let isConnected = false;

    while (!isConnected) {
        try {
            let health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
            log.info(`NotificationService ElasticSearch connection health status: ${health.status}`)
            isConnected = true;
        } catch (error) {
            log.error('Connection to ElasticSearch failed. Retrying in 10 seconds...')
            log.log('error', 'NotificationElasticSearchServer checkConnection() method error', error)
        }
    }
}