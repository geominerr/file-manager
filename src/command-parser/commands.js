export const commands = {
  up: { args: [], keyClass: 'navigation' },
  cd: { args: ['path_to_directory'], keyClass: 'navigation' },
  ls: { args: [], keyClass: 'fileOperation' },
  cat: { args: ['path_to_file'], keyClass: 'fileOperation' },
  add: { args: ['new_file_name'], keyClass: 'fileOperation' },
  rn: { args: ['path_to_file', 'new_filename'], keyClass: 'fileOperation' },
  cp: {
    args: ['path_to_file', 'path_to_new_directory'],
    keyClass: 'fileOperation',
  },
  mv: {
    args: ['path_to_file', 'path_to_new_directory'],
    keyClass: 'fileOperation',
  },
  rm: { args: ['path_to_file'], keyClass: 'fileOperation' },
  os: {
    args: ['--EOL', '--cpus', '--homedir', '--username', '--architecture'],
    keyClass: 'osOperation',
  },
  hash: { args: ['path_to_file'], keyClass: 'hash' },
  compress: {
    args: ['path_to_file', 'path_to_destination'],
    keyClass: 'zipOperation',
  },
  decompress: {
    args: ['path_to_file', 'path_to_destination'],
    keyClass: 'zipOperation',
  },
};
