import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { firstValueFrom } from 'rxjs';
import { MockStoreApi } from './app/core/api/mock-store.api';
import { SITE_CONFIG_DEFAULT } from './app/core/config/site.config';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * نقشه سایت پویا برای موتورهای جستجو؛ با اتصال به API واقعی، MockStoreApi جایگزین شود.
 */
app.get('/sitemap.xml', async (_req, res) => {
  const api = new MockStoreApi();
  const [products, categories] = await Promise.all([
    firstValueFrom(api.productSlugs()),
    firstValueFrom(api.categorySlugs()),
  ]);
  const base = SITE_CONFIG_DEFAULT.url;
  const urls = [
    { loc: '/', priority: '1.0', freq: 'daily' },
    { loc: '/shop', priority: '0.9', freq: 'daily' },
    ...categories.map((c) => ({ loc: `/shop/${c}`, priority: '0.8', freq: 'daily' })),
    ...products.map((p) => ({ loc: `/product/${p}`, priority: '0.7', freq: 'weekly' })),
    { loc: '/about', priority: '0.5', freq: 'monthly' },
    { loc: '/contact', priority: '0.5', freq: 'monthly' },
  ];
  const body = urls
    .map((u) => `<url><loc>${base}${u.loc}</loc><changefreq>${u.freq}</changefreq><priority>${u.priority}</priority></url>`)
    .join('');
  res
    .type('application/xml')
    .send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`);
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
