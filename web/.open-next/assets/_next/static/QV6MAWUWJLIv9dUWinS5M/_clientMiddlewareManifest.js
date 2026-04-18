self.__MIDDLEWARE_MATCHERS = [
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!api|_next\\/static|_next\\/image|favicon.ico|.*\\.[\\w]+$).*))(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)"
  }
];self.__MIDDLEWARE_MATCHERS_CB && self.__MIDDLEWARE_MATCHERS_CB()