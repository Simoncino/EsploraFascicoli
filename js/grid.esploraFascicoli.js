//EF = Esplora Fascicoli, serve per non andare in conflitto con altri javascript

/**gestione jsTree start *************************************************/
//Expected format of the node (there are no required fields)
//{
//  id          : "string" // required
//  parent      : "string" // required
//  text        : "string" // node text
//  icon        : "string" // string for custom
//  state       : {
//    opened    : boolean  // is the node open
//    disabled  : boolean  // is the node disabled
//    selected  : boolean  // is the node selected
//  },
//  li_attr     : {}  // attributes for the generated LI node
//  a_attr      : {}  // attributes for the generated A node
//}
function EF_initJsTree() {
	EF_toggleFileClose(
			  EF_toggleContenutoOpen(
					  EF_toggleEsploraOpen()));
	
	$('#EF_idJsTree').jstree({
		'core' : {
			'multiple' : false,
			'data' : {
				'cache' : false,
				//'url' : 'gestioneEsploraFascicoliAction.do?evento=getNodiById',
				'url' : 'json/allNodesIndentOk.json',
				'data' : function (node) {
					return { 'id' : node.id };
				}
			}	
			,'themes' : {
				'varian': 'small'	
			}
			,'check_callback':true
		}
		,"plugins" : [ "contextmenu" ]
        ,'contextmenu' : {
			'items': EF_getMenuNodo
		}               
		
	});
	
	$('#EF_idJsTree')
	  .on('select_node.jstree', function (e, data) {
		  if(data.selected.length != 1) return;
		  var nodoSelezionato = data.instance.get_node(data.selected[0]);
		  if(nodoSelezionato.data.tipoDoc != 'folder'){
			  EF_mostraFileInViewCartella(nodoSelezionato);
		  } else {
			  $('#EF_idJsTree').jstree(true).open_node(nodoSelezionato, EF_loadContenutoCartella);  
		  }
		  EF_creaMetaDati(data.selected[0]);
		  
//		  console.log("Padre: " + nodoSelezionato.parent + " -> Figlio: " + nodoSelezionato.id );
		  if(nodoSelezionato.parent && nodoSelezionato.parent != '#'){
			  $('#EF_idBackBtn').show();
		  } else {
			  $('#EF_idBackBtn').hide();
		  }
		  
	  });

	$('#EF_idJsTree')
	  .on('changed.jstree', function (e, data) {
		  EF_toggleFileClose(
				  EF_toggleContenutoOpen(
						  EF_toggleEsploraOpen()));
	  });
	
	$('#EF_idJsTree')
	  .on('open_node.jstree', function (e, data) {
		  /**nascondo i figli se non sono folder*/
		  var nodoSelezionato = data.node;
		  $.each($('#'+nodoSelezionato.id + ' li'), function( index, value ) {
			  var nodoFiglio = $('#EF_idJsTree').jstree(true).get_node($(this).attr('id'));
			  if(nodoFiglio.data.tipoDoc != 'folder'){
				  $('#'+nodoFiglio.id).hide();
			  }
		  });
	  });

	$('#EF_idJsTree')
		.on('close_node.jstree', function (e, data) {
			EF_toggleFileClose(
					EF_toggleContenutoOpen(
							EF_toggleEsploraOpen()));
		});

	$('#EF_idJsTree')
		.on('show_contextmenu.jstree', function (e, data) {
			$('.jstree-contextmenu').css('z-index','999');
			$('.jstree-contextmenu').css('font-size','12px');
			e.stopImmediatePropagation();
		});
}

function EF_getMenuNodo(nodo){
	var items = {
		mod_fasc : {
			'separator_after' : true,
			'label' : 'Dettaglio Fascicolo',
			'action' : function(data) {
				loadModificaPreferiti(nodo.id,nodo.text);
			}
		},
		refresh_singolo : {
			'separator_after' : false,
			'label' : 'Aggiorna Cartella',
			'action' : function(data) {
				$('#EF_idJsTree').jstree(true).refresh_node(nodo.id); 
			}
		}
	};
	return items;
}

/** gestione jsTree end ************************************************ */

/**FESTIONE PANNELLO CONTENUTI CARTELLE ... START ****************************/
function EF_loadContenutoCartella(nodo) {
	$('#EF_panelViewCartella_items').empty();
	var htmlDiv = '';
	if(nodo.children && nodo.children.length > 0){
		for(var i=0; i<nodo.children.length; i++){
			var item = nodo.children[i];
			var nodoChild = $('#EF_idJsTree').jstree(true).get_json(item);
//			var classeCss = EF_getClassIconaByNodo(nodoChild); //il bg-img non funziona su alcuni IE, sono costretto a mettere un'immagine
			var srcImage = EF_getClassIconaByNodo(nodoChild);
			
			if(nodoChild.data.tipoDoc == 'folder'){
//				htmlDiv += '<div onclick="EF_singleClickFolder(\''+nodoChild.id+'\')" ondblclick="EF_dblClickFolder(\''+nodoChild.id+'\')" class="EF_itemInContenuto '+classeCss+'" title="'+nodoChild.text+'" >';
				htmlDiv += '<div onclick="EF_singleClickFolder(\''+nodoChild.id+'\')" ondblclick="EF_dblClickFolder(\''+nodoChild.id+'\')" class="EF_itemInContenuto" title="'+nodoChild.text+'" >';
			} else {
//				htmlDiv += '<div onclick="EF_singleClickDocument(\''+nodoChild.id+'\')"  ondblclick="EF_dblClickDocument(\''+nodoChild.id+'\')" class="EF_itemInContenuto '+classeCss+'" title="'+nodoChild.text+'">';
				htmlDiv += '<div onclick="EF_singleClickDocument(\''+nodoChild.id+'\')"  ondblclick="EF_dblClickDocument(\''+nodoChild.id+'\')" class="EF_itemInContenuto" title="'+nodoChild.text+'">';
			}
			
			htmlDiv += '	<img src="'+srcImage+'" >';
			htmlDiv += '	<div class="EF_itemDescription" title="'+nodoChild.text+'">' + EF_accorciaNomeFile(nodoChild.text) + '</div>';
			htmlDiv += '</div>';
		}
	} else {
		htmlDiv += '<div style="width: 100%; height: 100%;position:relative; background:transparent;">';
		htmlDiv += '	<div class="EF_cartellaVuota">Cartella vuota</div>';
		htmlDiv += '</div>';
		EF_creaMetaDati(nodo.id);
	}
	
	$('#EF_panelViewCartella_items').html(htmlDiv);
}

function EF_accorciaDescrizione(stringa, dim) {
	if(stringa == 'null' || stringa == null)
		return '';
	
	if(!dim || dim < 1){
		dim = 45;
	}
	if(stringa && stringa.length > dim){
		var prefiX = stringa.substring(0,43);
		return '<span title="'+stringa+'" >' + prefiX + '...</span>' ;
	} else return stringa;
}

function EF_accorciaNomeFile(nome){
	if(nome && nome.length > 16){
		var prefiX = nome.substring(0,9);
		var suffix = nome.substring(nome.length - 3);
		return prefiX + "..." + suffix;
	} else return nome;
}

function EF_mostraFileInViewCartella(nodo) {
	$('#EF_panelViewCartella_items').empty();
	var htmlDiv = '';
	var classeCss = EF_getClassIconaByNodo(nodo);
	
	htmlDiv += '<div onclick="EF_singleClickDocument(\''+nodo.id+'\')" ondblclick="EF_dblClickDocument(\''+nodo.id+'\')" class="EF_itemInContenuto '+classeCss+'" title="'+nodo.text+'" >';
	htmlDiv += '	<div class="EF_itemDescription" title="'+nodo.text+'">' + EF_accorciaNomeFile(nodo.text) +'</div>';
	htmlDiv += '</div>';
	$('#EF_panelViewCartella_items').html(htmlDiv);
	
}

function EF_getClassIconaByNodo(nodo){
	var classeCss = '';
	var srcImage = '';
	if(nodo.data){
		switch (nodo.data.tipoDoc) {
		case 'folder':
//			classeCss = 'EF_itemBackFolder';
			srcImage = 'img/esplora_fascicoli/esplora_fascicoli/Folder64.png';
			break;
		case 'pdf':
//			classeCss = 'EF_itemBackPdf';
			srcImage = 'img/esplora_fascicoli/esplora_fascicoli/pdf64.png';
			break;
		case 'xls':
//			classeCss = 'EF_itemBackXls';
			srcImage = 'img/esplora_fascicoli/esplora_fascicoli/xls64.png';
			break;
		case 'xlsx':
//			classeCss = 'EF_itemBackXls';
			srcImage = 'img/esplora_fascicoli/esplora_fascicoli/xls64.png';
			break;
		case 'txt':
//			classeCss = 'EF_itemBackTxt';
			srcImage = 'img/esplora_fascicoli/esplora_fascicoli/txt64.png';
			break;
		case 'generic':
//			classeCss = 'EF_itemBackGeneric';
			srcImage = 'img/esplora_fascicoli/esplora_fascicoli/generic64.png';
			break;
		case 'doc':
//			classeCss = 'EF_itemBackDoc';
			srcImage = 'img/esplora_fascicoli/esplora_fascicoli/doc64.png';
			break;
		case 'docx':
//			classeCss = 'EF_itemBackDoc';
			srcImage = 'img/esplora_fascicoli/esplora_fascicoli/doc64.png';
			break;
		case 'p7m':
//			classeCss = 'EF_itemBackP7m';
			srcImage = 'img/esplora_fascicoli/esplora_fascicoli/p7m64.png';
			break;
		case 'protocollo':
//			classeCss = 'EF_itemBackProtocollo';
			srcImage = 'img/esplora_fascicoli/esplora_fascicoli/protocollo64.png';
			break;

		default:
//			classeCss = 'EF_itemBackGeneric';
			srcImage = 'img/esplora_fascicoli/esplora_fascicoli/generic64.png';
			break;
		}
	}
//	return classeCss;
	return srcImage;
}

function EF_singleClickFolder(nodoId) {
	EF_creaMetaDati(nodoId);
}

function EF_dblClickFolder(nodoId) {
	$('#EF_idJsTree').jstree(true).deselect_all();
	$('#EF_idJsTree').jstree(true).select_node(nodoId);
//	$('#EF_idJsTree').jstree(true).open_node(nodoId, EF_loadContenutoCartella);
	$('#EF_idBackBtn').show();
}

function EF_creaMetaDati(nodoId) {
	var nodo = $('#EF_idJsTree').jstree(true).get_json(nodoId);
	$('#EF_panelViewCartella_meta div').empty();
	
	var html = '';

	html += '<span class="EF_metaDato">';
	html += '<b>Tipologia di Fascicolo: </b>' + EF_accorciaDescrizione(nodo.data.originale.tipologia);
	html += '</span>';
	
//	html += '<span class="EF_metaDato">';
//	html += '<b>Identificativo: </b>' + nodo.id;
//	html += '</span>';

	html += '<span class="EF_metaDato">';
	html += '<b>Nome / Segnatura: </b>' + EF_accorciaDescrizione(nodo.text);
	html += '</span>';
	
	html += '<span class="EF_metaDato">';
	html += '<b>Descrizione: </b>' + EF_accorciaDescrizione(nodo.data.originale.descrizione);
	html += '</span>';
	
	html += '<span class="EF_metaDato">';
	html += '<b>Proprietario: </b>' + EF_accorciaDescrizione(nodo.data.originale.proprietario);
	html += '</span>';
	
	html += '<span class="EF_metaDato">';
	html += '<b>Codice Titolario: </b>' + EF_accorciaDescrizione(nodo.data.originale.titolario);
	html += '</span>';
	
	html += '<span class="EF_metaDato">';
	html += '<b>Collocazione: </b>' + EF_accorciaDescrizione(nodo.data.originale.collocazione);
	html += '</span>';
	
	html += '<span class="EF_metaDato">';
	html += '<b>Data Apertura: </b>' + EF_accorciaDescrizione(nodo.data.originale.dataCreazione);
	html += '</span>';
	
//	html += '<span class="EF_metaDato">';
//	html += '<b>Data Scadenza: </b>' + nodo.data.originale.;
//	html += '</span>';
//	
	html += '<span class="EF_metaDato">';
	html += '<b>Stato: </b>' + EF_accorciaDescrizione(nodo.data.originale.statoDescr);
	html += '</span>';
	
	//serve per fare un minimo di distanza dal bordo inferiore
	html += '<div class="EF_clear" style="height: 1em;width:100%;"></div>'; 
	
//	$('#EF_panelViewCartella_meta div').html(JSON.stringify(nodo));
	$('#EF_panelViewCartella_meta div').html(html);
}

function EF_chiudiFile() {
	var widthFile = $('#EF_panelViewFile').width(); 
	if(widthFile > 0){
		EF_toggleFileClose(
				  EF_toggleContenutoOpen(
						  EF_toggleEsploraOpen()));
	}//altrimenti non serve che lo chiuda
	
	return false;
}

function EF_back(){
	var nodiSelezionati = $('#EF_idJsTree').jstree(true).get_selected();
	
	if(nodiSelezionati.length == 1){
		var nodoId = nodiSelezionati[0];
		var nodo = $('#EF_idJsTree').jstree(true).get_node(nodoId);
		$('#EF_idJsTree').jstree(true).deselect_all();
		$('#EF_idJsTree').jstree(true).select_node(nodo.parent);
	}
	
	return false;
}

function EF_reloadFascicolo() {
	var nodiSelezionati = $('#EF_idJsTree').jstree(true).get_selected();
	
	if(nodiSelezionati.length == 1){
		var nodoId = nodiSelezionati[0];
//		var nodo = $('#EF_idJsTree').jstree(true).get_node(nodoId);
		$('#EF_idJsTree').jstree(true).deselect_all();
		$('#EF_idJsTree').jstree(true).load_node(nodoId);
		$('#EF_idJsTree').jstree(true).select_node(nodoId);
	}
}

function EF_apriFascicolo() {
	var nodiSelezionati = $('#EF_idJsTree').jstree(true).get_selected();
	
	if(nodiSelezionati.length == 1){
		var nodoId = nodiSelezionati[0];
		var nodo = $('#EF_idJsTree').jstree(true).get_node(nodoId);
		loadModificaPreferiti(nodo.id,nodo.text);
	}
}

/**FESTIONE PANNELLO CONTENUTI CARTELLE ... END ****************************/

/**FESTIONE PANNELLO DETTAGLIO ... START ****************************/
function EF_singleClickDocument(nodoId) {
	
	EF_creaMetaDati(nodoId);
//	$('#EF_panelViewCartella_meta div').empty();
}

function EF_dblClickDocument(nodoId) {
	$('#EF_panelViewCartella_meta div').empty();
	var nodo = $('#EF_idJsTree').jstree(true).get_json(nodoId);
	$('#EF_panelViewFile').width(2);
	EF_toggleEsploraClose(
			EF_toggleContenutoClose(
					EF_toggleFileOpen()));
	
	$('#EF_tabs').tabs({
		  active: 1
	});
	$("#EF_tabs").tabs( "refresh" );
	
	var allegati = nodo.data.originale.listDocument; 
	if(allegati && allegati.length > 0){
		$("#EF_tabs").tabs( "enable", 2 );
	} else {
		// Setter
		$("#EF_tabs").tabs( "option", "disabled", [2] );
	}
	
	$('#EF_tabs').on('tabsactivate', function (event, ui) {
//		console.log("event = " + JSON.stringify(event));
//		console.log("ui->newTab: 	" + JSON.stringify(ui.newTab));
//		console.log("ui->oldTab: 	" + JSON.stringify(ui.oldTab));
//		console.log("ui->newPanel: 	" + JSON.stringify(ui.newPanel));
//		console.log("ui->oldPanel: 	" + JSON.stringify(ui.oldPanel));
//		switch (ui.newPanel.selector) {
//			case '#EF_tab2':
//				$('#EF_tab2').empty();
//				$('#EF_tab2')
//					.append('<embed id="EF_panelViewFile_iframe" class="EF_panelViewFile_iframe" src="gestioneDocumentiAction.do?evento=scaricaDocumento&idFasc='+idFasc+'&idDocumento='+nodoId+'" />');
//				break;
//	
//			default:
//				break;
//		}
	});
	
	//tab1
	$('#EF_tab1').empty(); 
	EF_creaMetaDatiFile(nodoId);
	
	//tab2
	var idFasc = nodo.data.originale.parent; //in realtà non serve a niente alla query
	$('#EF_tab2').empty();
	$('#EF_tab2')
		.append('<embed style="width:95%; height:100%;" src="gestioneEsploraFascicoliAction.do?evento=getFile&idFasc='+idFasc+'&id='+nodoId+'" />');
	
	//tab3
	$('#EF_tab3_list').empty();
	$('#EF_tab3_embed').empty();
	EF_creaTabAllegati(nodoId);
	
}

function EF_creaMetaDatiFile(nodoId) {
	var nodo = $('#EF_idJsTree').jstree(true).get_json(nodoId);
	$('#EF_tab1').empty();
	
	var html = '';
	 
//	html += '<span class="EF_metaDato">';
//	html += '<b>Identificativo: </b>' + nodo.id;
//	html += '</span>';

	html += '<span class="EF_metaDato">';
	html += '<b>Nome / Segnatura: </b>' + EF_accorciaDescrizione(nodo.text);
	html += '</span>';
	
	html += '<span class="EF_metaDato">';
	html += '<b>Data Creazione: </b>' + EF_accorciaDescrizione(nodo.data.originale.dataCreazione);
	html += '</span>';
	
	html += '<span class="EF_metaDato">';
	html += '<b>Descrizione / Oggetto: </b>' + EF_accorciaDescrizione(nodo.data.originale.descrizione);
	html += '</span>';
	
	html += '<span class="EF_metaDato">';
	html += '<b>Tipologia: </b>' + EF_accorciaDescrizione(nodo.data.originale.tipologia);
	html += '</span>';
	
	html += '<span class="EF_metaDato">';
	html += '<b>Stato: </b>' + EF_accorciaDescrizione(nodo.data.originale.statoDescr);
	html += '</span>';

	
	//serve per fare un minimo di distanza dal bordo inferiore
	html += '<div class="EF_clear" style="height: 1em;width:100%;"></div>'; 
	
	//	$('#EF_panelViewFile_meta div').html(JSON.stringify(nodo));
//	$('#EF_panelViewFile_meta div').html(html);
	$('#EF_tab1').html(html);
	
}

function EF_creaTabAllegati(nodoId) {
	var nodo = $('#EF_idJsTree').jstree(true).get_json(nodoId);
	var allegati = nodo.data.originale.listDocument;
	
	var htmlAllegati = '';
	if(allegati && allegati.length > 0){
		var idFasc = nodo.data.originale.parent;
		for (var i = 0; i < allegati.length; i++) {
			var allegato = allegati[i];
			htmlAllegati += '<span class="EF_nomeAllegato" id="EF_'+allegato.id+'" >';
			htmlAllegati += '<a href="#" onclick="EF_loadAllegato(\''+allegato.id+'\', \''+idFasc+'\'); return false;" >' + EF_accorciaNomeFile(allegato.nome) + '</a>';
			htmlAllegati += '</span>';
		}
	} else {
		htmlAllegati = 'Non sono presenti allegati';
	}
	
	$('#EF_tab3_list').html(htmlAllegati);
}

function EF_loadAllegato(idAllegato, idFascicolo){
	
	$.each($('#EF_tab3_list span'), function (i, value) {
		$(this).removeClass("EF_itemSelected");
	});
	
	$('#EF_'+idAllegato).addClass("EF_itemSelected");
	
	$('#EF_tab3_embed').empty();
	$('#EF_tab3_embed')
		.append('<embed class="EF_tab3_embed" src="gestioneEsploraFascicoliAction.do?evento=getFile&idFasc='+idFascicolo+'&id='+idAllegato+'" />');
	
}

/**FESTIONE PANNELLO DETTAGLIO ... END ****************************/



/**gestione loading splash start *************************************************/
function EF_hideLoadingSplash() {
    $('#loading-splash').hide();
}
function EF_showLoadingSplash() {
    $('#loading-splash').show();
}
/**gestione loading splash end *************************************************/



/**gestione toggle start *************************************************/
function EF_toggleHorizontal(id, width) {
//	if(width){
		$('#'+id).animate({width: width});
//	} else {
//		$('#'+id).animate({width: 'toggle'});
//	}
}

//div ESPLORA
function EF_toggleEsplora(){
	var id = 'EF_panelJsTree';
	var widthWorkarea = $('#dialog-esploraFascicoli').width();
	var widthEsplora = $('#'+id).width();
	var width = (widthEsplora/widthWorkarea*100)>'6'?'5%':'40%';
	EF_toggleHorizontal(id, width);
}

function EF_toggleEsploraOpen(callbackFunction){
	var id = 'EF_panelJsTree';
	var width = '40%';
	EF_toggleHorizontal(id, width);
	
	if(callbackFunction){
		var func = (typeof callbackFunction == 'function') ? callbackFunction : new Function(callbackFunction);
		func();
	}
}
function EF_toggleEsploraClose(callbackFunction){
	var id = 'EF_panelJsTree';
	var width = '7%';
	EF_toggleHorizontal(id, width);
	
	if(callbackFunction){
		var func = (typeof callbackFunction == 'function') ? callbackFunction : new Function(callbackFunction);
		func();
	}
}

//div CONTENUTO
function EF_toggleContenuto(){
	var id = 'EF_panelViewCartella';
	var widthWorkarea = $('#dialog-esploraFascicoli').width();
	var widthContenuto = $('#'+id).width();
	var width = (widthContenuto/widthWorkarea*100)>'41'?'40%':'60%';
	EF_toggleHorizontal(id, width);
}
function EF_toggleContenutoOpen(callbackFunction){
	var id = 'EF_panelViewCartella';
	var width = '60%';
	EF_toggleHorizontal(id, width);
	
	if(callbackFunction){
		var func = (typeof callbackFunction == 'function') ? callbackFunction : new Function(callbackFunction);
		func();
	}
}
function EF_toggleContenutoClose(callbackFunction){
	var id = 'EF_panelViewCartella';
	var width = '38%';
	EF_toggleHorizontal(id, width);
	
	if(callbackFunction){
		var func = (typeof callbackFunction == 'function') ? callbackFunction : new Function(callbackFunction);
		func();
	}
}

//div FILE
function EF_toggleFile(){
	var id = 'EF_panelViewFile';
	var width = $('#'+id).width()>0?0:'55%';
	EF_toggleHorizontal(id, width);
}
function EF_toggleFileOpen(callbackFunction){
	var id = 'EF_panelViewFile';
	var width = '55%';
	$('#EF_panelViewFile').show();
	EF_toggleHorizontal(id, width);
	
	if(callbackFunction){
		var func = (typeof callbackFunction == 'function') ? callbackFunction : new Function(callbackFunction);
		func();
	}
}
function EF_toggleFileClose(callbackFunction){
	var id = 'EF_panelViewFile';
	var width = 0;
	EF_toggleHorizontal(id, width);
	$('#EF_panelViewFile').hide();
	$('#EF_panelViewFile_iframe').attr("src", "");
	
	if(callbackFunction){
		var func = (typeof callbackFunction == 'function') ? callbackFunction : new Function(callbackFunction);
		func();
	}
	  
}
/**gestione toggle end *************************************************/

/** Utility start*/
/** Utility end*/