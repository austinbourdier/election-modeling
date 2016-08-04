declare module 'remap-istanbul/lib/gulpRemapIstanbul' {
  function remapIstanbul(reports: Object): NodeJS.ReadWriteStream;
  module remapIstanbul {}
  export = remapIstanbul;
}
