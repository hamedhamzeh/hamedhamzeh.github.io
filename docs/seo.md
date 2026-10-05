# Search and identity

The public site is English. Its confirmed identity is Hamed Hamzeh, also written
حامد حمزه. The Persian spelling is stored only as `alternateName` on the Person
and WebSite structured data. It is not displayed in page content.
This associates both spellings with the same identity; it does not promise a
particular ranking or create a Persian translation of the site.

## Metadata and discovery

- `createPageMetadata` provides an absolute canonical URL when a page has a
  stable path. Use the trailing slash exported by GitHub Pages.
- No Twitter account is configured. Next.js may derive generic card tags from
  Open Graph metadata; these contain no account handle or ownership claim.
- Homepage search and share titles use the same descriptive title. The hero,
  metadata, and structured data use the shared `SITE_DESCRIPTION`.
- `robots.txt` permits crawling and advertises the production sitemap. Do not
  disallow unpublished sections: crawlers need access to their noindex tags.
- The sitemap includes public index and detail pages. Projects placeholders stay
  visible by the user's decision. Empty Writing, Stats, drafts, and generated
  unpublished sentinels stay out. Published writing is included automatically.
- Do not use the build date as lastmod. Add lastmod only when a reliable date for
  an actual content change is available.
- The shared not-found page has no canonical URL and is marked noindex.
- Keep English language metadata. Add Persian hreflang only if real Persian
  pages are created at separate URLs with reciprocal English/Persian references.

## After deployment

1. Verify the canonical tags, robots.txt, sitemap.xml, and publication pages at
   https://hamedhamzeh.github.io/ on the deployed site.
2. Verify ownership of the HTTPS URL-prefix property in Google Search Console
   using an available verification method; any verification file or code must
   come from the user's account.
3. Submit https://hamedhamzeh.github.io/sitemap.xml and inspect the homepage,
   About, Resume, and publication detail URLs. Request indexing when appropriate.
4. Keep external professional profiles linking to the same canonical website.
5. Monitor indexing and queries for both name spellings, then prioritize content
   and performance improvements based on observed results.

Sources: [Google's canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls),
[sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
[language-version guidance](https://developers.google.com/search/docs/specialty/international/localized-versions).
