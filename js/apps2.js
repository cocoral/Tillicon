
//***********************************************************//
//                define global variables                    //
//***********************************************************//

var search = {};
var makeBg = {};

var selectedUrlCollection = [];
// var displayedIcons = [];


//for generate background section
var width = 500;
var height = 500;
var iconSize = 104;


var numPerRow = Math.ceil(width / iconSize);

//define some global functions
var deleteIconWithUrl = function(url){
	// Get index of item by url	
	var removeIndex = selectedUrlCollection.indexOf(url);
	// console.log(removeIndex)
	//And splice it out of the array
	selectedUrlCollection.splice(removeIndex,1);
	console.log(selectedUrlCollection);
}

var displayCollectionOnTable = function(){
	$.each(selectedUrlCollection,function(i,url){
		var html = "<div class='selectedIcons' data-url='" + url + "'> <img src='"
		html += url + "' alt='selected result'></div>"
		// console.log(html)
		$('.iconTable .wrapper').append(html);
	})
}


//***********************************************************//
//                    initiate search                        //
//***********************************************************//
$(function(){
	search.init();
	
})


//***********************************************************//
//                         search                            //
//***********************************************************//

//trigger the search
search.init = function(){
	//-----------wait to be replaced----------------!!!!!!!!!!!
	search.getIcons('space');
	// search.randomIcons();

	//trigger search when click on submit btn
	$('form').on('submit',function(e){
		e.preventDefault();
		var searchInput = $('input.indexSearchBar').val();
		search.getIcons(searchInput);
	});
}

//get the key word inputed by user;
search.getIcons = function(keyword){

	$.ajax({
		url: 'noun.php',
		dataType:'json',
		data: {
			term: keyword,  
			type: 'icons'
		}
	}).then(function(res) {

		search.displayIcons(res);
		// console.log(res);		
	})
}

//display the icons in form of checkbox;
search.displayIcons = function(data){
	// console.log(data);
	//empty the former display 

	$('.iconBar form').empty();
	// displayedIcons = [];
	//define a counter
	var i = 0;
	$.each(data.icons,function(i,icons){
		// console.log(icons);
		var iconAuthor
		var iconUrl = icons.preview_url_84; 
		//display with a  html string
		var html = "<div class='iconList'>" 
		html += "<input type='checkbox' id='" + i + "' data-url='" + iconUrl + "'>";
		html += "<label for='" + i + "'> "
		html += "<img src='" + iconUrl + "' alt='search result'></label></div>"
		$('.iconBar form').append(html);

		// store the info in a array.probably for later use when need to 'loadmore'?
		// displayedIcons.push({
		// 	'displayIndex': i,
		// 	'diaplayIconUrl': iconUrl
		// })
		// console.log(displayedIcons);
		i++;
	});

	search.selectIcons();   
}

//add checked icon url in array, and remove unchecked icon url from array
search.selectIcons = function(){
	var i = 0;
	$('.iconBar input').change(function(){
        var selectedIconUrl = $(this).data('url');
        if ($(this).is(':checked')) {
        	selectedUrlCollection.push(selectedIconUrl); //!!!!!!!!this is the selected icons array!!!!!!!!!!
			console.log(selectedUrlCollection);
        } else{
        	//If unchecked 
        	deleteIconWithUrl(selectedIconUrl);
        }
        //and show them
		search.displayOnTheTable();
    });
}


//add selected icon to iconTable
search.displayOnTheTable = function(){
	$('.iconTable .wrapper').empty();

	displayCollectionOnTable();

	var makeBgBtn = "<button type='button' name ='gimmeBackground'>Map Background</button>"
	makeBgBtn += "<button type='button' name ='clearAll'>Clear All Icons</button>"
	$('.iconTable .wrapper').append(makeBgBtn);

	//--------run makeBg
	search.removeIcons();
	makeBg.clear();
	makeBg.init();

}

//remove selected icon when clicked in the icon table
search.removeIcons = function(){
	$('.selectedIcons').click(function(){
		//1.remove from the table
		$(this).remove();

		//2. uncheck the icon on bar
		var url = $(this).attr('data-url');
		var findUrl = "input[data-url='" + url + "']"
		$(findUrl).prop('checked', false);

		//3.remove form array
		deleteIconWithUrl(url);

	});
}

//clear all the icons when click clearAll
makeBg.clear = function(){
	$("button[name='clearAll']").click(function(){
		//1.uncheck items on the bar
		$('input[type="checkbox"').prop('checked',false);
		//2.remove from array
		selectedUrlCollection=[];
		//3.clear table
		$('.iconTable .wrapper').empty();

	});

}


//***********************************************************//
//                     generate background                   //
//***********************************************************//


//when click Map Background btn, init the background 
makeBg.init = function() {
	$("button[name='gimmeBackground']").click(function(){
		$('.displayPage').empty();
		// console.log(selectedUrlCollection)

		makeBg.createLayout();

	
	})
}



//create selection and goback button
makeBg.createLayout = function(){
	// var size = '<form action = "">
	// size + = '<select name="MapSize" id="MapSize">'
	// size + = '	<option value="xs" data-width = "500" data-height="500">500*500</option>'
	// size + = '	<option value="s">Eagles</option>'
	// size + = '	<option value="m">Dragons</option>'
	// size + = '	<option value="l">Elephants</option>'
	// size + = '	</select></form>'

	var goback = "<button type='button' name ='restart'>Start A New selection</button>";
	// var modify = "<button type='button' name ='modify'>Modify Selection</button>";
	$('.resultPage .wrapper').append(goback);

	makeBg.createCanvas();
	makeBg.goback();
}


makeBg.goback = function(){
	$("button[name='restart']").click(function(){
		location.reload();
	});

}

//-----------------------------------------------------------//
//------------------ all codes for canvas -------------------//
//-----------------------------------------------------------//

//draw one icon
makeBg.drawAIcon = function(x,y,shift,stage){
	var layer = new Konva.Layer();
	var imageObj = new Image();
	iconIndex = (y * numPerRow + x) % selectedUrlCollection.length;

    imageObj.onload = function() {
    	//creat the rotation degre
    	var rotationDeg = Math.random()*40-20;
	    //draw the image at {x: x*iconWidth, y: y*iconHeight}
		var icon = new Konva.Image({
			x:x*iconSize + shift,
			y:y*iconSize,
			image :  imageObj,
			rotation: rotationDeg,
		});
		layer.add(icon);
		stage.add(layer);	
	};
	imageObj.src = selectedUrlCollection[iconIndex];
	console.log(selectedUrlCollection[iconIndex])
}

//define the drawIcons 
makeBg.drawIcons = function(x,y,stage){
    var shift = 0;
    if (y %2 == 1) {
	  shift =  iconSize / 2
	}
	//draw icons one by one
    makeBg.drawAIcon(x,y,shift,stage);
};

//create the canvas with selected icons
makeBg.createCanvas = function(){

	var stage = new Konva.Stage({
	  container: 'container',
	  width: width,
	  height: height
	});

	for (var x = 0; x < numPerRow; x++)  {
	    for (var y = 0; y < Math.ceil(height / iconSize); y++) {
			console.log(x,y)
	    	// iconIndex = (y * numPerRow + x) % selectedUrlCollection.length;
			makeBg.drawIcons(x,y,stage);

			//if its the last icon in the even row,redrawing the last icon;
			if (y%2 == 1 && x === numPerRow - 1){
				console.log('gimme more!')
				makeBg.drawAIcon(0,y,-iconSize/2,stage);
			}
		};
	}
}


//go back and modify search

//start a new search





//---------random collection at the beginning
// search.randomIcons = function(){
// 	// var collection = ['animals','space']  //------to be finished
// 	// var randomCollection = collection[Math.floor(Math.random()*collection.length)];
// 	// console.log(randomCollection);
// 	$.ajax({
// 		url:'noun.php', 
// 		datatype:'json',
// 		data:{
// 			type: 'collection'
// 		}
// 	}).then(function(res){
// 		console.log(JSON.parse(res))
// 	});
// };
