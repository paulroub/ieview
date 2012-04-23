IEVIEW_VERSION = 1.5.1
LOCALES := en-US  da-DK  de-AT de-DE fr-FR ko-KR ru-RU zh-TW es-ES it-IT pl-PL nl-NL ca-AD ja-JP pt-PT he-IL sv-SE zh-CN pt-BR cs-CZ fi-FI  hu-HU sr-YU tr-TR  eu-ES sl-SI   bg-BG  el-GR hr-HR lt-LT th-TH uk-UA km-KH nb-NO sk-SK es-AR fy-NL sr-RS vi-VN eu
PROPS := $(foreach loc, $(LOCALES), chrome/locale/$(loc)/ieview.properties)
DTDS := $(foreach loc, $(LOCALES), chrome/locale/$(loc)/ieview.dtd)

all:	xpi

clean:
	rm -rf chrome.manifest install.rdf ieview.xpi chrome/locale/de-AT

xpi:	ieview.xpi

ieview.xpi:	chrome.manifest install.rdf \
	chrome/content/ieviewOverlay.js chrome/content/ieviewOverlay.xul chrome/content/ieviewsettings.xul \
	chrome/content/reloaded.html \
	chrome/skin/ieview-button-16px-disabled.png chrome/skin/ieview-button-16px.png chrome/skin/ieview-button-24px-disabled.png chrome/skin/ieview-button-24px.png chrome/skin/ieview-icon.png chrome/skin/ieview-toolbar-button.css \
	$(PROPS) $(DTDS)
	zip -9urp ieview.xpi chrome.manifest install.rdf chrome 

manis:	chrome.manifest install.rdf

install.rdf:	install.rdf.in inslocales.pl chrome/locale/de-AT/ieview.properties chrome/locale/de-AT/ieview.dtd Makefile
	perl inslocales.pl install.rdf.in $(IEVIEW_VERSION) $(LOCALES) > $@

chrome.manifest:	chrome.manifest.in makemanifest.pl chrome/locale/de-AT/ieview.properties chrome/locale/de-AT/ieview.dtd
	perl makemanifest.pl chrome.manifest.in $(LOCALES)  > $@

chrome/locale/de-AT/ieview.properties: chrome/locale/de-DE/ieview.properties chrome/locale/de-AT
	cp $< $@

chrome/locale/de-AT/ieview.dtd: chrome/locale/de-DE/ieview.dtd chrome/locale/de-AT
	cp $< $@

chrome/locale/de-AT:
	mkdir chrome/locale/de-AT
