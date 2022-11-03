function create_new_list_by_distance(){
    var distance = document.querySelector('#interval_of_distance_set_by_user').value;   //使用者輸入的間隔距離
    if(distance != ""){ //檢查使用者是否有輸入間隔距離
        switch(document.querySelector('#unit_of_distance').value){  //select選單選擇的單位
            case 'm':   //公尺
                break;
            case 'km':  //公里
                distance = distance * 1000; //公尺轉公里
                break;
        }

        if(IsPtInPoly()) add_log("使用者座標在框選範圍內" , "blue");   //判斷使用者是否被框選
        else add_log("使用者座標不在框選範圍內" , "blue");

        add_log("間隔距離設定為" + distance);
        getDirection();

        getScannerLine(distance);   //取得掃描線清單
        add_log("掃描線建立成功");
        scan(distance);
        add_log("掃描結果:建立" + points_on_edges_of_graphics.length + "個座標點","blue");

        
        
    }
    else alert("未輸入間隔距離");
}

//計算座標是否坐落於框選範圍
function IsPtInPoly() {
	var iSum = 0,
		iCount;
	var dLon1, dLon2, dLat1, dLat2, dLon;
	if (points_marker_by_user.length < 3) return false;
	iCount = points_marker_by_user.length;
	for (var i = 0; i < iCount; i++) {
		if (i == iCount - 1) {
			dLon1 = points_marker_by_user[i].lng;
			dLat1 = points_marker_by_user[i].lat;
			dLon2 = points_marker_by_user[0].lng;
			dLat2 = points_marker_by_user[0].lat;
		} else {
			dLon1 = points_marker_by_user[i].lng;
			dLat1 = points_marker_by_user[i].lat;
			dLon2 = points_marker_by_user[i + 1].lng;
			dLat2 = points_marker_by_user[i + 1].lat;
		}
		//以下語句判斷A點是否在邊的兩端點的水平平行線之間，在則可能有交點，開始判斷交點是否在左射線上
		if (((user_location.lat >= dLat1) && (user_location.lat < dLat2)) || ((user_location.lat >= dLat2) && (user_location.lat < dLat1))) {
			if (Math.abs(dLat1 - dLat2) > 0) {
				//得到 A點向左射線與邊的交點的x座標：
				dLon = dLon1 - ((dLon1 - dLon2) * (dLat1 - user_location.lat)) / (dLat1 - dLat2);
				if (dLon < user_location.lng) iSum++;
			}
		}
	}
	if (iSum % 2 != 0){      
        return true;
    }
	return false;
}

function getDirection(){
    let direction = document.querySelector("#direction").value;
    let result;
    switch(direction){
        case 'NSEW':
        case 'NSWE':
        case 'SNEW':
        case 'SNWE':
            result = 'vertical';
            break;
        case 'EWNS':
        case 'EWSN':
        case 'WENS':
        case 'WESN':
            result = 'level';
            break;
    }
}

//取得掃描線清單
function getScannerLine(distance){
    var min_lng = points_marker_by_user[0].lng; //假設最小經度為points_marker_by_user[0]的經度
    var max_lng = points_marker_by_user[0].lng; //假設最大經度為points_marker_by_user[0]的經度
    var min_lat = points_marker_by_user[0].lat; //假設最小緯度為points_marker_by_user[0]的緯度
    var max_lat = points_marker_by_user[0].lat; //假設最大緯度為points_marker_by_user[0]的緯度

    for(var i=0; i<points_marker_by_user.length;i++){   //走訪座標清單
        if(min_lng > points_marker_by_user[i].lng) min_lng = points_marker_by_user[i].lng;  //找最小經度
        if(max_lng < points_marker_by_user[i].lng) max_lng = points_marker_by_user[i].lng;  //找最大經度
        if(min_lat > points_marker_by_user[i].lat) min_lat = points_marker_by_user[i].lat;  //找最小緯度
        if(max_lat < points_marker_by_user[i].lat) max_lat = points_marker_by_user[i].lat;  //找最大緯度
    }

    let dist = distance * 0.00000900900901; //公尺轉經緯度: 1公尺約0.00000900900901度
    let index = 0;
    while(min_lng + index * dist <= max_lng){
        let sp1 = {
            'lat': min_lat,
            'lng': min_lng + index * dist
        };
        let sp2 = {
            'lat': max_lat,
            'lng': min_lng + index * dist
        };
        scanner_list.push([sp1, sp2]);
        index = index + 1;
    }
    index = 0;
}

//透過掃描線掃描圖形
function scan(){
    for(var index=0; index<points_marker_by_user.length; index++){
        if(index < points_marker_by_user.length-1){
            //L.polyline([points_marker_by_user[index], points_marker_by_user[index + 1]], { color: ' red ' }).addTo(map);  //繪製被掃描線
            for(var i=0; i<scanner_list.length; i++){
                //L.polyline(scanner_list[i], { color: ' blue ' }).addTo(map);  //繪製掃描線
                let result = segmentsIntr(scanner_list[i][0], scanner_list[i][1], points_marker_by_user[index], points_marker_by_user[index + 1]);
                if(result != false){
                    points_on_edges_of_graphics.push(result);
                }
            }
        }else{
            //L.polyline([points_marker_by_user[index], points_marker_by_user[0]], { color: ' red ' }).addTo(map);  //繪製被掃描線
            for(var i=0; i<scanner_list.length; i++){
                //L.polyline(scanner_list[i], { color: ' blue ' }).addTo(map);  //繪製掃描線
                let result = segmentsIntr(scanner_list[i][0], scanner_list[i][1], points_marker_by_user[index], points_marker_by_user[0]);  //頭尾相接
                if(result != false){
                    points_on_edges_of_graphics.push(result);
                }
            }
        }
    }
    points_on_edges_of_graphics.forEach(function(element){  //標註掃描後得到的座標點
        L.marker(element).addTo(map);
    });
}

//求交點座標
function segmentsIntr(sp1, sp2, up1, up2){  
    let a = {
        x: sp1.lng,
        y: sp1.lat
    };
    let b = {
        x: sp2.lng,
        y: sp2.lat
    };
    let c = {
        x: up1.lng,
        y: up1.lat
    };
    let d = {
        x: up2.lng,
        y: up2.lat
    };

    var nx=b.y - a.y,   
    ny=a.x - b.x;  
    var normalLine = {  x: nx, y: ny }; 
    var dist= normalLine.x*c.x + normalLine.y*c.y;  

    //線段ab的法線N1  
    var nx1 = (b.y - a.y), ny1 = (a.x - b.x);  

    //線段cd的法線N2  
    var nx2 = (d.y - c.y), ny2 = (c.x - d.x);  

    //兩條法線做叉乘, 如果結果為0, 說明線段ab和線段cd平行或共線,不相交  
    var denominator = nx1*ny2 - ny1*nx2;  
    if (denominator==0) {  
        return false;  
    }  

    //在法線N2上的投影  
    var distC_N2=nx2 * c.x + ny2 * c.y;  
    var distA_N2=nx2 * a.x + ny2 * a.y-distC_N2;  
    var distB_N2=nx2 * b.x + ny2 * b.y-distC_N2;  

    // 點a投影和點b投影在點c投影同側 (對點在線段上的情況,本例當作不相交處理);  
    if ( distA_N2*distB_N2>=0  ) {  
        return false;  
    }  

    //在法線N1上的投影  
    var distA_N1=nx1 * a.x + ny1 * a.y;  
    var distC_N1=nx1 * c.x + ny1 * c.y-distA_N1;  
    var distD_N1=nx1 * d.x + ny1 * d.y-distA_N1;  
    if ( distC_N1*distD_N1>=0  ) {  
        return false;  
    }  

    //計算交點坐標  
    var fraction= distA_N2 / denominator;  
    var dx= fraction * ny1,  
        dy= -fraction * nx1;

    let result = {
        'lat': a.y + dy,
        'lng': a.x + dx
    }
    return result;
}
