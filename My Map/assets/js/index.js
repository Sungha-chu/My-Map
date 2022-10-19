function init(){
   create_map();  //Initial map and mark own location
   //marker_point();
}


/*以下暫時沒用到*/
function draw_shape(){
   sort_points_list();
   L.polygon(points_marker_by_user).addTo(map);
   points_marker_by_user = new Array();
   index_for_points_list = 0;
}

function erase_shape(){
   location = location;
}


function sort_points_list(){
   points_marker_by_user.sort();
   points_marker_by_user.forEach(ele => console.log(ele));
}