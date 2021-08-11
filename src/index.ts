import 'dotenv/config'
import { LocalStorage } from 'node-localstorage'
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

const localStorage = new LocalStorage('./scratch')

const {
    SCOPE = 'public private video_files',
    CLIENT_ID = '',
    CLIENT_SECRET = '',
} = process.env

const VIDEO_ID = process.argv[2] ?? ''

if (!VIDEO_ID) {
    console.error('Missing video ID')
    process.exit(1)
}
if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('Missing client ID or secret')
    process.exit(1)
}

const client = new Vimeo(CLIENT_ID, CLIENT_SECRET)

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
    let accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
        const response = await generateClientCredentials(SCOPE)
        accessToken = response.access_token
        localStorage.setItem('accessToken', accessToken)
    }

    const metadata = await getVideoMetadata(VIDEO_ID)
    console.log(metadata)
}

main()
