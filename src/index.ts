import 'dotenv/config'
import { Vimeo } from 'vimeo'

interface CredentialsResponse {
    access_token: string
    token_type: string
    scope: string
    app: {
        name: string
        uri: string
    }
}

const {
    SCOPE = 'public private video_files',
    CLIENT_ID = '',
    CLIENT_SECRET = '',
    ACCESS_TOKEN = '',
} = process.env

const VIDEO_ID = process.argv[2] ?? ''

if (!ACCESS_TOKEN) {
    console.log('Please set ACCESS_TOKEN environment variable')
    process.exit(1)
}

if (!VIDEO_ID) {
    console.error('Missing video ID')
    process.exit(1)
}
if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('Missing client ID or secret')
    process.exit(1)
}

const client = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN)

async function generateClientCredentials(
    scope: string
): Promise<CredentialsResponse> {
    return new Promise((resolve, reject) => {
        client.generateClientCredentials(scope, (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}
async function getVideoMetadata(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
        client.request(
            {
                method: 'GET',
                path: `/videos/${id}`,
            },
            (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            }
        )
    })
}

async function main(): Promise<void> {
    const metadata = await getVideoMetadata(VIDEO_ID)
    console.log(metadata)
}

main()
