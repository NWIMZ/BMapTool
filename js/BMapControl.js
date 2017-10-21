
///百度地图控件
//增大一级=====
function ZoomPlusControl(){
  this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
  this.defaultOffset = new BMap.Size(0, 0);
}
ZoomPlusControl.prototype = new BMap.Control();
ZoomPlusControl.prototype.initialize = function(map){
  var div = document.createElement("div");
  div.appendChild(document.createTextNode("+"));
  div.style.cssText = "height: 0.96rem;width: 0.96rem;text-align: center;line-height: 0.96rem;font-size: 0.6rem;border: 1px solid #898989;border-bottom: none;border-radius: 2px 2px 0 0;background: white;margin-right: 0.266666rem!important;margin-bottom: 1.626666rem;";
  div.onclick = function(e){
	map.setZoom(map.getZoom() + 1);
  }
  map.getContainer().appendChild(div);
  return div;
}

//缩小一级=====
function ZoomSubControl(){
  this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
  this.defaultOffset = new BMap.Size(0, 0);
}
ZoomSubControl.prototype = new BMap.Control();
ZoomSubControl.prototype.initialize = function(map){
  var div = document.createElement("div");
  div.appendChild(document.createTextNode("-"));
  div.style.cssText = "height: 0.96rem;width: 0.96rem;text-align: center;line-height: 0.96rem;font-size: 0.8rem;border: 1px solid #898989;border-top: none;border-radius:0 0 2px 2px;background: #fff;margin-right: 0.266666rem;margin-bottom: 0.666666rem;";
  div.onclick = function(e){
	map.setZoom(map.getZoom() - 1);
  }
  map.getContainer().appendChild(div);
  return div;
}

//切换地图=====
function changeMapTypeControl(){
  this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
  this.defaultOffset = new BMap.Size(0, 0);
}
changeMapTypeControl.prototype = new BMap.Control();
changeMapTypeControl.prototype.initialize = function(map){
  var satellite = document.createElement("div");
  satellite.style.cssText = "height: 0.96rem;width: 0.96rem;text-align: center;line-height: 0.96rem;font-size: 0.6rem;border: 1px solid #898989;border-radius: 2px 2px 0 0;background: white no-repeat;margin-right: 0.266666rem!important;margin-top: 0.653333rem;";
  satellite.style.cssText += "background-image: url(static/img/bmap-SATELLITE.png);background-size: 0.64rem;background-position: center;"
  satellite.onclick = function(e){
  	if(this.className == "satellite"){
  		map.setMapType(BMAP_NORMAL_MAP);
  		this.className = "";
  	}else{
  		map.setMapType(BMAP_SATELLITE_MAP);
  		this.className = "satellite";
  	}
  }
  map.getContainer().appendChild(satellite);
  return satellite;
}


//实时路况
function trafficControl(){
  this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
  this.defaultOffset = new BMap.Size(0, 0);
}
trafficControl.prototype = new BMap.Control();
trafficControl.prototype.initialize = function(map){
  var div = document.createElement("div");
  div.style.cssText = "height: 0.96rem;width: 0.96rem;text-align: center;line-height: 0.96rem;font-size: 0.6rem;border: 1px solid #898989;border-radius: 2px 2px 0 0;background: white no-repeat;";
  div.style.cssText += "background-image: url(static/img/bmap-traffic.png);background-size: 0.426666rem;background-position: center;margin-right: 0.266666rem;margin-top: 1.88rem;"
  div.onclick = function(e){
  	if(this.className == "traffic"){
  		map.removeTileLayer(traffic);
  		this.className = "";
  	}else{
  		traffic = new BMap.TrafficLayer();
  		map.addTileLayer(traffic); 
  		this.className = "traffic";
  	}
  }
  map.getContainer().appendChild(div);
  return div;
}