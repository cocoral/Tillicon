
//***********************************************************//
//                define global variables                    //
//***********************************************************//

var search = {};
var makeBg = {};

var selectedUrlCollection = [];
// var displayedIcons = [];


//for generate background section
makeBg.width = $(window).width();
makeBg.height = $(window).height();
var iconSize = 114;


var numPerRow = Math.ceil(makeBg.width / iconSize);

//define some global functions
var deleteIconWithUrl = function(url){
	// Get index of item by url	
	var removeIndex = selectexdUrlCollection.indexOf(url);
	// console.log(removeIndex)
	//And splice it out of the array
	selectedUrlCollection.splice(removeIndex,1);
	console.log(selectedUrlCollection);
}

var displayCollectionOnTable = function(){
	$.each(selectedUrlCollection,function(i,url){
		var html = "<div class='selectedIcons' data-url='" + url + "'><i class='fa fa-times'></i> <img src='"
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
	console.log(makeBg.width,makeBg.height)
	//-----------start a random search----------------!!!!!!!!!!!
	search.getIcons('space');

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

	var makeBgBtn = "<div class='generatorButtons'><button type='button' name ='gimmeBackground'>Tile Background</button>"
	makeBgBtn += "<button type='button' name ='clearAll'>Clear All Icons</button></div>"
	$('.iconTable .icons').append(makeBgBtn);

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
//             display background and functions              //
//***********************************************************//


//when click Map Background btn, init the background 
makeBg.init = function() {
	$("button[name='gimmeBackground']").click(function(){
		$('.displayPage').empty();
		// console.log(selectedUrlCollection)
		$('.resultPage').removeClass('hide')
		makeBg.createLayout();	
	})
}



//create selection and goback button
makeBg.createLayout = function(){

	makeBg.createCanvas();
	makeBg.goback();
	makeBg.retile();
}



makeBg.retile = function(){
	$("button[name='retile']").on('click',function(){
		makeBg.width = $('form').find(':selected').data('width');
		makeBg.height = $('form').find(':selected').data('height');
		console.log(makeBg.width,makeBg.height);
		makeBg.createCanvas();

	});
}

makeBg.save_btn = document.getElementById("saver"), 

makeBg.save_btn.addEventListener("click", function() {
//dataURL is a funciton that uses the stage.toDataURL method in konva    
makeBg.dataURL = stage.toDataURL({
        mimeType: "image/png",
        x: 0,
        y: 0,
        width: makeBg.width,
        height: makeBg.height
    }), 
	window.open(makeBg.dataURL)
});


makeBg.goback = function(){
	$("button[name='restart']").click(function(){
		location.reload();
	});
}

//-----------------------------------------------------------//
//------------------ all codes for canvas -------------------//
//-----------------------------------------------------------//

//variables
makeBg.images = [];

//create the canvas with selected icons
makeBg.createCanvas = function(){
	 stage = new Konva.Stage({
	  container: 'container',
	  width: makeBg.width,
	  height: makeBg.height
	});
	 layer = new Konva.Layer();

	 var imageFiles = selectedUrlCollection.map(function(fileUrl) {
	 	var imageToDL = fileUrl;
		var fileName = imageToDL.split('/');
	 	return $.ajax({
			url:'imagedownload.php',
			method: 'POST',
			data: {
				imageUrl: imageToDL,
				name: fileName[fileName.length - 1]
			}
		});
	 });

	 $.when.apply(null,imageFiles)
	 	.then(function() {
	 		makeBg.images = Array.prototype.slice.call(arguments);

	 		if(makeBg.images[1] === "success") {
	 			makeBg.images = [makeBg.images[0]];
	 		}
	 		else {
		 		makeBg.images = makeBg.images.map(function(tempUrl) {
		 			return tempUrl[0];
		 		});
	 		}

			for (var x = 0; x < numPerRow; x++)  {
			    for (var y = 0; y < Math.ceil(makeBg.height / iconSize); y++) {
					console.log(x,y)
					iconIndex = (y * numPerRow + x) % makeBg.images.length;

					makeBg.drawIcons(x,y,makeBg.images[iconIndex]);

					//if its the last icon in the even row,redrawing the last icon;
					if (y%2 == 1 && x === numPerRow - 1){
						console.log('gimme more!')
						makeBg.drawAIcon(0,y,-iconSize/2,makeBg.images[iconIndex]);
					}
				};
			}
	 	});

}

//add the switch to every even lines
makeBg.drawIcons = function(x,y,iconIndex){
    var shift = 0;
    if (y %2 == 1) {
	  shift =  iconSize / 2
	}
	//draw icons one by one
    makeBg.drawAIcon(x,y,shift,iconIndex);
};

//draw one icon
makeBg.drawAIcon = function(x,y,shift,icon){
	
	var imageObj = new Image();

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

	imageObj.src = icon;
	console.log(icon);
}

$(window).unload(function() {
	makeBg.images = makeBg.map(function(name) {
		return $.ajax({
			url: 'imagedelete.php',
			method: 'POST',
			data: {
				imageName: name
			},
			async: false
		});
	});	

});












