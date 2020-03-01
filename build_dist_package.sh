cd dist
zip -r ../more-bookmarks-v`node -p "require('../package.json').version"`.zip .
