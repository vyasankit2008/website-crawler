import * as cheerio from 'cheerio';

export interface OptionItem {
  label: string;
  value: string;
  selectId: string;
}

export function extractDropdownOptions(html: string): OptionItem[] {
  const $ = cheerio.load(html);
  const options: OptionItem[] = [];

  $('select').each((_, select) => {
    const selectId = $(select).attr('id') || $(select).attr('name') || '';
    if (!selectId) return;

    $(select)
      .find('option')
      .each((_, option) => {
        const label = $(option).text().trim();
        const value = $(option).attr('value');

        if (value && label && !label.toLowerCase().includes('select')) {
          options.push({ label, value, selectId });
        }
      });
  });

  return options;
}
