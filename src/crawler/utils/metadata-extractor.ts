import * as cheerio from 'cheerio';

export function extractMetadata(html: string) {
  const $ = cheerio.load(html);

  /* ---------------- BASIC META ---------------- */
  const title = $('title').text().trim();
  const metaDescription =
    $('meta[name="description"]').attr('content')?.trim() || '';

  /* ---------------- BREADCRUMBS ---------------- */
  const crumbs: string[] = [];
  $('.breadcrumbs .breadcrumb-label span').each((_, el) => {
    const t = $(el).text().trim();
    if (t && t.toLowerCase() !== 'home') crumbs.push(t);
  });

  const breadcrumbs = {
    type: crumbs[0] || null,
    sub_types: crumbs.slice(1),
  };

  /* ---------------- PRODUCT INFO ---------------- */
  const productTitle = $('.productView-title').first().text().trim();
  const brand = $('.productView-brand span').first().text().trim();
  const sku = $('[data-product-sku]').text().trim();
  const upc = $('[data-product-upc]').text().trim();
  const size = $('.productView-info-value.size').first().text().trim();

  /* ---------------- DESCRIPTION TAB ---------------- */
  const descriptionHtml = $('#tab-description').html()?.trim() || '';
  const descriptionText = $('#tab-description').text().trim();

  /* ---------------- TECH SPECS TABLE ---------------- */
  const specs: Record<string, string> = {};

  $('#tab-description .row').each((_, row) => {
    const key = $(row).find('.left').text().trim();
    const value = $(row).find('.right').text().trim();
    if (key && value) specs[key] = value;
  });

  /* ---------------- PRICING ---------------- */
  const msrp = $('.price--rrp').text().replace('MSRP:', '').trim();
  const price = $('[data-product-price-without-tax]').text().trim();
  const save = $('[data-product-price-saved]').text().trim();

  return {
    title,
    metaDescription,
    breadcrumbs,

    product: {
      title: productTitle,
      brand,
      sku,
      upc,
      size,
    },

    pricing: {
      msrp,
      price,
      save,
    },

    description: {
      text: descriptionText,
      html: descriptionHtml,
      specs,
    },
  };
}
