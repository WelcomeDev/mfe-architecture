import express from 'express';
import { resolve } from 'node:path'
import { createProxyMiddleware } from 'http-proxy-middleware'
import cors from 'cors';
import * as t from 'timers/promises'
const app = express();
const staticDir = resolve(import.meta.dirname, '../../../');
app.use(cors());

app.use('/static-assets', express.static(staticDir));

const targets = {
    'mf_licence': {
        name: 'mf_license',
        port: '2345',
        // delay: 10e3
        delay: 3e3
    },
    'mf_users': {
        name: 'mf_users',
        port: '3456'
    },
}

app.use('/feed-proxy/:piletName', async (req, res, next) => {
    const {piletName} = req.params;
    const piletInfo = targets[piletName];
    console.log(piletName, piletInfo)

    if (!piletInfo) {
        res.status(404)
           .send(`Pilet ${piletName} not found`);
        return;
    }

    if (piletInfo.delay) {
        await t.setTimeout(piletInfo.delay);
    }

    const targetUrl = `http://localhost:${piletInfo.port}`;

    return createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: (path) => {
            return `/$pilet-api/0/${path}`;
        }
    })(req, res, next)
})

app.get('/feed', (req, res) => {
    const dto = feed.map(it => ({
        ...it,
        spec: 'v2',
        link: `http://localhost:${servicePort}/feed-proxy/${it.name}/index.js`
    }))

    res.status(200)
       .json({items: dto});
});

app.get('/direct-feed', (req,res)=>{
    const dto = feed.map(it => ({
        ...it,
        spec: 'v2',
        link: `http://localhost:${targets[it.name].port}/$pilet-api/0/index.js`
    }))

    res.status(200)
       .json({items: dto});
})

const servicePort = process.env.PORT || '9999';
app.listen(Number(servicePort), () => {
    console.log(`Server running on port ${servicePort}`);
})

const feed = [
    {
        name: 'mf_licence',
        version: "1.0.0"
    },
    {
        name: 'mf_users',
        version: "1.0.0"
    }
]
