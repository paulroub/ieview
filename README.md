__Notice:__ I'm no longer the developer/owner of IE View.  The last version I created was v1.5.1, available from the
IE View Versions page at [addons.mozilla.org/en-us/firefox/addon/ie-view/versions/][ieviewaddon].  I can't offer
support on more-recent versions; please contact the new developers through the [IE View addon page](https://addons.mozilla.org/en-us/firefox/addon/ie-view/).
The source code here is for v1.5.1.  It is MPL-licensed, forkable, and 
free to modify and redistribute.

[IE View Lite][ieviewlite], based on IE View, is still supported by its original developer.


Introduction
----------

IE View is a simple [Firefox][firefox] extension (for Microsoft Windows systems), which allows the current page or a selected link to be opened in Internet Explorer.  I use Firefox 99.99% of the time, but there are those moments -- particularly when testing new pages, or when viewing that rare IE-only page that's actually interesting -- when I need to see what things look like in IE. 

IE View adds menu items to the page context menu, and the link context menu.  Right-clicking a link now includes an `"Open link target in IE"` menu item.  Right-clicking elsewhere in the main body of the page (not within an image, text box, etc.) gives `"View this page in IE."`

You can also add sites to an "always-view-in-IE" list.  These sites, when reached in Firefox,  will automatically reopen in Internet Explorer.  The site you are currently viewing can be added via the Firefox `Tools` menu, or by opening the `Tools | Add-ons | IE View | Options` window \([screenshots][screenshots]\)

Known Issues

1.  Recent IE View versions don't get along well with the TabBrowser Extensions package.  Unfortunately, *many* extensions do not get along well with TBE.  For more information, see [FAQ][faq] for information on disabling Always-View-in-IE.
    
    User Jim Courtney reports better luck using [TabMix][tabmix] in place of TabBrowser extensions - TabMix  has many of the functions of TBE, as well as additional functionality of its own, and plays    well with others.
2. Users of Agnitum Outpost firewall software will likely have problems using IE View.     Outpost (unlike any other firewall product of which I'm aware) considers the Internet Explorer process launched by IE View and Firefox to be "hidden", and denies it internet access. 
3. At the moment, this works under __Windows only__.  A technique for getting it to work under Mac OS X can be found in the [FAQ][faq].  Linux instructions can be found on the [IE View on Linux][ieviewlinux] page.


Credits
------

Through the wonders of the MPL, I was able to crib some of the context-menu addition code from Ted Mielczarek's [Nuke Image][nukeimage] extension.  

Parts of the actual run-an-external-app footwork were taken from Torisugari's External Application Buttons extension.

Contributors
----------

<table>
<tr><th>3ARRANO.com:</th><td>Basque translation</td></tr>
<tr><th>acushnir:</th><td>Spanish (Argentina) translation</td></tr>
<tr><th>AlleyKat:</th><td>Danish translation</td></tr>
<tr><th>Andreas Boettcher:</th><td>German translation</td></tr>
<tr><th>Andrew Kota:</th><td>Hungarian translation</td></tr>
<tr><th>Aycan Demirel:</th><td>Turkish translation</td></tr>
<tr><th>Bart:</th><td>German translation</td></tr>
<tr><th>Bartosz Piec:</th><td>Polish translation</td></tr>
<tr><th>BatBat:</th><td>French translation</td></tr>
<tr><th>Chankyu Park:</th><td>Korean translation</td></tr>
<tr><th>Duriel:</th><td>Chinese (Simplified) translation</td></tr>
<tr><th>Eduardo Rapaport:</th><td>Portuguese (Portugal) translation</td></tr>
<tr><th>Eduardo Rapoport:</th><td>Portuguese (Brazilian) translation</td></tr>
<tr><th>Fulya Koksal:</th><td>Turkish translation</td></tr>
<tr><th>Gert-Paul van der Beek:</th><td>Dutch translation</td></tr>
<tr><th>Ghandi2:</th><td>Norwegian translation</td></tr>
<tr><th>Giuliano Masseroni:</th><td>Italian translation</td></tr>
<tr><th>J.I. Plaza:</th><td>Spanish (Spain) translation</td></tr>
<tr><th>Jarno Kiuttu:</th><td>Finnish translation</td></tr>
<tr><th>Joao Santos:</th><td>Portuguese (Portugal) translation</td></tr>
<tr><th>Kim Ludvigsen:</th><td>Danish translation</td></tr>
<tr><th>lcraFTl:</th><td>Russian translation</td></tr>
<tr><th>Leszek(teo)Życzkowski:</th><td>Polish translation</td></tr>
<tr><th>Ljubisa Radovanovic:</th><td>Serbian translation</td></tr>
<tr><th>micmic:</th><td>Spanish (Spain) translation</td></tr>
<tr><th>miles:</th><td>Slovenian translation</td></tr>
<tr><th>moZes:</th><td>Frisian translation</td></tr>
<tr><th>NGUYỄN Mạnh Hùng:</th><td>Vietnamese translation</td></tr>
<tr><th>Norah Models:</th><td>Japanese translation</td></tr>
<tr><th>Pavel Penaz:</th><td>Czech translation</td></tr>
<tr><th>Phireak:</th><td>Khmer (Cambodian) translation</td></tr>
<tr><th>raryelcsouza:</th><td>Portuguese (Brazilian) translation</td></tr>
<tr><th>Rotem Liss:</th><td>Hebrew translation</td></tr>
<tr><th>Silvio Santos:</th><td>Portuguese (Brazilian) translation</td></tr>
<tr><th>Sonickydon:</th><td>Greek translation</td></tr>
<tr><th>sushizang:</th><td>Korean translation</td></tr>
<tr><th>Team erweiterungen.de:</th><td>German translation</td></tr>
<tr><th>Thomas Bertels:</th><td>French translation</td></tr>
<tr><th>Thomas Nilsson:</th><td>Swedish translation</td></tr>
<tr><th>Toni Barrera Arboix:</th><td>Catalan translation</td></tr>
<tr><th>Toni Hermoso Pulido:</th><td>Catalan translation</td></tr>
<tr><th>WangKing:</th><td>Chinese (Simplified) translation</td></tr>
<tr><th>Willy Young:</th><td>Chinese (Traditional) translation</td></tr>
<tr><th>Wladow:</th><td>Slovak translation</td></tr>
<tr><th>yoneh:</th><td>Finnish translation</td></tr>
</table>

[addon]: https://addons.mozilla.org/en-US/firefox/addon/ie-view/ "IE View at the Mozilla Add-Ons site"
[mozdev]: http://ieview.mozdev.org/ "Former home of IE View at mozdev.org"
[firefox]: http://www.mozilla.org/products/firefox/
[screenshots]: http://ieview.mozdev.org/screenshots.html
[faq]: http://ieview.mozdev.org/faq.html "IE View Frequently Asked Questions list"
[ieviewlinux]: https://github.com/paulroub/ieview/wiki/IE-View-on-Linux
[nukeimage]: http://ted.mielczarek.org/code/mozilla/
[tabmix]: https://addons.mozilla.org/en-US/firefox/addon/tab-mix-plus/

[ieviewaddon]: https://addons.mozilla.org/en-us/firefox/addon/ie-view/versions/?page=1#version-1.5.1 "IE View 1.5.1 at Mozilla Add-Ons"
[ieviewlite]: https://addons.mozilla.org/en-us/firefox/addon/ie-view-lite/ "IE View Lite - a minimal version of IE View"

