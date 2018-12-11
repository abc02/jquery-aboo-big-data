(function($){$.fn.printQr=function(options){var settings={generatorUrl:'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=',template:'{img}<div class="qrDescription"><span class="qrTitle">{title}</span><span class="qrLink">[{link}]</span></div>',shortener:null,divId:'qrCode',olId:'qrCodeList',aCounterClass:'qrCounter',counterName:'qrLinkCounter',generateStyles:true,printOnly:true,printCss:null,screenCss:null};if(options){$.extend(settings,options);}
if(this.length>0){$('body').append('<div id="'+settings.divId+'"><ol id="'+settings.olId+'"></ol></div>');if(settings.generateStyles){var stylesheetPrint=settings.printCss?settings.printCss:'<style type="text/css" media="'
+((settings.printOnly===true)?'print':'screen')+'">'
+'#'+settings.divId+'{'
+'display:block;'
+'}'
+'#qrCode li{clear:both;}'
+'#qrCode li img,#qrCode li .qrDescription{float:left;}'
+'#qrCode li .qrDescription span{display:block;}'
+'#'+settings.divId+' img{'
+'width:75px;'
+'height:75px;'
+'vertical-align:middle;'
+'}'
+'body{counter-reset : '+settings.counterName+';}'
+'a.'+settings.aCounterClass+', img.'+settings.aCounterClass+' {counter-increment:'+settings.counterName+'; }'
+'a.'+settings.aCounterClass+':after, img.'+settings.aCounterClass+':after{content:" [" counter('+settings.counterName+') "]";}'
+'</style>';var stylesheetScreen=settings.screenCss?settings.screenCss:'<style type="text/css" media="screen">'
+'#'+settings.divId+'{'
+'display:none;'
+'}'
+'</style>';$('head').append(stylesheetScreen);$('head').append(stylesheetPrint);}}
return this.each(function(counter,item){var a,link=null,title=null,url=null,newLi=null;a=$(this);if(this.tagName.toUpperCase()==='A'){link=this.href;}else if(this.tagName.toUpperCase()==='IMG'){link=this.src;}
if(link){a.addClass(settings.aCounterClass);title=a.attr('title');if(settings.shortener&&$.isFunction(settings.shortener)){settings.shortener(link,function(shortUrl){var url=settings.generatorUrl+encodeURIComponent(shortUrl?shortUrl:link);var newLi='<li data-sort="'+counter+'">'
+settings.template.replace(/{img}/,'<img src="'+url+'" />').replace(/{title}/,title).replace(/{link}/,link).replace(/{shortUrl}/,shortUrl?shortUrl:'')
+'</li>';if($('#'+settings.olId+' li').length===0){$('#'+settings.olId).append(newLi);}else{var isInserted=false;$('#'+settings.olId+' li').each(function(liCounter,liItem){if($(liItem).attr('data-sort')>counter){$(liItem).before(newLi);isInserted=true;return false;}});if(isInserted===false){$('#'+settings.olId).append(newLi);}}});}else{url=settings.generatorUrl+encodeURIComponent(link);newLi='<li data-sort="'+counter+'">'
+settings.template.replace(/{img}/,'<img src="'+url+'" />').replace(/{title}/,title).replace(/{link}/,link)
+'</li>';$('#'+settings.olId).append(newLi);}}});};})(jQuery);