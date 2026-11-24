import { NextRequest, NextResponse } from "next/server";

/**
 * Retire routes left behind by the former WordPress site.
 *
 * Return 410 (rather than redirecting unrelated content to the homepage)
 * so search engines can remove permanently deleted URLs. Uploaded PDFs under
 * /wp-content/uploads are intentionally preserved.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const path = decodeURI(pathname);

  const isLegacyWordPressFeed =
    /\/feed\/?$/i.test(path) ||
    /\/feed\/(?:rss2?|atom)\/?$/i.test(path);

  const isLegacyDatedArticle = /^\/\d{4}\/\d{2}\/\d{2}\/.+/.test(path);
  const isLegacyArchive =
    /^\/category\//i.test(path) ||
    /^\/staff\//i.test(path);
  const isRemovedPage =
    /^\/(?:kliyenti|service\/ohorona-praczi)\/?$/i.test(path);
  const isLegacyWordPressEndpoint =
    /^\/wp-includes\//i.test(path) ||
    /^\/wp-admin\//i.test(path) ||
    /^\/wp-[^/]+\.php$/i.test(path) ||
    /^\/wp-content\/themes\//i.test(path);

  // Keep uploaded qualification-centre PDFs and other documents accessible.
  const isUploadedDocument = /^\/wp-content\/uploads\//i.test(path);

  if (
    !isUploadedDocument &&
    (isLegacyWordPressFeed ||
      isLegacyDatedArticle ||
      isLegacyArchive ||
      isRemovedPage ||
      isLegacyWordPressEndpoint)
  ) {
    return new NextResponse(null, { status: 410 });
  }

  // Internal search-result URLs should not become search landing pages.
  if (searchParams.has("s")) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:path*",
  ],
};
