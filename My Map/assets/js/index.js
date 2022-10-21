function init(){
   create_map();  //Initial map and mark own location
}

function sort_points_marker_by_user(){
   points_marker_by_user.sort(function(p1, p2){    //以lat為基準進行排序   
      return p1.lat - p2.lat;
   });
}