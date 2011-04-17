#	Makefile for the IE View extension
#	http://ieview.mozdev.org/
#	author: Paul Roub <paul@roub.net>
#

MAJOR_VERSION = 1
MINOR_VERSION = 4.5.1

FULL_VERSION = $(MAJOR_VERSION).$(MINOR_VERSION)

COMMONFILES =	skin					\
		content/contents.rdf		\
		content/ieviewOverlay.js		\
		content/ieviewsettings.xul		\
		content/ieviewOverlay.xul   \
		content/reloaded.html \
		skin/ieview-icon.png \
		skin/ieview-button-16px.png skin/ieview-button-24px.png \
		skin/ieview-button-16px-disabled.png skin/ieview-button-24px-disabled.png \
		skin/ieview-toolbar-button.css skin/contents.rdf

OLDFILES = 	

NEWFILES = 	chrome.manifest \
		install.rdf \
		defaults	\
		defaults/preferences \
		defaults/preferences/ieview.js \


LOCALES := en-US  da-DK  de-AT de-DE fr-FR ko-KR ru-RU zh-TW es-ES it-IT pl-PL nl-NL ca-AD ja-JP pt-PT he-IL sv-SE zh-CN pt-BR cs-CZ fi-FI  hu-HU sr-YU tr-TR  eu-ES sl-SI   bg-BG  el-GR hr-HR lt-LT th-TH uk-UA km-KH nb-NO sk-SK es-AR fy-NL sr-RS vi-VN eu


LOCALEFILES := $(foreach loc, $(LOCALES), locale/$(loc)/ieview/contents.rdf locale/$(loc)/ieview/ieview.dtd locale/$(loc)/ieview/ieview.properties) 
LOCALECONTENTS := $(foreach loc, $(LOCALES), locale/$(loc)/ieview/contents.rdf) 
ALLCONTENTS := content/contents.rdf $(LOCALECONTENTS)

COMMA := ,
LOCALELISTTMP := $(foreach loc, $(LOCALES), "$(loc)"$(COMMA)).
ENDSUBST := ,.
LOCALELIST := $(subst $(ENDSUBST),,$(LOCALELISTTMP))


all:	installers xpi

full:	clean install.rdf checklocale checkversion checkxml credits  all

clean:
	rm -rf ieview.xpi chrome/ieview.jar install.js chrome.manifest install.rdf locale/de-AT

jar:	chrome/ieview.jar

xpi:	ieview.xpi 

installers:	install.js

release:	ieview.xpi 
	cp ieview.xpi ../downloads

test:	test/ieview-$(FULL_VERSION).xpi

test/ieview-$(FULL_VERSION).xpi:	ieview.xpi
	rm -rf test/*
	cp $< $@
	chmod 644 $@
	cp $@ test/ieview-test.xpi
	chmod 644 test/ieview-test.xpi

ieview.xpi:	$(NEWFILES) $(OLDFILES) chrome/ieview.jar
	zip -qu9 $@ $^

chrome/ieview.jar:	$(COMMONFILES) $(LOCALEFILES)
	zip -qu0 $@ $^

install.js: install.js.in Makefile
	sed -e 's/__LOCALELIST__/$(LOCALELIST)/' -e 's/__VERSION__/$(FULL_VERSION)/' < $< > $@

skin:
	mkdir skin

install.rdf:	install.rdf.in inslocales.pl locale/de-AT/ieview/ieview.properties
	PERL_UNICODE=Sio perl inslocales.pl install.rdf.in $(FULL_VERSION) $(LOCALES) > $@

locale/de-AT:
	mkdir locale/de-AT

locale/de-AT/ieview:	locale/de-AT
	mkdir locale/de-AT/ieview

locale/de-AT/ieview/contents.rdf:	locale/de-DE/ieview/contents.rdf locale/de-AT/ieview  Makefile
	sed -e 's/de-DE/de-AT/g' -e 's/Deutsch(DE)/Deutsch(AT)/g' < $< > $@

locale/de-AT/ieview/ieview.dtd:	locale/de-DE/ieview/ieview.dtd locale/de-AT/ieview
	cp $< $@

locale/de-AT/ieview/ieview.properties:	locale/de-DE/ieview/ieview.properties locale/de-AT/ieview
	cp $< $@

checks:	checkxml checklocale checkversion

checklocale:	locale/de-AT/ieview/contents.rdf locale/de-AT/ieview/ieview.dtd locale/de-AT/ieview/ieview.properties install.rdf
	@./checklocale.pl

checkxml: $(ALLCONTENTS) install.rdf
	@./xmlcheck.pl $(ALLCONTENTS) install.rdf

checklocaletrans:	locale/de-AT/ieview/contents.rdf locale/de-AT/ieview/ieview.dtd locale/de-AT/ieview/ieview.properties
	@./checklocale.pl -trans

checkversion:	install.js install.rdf
	@perl checkversion.pl $(FULL_VERSION)




#	copy straight to local chrome dir for testing.  CHROMEDIR must be defined in the environment
#		
chrometest:	chrome/ieview.jar 
	cp chrome/ieview.jar "$(CHROMEDIR)"

credits:	../www/index.html

chrome.manifest:	install.rdf chrome.manifest.in
	rm -f $@
	perl makemanifest.pl chrome.manifest.in $(LOCALES)  > /tmp/chrome.manifest.ieview
	mv /tmp/chrome.manifest.ieview $@

../www/index.html:	install.rdf
	./creditgen
