//2017.10.25
/**
 * 百度地图二次封装
 * @param {string} id 地图元素id
 * @param {Object} option 选项
 */
function ZBMap(id,option){
    this.id = id;
	this.map = null;
	this.lng = "116.404";
	this.lat = "39.915";
	this.zoom = 11;//缩放等级
	
    
    // 存储器
	this.aPoints = {};// 坐标点 key:deviceId,value:point
	this.aMarkers = {};// 标记物 key:deviceId,value:marker
}
//加载百度地图

/**
 * @description 创建一个百度地图实例
 * @returns Object map 百度地图实例
 */
ZBMap.prototype.init = function(){
    var map = new BMap.Map(this.id);
	this.map = map;
	map.enableScrollWheelZoom(true);//允许滚轮缩放
    map.enableContinuousZoom(true);//启用习惯性拖拽

    map.addControl(new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_SMALL }));//左上角，仅包含平移和缩放按钮
    map.addControl(new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP] }));//2D图，卫星图
    map.addControl(new BMap.MapTypeControl({ anchor: BMAP_ANCHOR_TOP_RIGHT }));//右上角，默认地图控件
    map.addControl(new BMap.ScaleControl());//添加默认比例尺控件
    map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT }));
    map.addControl(new BMap.OverviewMapControl());//添加默认缩略地图控件
    map.addControl(new BMap.OverviewMapControl({ isOpen: false, anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));//右下角，打开

    // 设置地图中心点
    map.centerAndZoom(new BMap.Point(this.lng, this.lat ), this.zoom);
    
    // 全景实例
	var Panorama=map.getPanorama();
	Panorama.setOptions({
	    closeControl:true
	});
    return map;
}

/**
 * @description 加载标记物并储存在aMarkers中， 根据[设备id] 判断是否已经加载在地图上
 * @param {Object} data 标记物数据，包括经纬度和一个唯一标识
 * @param {Object} icon 自定义标记物的图标，是一个BMap.Icon对象
 * @returns {Object} 地图标记物BMap.Marker
 */
ZBMap.prototype.loadMarker = function(data,icon){
    var deviceId = data.deviceId;

	var lng = data.lng;
	var lat = data.lat;
	// 创建坐标点
    var point = new BMap.Point(lng, lat);
    
	var marker = new BMap.Marker(point, icon);
	this.map.addOverlay(marker);
	
    // 保存
    if(deviceId){
        this.aPoints[deviceId] = point;
        this.aMarkers[deviceId] = marker;
    }
	return marker;
}



/**
 * 根据deviceId移除标记物
 * @param {String} id 标记物的唯一标识
 */
ZBMap.prototype.removeMarker = function(id){
    var marker = this.aMarkers[id];
    if(marker){
        delete this.aMarkers[id];
        this.map.removeOverlay(marker);
    }
}
/**
 * 将经纬度解析为地址
 * @param {*} lng 经度
 * @param {*} lat 纬度
 * @param {Function} cb 解析完成的回调函数
 */
ZBMap.prototype.getPosition = function(lng,lat,cb){
    var point = new BMap.Point(lng,lat);
    this.geo = this.geo || new BMap.Geocoder();
    this.geo.getLocation(point,function(rs){
        var addComp = rs.addressComponents;
        console.log(`${addComp.province}，${addComp.city}${addComp.district}，${addComp.street}，${addComp.streetNumber}`)
        cb && cb(rs);
    })
}

ZBMap.prototype.getLngLat = function(address){
    this.geo = this.geo || new BMap.Geocoder();
    this.geo.getPoint(address,function(point){
        if (point) {
            map.centerAndZoom(point, 16);
            map.addOverlay(new BMap.Marker(point));
        } else {
            alert("您选择地址没有解析到结果!");
        }
    })
}



/**
 * 原始坐标转换成百度坐标
 * @param {array} pointArr 百度坐标点数组
 * @param {function} cb 转换完的回调，接受一个入参：转换完成后的点组成的数组
 */
ZBMap.prototype.translateToBaidu = function (pointArr, cb) {
    if (!this.convertor) {
        this.convertor = new BMap.Convertor();
    }
    var convertor = this.convertor;

    /* http://lbsyun.baidu.com/index.php?title=webapi/guide/changeposition
    from:源坐标类型：
    1：GPS设备获取的角度坐标，wgs84坐标;
    2：GPS获取的米制坐标、sogou地图所用坐标;
    3：google地图、soso地图、aliyun地图、mapabc地图和amap地图所用坐标，国测局（gcj02）坐标;
    4：3中列表地图坐标对应的米制坐标;
    5：百度地图采用的经纬度坐标;
    6：百度地图采用的米制坐标;
    7：mapbar地图坐标;
    8：51地图坐标

    to:目标坐标类型：
    5：bd09ll(百度经纬度坐标),
    6：bd09mc(百度米制经纬度坐标);
    */
    convertor.translate(pointArr, 1, 5, cb);
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

