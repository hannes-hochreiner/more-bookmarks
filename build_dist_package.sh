cd dist
zip -r ../more-bookmarks-`node -p "require('../package.json').version"`.zip .
