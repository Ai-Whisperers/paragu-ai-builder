self.__MIDDLEWARE_MATCHERS = [
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!api|_next\\/static|_next\\/image|favicon\\.ico|.*\\.(?:css|js|mjs|map|woff2?|ttf|eot|otf|svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm)$).*))(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:css|js|mjs|map|woff2?|ttf|eot|otf|svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm)$).*)"
  }
];self.__MIDDLEWARE_MATCHERS_CB && self.__MIDDLEWARE_MATCHERS_CB()