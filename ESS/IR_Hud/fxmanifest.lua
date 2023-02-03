fx_version 'bodacious'
game 'gta5'

ui_page "ui/index.html"
files {
	"ui/index.html",
	"ui/*.css",
	"ui/*.js",
	"ui/icon/*.png",
	"ui/fonts/*.svg",
	"ui/fonts/*.ttf",
	"ui/fonts/*.woff2",
	"ui/fonts/*.woff",
	"ui/fonts/*.eot",
	"ui/icon/*.png"
}

client_scripts {
    'client.lua',
}

server_scripts {
    'server.lua',
}