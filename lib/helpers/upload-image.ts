import axios from 'axios'

export async function uploadImage(file: File, host: 'imgur' | 'fpt' = 'imgur') {
    switch (host) {
        case 'imgur': {
            const data = new FormData()
            data.append('image', file)

            try {
                let res = await axios.post<{ data?: any }>('https://api.imgur.com/3/image', data, {
                    headers: {
                        Authorization: 'Client-ID dd32dd3c6aaa9a0',
                    },
                })
                return res.data?.data
            } catch (err) {
                try {
                    let res = await axios.post<{ data?: any }>(
                        'https://api.imgur.com/3/image',
                        data,
                        {
                            headers: {
                                Authorization: 'Client-ID dd32dd3c6aaa9a0',
                            },
                        }
                    )
                    return res.data?.data
                } catch (err) {
                    console.error(err)
                    throw err
                }
            }
        }
        default:
            break
    }
}
