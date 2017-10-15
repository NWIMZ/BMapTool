var initMap = function(id){
	var map = new BMap.Map(id);
	var point = new BMap.Point(113.70077, 23.034817);
	map.centerAndZoom(point, 15);
	map.addControl(new BMap.MapTypeControl());
	map.enableScrollWheelZoom(true);//开启鼠标滚轮缩放。
	map.addControl(new BMap.NavigationControl());//缩放控件
	return map;
}
