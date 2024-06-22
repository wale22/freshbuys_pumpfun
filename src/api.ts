import axios from 'axios';

export async function getCoinData(mintStr: string) {
    try {
        const url = `https://frontend-api.pump.fun/coins/${mintStr}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Referer": "https://www.pump.fun/",
                "Origin": "https://www.pump.fun",
                "Connection": "keep-alive",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "If-None-Match": 'W/"44f-mGaFn8sMbztRJLVYdNS3D60FIIk"',
            }
        });
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Failed to retrieve coin data:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching coin data:', error);
        return null;
    }
}


