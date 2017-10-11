function padLeft(t, a, e) {
	var l = String(t).length;
	return Array(a > l ? a - l + 1 || 0 : 0).join(e) + t
}

function googleFix() {
	return window.chrome && "GOOGLE" == mapType ? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" : ""
}
var map = "",
	_isBMap_ = "undefined" != typeof BMap,
	_isOSM_ = "undefined" != typeof MQA,
	_isLMap_ = "undefined" != typeof L,
	arrFilterProducts = ["GT02", "GT06N", "GT06S", "GT12G", "GM901", "GM06", "GM908N", "GM02", "JM006", "LY-H810", "ET200", "GM03A", "GMT8"],
	PlayBack = function(t, a, e, l, i) {
		this.container = t, this.user_id = a, this.map = null, this.productType = e, this.overSpeed = l > 0 ? l : 60, this.AJAX_URL = i || "", this.REQUESR_URL = "1/devices/history?method=getHistoryGpsLocation", this.MAP_CENTER_LAT = 22.573978188551298, this.MAP_CENTER_LNG = 113.92078757286072, this.DEFAULT_DAYS = 518400, this.RECORDS_LENGTH = 1e3, this.MARKERS_OBJ = {}, this.STATIC_MARKER = [], this.mapType = _isBMap_ ? "BAIDU" : _isLMap_ || _isOSM_ ? "RAW" : "GOOGLE", this.DEFAULT_ZOOM = 5, this.DISTANCE = 0, this.POLY_LINE_MARKER = [], this.DATA_REQUEST = !0, this.FROM_TIME = null, this.TO_TIME = null, this.NEXT_TIME = null, this.LAST_DATA = [], this.PRE_DATE_TIMR = null, this.LAST_DATA_ = [], this.PRE_DATE_TIMR_ = null, this.RUN_TIME = 0, this.STOP_TIME = 0, this.EXCURSION_COUNT = 0, this.FRIST_LOAD = !0, this.TIMER = "-1", this.HISTORY_PLAY_FLAG = !0, this.Frequency = null, this.BUTTONS_ID = ["PLAY", "STOP"], this.PLAY_OVER = !1, this.CROSS_DATA_1 = null, this.CROSS_DATA_2 = null, this.needGetData = !1, this.DATA_NEXT = "", this.RECOVER_FROM_BACKUP = !1, this.isJD = "http://110.jdgps.cn/" == loginUrl, this.SPEED = this.isJD ? 2 : 300, this.stopTimeSetting = 600, this.drawStep = 2, _.isIE && (this.drawStep = 11)
	};
PlayBack.prototype.createMap = function(t) {
	this.lang = t, "en" == t && (this.MAP_CENTER_LAT = 41.850033, this.MAP_CENTER_LNG = -87.65005229999997, this.DEFAULT_ZOOM = 3), this.map = new goome.maps.Map({
		id: "map",
		lang: t,
		lat: this.MAP_CENTER_LAT,
		lng: this.MAP_CENTER_LNG,
		zoom: this.DEFAULT_ZOOM
	}), goome.maps.event.addListener(this.map, "mousemove", PlayBack.mapMouseMove), goome.maps.event.addListener(this.map, "mousedown", function() {
		$("#search-device").blur()
	})
}, PlayBack.prototype.getDataFrist = function(t, a, e) {
	if("" != t && "" != a) {
		var l = new Date(t.replace(/-/g, "/")),
			i = new Date(a.replace(/-/g, "/"));
		PlayBack.RUN_TIME = 0, PlayBack.STOP_TIME = 0; {
			var n = (i - l) / 1e3;
			new Date, goome.session.SaveGpsDays
		}
		if(minDate || (minDate = new Date, minDate.setMonth(minDate.getMonth() - 6)), n > 5184e3) return alert(lg.overTimeSpan.replace("{0}", 60)), void this.buttonAttribute(this.BUTTONS_ID[0], !1, !0);
		if(0 > n) return alert(lg.distime), void this.buttonAttribute(this.BUTTONS_ID[0], !1, !0);
		if(minDate > l) return alert(lg.overTimeRangeDay.replace(/\{0\}/g, minDate.getFullYear() + "-" + padLeft(minDate.getMonth() + 1, 2, "0") + "-" + padLeft(minDate.getDate(), 2, "0"))), void this.buttonAttribute(this.BUTTONS_ID[0], !1, !0);
		this.FRIST_LOAD ? (this.FROM_TIME = t, this.TO_TIME = a, this.NEXT_TIME = t) : (PlayBack.HISTORY_PLAY_FLAG = !0, PlayBack.DATA_REQUEST = getTimeDiff(a, this.TO_TIME) > 10 || !PlayBack.PLAY_OVER ? !0 : !1, (this.FROM_TIME != t || this.TO_TIME != a || getTimeDiff(a, this.TO_TIME) <= 10 && PlayBack.PLAY_OVER) && this.reset(t, a)), this.Frequency = e || 300, this.TO_TIME = a, this.FRIST_LOAD || PlayBack.PLAY_OVER ? (this.PLAY_OVER = !1, infoPanel.reset(), this.ajaxRequest()) : PlayBack.buttonAttribute(PlayBack.BUTTONS_ID[0], !1, !1)
	}
}, PlayBack.prototype.getDataCallBack = function(t) {
	this.FRIST_LOAD || this.RECOVER_FROM_BACKUP ? (this.RECOVER_FROM_BACKUP = !1, this.processData(t)) : this.DATA_NEXT = t
}, PlayBack.prototype.processData = function(t) {
	var a = t.data.pos;
	if(document.getElementById("tip").style.display = "none", PlayBack.buttonAttribute(PlayBack.BUTTONS_ID[0], !1, !0), !a || 0 === a.length) {
		PlayBack.showStopInfo(PlayBack.FROM_TIME, PlayBack.TO_TIME);
		var e = PlayBack.getTxtByCount();
		return PlayBack.MARKERS_OBJ.update && PlayBack.MARKERS_OBJ.update({
			text: e
		}), PlayBack.buttonAttribute(PlayBack.BUTTONS_ID[0], !1, !0), void(PlayBack.PLAY_OVER = !0)
	}
	if(PlayBack.buttonAttribute(PlayBack.BUTTONS_ID[0], !0, !1), a.length > 0) {
		var l = [],
			i = a;
		PlayBack.FRIST_LOAD && (i[0].gps_time = 1e3 * i[0].gps_time, PlayBack.LAST_DATA_ = i[0], PlayBack.PRE_DATE_TIMR_ = PlayBack.LAST_DATA_.gps_time);
		for(var n = i.length, s = 0; n > s; s++) {
			var r = i[s];
			0 === s && PlayBack.FRIST_LOAD || (r.gps_time = 1e3 * r.gps_time), PlayBack.LAST_DATA_ = r, PlayBack.PRE_DATE_TIMR_ = r.gps_time, l.push(r)
		}
		var o = function() {
				var a = PlayBack.NEXT_TIME;
				i.length == PlayBack.RECORDS_LENGTH ? (PlayBack.NEXT_TIME = i[i.length - 1].gps_time, a == PlayBack.NEXT_TIME && (PlayBack.NEXT_TIME = parseInt(PlayBack.NEXT_TIME) + 1e3 + "")) : PlayBack.NEXT_TIME = 1e3 * t.data.resEndTime, PlayBack.DATA_REQUEST = !0, PlayBack.needGetData = !0
			},
			c = function() {
				PlayBack.needGetData = !1, PlayBack.DATA_REQUEST = !1
			},
			p = function() {
				o()
			},
			d = function() {
				c()
			};
		i.length == PlayBack.RECORDS_LENGTH ? p() : localToUtc(PlayBack.TO_TIME) > 1e3 * t.data.resEndTime ? p() : d();
		for(var s = 0; s < l.length - 1; s++) l[s].lng == l[s + 1].lng && l[s].lat == l[s + 1].lat && (l.splice(s + 1, 1), s--);
		PlayBack.playMarker(l)
	}
	PlayBack.needGetData && PlayBack.DATA_REQUEST && setTimeout(this.ajaxRequest, 1)
}, PlayBack.prototype.playMarker = function(t) {
	if(PlayBack.FRIST_LOAD) {
		var a = "";
		0 == t.length ? (PlayBack.FRIST_LOAD = !1, PlayBack.LAST_DATA = PlayBack.LAST_DATA_, PlayBack.PRE_DATE_TIMR = PlayBack.PRE_DATE_TIMR_, a = PlayBack.getTxtByRecord(PlayBack.LAST_DATA), PlayBack.ajaxRequest()) : (PlayBack.LAST_DATA = t[0], PlayBack.PRE_DATE_TIMR = t[0].gps_time, a = PlayBack.getTxtByRecord(t[0]));
		var e = new goome.maps.LatLng(PlayBack.LAST_DATA.lat, PlayBack.LAST_DATA.lng);
		if(PlayBack.map.setCenter(e), PlayBack.map.setZoom(13), PlayBack.MARKERS_OBJ = new PopupMarker(_isOSM_ ? {
				position: e,
				map: PlayBack.map,
				icon: _CONFIG_.STATIC_SITE + "images/comm/green_01.gif",
				text: a,
				showpop: !0
			} : {
				position: e,
				map: PlayBack.map,
				icon: _CONFIG_.STATIC_SITE + "images/arrows/arrow_e.png",
				text: a,
				showpop: !0,
				offset: {
					x: 0,
					y: 14
				}
			}), PlayBack.POLY_LINE_MARKER.push(PlayBack.MARKERS_OBJ), 0 == t.length) return
	}
	var l = 0,
		i = (t.length, function() {
			var a = PlayBack.Frequency;
			if(PlayBack.HISTORY_PLAY_FLAG)
				if(l < t.length) PlayBack.play(t[l]), l++, PlayBack.TIMER = setTimeout(i, a);
				else if(PlayBack.DATA_REQUEST && PlayBack.needGetData)
				if(PlayBack.DATA_NEXT) PlayBack.processData(PlayBack.DATA_NEXT), PlayBack.DATA_NEXT = "";
				else {
					var e = PlayBack.POLY_LINE_MARKER.length - 1;
					PlayBack.POLY_LINE_MARKER[e].setMap(null), PlayBack.POLY_LINE_MARKER[e - 1].setMap(null), PlayBack.RECOVER_FROM_BACKUP = !0
				}
			else {
				PlayBack.moveMarker(PlayBack.LAST_DATA), PlayBack.polyBuffer.length > 1 && PlayBack.drawPolyline(PlayBack.polyBuffer[0].color, PlayBack.polyBuffer), PlayBack.calculateStopInfo({
					gps_time: PlayBack.TO_TIME.replace(/-/g, "/")
				}), PlayBack.showStopInfo(PlayBack.FROM_TIME, PlayBack.TO_TIME);
				var n = PlayBack.getTxtByCount();
				PlayBack.MARKERS_OBJ.update({
					text: n
				}), PlayBack.buttonAttribute(PlayBack.BUTTONS_ID[0], !1, !0), PlayBack.PLAY_OVER = !0, PlayBack.NEXT_TIME = PlayBack.TO_TIME.split(".")[0]
			} else PlayBack.TIMER = setTimeout(i, a)
		});
	PlayBack.FRIST_LOAD ? (PlayBack.FRIST_LOAD = !1, setTimeout(i, 1e3)) : i()
}, PlayBack.prototype.ajaxRequest = function() {
	var t = "user_id=" + PlayBack.user_id + "&map_type=" + latlngType + "&access_type=inner&begin_time=" + localToUtc(PlayBack.NEXT_TIME) / 1e3 + "&end_time=" + localToUtc(PlayBack.TO_TIME) / 1e3,
		a = {
			url: PlayBack.AJAX_URL + PlayBack.REQUESR_URL,
			data: t,
			callback: PlayBack.getDataCallBack,
			context: PlayBack,
			error: function(t) {
				t.url.indexOf(PlayBack.AJAX_URL + PlayBack.REQUESR_URL) > -1 ? (t.url = _CONFIG_.PLAYBACK_SERVER_BACKUP + PlayBack.REQUESR_URL, setTimeout(function() {
					_.ajax.jsonp2(t)
				}, 2e3)) : setTimeout(function() {
					_.ajax.jsonp2(a)
				}, 2e3)
			},
			jsonpkey: "callback",
			cache: !0
		};
	_.ajax.jsonp2(a)
}, PlayBack.prototype.filterExcursion = function(t) {
	PlayBack.EXCURSION_COUNT++, t.speed = 0;
	var a = PlayBack.getTxtByRecord(t);
	PlayBack.MARKERS_OBJ.update({
		text: a
	})
}, PlayBack.prototype.drawPolyline = function(t, a) {
	var e = new goome.maps.Polyline({
		map: PlayBack.map,
		enableClicking: !1,
		clickable: !1,
		path: a,
		strokeColor: t,
		strokeOpacity: .9,
		strokeWeight: 4
	});
	PlayBack.POLY_LINE_MARKER.push(e)
}, PlayBack.prototype.polyBuffer = [], PlayBack.prototype.processPoly = function(t) {
	var a = !1,
		e = (PlayBack.POLY_LINE_MARKER.length, "#FF0000"),
		l = "#00FF00",
		i = new goome.maps.LatLng(t.lat, t.lng),
		n = this.polyBuffer,
		s = 50;
	if(i.color = l, t.speed > PlayBack.overSpeed && (i.color = e), PlayBack.SPEED > 30 && (s = 4), PlayBack.SPEED > 200 && (s = 1), n.push(i), !(n.length < 2)) {
		var r = n[n.length - 2];
		r.color != i.color ? a = !0 : n.length > s && (a = !0), a && (PlayBack.moveMarker(t), PlayBack.drawPolyline(n[0].color, n), this.polyBuffer = [i])
	}
}, PlayBack.prototype.moveMarker = function(t) {
	var a = new goome.maps.LatLng(t.lat, t.lng),
		e = PlayBack.getTxtByRecord(t);
	_isOSM_ || PlayBack.MARKERS_OBJ.setIcon(_CONFIG_.STATIC_SITE + "images/arrows/arrow_" + this.getHangXiang(t.course, t.speed, !0) + ".png"), PlayBack.MARKERS_OBJ.update({
		position: a,
		text: e
	});
	var l = PlayBack.map.getBounds();
	l.contains(a) || (_isBMap_ ? PlayBack.map.setCenter(a) : PlayBack.map.panTo(a))
}, PlayBack.prototype.play = function(t) {
	t.gps_time_utc = t.gps_time, t.gps_time = utcToLocal(t.gps_time);
	var a = getTimeDiff(t.gps_time, utcToLocal(PlayBack.LAST_DATA.gps_time));
	PlayBack.PRE_DATE_TIMR = t.gps_time, infoPanel.addGpsData(t), PlayBack.DISTANCE = distance(PlayBack.LAST_DATA.lat, PlayBack.LAST_DATA.lng, t.lat, t.lng, PlayBack.DISTANCE), t.speed > 0 && (a > 180 ? PlayBack.STOP_TIME += a : PlayBack.RUN_TIME += a), PlayBack.processPoly(t), PlayBack.LAST_DATA = t
}, PlayBack.prototype.getHangXiang = function(t, a, e) {
	if(0 > a || "" == t) return e ? "n" : "......";
	for(var l = 5, i = 10, n = 30, s = ["n", "n", "ne", "ne", "ne", "e", "e", "se", "se", "se", "s", "s", "sw", "sw", "sw", "w", "w", "nw", "nw", "nw"], r = [l, i, i, n, 90 - n, 90 - l, 90 - i, 90 + i, 90 + n, 180 - n, 180 - l, 180 - i, 180 + i, 180 + n, 270 - n, 270 - l, 270 - i, 270 + i, 270 + n, 360 - n], o = [360 - l, 360 - i, n, 90 - n, 90 - i, 90 + l, 90 + i, 90 + n, 180 - n, 180 - i, 180 + l, 180 + i, 180 + n, 270 - n, 270 - i, 270 + l, 270 + i, 270 + n, 360 - n, 360 - i], c = 0; c < r.length; c++)
		if(0 == c || 1 == c) {
			if(o[c] <= t || t <= r[c]) return s[c]
		} else if(r[c] <= t && t <= o[c]) return s[c];
	return t
}, PlayBack.prototype.getTxtByRecord = function(t) {
	var a = [];
	return a.push(-1 == t.speed ? "<span>" + lg.speed + ": </span>" + lg.uknGpsPosition + "<br/>" : -2 == t.speed ? "<span>" + lg.speed + ": </span>" + lg.wifiPosition + "<br/>" : "<span>" + lg.speed + ": </span>" + t.speed + lg.kPerH + "<br/>"), a.push('<font style="white-space:nowrap;font-size:12px;">'), a.push("<span>" + lg.movement + ": </span></span>" + formatKm2M(PlayBack.DISTANCE) + '<span id="mileageTipBtn" style="color: #0077FF;cursor: pointer;" title="' + lg.mileageTips + '" onclick="PlayBack.showMilageTips();">[?]</span><br/>'), a.push("<span>" + lg.sign + ": </span>" + utcToLocal(t.gps_time) + googleFix() + "<br/>"), a.push("<span>" + lg.duration + ": </span>" + (exchangeTime(PlayBack.RUN_TIME) || 0) + "<br/>"), "en" == lang && "GOOGLE" == mapType && a.push("<br/>"), a.push("</font>"), a.join("")
}, PlayBack.prototype.getTxtByCount = function() {
	var t = getTimeDiff(PlayBack.TO_TIME, PlayBack.FROM_TIME),
		a = [];
	return a.push('<font style="white-space:nowrap;font-size:12px;">'), a.push("<span>" + lg.totalTime + ": </span>" + exchangeTime(t) + "<br/>"), a.push("<span>" + lg.movement + ": </span>" + formatKm2M(PlayBack.DISTANCE) + '<span id="mileageTipBtn" style="color: #0077FF;cursor: pointer;font-weight: bold;" title="' + lg.mileageTips + '" onclick="PlayBack.showMilageTips();">[?]</span><br/>'), a.push("<span>" + lg.duration + ": </span>" + (exchangeTime(PlayBack.RUN_TIME) || 0) + googleFix() + "<br/>"), a.push("<span>" + lg.idle + ": </span>" + exchangeTime(t - PlayBack.RUN_TIME) + "<br/>"), "GM02EW" != PlayBack.productType && "GM06NW" != PlayBack.productType && "GM36W" != PlayBack.productType && "GM07W" != PlayBack.productType && a.push("<span>" + lg.type + ": </span>" + equipmentType(PlayBack.productType) + "<br/>"), a.push("</font>"), a.join("")
}, PlayBack.prototype.showMilageTips = function() {
	var t = ['<div style="margin: 5px 10px;color: #333;line-height:1.5em;">'];
	t.push('<p style="font-weight: bold;">' + lg.mileageDiffTitle + "</p>"), t.push("<p>" + lg.mileageDiffContent[0] + "</p>"), t.push("<p>" + lg.mileageDiffContent[1] + "</p>"), t.push("<p>" + lg.mileageDiffContent[2] + "</p>"), t.push("</div>"), t = t.join(""), dialogHandler.openWinLayer(lg.mileageTips, t, "en" == lang ? 500 : 400, "en" == lang ? 280 : 250, 1, window, null)
}, PlayBack.prototype.calculateStopInfo = function(t, a) {
	var e = PlayBack.LAST_DATA,
		l = getTimeDiff(t.gps_time, utcToLocal(e.gps_time));
	if(!(l <= this.stopTimeSetting)) {
		var i = PlayBack.STATIC_MARKER[PlayBack.STATIC_MARKER.length - 1],
			n = '<font style="white-space:nowrap;">' + lg.idle + "：{idle}<br>" + lg.start + "{start}<br>" + lg.end + t.gps_time + "{address}</font>";
		e.stopDuration ? (t.stopDuration = e.stopDuration + l, n = n.replace("{idle}", exchangeTime(t.stopDuration)).replace("{start}", i.startTime), infoPanel.stayAddress(i, n, i.latlng().lng(), i.latlng().lat())) : (t.stopDuration = l, n = n.replace("{idle}", exchangeTime(t.stopDuration)).replace("{start}", e.gps_time), i = new PopupMarker({
			position: new goome.maps.LatLng(PlayBack.LAST_DATA.lat, PlayBack.LAST_DATA.lng),
			map: PlayBack.map,
			icon: _CONFIG_.STATIC_SITE + "images/comm/blue_01.gif?t=140221.1153",
			text: n,
			showpop: !1
		}), i.seq = e.seq, i.startTime = e.gps_time, PlayBack.STATIC_MARKER.push(i), i.detailDom = a, "cn" == lang && a && (infoPanel.queryAddress(e.lng, e.lat, a.find(".playback-address-td")), a.attr("title", "停留点"), a.addClass("stoppoint-highlight"), PlayBack.isJD && a.addClass("stoppoint-highlight-jd")), infoPanel.stayAddress(i, n, e.lng, e.lat))
	}
}, PlayBack.prototype.showStopInfo = function(t, a) {
	var e = "";
	"cn" == lang && (e = '<a id="view-path" class="path-view" href="###">下载轨迹</a>');
	var l = '<div class="play-over-info"><h3 class="title"><span class="icon"></span>' + lg.playOverMsg[0] + "</h3><ul><li>" + lg.playOverMsg[1] + "&nbsp" + t + "</li><li>" + lg.playOverMsg[2] + "&nbsp" + a + "</li><li>" + lg.playOverMsg[3] + "&nbsp" + formatKm2M(PlayBack.DISTANCE) + '</li><li class="line-btns"><input type="button" class="btn btn-ok" onclick="infoPanel.dialog.closeWinLayer();" value="' + lg.ok + '"/><a id="view-travel" class="travel-view" href="###">' + lg.travel.view + "</a>" + e + "</li></ul></div>";
	infoPanel.dialog.openWinLayer(lg.playOverMsg[0], l, 322, 200, 1)
}, PlayBack.prototype.stopPlay = function() {
	PlayBack.buttonAttribute(PlayBack.BUTTONS_ID[1], !0, !1), PlayBack.HISTORY_PLAY_FLAG = !1
}, PlayBack.prototype.reset = function(t, a) {
	clearTimeout(this.TIMER), this.clearOverLayer(), this.POLY_LINE_MARKER.length = 0, this.polyBuffer.length = 0, this.FRIST_LOAD = !0, this.DISTANCE = 0, this.FROM_TIME = t, this.NEXT_TIME = t, this.TO_TIME = a, this.DATA_NEXT = ""
}, PlayBack.prototype.clearOverLayer = function() {
	for(var t = 0; t < PlayBack.POLY_LINE_MARKER.length; t++) PlayBack.POLY_LINE_MARKER[t].setMap(null);
	for(var a = 0; a < PlayBack.STATIC_MARKER.length; a++) PlayBack.STATIC_MARKER[a].setMap(null);
	PlayBack.STATIC_MARKER = []
}, PlayBack.prototype.buttonAttribute = function(t, a, e) {
	for(var l = 0; l < this.BUTTONS_ID.length; l++) this.BUTTONS_ID[l] == t ? (document.getElementById(this.BUTTONS_ID[l]).disabled = a, document.getElementById(this.BUTTONS_ID[l]).style.display = e ? "" : "none") : (document.getElementById(this.BUTTONS_ID[l]).style.display = e ? "none" : "", document.getElementById(this.BUTTONS_ID[l]).disabled = !1)
}, PlayBack.prototype.mapMouseMove = function(t) {
	var a = t.latLng;
	if(a) var e = this.fromLatLngToDivPixel(a);
	else var e = {
		x: t.pageX,
		y: t.pageY
	};
	for(var l = 0; l < PlayBack.STATIC_MARKER.length; l++) {
		var i = this.fromLatLngToDivPixel(PlayBack.STATIC_MARKER[l].latlng());
		if(i.x < e.x + 7 && i.x > e.x - 7 && i.y < e.y + 15 && i.y > e.y - 5) return void PlayBack.STATIC_MARKER[l].show();
		PlayBack.STATIC_MARKER[l].hide()
	}
}, PlayBack.prototype.isFilterProduct = function(t) {
	for(var a = arrFilterProducts, e = 0, l = a.length; l > e; e++)
		if(t.indexOf(a[e]) > -1) return !0;
	return !1
};
var Slider = {
	addListener: function(t, a, e) {
		window.attachEvent ? t.attachEvent("on" + a, e) : window.addEventListener && t.addEventListener(a, e, !1)
	},
	removeListener: function(t, a, e) {
		window.attachEvent ? t.detachEvent("on" + a, e) : window.addEventListener && t.removeEventListener(a, e, !1)
	},
	createDiv: function(t) {
		var a = document.createElement("div");
		return a.className = t, a
	},
	getPosition: function(t) {
		for(var a = {
				left: 0,
				top: 0
			}; t;) a.left += t.offsetLeft, a.top += t.offsetTop, t = t.offsetParent;
		return a
	}
};
Slider.Bar = function(t) {
	this.min = t.min || 0, this.max = t.max || 300, this.value = t.value || 0, this.infoFilter = t.infoFilter || function() {
		return null
	}, this.beforeMouseDown = t.beforeMouseDown || function() {}, this.wrap = Slider.createDiv("sliderbar-wrap"), this.unactive = Slider.createDiv("sliderbar-unactive"), this.block1 = Slider.createDiv("sliderbar-block"), this.info = Slider.createDiv("sliderbar-info"), this.wrap.appendChild(this.unactive), this.wrap.appendChild(this.block1), this.wrap.appendChild(this.info);
	var a = this,
		e = !1,
		l = function(t) {
			var e = t || window.event,
				l = e.target || e.srcElement;
			if("sliderbar-wrap" == l.className || "sliderbar-unactive" == l.className) {
				var i = e.clientX - Slider.getPosition(a.wrap).left;
				i < a.minLeft && (i = a.minLeft), i > a.maxLeft && (i = a.maxLeft);
				var n = a.block1;
				n.style.left = i + "px", a.refreshValue(), a._fireChange()
			}
		},
		i = function(t) {
			var l = t || window.event;
			a.beforeMouseDown() !== !1 && (a.currentBlock = this, a.beginMouseX = l.clientX, a.beginX = this.offsetLeft, this === a.block1 && (a.minMoveX = a.minLeft, a.maxMoveX = a.maxLeft), Slider.addListener(document, "mousemove", n), Slider.addListener(document, "mouseup", s), e = !0)
		},
		n = function(t) {
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			var e = t || window.event,
				l = e.clientX - a.beginMouseX + a.beginX;
			l < a.minMoveX && (l = a.minMoveX), l > a.maxMoveX && (l = a.maxMoveX), a.currentBlock.style.left = l + "px", a.refreshValue();
			var i = $(a.info).outerWidth(),
				n = l - i / 2;
			0 > n && (n = 0), n > a.maxLeft - i && (n = a.maxLeft - i);
			var s = a.infoFilter(a.value);
			return null !== s ? $(a.info).html(s).css("left", n) : $(a.info).hide(), !1
		},
		s = function() {
			Slider.removeListener(document, "mousemove", n), Slider.removeListener(document, "mouseup", s), e = !1, $(a.info).hide(), a.refreshValue(), (a.value != a.min || a.value != a.max) && a._fireChange()
		},
		r = function() {
			$(a.info).show()
		},
		o = function() {
			!e && $(a.info).hide()
		},
		c = function(t) {
			var e = t || window.event,
				l = e.clientX,
				i = $(a.info).outerWidth(),
				n = l - i / 2 - a.wrap.offsetLeft,
				s = Math.round((l - a.wrap.offsetLeft) / (a.maxLeft - a.minLeft) * (a.max - a.min)) + a.min;
			s < a.min && (s = a.min), s > a.max && (s = a.max), n < a.wrap.offsetLeft && (n = a.wrap.offsetLeft), n > a.maxLeft - i && (n = a.maxLeft - i);
			var r = a.infoFilter(s);
			null !== r ? $(a.info).html(r).css("left", n) : $(a.info).hide()
		};
	$(a.wrap).click(l), $(a.block1).mousedown(i), $(a.wrap).mousemove(c), $(a.wrap).mouseenter(r).mouseleave(o)
}, Slider.Bar.prototype = {
	appendTo: function(t) {
		"string" == typeof t && (t = document.getElementById(t)), t && 1 == t.nodeType && (t.appendChild(this.wrap), this.initBlock())
	},
	initBlock: function() {
		var t = this.wrap.offsetWidth,
			a = this.block1.offsetWidth;
		this.minLeft = 0, this.maxLeft = t - a, this.hrefBlockWidth = a / 2;
		var e = Math.round((this.value - this.min) / (this.max - this.min) * this.maxLeft);
		this.block1.style.left = e + "px"
	},
	refreshValue: function() {
		{
			var t = this.block1.offsetLeft;
			this.block1.offsetWidth / 2
		}
		this.value = this.min + Math.round(t / this.maxLeft * (this.max - this.min))
	},
	moveTo: function(t, a) {
		if(t) {
			t < this.min && (t = this.min), t > this.max && (t = this.max);
			var e = this.wrap.offsetWidth,
				l = this.block1.offsetWidth,
				i = (t - this.min) / (this.max - this.min) * (e - l);
			this.block1.style.left = Math.round(i) + "px", this.value = t, "boolean" == typeof a ? this.refreshValue() : "function" == typeof a && a(t)
		}
	},
	reset: function(t, a, e) {
		this.min = t || 0, this.max = a || 0, this.value = e || 0, this.initBlock()
	},
	_fireChange: function() {
		this.onchange && this.onchange.call(this, this.value)
	}
};
var infoPanel = function() {
		var t = null,
			a = null,
			e = null,
			l = null,
			i = null,
			n = $("#map"),
			s = null,
			r = null,
			o = null,
			c = 0,
			p = [],
			d = !1,
			h = new Dialog({
				borderColor: "#3873C9"
			}),
			g = function(t) {
				var e = [],
					l = +t.speed,
					i = "",
					n = lg.clickToShowInMap;
				c++, t.seq = c, p.push(t), E(t), l > PlayBack.overSpeed && (i = "overspeed-highlight-red", n = lg.srun5), e.push('<tr class="' + i + '"  title="' + lg.clickToShowInMap + '" data-gps-seq="' + c + '">'), e.push('<td class="js-seq">' + c + "</td>"), e.push('<td class="js-time">' + utcToLocal(t.gps_time).replace(/\//g, "-") + "</td>"), e.push('<td class="js-lng">' + t.lng + "</td>"), e.push('<td class="js-lat">' + t.lat + "</td>"), e.push('<td class="js-speed">' + t.speed + "</td>"), e.push('<td class="js-direction">' + (m(t.course, t.speed) || "") + "</td>"), e.push("<td>" + (t.course || "") + "</td>"), e.push('<td class="playback-address-td"><a href="javascript:;" class="js-query-address" data-lng="' + t.lng + '" data-lat="' + t.lat + '">' + lg.clickToQueryAddress + "</a></td>"), e.push("</tr>"), e = $(e.join("")), a.append(e), v(), f(), PlayBack.calculateStopInfo(t, e.prev()), timelineBar.moveTo(t.gps_time_utc), e = null
			},
			u = function(t, a, e) {
				$.ajax({
					url: _CONFIG_.GEO_CODER_URL + "o.jsp?i=" + t + "," + a + "&map=" + PlayBack.mapType,
					dataType: "jsonp",
					type: "get",
					cache: !0,
					success: function(l) {
						return l ? (e.html(l.substr(0, 200)), e = null, void f()) : void parseAddress(a, t, e[0], PlayBack.map)
					},
					error: function() {
						e.html(lg.noAddress), e = null
					}
				})
			},
			y = function(t, a, e, l) {
				$.ajax({
					url: _CONFIG_.GEO_CODER_URL + "o.jsp?i=" + e + "," + l + "&map=" + PlayBack.mapType,
					dataType: "jsonp",
					type: "get",
					async: !1,
					cache: !0,
					success: function(e) {
						a = a.replace("{address}", "<br>" + lg.stay + e), t.update({
							text: a
						})
					},
					error: function() {
						a = a.replace("{address}", "<br>" + lg.stay + "地址查询失败"), t.update({
							text: a
						})
					}
				})
			},
			v = function() {
				e.scrollTop(e[0].scrollHeight)
			},
			f = function() {
				null == i && ($("#fixed-thead-wrapper table").html(t.clone()), i = $("#fixed-thead-wrapper table thead"), $("#fixed-thead-wrapper").show()), i.find(".js-alarm-th").width(t.find(".js-alarm-th").width()), i.find(".js-address-th").width(t.find(".js-address-th").width())
			},
			T = function() {
				var t = '<span id="info-panel-btn" class="closed" title="' + lg.clickToOpen + '"><span>' + lg.detail2 + '</span></span><span id="playback-chart-btn" class="playback-chart-icon" ' + ("client" == source ? 'style="display:none;"' : "") + ' title="' + lg.showSpeedChart + '"><span>' + lg.speed + "</span></span>",
					a = '<div id="timeline-bar-wrapper"></div><div class="playback-speed-chart"><iframe id="speed-chart-iframe" src="" frameborder="0" scolling="no"></iframe></div><div id="gps-list-wrapper"><div id="fixed-thead-wrapper"><table class="playback-table"></table></div><table id="gps-list-table" class="playback-table"><thead><tr><th style="width:60px;">' + lg.num + '</th><th style="width:130px;">' + lg.time + '</th><th style="width:100px;">' + lg.lng + '</th><th style="width:100px;">' + lg.lat + '</th><th style="width:120px;">' + lg.speed + '<span class="remark-text">(' + lg.kPerH + ')</span></th><th style="width:80px;">' + lg.direction + '</th><th style="width:80px;">' + lg.direction + '<span class="remark-text">(' + lg.degree + ')</span></th><th class="js-address-th"><input class="print-btn" type="button" value="' + lg.print + '" onclick="infoPanel.printDataTable();">' + lg.p1 + "</th></tr></thead><tbody></tbody></table></div>";
				n.prev().prepend(t), n.before(a)
			},
			m = function(t, a) {
				if(0 > a || "" == t) return "......";
				for(var e = 5, l = 10, i = 30, n = lg.hangxiang, s = [e, l, l, i, 90 - i, 90 - e, 90 - l, 90 + l, 90 + i, 180 - i, 180 - e, 180 - l, 180 + l, 180 + i, 270 - i, 270 - e, 270 - l, 270 + l, 270 + i, 360 - i], r = [360 - e, 360 - l, i, 90 - i, 90 - l, 90 + e, 90 + l, 90 + i, 180 - i, 180 - l, 180 + e, 180 + l, 180 + i, 270 - i, 270 - l, 270 + e, 270 + l, 270 + i, 360 - i, 360 - l], o = 0; o < s.length; o++)
					if(0 == o || 1 == o) {
						if(r[o] <= t || t <= s[o]) return n[o]
					} else if(s[o] <= t && t <= r[o]) return n[o];
				return t
			},
			P = function(t) {
				var a = null;
				if($.each(PlayBack.STATIC_MARKER, function(e, l) {
						l.seq == t.seq && (a = l), l.hide()
					}), a) a.show(), PlayBack.map.setCenter(a.latlng_);
				else {
					var e = "<span>" + lg.num + "</span>： " + t.seq + "<br/><span>" + lg.time + "</span>： " + t.time + "<br/><span>" + lg.lng + "</span>： " + t.lng + "<br/><span>" + lg.lat + "</span>： " + t.lat + "<br/><span>" + lg.speed + "</span>： " + t.speed + " " + lg.kPerH + (t.direction ? "<br/><span>" + lg.direction + "</span>： " + t.direction : ""),
						l = new goome.maps.LatLng(t.lat, t.lng),
						i = new PopupMarker({
							position: l,
							map: PlayBack.map,
							icon: _CONFIG_.STATIC_SITE + "images/comm/gray_01.gif",
							text: e,
							showpop: !0
						});
					i.seq = t.seq, i.setZIndex(1e4), PlayBack.STATIC_MARKER.push(i), PlayBack.map.setCenter(l)
				}
			},
			k = function() {
				var t = $("<div></div>"),
					a = t.append($("#gps-list-table").clone()).html();
				t = null, a = a.replace(/<input[^>]*>/gim, function() {
					return ""
				}), a = a.replace(/<a[^>]*>([^<>]*)<\/a>/gim, function() {
					return ""
				}), a = '<div style="text-align: center;margin: 10px 0;">' + lg.carNum + ":" + $("#user_name").text() + "&nbsp;&nbsp;" + lg.server.From + ":" + _("from").value + "&nbsp;" + lg.server.TO + ":" + _("to").value + "</div>" + a, a = '<div class="btn-area"><span class="btn" onclick="window.print();"><button type="button">' + lg.print + '</button></span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="btn" onclick="parent.Printer.close();"><button type="button">' + lg.close + "</button></span></div>" + a, a = a + '<div class="btn-area"><span class="btn" onclick="window.print();"><button type="button">' + lg.print + '</button></span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="btn" onclick="parent.Printer.close();"><button type="button">' + lg.close + "</button></span></div>", Printer.view(a, !1, "./")
			},
			B = function(t) {
				o.load(function() {
					o[0].contentWindow.speedChart.initChart(t), d = !0
				}), o.attr("src", "playback_speedchart.shtml?lang=" + lang)
			},
			E = function(t) {
				d && o[0].contentWindow.speedChart.updateChart(t)
			},
			A = function() {
				d && o[0].contentWindow.speedChart.resetChart()
			},
			b = function() {
				c = 0, p = [], A(), a.html("")
			},
			R = function() {
				a.find("tr").live("click", function(t) {
					var a = $(this),
						e = $(t.target);
					e.hasClass("js-query-address") ? (u(e.attr("data-lng"), e.attr("data-lat"), e.parent()), t.stopPropagation()) : P({
						seq: a.find(".js-seq").text(),
						time: a.find(".js-time").text(),
						lng: a.find(".js-lng").text(),
						lat: a.find(".js-lat").text(),
						speed: a.find(".js-speed").text(),
						direction: a.find(".js-direction").text()
					}), t.preventDefault()
				}), l.click(function() {
					var t = $(this);
					t.data("closed") === !0 ? (t.data("closed", !1).attr("title", lg.clickToClose), e.show(), n.height(n.height() - 200), t.removeClass("closed").addClass("opened")) : (t.data("closed", !0).attr("title", lg.clickToOpen), e.hide(), n.height(n.height() + 200), t.removeClass("opened").addClass("closed")), f()
				}), s.click(function() {
					var t = $(this);
					t.data("closed") === !0 ? (t.data("closed", !1).attr("title", lg.hideSpeedChart), n.height(n.height() - 200), r.height(200), "" == o.attr("src") && B(p), t.removeClass("closed").addClass("opened")) : (r.height(0), t.data("closed", !0).attr("title", lg.showSpeedChart), n.height(n.height() + 200), t.removeClass("opened").addClass("closed")), $(window).resize()
				}), $(h.dom).on("click", "#travel-time-input,#travel-time-btn,#stay-time-btn,#travel-interval-list li a,#view-travel,#view-path", function(t) {
					var a = t.target,
						e = $(a),
						l = a.id;
					"travel-time-input" == l && ($("#travel-interval-list").show(), t.stopPropagation()), e.hasClass("js-travel-interval") && ($("#travel-time-input").val(e.data("interval")), $("#travel-interval-list").hide()), "travel-time-btn" == l && w(), "stay-time-btn" == l && S(), "view-travel" == l && M(), "view-path" == l && ($("#dl-box").fadeIn("fast"), h.close(), t.stopPropagation())
				}).on("click", function() {
					$("#travel-interval-list").hide()
				}).on("blur", "#travel-time-input", function() {
					var t = $(this);
					"" == t.val() && t.val(t.attr("placeholder"))
				}).on("focus", "#travel-time-input", function() {
					var t = $(this);
					t.val() == t.attr("placeholder") && t.val("")
				}).on("keydown", "#travel-time-input", function(t) {
					var a = t.keyCode;
					13 == a && w()
				})
			},
			M = function() {
				var t = '<div><div class="travel-title"><h3 id="travel-list-name">&nbsp</h3><div class="condition">' + lg.travel.stayInterval + '：<span class="travel-time-input-wrapper"><input type="text" maxlength="7" id="travel-time-input" value="30" placeholder=""/><span>' + lg.m2 + '</span><ul id="travel-interval-list"><li><a href="javascript:;" data-interval="3" class="js-travel-interval">3' + lg.m2 + '</a></li><li><a href="javascript:;" data-interval="5" class="js-travel-interval">5' + lg.m2 + '</a></li><li><a href="javascript:;" data-interval="10" class="js-travel-interval">10' + lg.m2 + '</a></li><li><a href="javascript:;" data-interval="15" class="js-travel-interval">15' + lg.m2 + '</a></li><li><a href="javascript:;" data-interval="20" class="js-travel-interval">20' + lg.m2 + '</a></li><li><a href="javascript:;" data-interval="30" class="js-travel-interval">30' + lg.m2 + '</a></li><li><a href="javascript:;" data-interval="45" class="js-travel-interval">45' + lg.m2 + '</a></li><li><a href="javascript:;" data-interval="60" class="js-travel-interval">1' + lg.h + '</a></li><li><a href="javascript:;" data-interval="120" class="js-travel-interval">2' + lg.h + '</a></li><li><a href="javascript:;" data-interval="180" class="js-travel-interval">3' + lg.h + '</a></li><li><a href="javascript:;" data-interval="360" class="js-travel-interval">6' + lg.h + '</a></li><li><a href="javascript:;" data-interval="720" class="js-travel-interval">12' + lg.h + '</a></li><li><a href="javascript:;" data-interval="1440" class="js-travel-interval">1' + lg.d + '</a></li><li><a href="javascript:;" data-interval="2880" class="js-travel-interval">2' + lg.d + '</a></li></ul></span><input type="button" value="' + lg.travel.viewTravel + '" id="travel-time-btn"/><input type="button" value="' + lg.travel.viewStay + '" id="stay-time-btn"/></div></div><div id="travel-content"></div></div>';
				h.openWinLayer(lg.travel.title, t, 930, 450, 1), w()
			},
			w = function() {
				$("#travel-list-name").text(lg.travel.listName[0]), $("#travel-interval-list").hide();
				var t = $.trim($("#travel-time-input").val());
				if(!t || !/^\d*$/g.test(t)) return alert(lg.travel.tip[0]), $("#travel-time-input").val("").focus(), !1;
				t = 60 * +t;
				var a = "",
					e = L(1e3 * t),
					l = function(t, a) {
						var e = a.startPoint,
							l = a.endPoint;
						return str = '<tr class="' + (t % 2 ? "even" : "odd") + '" data-start-lng="' + e.lng + '" data-start-lat="' + e.lat + '" data-end-lng="' + l.lng + '" data-end-lat="' + l.lat + '"><td style="width:39px;">' + (t + 1) + '</td><td style="width:90px;">' + formatKm2M(a.distance) + '</td><td style="width:90px;">' + exchangeTime((localToUtc(l.gpsTime) - localToUtc(e.gpsTime)) / 1e3) + '</td><td style="width:150px;">' + lg.travel.from + " " + e.gpsTime + "<br/>" + lg.travel.to + " " + l.gpsTime + '</td><td style="width:160px;">' + lg.travel.from + " " + e.lng + "," + e.lat + "<br/>" + lg.travel.to + " " + l.lng + "," + l.lat + '</td><td style="width:192px;" class="start-address"></td><td class="end-address"></td></tr>'
					};
				if(a += '<table class="playback-table travel-table"><thead><tr><th style="width:39px;" class="first">' + lg.num + '</th><th style="width:90px;">' + lg.travel.mile + '</th><th style="width:90px;">' + lg.travel.overTime + '</th><th style="width:150px;">' + lg.travel.beTime + '</th><th style="width:160px;">' + lg.travel.beLatLon + '</th><th style="width:192px;">' + lg.travel.bAddr + "</th><th>" + lg.travel.eAddr + '</th></tr></thead></table><div class="t-content"><table class="playback-table"><tbody>', p.length > 0)
					for(var i = 0, n = e.length; n > i; i++) a += l(i, e[i]);
				else a += '<tr class="even"><td colspan="7">' + lg.travel.tip[1] + "</td></tr>";
				a += "</tbody></table></div>";
				var s = $("#travel-content");
				s.html(a), e.length > 0 && s.find("tbody tr").each(function() {
					var t = $(this);
					u(t.data("start-lng"), t.data("start-lat"), t.find(".start-address"), 25), u(t.data("end-lng"), t.data("end-lat"), t.find(".end-address"), 25)
				})
			},
			L = function(t) {
				function a(t, a) {
					for(var e = {
							distance: 0,
							startPoint: {
								gpsTime: t.end,
								lat: t.lat,
								lng: t.lng
							},
							endPoint: {
								gpsTime: a.start,
								lat: a.lat,
								lng: a.lng
							}
						}, l = t.dataIndex, i = a.dataIndex; i > l; l++) e.distance = distance(+p[l].lat, +p[l].lng, +p[l + 1].lat, +p[l + 1].lng, e.distance);
					return e
				}
				var e = I(t),
					l = [];
				if(e.length > 0 && (e[0].lat != p[0].lat || e[0].lng != p[0].lng)) {
					var i = {
						dataIndex: 0,
						end: p[0].gps_time,
						lat: p[0].lat,
						lng: p[0].lng
					};
					l.push(a(i, e[0]))
				}
				for(var n = 0, s = e.length - 1; s > n; n++) l.push(a(e[n], e[n + 1]));
				return l
			},
			I = function(t) {
				function a(a, i, n) {
					var s = 0;
					s = localToUtc(a.gps_time) - localToUtc(i.gps_time), s > t ? (l || (l = {}, l.dataIndex = n, l.duration = 0, l.start = i.gps_time, l.lat = i.lat, l.lng = i.lng, e.push(l)), l.duration += s, l.end = a.gps_time) : l = null
				}
				for(var e = [], l = null, i = 1, n = p.length; n > i; i++) a(p[i], p[i - 1], i - 1);
				return a({
					gps_time: PlayBack.TO_TIME.replace(/-/g, "/")
				}, p[n - 1], n - 1), e
			},
			S = function() {
				$("#travel-list-name").text(lg.travel.listName[1]), $("#travel-interval-list").hide();
				var t = $.trim($("#travel-time-input").val());
				if(!t || !/^\d*$/g.test(t)) return alert(lg.travel.tip[0]), $("#travel-time-input").val("").focus(), !1;
				t = 60 * +t;
				var a = I(1e3 * t),
					e = "",
					l = function(t, a) {
						var e = a.start,
							l = a.end,
							i = '<tr class="' + (t % 2 ? "even" : "odd") + '" data-lng="' + a.lng + '" data-lat="' + a.lat + '"><td style="width:40px;">' + (t + 1) + '</td><td style="width:95px;">' + exchangeTime(a.duration / 1e3) + '</td><td style="width:289px;">' + lg.travel.from + e + "&nbsp" + lg.travel.to + l + '</td><td style="width:140px;">' + a.lng + "," + a.lat + '</td><td class="end-address"></td></tr>';
						return i
					};
				if(e += '<table class="playback-table travel-table"><thead><tr><th style="width:40px;" class="first">' + lg.num + '</th><th style="width:95px;">' + lg.travel.overTime2 + '</th><th style="width:289px;">' + lg.travel.beTime + '</th><th style="width:140px;">' + lg.travel.latLon + "</th><th>" + lg.travel.addr + '</th></tr></thead></table><div class="t-content"><table class="playback-table"><tbody>', p.length > 0)
					for(var i = 0, n = a.length; n > i; i++) e += l(i, a[i]);
				else e += '<tr class="even"><td colspan="7">' + lg.travel.tip[1] + "</td></tr>";
				e += "</tbody></table></div>";
				var s = $("#travel-content");
				s.html(e), s.find("tbody tr").each(function() {
					var t = $(this);
					u(t.data("lng"), t.data("lat"), t.find(".end-address"), 25)
				})
			},
			D = function() {
				T(), t = $("#gps-list-table thead"), a = $("#gps-list-table tbody"), e = $("#gps-list-wrapper"), l = $("#info-panel-btn"), l.data("closed", !0), s = $("#playback-chart-btn"), r = $(".playback-speed-chart"), s.data("closed", !0), o = $("#speed-chart-iframe"), R()
			};
		return D(), {
			queryAddress: u,
			stayAddress: y,
			addGpsData: g,
			locatePoint: P,
			printDataTable: k,
			reset: b,
			dialog: h
		}
	}(),
	myLabels = function() {
		function t(t) {
			$.each(t.list, function(t, a) {
				var e = new goome.maps.LatLng(a.lat, a.lng);
				new goome.maps.Marker({
					icon: _CONFIG_.STATIC_SITE + "images/label-icon/" + a.icon,
					draggable: !1,
					enableDragging: !1,
					enableClicking: !1,
					map: PlayBack.map,
					position: e
				}, {
					width: 31,
					height: 25
				}, {
					width: 15,
					height: 25
				});
				var l = a.name || " ",
					i = new goome.maps.Label({
						map: PlayBack.map,
						position: e,
						content: l,
						offset: new goome.maps.Size(7, -42)
					});
				i.setStyle({
					border: "1px solid #ccc",
					padding: "2px 5px"
				})
			})
		}

		function a(t, a) {
			$.ajax({
				url: _CONFIG_.API_SERVICE_URL + "GetDataService?method=getLabelList&custid=" + t + "&mapType=" + latlngType + "&type=" + (IS_DEVICE ? "1" : "0"),
				type: "get",
				dataType: "jsonp",
				success: function(t) {
					t && 1 == t.success && t.data && a(t.data)
				},
				error: function() {}
			})
		}
		return {
			init: function(e) {
				_isOSM_ || a(e, t)
			}
		}
	}();