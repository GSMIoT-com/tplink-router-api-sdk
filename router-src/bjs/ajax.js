function Basic() {
    this.w = window;
    this.routerAlive = !1;
    this.head = document.getElementsByTagName("head")[0];
    this.d = document;
    this.local = "undefined" != typeof bWebUISimulator && !0 === bWebUISimulator ? !0 : "file:" == location.protocol;
    this.isIE = 0 <= navigator.userAgent.indexOf("IE");
    this.domainUrl = "http://192.168.1.1";
    this.time = 1e3;
    this.explorerTag = 0;
    this.pwd = this.session = this.hostip = "";
    this.httpTag = "http://";
    this.ajaxAsyn = !0;
    this.ajaxSyn = !1;
    this.isArray = function(a) {
        return "[object Array]" === Object.prototype.toString.call(a);
    };
    this.getExplorer = function() {
        var a = navigator.userAgent;
        0 < a.indexOf("IE 6.0") ? this.explorerTag = 6 : 0 < a.indexOf("IE 7.0") && (this.explorerTag = 7);
    };
    this.transText = function(a) {
        if (0 < a.length) {
            a = a.substring(a.indexOf("\r\n") + 2);
            try {
                return eval("(" + a + ")");
            } catch (b) {
                return "";
            }
        }
    };
    this.id = function(a) {
        return document.getElementById(a);
    };
    this.changeDomain = function(a) {
        var b = this.httpTag;
        this.domainUrl = 0 <= a.indexOf(b) ? a : b + a;
    };
    this.initUrl = function() {
        if (!this.local) {
            var a = location.href, b = a.indexOf("?");
            0 < b && (a = a.substring(0, b));
            this.domainUrl = a;
        }
    };
    this.objInitNull = function(a) {
        for (var b in a) "object" == typeof a[b] ? this.arguments.callee(a[b]) : a[b] = "";
    };
    this.objSet = function(a, b) {
        if (this.isArray(b)) {
            var d = 0, c;
            for (c in a) a[c] = b[d++];
        } else for (c in a) a[c] = b;
    };
    this.objCopy = function(a, b) {
        var d, c;
        for (c in a) d = b[c], void 0 != d && (a[c] = d);
    };
    this.encodePara = function(a) {
        return a = encodeURL(a.toString());
    };
}

function WebAjax() {
    this.local = "undefined" != typeof bWebUISimulator && !0 === bWebUISimulator ? !0 : "file:" == location.protocol;
    this.isIE = 0 <= navigator.userAgent.indexOf("IE");
    this.ajaxTimeout = 2e3;
    this.sessionKey = "stok";
    this.externDataParseFunc = new Function();
    this.result = {
        errorno: 0,
        data: "",
        timeout: !0
    };
    this.initResult = function(a) {
        this.result.errorno = 0;
        this.result.data = "";
        this.result.timeout = !0;
    };
    this.setDataParseFunc = function(a) {
        this.externDataParseFunc = a;
    };
    this.changeAsynTime = function(a) {
        this.ajaxTimeout = a;
    };
    this.getValueFromUrl = function(a, b) {
        var d = "", c;
        b += "=";
        c = a.indexOf(b);
        0 <= c && (d = a.substring(c + b.length), c = d.indexOf("&"), c = 0 < c ? c : d.length, 
        d = d.substring(0, c));
        return d;
    };
    this.orgURL = function(a) {
        var b;
        $.session && 0 != $.session.length && (b = a.indexOf(".."), 0 <= b && (a = a.substring(b + 2)), 
        a = "/stok=" + encodeURIComponent($.session) + a);
        return a;
    };
    this.createXHR = function() {
        var a;
        if (void 0 != window.ActiveXObject) try {
            a = !0 == this.local ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
        } catch (b) {
            a = new ActiveXObject("Microsoft.XMLHTTP");
        } else a = new XMLHttpRequest();
        return a;
    };
    this.request = function(a, b, d, c, f, e, g, k) {
        function n(a) {
            var b, c;
            try {
                c = JSON.parse(a, function(a, b) {
                    var c = b;
                    if ("string" === typeof c) try {
                        c = decodeURIComponent(c);
                    } catch (d) {}
                    return c;
                });
            } catch (d) {
                c = null;
            }
            null == c ? b = ENONE : (b = c[ERR_CODE], a = c.data);
            return [ b, a ];
        }
        var h = this.createXHR(), m, l = this;
        this.initResult(l.result);
        h.onreadystatechange = function() {
            if (4 == h.readyState && (!0 === $.local || 100 <= h.status)) {
                l.result.timeout = !1;
                if (m = h.responseText) l.result.data = m;
                var a = n(m);
                l.result.errorno = a[0];
                l.result.data = a[1];
                void 0 != f && f(l.result);
                return !0;
            }
        };
        try {
            void 0 != g && void 0 != k ? h.open(d, a, c, g, k) : h.open(d, a, c), !0 == this.isIE && "undefined" == typeof bWebUISimulator && h.setRequestHeader("If-Modified-Since", "0"), 
            void 0 != b ? h.send(b) : h.send(null);
        } catch (p) {}
    };
}

function Load() {
    Basic.call(this);
    WebAjax.call(this);
    this.asyn = !0;
    this.syn = !1;
    this.detectTime = 1e3;
    this.div = document.createElement("div");
    this.externResizefunc = new Function();
    this.externJSP = new Function();
    this.externLoading = new Function();
    this.externPageHandle = new Function();
    this.pageTickArray = [];
    this.scriptArray = [];
    this.unAuthCode = 401;
    this.httpOK = 200;
    this.setTimeout = function(a, b) {
        var d = window.setTimeout(a, b);
        this.pageTickArray.push(d);
        return d;
    };
    this.addScript = function(a) {
        if (a && /\S/.test(a)) {
            var b = this.d.createElement("script");
            b.type = "text/javascript";
            void 0 === b.text ? b.appendChild(this.d.createTextNode(a)) : b.text = a;
            this.head.insertBefore(b, this.head.firstChild);
            this.head.removeChild(b);
        }
    };
    this.getNodeArray = function(a, b) {
        for (var d = [], c = 0, f = a.length; c < f; c++) d[c] = a[c];
        b(d);
    };
    this.addDomNode = function(a, b) {
        var d = this;
        this.div.innerHTML = "div" + b;
        this.div.removeChild(this.div.firstChild);
        this.getNodeArray(this.div.childNodes, function(b) {
            var f = [];
            emptyNodes(a);
            for (var e = 0, g = b.length; e < g; e++) 1 == b[e].nodeType && "script" === b[e].nodeName.toLowerCase() ? f.push(b[e]) : a.appendChild(b[e]);
            e = 0;
            for (g = f.length; e < g; e++) d.addScript(f[e].text || f[e].textContent || f[e].innerHTML || "");
        });
    };
    this.pageResize = function() {
        this.externResizefunc();
    };
    this.setPageResize = function(a) {
        this.externResizefunc = a;
    };
    this.setexternJSP = function(a) {
        this.externJSP = a;
    };
    this.setExternLoading = function(a) {
        this.externLoading = a;
    };
    this.setExternPageHandle = function(a) {
        this.externPageHandle = a;
    };
    this.append = function(a, b) {
        a && 1 == a.nodeType && "string" === typeof b && (this.addDomNode(a, b), this.pageResize());
    };
    this.detectWidthImg = function(a) {
        var b = new Image();
        b.onload = function() {
            a();
        };
        b.src = this.domainUrl + imgDetectPathStr + "?requence=" + Math.random();
    };
    this.detect = function(a) {
        !0 == isIETenLess ? this.detectWidthImg(a) : this.request(this.domainUrl + detectPathStr + "?requence=" + Math.random(), void 0, "get", this.asyn, a);
    };
    this.loadHand = function(a, b, d) {
        str = this.externJSP(a.data);
        void 0 != str && (a.data = str);
        if (this.unAuthCode != a.errorno) {
            if (!1 !== d.bClearPageTickArray) {
                d = 0;
                for (var c = this.pageTickArray.length; d < c; d++) try {
                    window.clearTimeout(this.pageTickArray[d]);
                } catch (f) {}
            }
            this.append(this.id(b), a.data);
            try {
                this.externPageHandle();
            } catch (e) {}
        }
    };
    this.getLgResult = function(a) {
        return /\r\n\x3c!--(\d{3})--\x3e\r\n/gi.test(a.data) && RegExp.$1 != this.httpOK ? (a.errorno = RegExp.$1, 
        /var authInfo = new Array("([a-zA-Z])","(\d{1,})");/g.test(a.data) && (a.data = RegExp.$1 + " " + RegExp.$2), 
        !0) : !1;
    };
    this.refreshSession = function(a, b) {
        var d = this;
        this.request(a, void 0, "get", this.asyn, function(a) {
            a.errorno == EUNAUTH && d.parseAuthRlt(a.data);
            b();
        });
    };
    this.getUnAuthHandle = function(a, b, d) {
        !0 != $.accountStatus.logoutHandle && EUNAUTH == $.result.errorno && ($.authRltObj.authStatus = !1, 
        $.parseAuthRlt($.result.data), null == $.pwd || 0 == $.pwd.length || ESYSRESET == $.authRltObj.code ? window.setTimeout(function() {
            $.loginErrHandle();
        }, 0) : $.auth($.pwd, function(c) {
            if (ENONE == c) if (!0 == b) $.request($.orgURL(a), void 0, "get", b, function(a) {
                ENONE != a.errorno ? ($.authRltObj.authStatus = !1, $.parseAuthRlt(a.data), $.loginErrHandle()) : ($.authRltObj.authStatus = !0, 
                d(a));
            }); else return $.request($.orgURL(a), void 0, "get", b, void 0), ENONE != $.result.errorno ? ($.authRltObj.authStatus = !1, 
            $.parseAuthRlt($.result.data), $.loginErrHandle()) : ($.authRltObj.authStatus = !0, 
            d($.result)), !0; else window.setTimeout(function() {
                $.authRltObj.authStatus = !1;
                $.loginErrHandle();
            }, 0);
        }));
    };
    this.load = function(a, b, d, c, f) {
        function e(a) {
            "function" == typeof f && f(a);
            g = a.timeout;
            g || (c = void 0 == c ? {} : c, k.loadHand(a, d, c));
            "function" == typeof b && b(a);
        }
        var g = !1, k = this;
        this.local || void 0 != b ? this.loadAsyn(a, this.ajaxTimeout, function(b) {
            b.errorno == EUNAUTH ? k.getUnAuthHandle(a, k.asyn, e) : b.errorno == ENONE && e(b);
        }) : (this.request(this.orgURL(a), void 0, "get", this.syn), this.result.errorno == EUNAUTH ? this.getUnAuthHandle(a, this.syn, e) : this.result.errorno == ENONE && e(this.result));
        return g;
    };
    this.loadAsyn = function(a, b, d) {
        this.request(this.orgURL(a), void 0, "get", this.asyn, d, b);
    };
}


