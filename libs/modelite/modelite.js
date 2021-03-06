/*! modelite.js v0.3.0 | (c) 2015, Kan Kung-Yip. | MIT  https://github.com/fxk01/modelite.js */
var slice = [].slice;
!
    function() {
      var e, t, n, r, a, i, l, s, u, o;
      if (!jQuery) throw new Error("First require jQuery!");
      return l = function(e, t) {
        var n, r, a;
        if (null == e && (e = 10), null == t && (t = !1), "boolean" == typeof e && (r = [8, e], e = r[0], t = r[1]), !t) return Math.floor(Math.random() * e);
        for (n = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", "string" == typeof t && (n = t), a = ""; a.length < e;) a += n[l(n.length)];
        return a
      }, n = function(e, t) {
        var r, a, i;
        if (e) {
          if (a = t.indexOf("."), -1 === a) return e[t];
          if (r = t.substr(0, a), isNaN(i = parseInt(r)) || (r = i), e[r]) return n(e[r], t.substr(a + 1))
        }
      }, u = function(e, t, n) {
        var r, a, i, l;
        return a = t.indexOf("."), -1 === a ? ("undefined" == typeof n ? delete e[t] : e[t] = n, n) : (r = t.substr(0, a), isNaN(i = parseInt(r)) || (r = i), t = t.substr(a + 1), e[r] || (l = t, a = t.indexOf("."), -1 !== a && (l = l.substr(0, a)), e[r] = isNaN(parseInt(l)) ? {} : []), u(e[r], t, n))
      }, t = function(e) {
        var t, n, r, a, i, l, s, u, o, m, c, f;
        for (t = /\( *(\w+) *\) *(\w+) *\:?([^\(]*)/g; o = t.exec(e.attr("ml-events"));) s = o.slice(1, 4), f = s[0], i = s[1], l = s[2], ("repeat" === f || "each" === f || "insert" === f || "remove" === f) && (f = "ml-" + f), c = e[0].tagName.toLowerCase(), "change" === f && "input" === c && (f = "ml-change"), e.on(f, {
          type: f,
          name: i,
          raw: l
        }, function() {
          var e, t, n, r, a, s, u, o, m, c, d, g, p, h, b, v, y;
          if (t = arguments[0], e = 2 <= arguments.length ? slice.call(arguments, 1) : [], t.stopPropagation(), m = t.data, f = m.type, i = m.name, l = m.raw, null == l && (l = ""), n = null != (c = ml.EVENTS) ? c[i] : void 0, "function" == typeof n) {
            if (r = $(this), h = r.closest("[name='#']"), b = h.attr("ml-binding"), "string" == typeof b && (p = new RegExp(b.replace(/\d+/g, "#"))), o = function(e) {
                  return null == e && (e = ""), e = e.trim(), p && -1 !== e.indexOf("#") && (e = e.replace(p, b)), e
                }, t.data = o(l), -1 !== l.indexOf("=")) for (t.data = {}, d = l.split(","), a = 0, u = d.length; u > a; a++) v = d[a], v && (g = v.split("="), s = g[0], y = g[1], t.data[s.trim()] = o(y));
            return e.unshift(t), n.apply(r, e)
          }
        });
        for (u = ["insert", "remove"], m = [], n = 0, a = u.length; a > n; n++) f = u[n], (r = e.attr("ml-" + f)) && m.push(e.on("click", {
          type: f,
          keypath: r
        }, function(e) {
          var t, n, a, i, l, s;
          return e.stopPropagation(), a = e.data, f = a.type, r = a.keypath, null == r && (r = ""), t = ml[f], "function" == typeof t ? (n = $(this), r = r.trim(), -1 !== r.indexOf("#") && (l = n.closest("[name='#']"), s = l.attr("ml-binding"), i = new RegExp(s.replace(/\d+/g, "#")), r = r.replace(i, s)), t.call(n, r), setTimeout(function() {
            return n.triggerHandler("ml-" + f, r)
          })) : void 0
        }));
        return m
      }, e = function(t) {
        var n, r;
        return null == ml.TEMPLATES && (ml.TEMPLATES = {}), ml.TEMPLATES[n = l(!0)] ? e(t) : (r = t.closest("[name][name!='#']"), ml.TEMPLATES[n] = t, r.attr("ml-template", n), t.detach())
      }, o = function(e, t) {
        var r, a, i, l, s, m, c, f;
        if (i = e.attr("ml-binding"), i || e.attr("ml-binding", i = e.attr("name")), t || (t = n(ml.DATA, i)), c = e.find("[name]"), f = e.attr("ml-template"), !f) return 0 === c.length ? o.single(i, e, t) : (t || (t = u(ml.DATA, i, {})), void c.each(function() {
          var e, n;
          return e = $(this), o.bound || !e.attr("ml-binding") ? (n = e.attr("name"), e.attr("ml-binding", i + "." + n), o(e, t[n])) : void 0
        }));
        if ($.isArray(t) || (t = u(ml.DATA, i, [])), t.reserve = 0, isNaN(s = parseInt(e.attr("ml-reserve"))) || (t.reserve = s), l = t.reserve - t.length, l > 0) for (r = a = 0, m = l; m >= 0 ? m > a : a > m; r = m >= 0 ? ++a : --a) t.push(null);
        return o.repeat(e, ml.TEMPLATES[f], t), e.triggerHandler("ml-repeat", t.length)
      }, o.repeat = function(e, t, n) {
        var r, a, i, l, s, u, m, c, f, d, g;
        if (e.empty(), $.isArray(n)) {
          for (c = e.attr("ml-binding"), f = e.attr("ml-template"), s = n.length, m = [], r = a = 0, l = n.length; l > a; r = ++a) d = n[r], i = c + "." + r, u = t.clone(!0), u.attr("ml-binding", i), u.attr("ml-belong", f), e.append(u), o.repeat.mode(u, r, s), g = u.find("[name='$']"), g.length ? o.single(i, g, d) : o(u, d), m.push(u.triggerHandler("ml-each", r));
          return m
        }
      }, o.repeat.mode = function(e, t, n) {
        var r, a;
        return r = n - 1, a = e.attr("ml-belong"), e.find("[ml-repeat]").each(function() {
          var e, n;
          if (e = $(this), n = e.attr("ml-repeat"), a === e.closest("[name='#']").attr("ml-belong")) switch (e.css("display", ""), e.attr("ml-repeat")) {
            case "header":
              if (t > 0) return e.css("display", "none");
              break;
            case "body":
              if (!(t > 0 && r > t)) return e.css("display", "none");
              break;
            case "odd":
              if (!(t % 2)) return e.css("display", "none");
              break;
            case "even":
              if (t % 2) return e.css("display", "none");
              break;
            case "footer":
              if (r > t) return e.css("display", "none")
          }
        })
      }, o.single = function(e, t, r) {
        var a, i, l;
        switch (("undefined" == typeof r || null === r || 0 === r.length) && (r = t.attr("ml-default") || null, "string" == typeof r && /^[\[\{]/.test(r) && (r = JSON.parse(r)), u(ml.DATA, e, r)), t[0].tagName.toLowerCase()) {
          case "input":
            switch (l = t.attr("type") || "text", l.toLowerCase()) {
              case "text":
              case "email":
                a = "keyup blur";
                break;
              default:
                a = "change"
            }
            switch (t.data("changeEvent") || (t.data("changeEvent", !0), t.on(a, {
              type: l
            }, function(t) {
              var r, a, i, l, s;
              if (t.stopPropagation(), r = $(this), a = "checkbox" === t.data.type, e = r.attr("ml-binding"), s = r.data("value"), "undefined" == typeof s) switch (t.data.type) {
                case "checkbox":
                case "radio":
                  // i = $("[ml-binding='" + e + "'][type='" + t.data.type + "']"), s = i.index(r);
                  break;
                default:
                  s = r.val()
              }
              if (l = n(ml.DATA, e), a) if ($.isArray(l) || (l = []), r.prop("checked")) {
                if (-1 !== l.indexOf(s)) return;
                l.push(s), u(ml.DATA, e, l)
              } else {
                if (-1 === l.indexOf(s)) return;
                l.splice(l.indexOf(s), 1), u(ml.DATA, e, l)
              } else {
                if (l === s) return;
                u(ml.DATA, e, s)
              }
              return r.triggerHandler("ml-change"), $("[ml-binding='" + e + "']").not(r).each(function() {
                var t, n;
                return t = $(this), n = t.find("[name='$']"), n.length ? o.single(e, n, s) : o.single(e, t, s)
              })
            })), l) {
              case "checkbox":
                if (!$.isArray(r)) return;
                return $("[ml-binding='" + e + "'][type='checkbox']").not(t).each(function(e) {
                  var t, n;
                  return t = $(this), n = parseInt(t.data("value")), isNaN(n) && (n = e), t.prop("checked", -1 !== r.indexOf(n))
                });
              case "radio":
                if (isNaN(i = parseInt(r))) return;
                return $("[ml-binding='" + e + "'][type='radio']").not(t).each(function(e) {
                  var t, n;
                  return t = $(this), n = parseInt(t.data("value")), isNaN(n) && (n = e), t.prop("checked", i === n)
                });
              default:
                return t.val(r)
            }
            break;
          case "meta":
            return u(ml.DATA, e, t.attr("content"));
          case "img":
            return null == r && (r = t.attr("ml-placeholder")), t.attr("src", r);
          default:
            return null == r && (r = t.attr("ml-placeholder")), t.text(r)
        }
      }, r = function(e, t, n) {
        var r, a, l, s, u, m;
        if (!(m = e.attr("ml-template"))) throw new Error("template is " + m);
        return s = e.attr("ml-binding"), a = s + "." + t, l = ml.TEMPLATES[m].clone(!0), l.attr("ml-binding", a), l.attr("ml-belong", m), r = e.find("[ml-binding='" + a + "']"), r.length ? l.insertBefore(r) : e.append(l), i(e), u = l.find("[name='$']"), u.length ? o.single(a, u, n) : o(l, n), l.triggerHandler("ml-each", t)
      }, s = function(e, t) {
        var n, r, a;
        if (a = e.attr("ml-binding"), n = a + "." + t, r = e.find("[ml-binding='" + n + "']"), !r.length) throw new Error("not found " + n);
        return setTimeout(r.remove, 1e3), r.detach(), i(e)
      }, i = function(e) {
        var t, n, r, a, i;
        return a = e.attr("ml-binding"), i = e.attr("ml-template"), n = new RegExp(a + "\\.\\d+", "g"), r = e.find("[ml-belong='" + i + "']"), t = r.length, r.each(function(e) {
          var r, i, l;
          return r = $(this), i = r.attr("ml-binding"), l = a + "." + e, r.attr("ml-binding", i.replace(n, l)), o.repeat.mode(r, e, t), r.find("[ml-binding*='" + i + "']").each(function() {
            var e;
            return r = $(this), e = r.attr("ml-binding"), r.attr("ml-binding", e.replace(n, l))
          })
        })
      }, a = window.ml = window.modelite = function(e, t) {
        if ("string" != typeof e) throw TypeError(e + " is not string");
        return "undefined" == typeof t ? n(ml.DATA, e) : (u(ml.DATA, e, t), $("[ml-binding='" + e + "']").each(function() {
          return o($(this))
        }))
      }, ml.clear = function(e) {
        return ml(e, null)
      }, ml.insert = function(e, t) {
        var a, i, l, s;
        if (null == t && (t = null), "string" != typeof e) throw TypeError(e + " is not string");
        return l = e.lastIndexOf("."), a = NaN, -1 !== l && (a = parseInt(e.substr(l + 1))), isNaN(a) ? a = Number.MAX_VALUE : e = e.substr(0, l), s = n(ml.DATA, e), $.isArray(s) || (s = u(ml.DATA, e, [])), i = s.length, a > i && (a = i), 0 > a && (a = i + a), 0 > a && (a = 0), s.splice(a, 0, t), $("[ml-binding='" + e + "']").each(function() {
          return r($(this), a, t)
        })
      }, ml.remove = function(e) {
        var t, r, a, i, l, u, o, m, c;
        if ("string" != typeof e) throw TypeError(e + " is not string");
        if (l = e.lastIndexOf("."), r = NaN, -1 !== l && (r = parseInt(e.substr(l + 1))), isNaN(r) ? r = Number.MAX_VALUE : e = e.substr(0, l), c = n(ml.DATA, e), $.isArray(c) && c.length && (i = c.length - 1, r > i && (r = i), 0 > r && (r = i + r), 0 > r && (r = 0), c.splice(r, 1), $("[ml-binding='" + e + "']").each(function() {
              return s($(this), r)
            }), c.length < c.reserve)) {
          for (m = [], t = a = u = c.length, o = c.reserve; o >= u ? o > a : a > o; t = o >= u ? ++a : --a) m.push(ml.insert(e));
          return m
        }
      }, ml.emit = function() {
        var e, t, n, r, a;
        return n = arguments[0], e = 2 <= arguments.length ? slice.call(arguments, 1) : [], 1 === e.length && "string" == typeof e[0] ? (t = $("[ml-binding='" + n + "']"), t.triggerHandler(e[0])) : null != (r = ml.EVENTS) && null != (a = r[n]) ? a.apply(null, e) : void 0
      }, $(function() {
        return null == ml.DATA && (ml.DATA = {}), null == ml.EVENTS && (ml.EVENTS = {}), $("[ml-events], [ml-insert], [ml-remove]").each(function() {
          return t($(this))
        }), $("[name='#']").each(function() {
          return e($(this))
        }), $("[name]").each(function() {
          return o($(this))
        }), o.bound = !0
      })
    }();