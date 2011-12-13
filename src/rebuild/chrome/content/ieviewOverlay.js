/*
 *
 * Copyright (c) 2003-2008 Paul Roub <paul@roub.net>
 *
 * Portions based on GPLed code by Ted Mielczarek
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

var gIeViewBundle;

var IeView = {

	ieviewMenuItems: new Array("ieview-do-view", "ieview-do-forcepage"),
	ieviewLinkMenuItems: new Array("ieview-do-viewlink", "ieview-do-forcelink", "ieview-do-forcelink-menu"),
	userPrograms: "Progs",
	allUserPrograms: "CmPrgs",
	applicationData: "AppData",

	isJsLink: function(href)
	{
		return(! this.isForceable(href));
	},

	enableForceIE: function()
	{
		var	enabled = true;

		if (this.getBoolPref("ieview.disableForce", false))
		{
			enabled = false;
		}

		return(enabled);
	},

	closeAfterRedirect: function()
	{
		var	closeAfter = this.getBoolPref("ieview.closeReloadPage", false);

		return(closeAfter);
	},

	placesContext: function(evt)
	{
		var menuitem = document.getElementById('ieview-do-places-view');

		if (menuitem)
		{
			var showitem = false;

			if (document.popupNode && document.popupNode.node && document.popupNode.node.uri)
			{
				showitem = this.isForceable(document.popupNode.node.uri);
			}

			menuitem.hidden = ! showitem;
		}

		return(true);
	},

	tabContextShowing: function(evt)
	{
		var menuitem = document.getElementById('context-ieViewTab');

		if (menuitem)
		{
			var showitem = false;

			var href = this.getTabUrl();

			showitem = href && this.isForceable(href);

			menuitem.hidden = ! showitem;
			
			var sep = document.getElementById('context-ieViewTabsep');
			sep.hidden = ! showitem;
		}

		return(true);
	},



	ieviewContext: function()
	{
		if (gContextMenu)
		{
			var i;
			var menuitem = null;

			for ( i=0; i < this.ieviewMenuItems.length; i++)
			{
				menuitem = document.getElementById(this.ieviewMenuItems[i]);

				if (menuitem)	// click-on-page item
				{
					menuitem.hidden = (gContextMenu.isTextSelected || gContextMenu.onLink || gContextMenu.onImage || gContextMenu.onTextInput ) ||
				((! this.enableForceIE()) && (this.ieviewMenuItems[i].indexOf("force") >= 0));
				}
			}

			for ( i = 0; i < this.ieviewLinkMenuItems.length; ++i )
			{
				menuitem = document.getElementById(this.ieviewLinkMenuItems[i]);

				if (menuitem)	// click-on-link item
				{
					menuitem.hidden = (! gContextMenu.onLink) ||	// no link, no link item
										((! this.enableForceIE()) && (this.ieviewMenuItems[i].indexOf("force") >= 0));

					// disable the link if it's javascript
					//
					var disable = ((! menuitem.hidden) && this.isJsLink(this.contextLinkURL()));

					if (disable)
						menuitem.setAttribute('disabled', 'true');
					else
						menuitem.setAttribute('disabled', 'false');
				}
			}
		}
	},

	placesView: function()
	{
		var n = document.popupNode;

		if (n && n.node && n.node.uri)
		{
			this.ieViewLaunch("Internet Explorer.lnk", n.node.uri);
		}

	},


	ieView: function()
	{
		var href = gBrowser.currentURI.spec;
	
		this.ieViewLaunch("Internet Explorer.lnk", href);
	},


	ieViewLink: function()
	{
		if (gContextMenu)
		{
			var href = this.contextLinkURL();

			this.ieViewLaunch("Internet Explorer.lnk", href);
		}
	},

	// grab the link URL (if any) from the context menu, accounting for changes
	// between FF 1.0 and 1.5
	//
	contextLinkURL: function()
	{
		if (gContextMenu && gContextMenu.getLinkURL)
		{
			return(gContextMenu.getLinkURL());
		}
		else if (gContextMenu && gContextMenu.linkURL)
		{
			return(gContextMenu.linkURL());
		}
	
		return(false);
	},

	saveIeLoc: function(path)
	{
			var prefService = Components.classes["@mozilla.org/preferences-service;1"]
										.getService(Components.interfaces.nsIPrefService);

			var prefs = prefService.getBranch("");

			prefs.setCharPref("ieview.ieapp", path);
	},

	confirmAdd: function(href)
	{
		var alwaysMessage = "Will always use IE to open URLs beginning with";

		try
		{
			alwaysMessage = gIeViewBundle.getString("ieview.alwaysopenwith");
		}
		catch(e)
		{
			alert(e);
			return(false);
		}

		alwaysMessage += " " + href;

		return( confirm(alwaysMessage) );
	},

	addForce: function(href)
	{
		var root = href;
		var root2 = false;

		var cls = Components.classes["@mozilla.org/network/io-service;1"];
		var srv = cls.getService(Components.interfaces.nsIIOService);

		var uri = false;

		try
		{
			uri = srv.newURI(href, null, null);
		}
		catch(e)
		{
			uri = false;
		}
	
		if (uri && (uri.username || uri.userPass))
		{
			uri.username = '';
			uri.userPass = '';
		}

		if (uri && uri.prePath)
		{
			root = uri.prePath;
		}
	
		if (uri)
		{
			if (uri.scheme == 'http')
			{
				uri.scheme = 'https';
				root2 = uri.prePath;
			}
			else if (uri.scheme == 'https')
			{
				uri.scheme = 'http';
				root2 = uri.prePath;
			}
		}

		if (! this.confirmAdd(root))
		{
			return(false);
		}

		var forces = this.getForceList();
		forces[forces.length] = root;
		
		if (root2)
		{
			forces[forces.length] = root2;
		}
		
		var forceStr = forces.join(" ");

		var prefService = Components.classes["@mozilla.org/preferences-service;1"]
									.getService(Components.interfaces.nsIPrefService);

		var prefs = prefService.getBranch("");

		prefs.setCharPref("ieview.forceielist", forceStr);

		return(true);
	},


	forceLink: function()
	{
		if (! gContextMenu)
		{
			return;
		}

		this.addForce(gContextMenu.linkURL());
		this.ieViewLink();
	},

	forcePage: function()
	{
		if (this.addForce(gBrowser.currentURI.spec))
		{
			this.ieView();
		}
	},


	// attempt to grab the real path of a predefined directory
	//
	tryDir: function(dsp, key)
	{
		try
		{
			var nif = dsp.get(key, Components.interfaces.nsIFile);
			return(nif.path);
		}
		catch (ar)
		{
			return("");
		}
	},


	searchPath: function(path, fname)
	{
		var result = null;

		try
		{
			var f = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);

			f.initWithPath(path);

			if (f.exists() && f.isDirectory())
			{
				var entries = f.directoryEntries;

				while (entries.hasMoreElements())
				{
					var ent = entries.getNext().QueryInterface(Components.interfaces.nsIFile);

					if (ent.isDirectory())
					{
						result = this.searchPath(ent.path, fname);

						if (result)
						{
							break;
						}
					}
					else if (ent.isSymlink())
					{
						if (ent.leafName.toLowerCase() == fname.toLowerCase())
						{
							result = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
							result.followLinks = true;
							result.initWithPath(ent.path);

							if (result.target == "")
							{
								result = null;
							}
							else
							{
								break;
							}
						}
					}
					else if (ent.isFile())
					{
						if (ent.leafName.toLowerCase() == fname.toLowerCase())
						{
							result = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
							result.initWithPath(ent.path);
							break;
						}
					}
				}
			}
		}
		catch (ar)
		{
			return(null);
		}

		return( result );
	},


	ievtrim: function(st)
	{
		var result = st.replace( /^\s+/g, "" );
		result = result.replace( /\s+$/g, "" );
		return(result);
	},


	deQuote: function(st)
	{
		var result = this.ievtrim(st);

		if ((result.length >= 2) &&
			(result.charAt(0) == '"') &&
			(result.charAt(result.length - 1) == '"')
			)
		{
			result = this.ievtrim(result.substr(1, result.length - 2));
		}

		return(result);
	},

	expandEnv: function(st) 
	{
	var result = st;

	var env = Components.classes['@mozilla.org/process/environment;1'].createInstance(Components.interfaces.nsIEnvironment);

	var reg = /^(.*?)%([^%]+)%(.*)$/;

	while (reg.test(result))
	{
		var matches = reg.exec(result);

		result = matches[1] + env.get(matches[2]) + matches[3];

	}

	return(result);
	},

	parseArgs: function(argstring)
	{
		var res = new Array();
		var remain = this.ievtrim(argstring);

		while (remain != "")
		{
			var chunk = "";

			var i = 0;

			var inQuote = false;

			while (i < remain.length)
			{
				if (inQuote)
				{
					if (remain[i] == '"')
					{
							chunk += remain[i];
							++i;
							break;
					}
					else
					{
							chunk += remain[i];
							++i;
					}
				}
				else
				{
					if (remain[i] == '"')
					{
							chunk += remain[i];
							inQuote = true;
							++i;
					}
					else if (remain[i] == ' ')
					{
							break;
					}
					else
					{
							chunk += remain[i];
							++i;
					}
				}

			}

			remain = this.ievtrim(remain.substring(i));

			res.push(chunk);
		}

		return(res);
	},

	getCharPref: function(prefName, defval)
	{
		var	result = defval;

		var prefservice = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		var prefs = prefservice.getBranch("");

		if (prefs.getPrefType(prefName) == prefs.PREF_STRING)
		{
			result = prefs.getCharPref(prefName);
		}

		return(result);
	},

	getBoolPref: function(prefName, defval)
	{
		var	result = defval;

		var prefservice = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		var prefs = prefservice.getBranch("");

		if (prefs.getPrefType(prefName) == prefs.PREF_BOOL)
		{
			result = prefs.getBoolPref(prefName);
		}

		return(result);
	},

	ieargs: function()
	{
		return(this.getCharPref("ieview.ieargs", ""));
	},

	getForceList: function()
	{
		var prefservice = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);

		var prefs = prefservice.getBranch("");
		var forces = new Array();

		if (prefs.getPrefType("ieview.forceielist") == prefs.PREF_STRING)
		{
			var forceList = this.deQuote(prefs.getCharPref("ieview.forceielist"));
			forces = forceList.split(" ");

			var msg = "force list:\r\n";

			var i;

			for (i = 0; i < forces.length; ++i )
			{
				msg += forces[i] + "\r\n";
			}
		}

		return(forces);
	},


	getTabUrl: function()
	{
		var result = null;

		if (gBrowser && gBrowser.mContextTab && gBrowser.getBrowserForTab(gBrowser.mContextTab))
		{
			result = gBrowser.getBrowserForTab(gBrowser.mContextTab).currentURI.spec;
		}

		return(result);
	},

	loadTabInIE: function(aEvent)
	{
		this.ieViewLaunch("Internet Explorer.lnk", this.getTabUrl());
	},

	ieViewLaunch: function (path,argumentstext)
	{
		var cantMessage = "can't find";

		if (! this.isForceable(argumentstext))
		{
			return(false);
		}

		try
		{
			cantMessage = gIeViewBundle.getString("ieview.cantFindExplorer");
		}
		catch(e)
		{
			alert(e);
		}

		var prefservice = Components.classes["@mozilla.org/preferences-service;1"].
								getService(Components.interfaces.nsIPrefService);

		var prefs = prefservice.getBranch("");

		try
		{
			if (path=="")
				return(false);

			var ieloc = null;

			if (prefs.getPrefType("ieview.ieapp") == prefs.PREF_STRING)
			{
				ieloc = this.deQuote(prefs.getCharPref("ieview.ieapp"));

				ieloc = this.expandEnv(ieloc);

				if (this.trim(ieloc) == "")
				{
					ieloc = null;
				}
			}

			var natTarget = null;
			var usePath = null;

			if (ieloc != null)
			{
				natTarget = ieloc;
			}
			else
			{
				var dsprops = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties);

				usePath = this.tryDir(dsprops, this.userPrograms);	// try user-specific program menu first

				var file = null;

				if (usePath != "")
				{
					file = this.searchPath(usePath, path);
				}

				if (! file)
				{
					usePath = this.tryDir(dsprops, this.allUserPrograms);	// no joy? try "all users" program menu

					if (usePath != "")
					{
						file = this.searchPath(usePath, path);
					}
				}

				if (! file)
				{
					usePath = this.tryDir(dsprops, this.applicationData);	// last resort, check the "quick start" bar

					if (usePath != "")
					{
						var	quickPath = "\\microsoft\\internet explorer\\quick launch";

						usePath = usePath + quickPath;

						file = this.searchPath(usePath, path);

						if (! file)	// check alternate QuickLaunch bar title
						{
							var launchLink = "Launch Internet Explorer Browser.lnk";

							file = this.searchPath(usePath, launchLink);
						}
					}
				}

				// last ditch -- find the windows directory
				// assume that the main Program Files directory is on the same drive
				// look in there, under Program Files\Internet Explorer, for iexplore.exe
				//
				if (! file)
				{
					usePath = this.tryDir(dsprops, "WinD");

					if ((usePath != "") && (usePath.charAt(1) == ":"))
					{
						usePath = usePath.substr(0, 2) + "\\program files\\internet explorer";

						file = this.searchPath(usePath, "iexplore.exe");
					}
				}

				if ((! file) || (! file.exists()))
				{
					alert(cantMessage);
					return false;
				}

				natTarget = file.target;
				this.saveIeLoc(natTarget);
			}

			var targetFile = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);

			try
			{
				targetFile.initWithPath(natTarget);
			}
			catch(e)
			{
				alert(cantMessage);
				return(false);
			}

			if (! targetFile.exists())
			{
				alert(cantMessage);
				return(false);
			}

			var process = Components.classes['@mozilla.org/process/util;1'].createInstance(Components.interfaces.nsIProcess);
			process.init(targetFile);
			var arguments= this.parseArgs(this.ieargs());

			arguments.push(argumentstext);

			process.run(false, arguments, arguments.length,{});
			return true;

		}
		catch (e)
		{
			alert(e);
			return false;
		}

		return false;
	},


	ieviewInit: function()
	{
		var i;

		gIeViewBundle = document.getElementById("bundle_ieview");

		var docHref = this.getDocHref();

		if (docHref == "")
		{
			docHref = document.location.href;
		}

		if (docHref.substring(0, 7) != 'chrome:')
		{
			if (! gIeViewBundle)
			{
				return;
			}
		}

		if (typeof(getBrowser) != 'undefined')
		{
			var tabContextMenu = gBrowser.tabContextMenu || document.getAnonymousElementByAttribute(getBrowser(), "anonid", "tabContextMenu");
	
			if ((typeof(tabContextMenu) != 'undefined') && tabContextMenu)
			{
				var ourContext = document.getElementById("context-ieViewTab");
				var ourSep = document.getElementById("context-ieViewTabsep");
	
				var	loadBefore = null;
	
				//	Find last menu sep, if any
				for ( var ii = 0; ii < tabContextMenu.childNodes.length; ++ii )
				{
					var item = tabContextMenu.childNodes[ii];
	
					if (item.localName == "menuseparator")
					{
						loadBefore = item;
					}
				}
	
				if (ourContext)
				{
					tabContextMenu.insertBefore(ourSep, loadBefore);
					tabContextMenu.insertBefore(ourContext, loadBefore);
				}
	
				tabContextMenu.addEventListener("popupshowing", ieviewTabPopupShowing, false);
			}
		}

		var menu = document.getElementById("contentAreaContextMenu");
		if (menu)
		{
			menu.addEventListener("popupshowing", ieviewContextListener,false);
		}

		var appcontent = document.getElementById("appcontent");	// browser
		if (appcontent)
		{
			appcontent.addEventListener("load", ieviewLoadListener, true);
		}

		var ieviewPlacesContext = document.getElementById('placesContext');
		if ((typeof(ieviewPlacesContext) != 'undefined') && ieviewPlacesContext)
		{
			ieviewPlacesContext.addEventListener('popupshowing', placesContextListener, false);
			ieviewPlacesContext = null;
		}

		if ((typeof(BookmarksEventHandler) != 'undefined') &&
			(typeof(BookmarksEventHandler.onCommand) != 'undefined') &&
			(typeof(BookmarksEventHandler.ievOnCommand) == 'undefined'))
		{
			BookmarksEventHandler.oldBmehOnCommand = BookmarksEventHandler.onCommand;

			BookmarksEventHandler.onCommand = function(bmocEvent) {
				var target = bmocEvent.originalTarget;

				if (target.node && target.node.uri && IeView.forceIe(target.node.uri))
				{
					IeView.ieViewLaunch("Internet Explorer.lnk", target.node.uri);
					return;
				}

				return( BookmarksEventHandler.oldBmehOnCommand(bmocEvent) );
			};
		}
	},

	isForceable: function(href) 
	{
		return( (typeof(href) != 'undefined') && (href.substr) &&
					(this.startsWith(href, 'http://') ||
					 this.startsWith(href, 'https://') ||
					 this.startsWith(href, 'file://') ||
					 this.startsWith(href, 'ftp://')
					)
			);
	},

	hideMenu: function(aEvent)
	{
		var i;
		var doc = aEvent.originalTarget;

	 	var href = '';

		if (doc.location && doc.location.href)
		{
			href = doc.location.href;
		}

		if (! href)
		{
			return;
		}

		var menuitem = document.getElementById('ieview-do-forcepage-menu');

		if (! menuitem)
		{
			if (doc.getElementById)
			{
				menuitem = doc.getElementById('ieview-do-forcepage-menu');
			}
		}

		if (! menuitem)
		{
			menuitem = document.getElementById('ieview-do-forcepage-menu-moz');
		}

		if (! menuitem)
		{
			if (doc.getElementById)
			{
				menuitem = doc.getElementById('ieview-do-forcepage-menu-moz');
			}
		}

		if (menuitem)	// click-on-page item
		{
			var enabled = this.enableForceIE() && this.isForceable(href);

			menuitem.setAttribute('disabled', enabled ? 'false' : 'true');
		}

		var tbutton = document.getElementById("ieview-button");

		if (tbutton)
		{
			enabled = this.isForceable(href);
			tbutton.setAttribute('disabled', enabled ? 'false' : 'true');
			tbutton.disabled = ! enabled;
		}
	},

	grabLinks: function(aEvent)
	{
		var i;
		var doc = aEvent.originalTarget;

		if ((! this.enableForceIE()) || (! doc) || (! doc.getElementsByTagName))
		{
			return;
		}

		if (doc && doc.location && doc.location.href && (doc.location.href == "about:config"))
		{
			return;
		}

		var links = doc.getElementsByTagName('a');

		for (i = 0; i < links.length; ++i)
		{
			var ln = links[i];

			if (ln && ln.href && this.isForceable(ln.href))
			{
				ln.addEventListener('click', this.ieviewClick, true);
			}
		}
	},

	//	check whether the document behind a dom-loaded event is framed
	//
	isFramed: function(aEvent)
	{
		var cwin = aEvent.originalTarget.defaultView;
		var framed = cwin && (cwin.parent != cwin) && (cwin.parent.frames.length > 0);

		return(framed);
	},

	checkForced: function(aEvent)
	{
		var i;
		var doc = aEvent.originalTarget;

		if (! this.enableForceIE())
		{
			return;
		}

		// only want to reload the topmost frame
		//
		if (this.isFramed(aEvent))
		{
			return;
		}

		if (doc.location && doc.location.href && this.forceIe(doc.location.href))
		{
			var ws = gBrowser.docShell.QueryInterface(Components.interfaces.nsIRefreshURI);

			if (ws)
			{
				ws.cancelRefreshURITimers();
			}

			doc.location.replace("chrome://ieview/content/reloaded.html");
	
			var head = null;
	
			var heads = doc.getElementsByTagName('head');
	
			if (heads && heads.length > 0)
			{
				head = heads[0];
			}
			else
			{
				heads = doc.getElementsByTagName('HEAD');

				if (heads && heads.length > 0)
				{
					head = heads[0];
				}
			}

			if (head)
			{
				head.innerHTML = "<title>IE View " + gIeViewBundle.getString("ieview.reloaded") + "</title>";
			}

			this.ieViewLaunch("Internet Explorer.lnk", doc.location.href);
		}
	},

	startsWith: function(st, pref)
	{
		return( (pref.length > 0) && (st.substring(0, pref.length) == pref) );

	},

	isMatch: function(url, pattern)
	{
		if ((pattern == null) || (pattern == ""))
		{
			return(false);
		}

		var repat = pattern;

		repat = repat.replace(/\\/, "\\\\");
		repat = repat.replace(/\./g, "\\.");
		repat = repat.replace(/\?/g, "\\?");
		repat = repat.replace(/\//g, "\\/");
		repat = repat.replace(/\*/g, ".*");
		repat = repat.replace(/\{/g, "\\{");
		repat = repat.replace(/\}/g, "\\}");
		repat = repat.replace(/\.\*\\\./g, ".*\\.?\\b");
		repat = "^" + repat;

		var reg = new RegExp(repat);

		var matched = (reg.test(url));

		return(matched);
	},

	forceIe: function(href)
	{
		var skipList = this.getForceList();

		for (i = 0; i < skipList.length; ++i)
		{
			if (this.isMatch(href, skipList[i]))
			{
				return(true);
			}
		}

		return(false);
	},

	ieviewClick: function(aEvent)
	{
		var link = aEvent.originalTarget;

		if ((! link) || (! link.href))
		{
			link = aEvent.currentTarget;
		}

		if ((! link) || (! link.href))
		{
			return(true);
		}

		if (IeView.forceIe(link.href) ||
			(link.target && (link.target.toLowerCase() == "_blank_ie"))
		   )
		{
			aEvent.preventDefault();
			IeView.ieViewLaunch("Internet Explorer.lnk", link.href);
			return(false);
		}


		return(true);
	},

	setIeviewOptions: function()
	{
		var prefService = Components.classes["@mozilla.org/preferences-service;1"]
									.getService(Components.interfaces.nsIPrefService);

		var prefs = prefService.getBranch("");

		prefs.setCharPref("ieview.ieapp", document.getElementById('ieloc').value);
		prefs.setCharPref("ieview.ieargs", document.getElementById('ieargs').value);

		prefs.setCharPref("ieview.forceielist", this.getPrefListString());

		var disableAlways = document.getElementById('disableAlways');
		var closeAfter = document.getElementById('closeAfterRedir');
	
		prefs.setBoolPref("ieview.disableForce", disableAlways.checked);
		prefs.setBoolPref("ieview.closeReloadPage", closeAfter.checked);

		window.close();
	},

	pickIe: function()
	{
		var picker = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);

		picker.init(window, "Choose Browser", 0);
		picker.appendFilters(64);

		if (picker.show() == 0)
		{
			document.getElementById('ieloc').value = picker.file.target;
		}
	},


	initPath: function()
	{
		document.getElementById('ieloc').value = this.getCharPref("ieview.ieapp", "");
		document.getElementById('ieargs').value = this.getCharPref("ieview.ieargs", "");

		var skips = this.getForceList();

		var listbox = document.getElementById('patlist');

		if (! listbox)
		{
			alert('no listbox');
		}
		else
		{
			var i;

			for ( i = 0; i < skips.length; ++i )
			{
				if (skips[i] != '')
				{
					listbox.appendItem(skips[i]);
				}
			}
		}

		var np = document.getElementById('newpat');

		np.disabled = ! this.enableForceIE();
		listbox.disabled = ! this.enableForceIE();

		var disableAlways = document.getElementById('disableAlways');
		disableAlways.checked = ! this.enableForceIE();
	
		var closeAfter = document.getElementById('closeAfterRedir');
		closeAfter.checked = this.closeAfterRedirect();
	},

	updateDelButtonStatus: function()
	{
		var lb = document.getElementById('patlist');
		var bt = document.getElementById('delpat');

		bt.disabled = (lb.selectedItems.length < 1) || ! this.enableForceIE();
		this.updateEditButtonStatus();
	},

	compareNum: function(a,b)
	{
		return(b-a);
	},

	editSelected: function(editprompt)
	{
		this.updateEditButtonStatus();

		var bt = document.getElementById('editpat');

		if (bt.disabled)
		{
			return;
		}

		var lb = document.getElementById('patlist');
		var selected = lb.selectedItems;

		var idx = lb.getIndexOfItem(selected[0]);

		var oldtxt = selected[0].label;
	
		var newtext = prompt(editprompt, oldtxt);
		if (newtext)
		{
			lb.insertItemAt(idx, newtext);
			lb.removeItemAt(idx + 1);
			lb.selectedIndex = idx;
		}

		this.updateDelButtonStatus();
		this.updateEditButtonStatus();
	},

	deleteSelected: function()
	{
		var lb = document.getElementById('patlist');
		var selected = lb.selectedItems;
		var indexes = new Array();

		var i;

		for ( i = 0; i < selected.length; ++i )
		{
			var item = selected[i];

			var idx = lb.getIndexOfItem(item);

			indexes[i] = idx;
		}

		indexes.sort(this.compareNum);

		for ( i = 0; i < indexes.length; ++i )
		{
			lb.removeItemAt(indexes[i]);
		}

		this.updateDelButtonStatus();
		this.updateEditButtonStatus();
	},

	updateEditButtonStatus: function() 
	{
		var lb = document.getElementById('patlist');
		var bt = document.getElementById('editpat');

		bt.disabled = (lb.selectedItems.length != 1) || ! this.enableForceIE();
	},


	updateButtonStatus: function()
	{
		var tb = document.getElementById('newpat');
		var bt = document.getElementById('addpat');

		bt.disabled = (this.trim(tb.value).length < 1);
	},

	addNewPat: function()
	{
		var tb = document.getElementById('newpat');

		var newstr = tb.value;

		if (newstr.indexOf("://") < 0)
		{
			newstr = "http://" + newstr;
		}

		var listbox = document.getElementById('patlist');

		listbox.appendItem(this.trim(newstr));

		tb.value = "";
		this.updateButtonStatus();
		this.updateEditButtonStatus();
	},

	getPrefListString: function()
	{
		var result = "";

		var listbox = document.getElementById('patlist');
		var rows = listbox.getRowCount();
		var i;

		for ( i = 0; i < rows; ++i )
		{
			var li = listbox.getItemAtIndex(i);

			if (result != "")
			{
				result += " ";
			}

			result += li.label;
		}

		return(result);
	},

	trim: function(st)
	{
		var result = st;

		while ((result.length > 0) && (result.substring(0,1) == " "))
		{
			result = result.substring(1);
		}

		while ((result.length > 0) && (result.substring(st.length - 1, 1) == " "))
		{
			result = result.substring(0, result.length - 1);
		}

		return(result);
	},

	getDocHref: function()
	{
		if (typeof(XPCNativeWrapper) == "undefined")
		{
			return("");
		}

		var href = false;
		var locWrapper = false;

		try
		{
			var winWrapper = new XPCNativeWrapper(window._content, 'document');
			var docWrapper = new XPCNativeWrapper(winWrapper.document, 'location');
			locWrapper = new XPCNativeWrapper(docWrapper.location, 'href');

			href = locWrapper.href;
		}
		catch(e)
		{
			locWrapper = new XPCNativeWrapper(window, 'location', 'href');
			href = locWrapper.location.href;
		}

		return(href);
	}
};


function ieviewLaunchOptions()
{
	window.openDialog("chrome://ieview/content/ieviewsettings.xul", "ieviewsettings",
		"resizable,centerscreen,modal");
}

function ieviewContextListener(aEvent)
{
	return(IeView.ieviewContext(aEvent));
}

function placesContextListener(aEvent)
{
	return(IeView.placesContext(aEvent));
}

function ieviewLoadListener(aEvent)
{
	IeView.hideMenu(aEvent);

	return(IeView.grabLinks(aEvent));
}

function ieviewCheckForcedListener(aEvent)
{
	IeView.checkForced(aEvent);
}

function ieviewInitListener(aEvent)
{
	return(IeView.ieviewInit(aEvent));
}

function ieviewTabPopupShowing(aEvent)
{
	return(IeView.tabContextShowing(aEvent));
}

// do the init on load

var initWith = window;

initWith.addEventListener("load", ieviewInitListener, false);

window.addEventListener("DOMContentLoaded", ieviewCheckForcedListener, false);

if (typeof(BookmarksCommand) != "undefined")
{
	if (BookmarksCommand.openOneBookmark && (! BookmarksCommand.oldOpenOneBookmark) && IeView.enableForceIE())
	{
		BookmarksCommand.oldOpenOneBookmark = BookmarksCommand.openOneBookmark;

		BookmarksCommand.openOneBookmark = function(aURI, aTargetBrowser, aDS) {

			var namespaceVar = null;

			if (typeof(gNC_NS) != "undefined")
			{
				namespaceVar = gNC_NS;
			}
			else if (typeof(NC_NS) != "undefined")
			{
				namespaceVar = NC_NS;
			}
			else
			{
				alert('no namespace var');
			}

			var url = BookmarksUtils.getProperty(aURI, namespaceVar+"URL", aDS);

			if (IeView.forceIe(url))
			{
				IeView.ieViewLaunch("Internet Explorer.lnk", url);
				return;
			}
			else
			{
				BookmarksCommand.oldOpenOneBookmark(aURI, aTargetBrowser, aDS);
			}
		};
	}
}
