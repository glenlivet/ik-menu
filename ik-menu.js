(function($){

	$.widget('ik.menu',{
		options: {
			data: []
		},
		_create: function(){
			//add wrapper class
			var $wrapper = this.element.addClass('ik-menu-wrapper');
			// ol
			var $topOL = $('<ol>').addClass('ik-menu-ol').appendTo($wrapper);
			// read data
			if(this.options.data){
				var dataLength = this.options.data.length;

				if(dataLength){
					//validate data
					//copy data
					this._data = $.extend({}, this.options.data);
					for(var i=0;i<dataLength;i++){
						this._handleTopData(this._data[i], $topOL);
					}
				}
			}

		},
		_handleTopData: function(data, $topOL){
			var that = this;
			var topLI = $('<li>').addClass('ik-menu-top-li').appendTo($topOL);
			var aTag = $('<a>').text(data.name).appendTo(topLI);
			var hasChildren = false;
			//append children ol
			if(!!data.children && !!data.children.length){
				hasChildren = true;
				//it is a set label
				var setOL = $('<ol>').addClass('ik-menu-set-ol')
					.addClass('ik-helper-hidden').appendTo(topLI);
				for(var i=0;i<data.children.length;i++){
					this._handleSetData(data.children[i], setOL);
				}

			}
			//add target to data
			data.target = topLI[0];
			//CLICK EVENT
			aTag.click(function(){
				if(hasChildren){
					//open/close the children div
					if(that._isOpenedSet(data.target)){
						//close
						that._closeSet(data.target);
					}	
					else {
						//open
						that._openSet(data.target);
					}
				} else {
					that._selectTopLabel(this);
				}
				if(that.options.onItemClick){
					that.options.onItemClick(data);
				}
			});
			
		},
		_isOpenedSet: function(target){
			var index = this._openedSet.indexOf(target);
			if(index === -1){
				return false;
			}else {
				return true;
			}

		},
		_openSet: function(target){
			var index = this._openedSet.indexOf(target);
			if(index === -1){
				//add it to the opened set
				this._openedSet.push(target);
			}
			$(target).children('a').next().removeClass('ik-helper-hidden');
		},
		_closeSet: function(target){
			var index = this._openedSet.indexOf(target);
			if(index !== -1){
				//remove it from the opened set.
				this._openedSet.splice(index, 1);
			}
			$(target).children('a').next().addClass('ik-helper-hidden');
		},
		_closeAllSetExcept: function(target){
			var index = this._openedSet.indexOf(target);
			for(var i=0;i<this._openedSet.length;i++){
				if(i != index){
					this._closeSet(this._openedSet[i]);
				}
			}
		},
		_activateSelect: function(target){
			this._deactivateSelect();
			this._activedLink = target;
			$(target).addClass('ik-state-active');
			//
			if($(target).hasClass('ik-menu-set-li')){
				$(target).parent().parent().addClass('ik-state-active');
			}
			
		},
		_deactivateSelect: function(){
			$(this._activedLink).removeClass('ik-state-active');
			if($(this._activedLink).hasClass('ik-menu-set-li')){
				$(this._activedLink).parent().parent().removeClass('ik-state-active');
			}
			this._activedLink = null;
		},
		_selectTopLabel: function(aTagEle, fromChild){
			if(!fromChild){
				this._activateSelect($(aTagEle).parent()[0]);
			}
			this._closeAllSetExcept($(aTagEle).parent()[0]);
		},
		_selectSetItem: function(aTagEle){
			this._selectTopLabel($(aTagEle).parent().parent().prev()[0], true);
			this._activateSelect($(aTagEle).parent()[0]);
		},
		_handleSetData: function(d, setOL){
			var that = this;
			var liTag = $('<li>').addClass('ik-menu-set-li').appendTo(setOL);
			var aTag = $('<a>').text(d.name).appendTo(liTag);
			//add target to data
			d.target = liTag[0];
			//CLICK EVENT
			aTag.click(function(){
				that._selectSetItem(this);
				if(that.options.onItemClick){
					that.options.onItemClick(d);
				}
			});

		},
		_data: [],
		_openedSet: [],
		_activedLink: null
	});

})(jQuery);