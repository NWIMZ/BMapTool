//2017.10.19
// 百度地图
function ZBMap(id,option){
	this.map = new BMap.Map(id);
	this.aPoints = {};// 坐标点
	this.aMarkers = {};// 标记物
	this.init();
	
	return this.map;
}
//加载百度地图
ZBMap.prototype.init = function(){
	var map = this.map;
	map.enableScrollWheelZoom(true); //允许滚轮缩放
    map.enableContinuousZoom(true); //启用习惯性拖拽
    map.addControl(new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_SMALL }));  //左上角，仅包含平移和缩放按钮
    map.addControl(new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP] }));	//2D图，卫星图
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT }));	//右上角，默认地图控件
    map.addControl(new BMap.ScaleControl());	// 添加默认比例尺控件
    map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT }));
    map.addControl(new BMap.OverviewMapControl());	//添加默认缩略地图控件
    map.addControl(new BMap.OverviewMapControl({ isOpen: false, anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));   //右下角，打开
	
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
	var Panorama=map.getPanorama();
	Panorama.setOptions({
	    closeControl:true
	});
    return map;
}

//加载标记物，根据[设备id]判断是否已经加载在地图上
/*
data = {
	lng: "",
	lat: "",
	deviceId: "",
}
option = {
	配置项
}
 * */
ZBMap.prototype.loadMark = function(data,option,callback){
	var lng = data.lng;
	var lat = data.lat;
	// 创建坐标点
	var point = new BMap.Point(lng, lat);
	var marker = new BMap.Marker(point);
	this.map.addOverlay(marker);
	
	// 保存
	this.aPoints[data.deviceId] = point;
	this.aMarkers[data.deviceId] = marker;
	
	callback && callback();
	return marker;
}
/**
 * 根据deviceId移除标记物
 * */
ZBMap.prototype.removeMark = function(deviceId){
	var marker = this.aMarkers[deviceId];
	delete this.aMarkers[deviceId];
	console.log(this.aMarkers);
	
	this.map.removeOverlay(marker);
}



/**百度地图自动完成对象
 * acInputId:输入框id
 * searchResultPanel:自动完成对象的id
 * */
function MapAc(map,acInputId,searchResultPanel,cb){
	this.ac = new BMap.Autocomplete({ //建立一个自动完成的对象
        "input": acInputId,
        "location": map
    });
    this.map = map;
    this.searchResultPanel = searchResultPanel;
    this.value = "";
    this.local = {};
    this.callback = cb;
    this.init();
}
MapAc.prototype.init = function(){
	var This = this;
	this.ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if(e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
        value = "";
        if(e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        
        document.getElementById(This.searchResultPanel).innerHTML = str;
    });
    
    this.ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        This.value = _value.province + _value.city + _value.district + _value.street + _value.business;
        document.getElementById(This.searchResultPanel).innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + this.value;
        This.setPlace();
    });
}
MapAc.prototype.setPlace = function(){
    this.map.clearOverlays(); //清除地图上所有覆盖物
    this.local = new BMap.LocalSearch(this.map, { //智能搜索
        onSearchComplete: this.searchComplete.bind(this)
    });
    this.local.search(this.value);
}
MapAc.prototype.searchComplete = function(){
	var firstPoint = this.local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
    this.map.centerAndZoom(firstPoint, 18);
    var bdMapMarker = new BMap.Marker(firstPoint);
	this.map.addOverlay(bdMapMarker); //添加标注
	
    this.callback && this.callback(firstPoint);
}
