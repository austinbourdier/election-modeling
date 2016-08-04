import * as gulp from 'gulp';
import * as remapIstanbul from 'remap-istanbul/lib/gulpRemapIstanbul';

export = () => {
  return gulp.src('coverage/coverage-final.json')
    .pipe(remapIstanbul({
      reports: {
        cobertura: 'coverage/coverage.xml'
      }
    }));
};
