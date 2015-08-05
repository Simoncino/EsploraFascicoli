
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
	  try{
		 // return this.slice(0, str.length) == str;
		 // return this.substr(0, str.length) == str;
		  
		  return (this.indexOf(str) == 0);
	  }catch (e) {}
  };
}	




function ComboBox(
		name,				// NOME DEL COMBOBOX 
		actionToCall, 		// ACTION DA RICHIAMARE
		parameterNames, 	// NOME DEI PARAMETRI DA PASSARE
		parameters, 		// VALORI DEI PARAMETRI DA PASSARE
		firstOption,		// OPTION DI DEFAULT
		style, 				// EVENTUALE STILE DA APPLICARE
		comboToPopulate, 	// ID DELLA COMBOBOX DA POPOLARE ALL'EVENTO ONCHANGE
		keyId, 				// KEY DELLA COMBOBOX
		keyLabel, 			// LABEL DA INSERIRE
		father,				// ELEMENTO PADRE PER INSERIRE LA COMBOBOX
		functionToSelect
	) {
	
	
	
	
	this.name = name;
	this.actionToCall = actionToCall;
	this.parameterNames = parameterNames; 	
	this.parameters = parameters; 		
	this.firstOption = firstOption;
	this.style = style;
	this.comboToPopulate = comboToPopulate;
	this.keyId = keyId;
	this.keyLabel = keyLabel;
	this.father = father;
	this.functionToSelect = functionToSelect;
	

	
	var code = '<select id="' + name + '" name="' + name + '" disabled = "disabled"></select>';

	if (father != '') {
		$('#' + father).append(code);
	}
	if (actionToCall != '')
		addAction();
	
	if (firstOption != '')
		addFirstOption();

	if (style != '')
		$('#'+name).attr('style',style);

	if (functionToSelect != null || functionToSelect != '')
		$('#' + name).change(
				function() {eval(functionToSelect)});
	

	this.load = function load(action) {
		this.load(action, true);
	};
	
	this.load = function load(action, loadAsync)
	{
		$.ajax( {
				type : "GET",
				url : action,
				async : loadAsync,
				success : function(response) {
					$("#" + name).removeAttr('disabled');
					for (var i = 0; i < response.length; i++) {
						$("#" + name).append(
								'<option value="' + response[i][keyId] + '">'
								+ response[i][keyLabel]
								+ '</option>');
					}
					return response;
				
				},
			error : function(response) {
				alert("errore  Combobox " + name);
			}
		});
	};
	


	this.loadAndSetValue = function loadAndSetValue(action, value) {
		this.loadAndSetValue(action, value, true);
	};
	
	this.loadAndSetValue = function loadAndSetValue(action, value, loadAsync)
	{
		$.ajax( {
				type : "GET",
				url : action,
				async : loadAsync,
				success : function(response) {
					$("#" + name).removeAttr('disabled');
					for (var i = 0; i < response.length; i++) {
						$("#" + name).append(
										'<option value="' + response[i][keyId] + '" '+(response[i][keyId]==value ? ' selected="selected" ' : '')+'>'
												+ response[i][keyLabel]
												+ '</option>');
				}
				return response;
				
			},
			error : function(response) {
				alert("errore  Combobox " + name);
			}
		});
	};
	

	
	function addFirstOption() {
		var option = '<option value="-1">' + firstOption + '</option>';
		$('#' + name).append(option);
	}

	
	function addAction() {
		$('#' + name)
				.change(
						function() {carica();});
		
	}
	
	this.value = function value()
	{
		aux = $('#'+name).find('option:selected').val();
		if (aux == null || aux == '-1')
			aux = 'ALL';
		return aux;
	};
	
	this.text = function text()
	{
		aux = $('#'+name).find('option:selected').text();
		if (aux == null || aux == '-1' || aux == '' || aux == firstOption)
			aux = 'ALL';
		return aux;
	};
	
	
	this.setValue = function setValue(valore)
	{
		$("#" + name)
		.children()
		.each(
			function(i)
			{
				
				if (this.value == valore)
				{
						$('#'+name)[0].selectedIndex = i;
						if (comboToPopulate != null)
							carica();
				}
			}
		);	
		
//		var select = $("#" + name);
//		alert("select: " + select);
//		
//		var option = $(select).find('option[value="' + value +'"]');
//		alert("option: " + option.val());
//		
//		alert("valore: " + $('#' + name + ' option[value="' + value + '"]').val());
//		$("#" + name + " option[value='" + value + "']").attr("selected", "selected");
//		//$("#" + name ).find('option:contains(' + value + ')').attr('selected','selected');
	};
	
	function clean(combo)
	{
		$("#" + combo.name)
		.children().eq(0).nextAll()
		.remove();
		$("#" + combo.name).attr("disabled","disabled");
		if (combo.comboToPopulate != null)
			clean(combo.comboToPopulate);
	}
	
	this.reset = function () {
		clean(this);
	};
	
	function carica()
	{

		var action = actionToCall;
		
		if (parameterNames.length > 0) {
			if(action.indexOf("?") == -1 ) {
				action += '?';
			} else {
				action += '&';
			}

			for ( var i = 0; i < parameterNames.length; i++) {
				parameter = '';
				action += parameterNames[i] + '=';
				var par = '';
				// VALUE DEL COMBOBOX
				if ((/cmb:/).test(parameters[i])) {
					par = parameters[i].substr(4);
					parameter = $('#'+par).find(
							'option:selected').val();
				} 
				else if ((/cmbTxt:/).test(parameters[i])) 
				{
						par = parameters[i].substr(7);
						parameter = $('#'+par).find(
								'option:selected').text();
				} 
				else
					//parameter = eval(parameters[i]);
					parameter = parameters[i];

				action += parameter;
			
				if (i < parameterNames.length - 1)
					action += '&';
			}
		}
		$
				.ajax({
					type : "POST",

					url : action,
					async : false,
					success : function(response) {
						clean(comboToPopulate);
						$("#" + comboToPopulate.name).removeAttr('disabled');
						for ( var i = 0; i < response.length; i++) {
							
							$("#" + comboToPopulate.name)
									.append(
											'<option value="'
													+ response[i][comboToPopulate.keyId]
													+ '">'
													+ response[i][comboToPopulate.keyLabel]
													+ '</option>');
						}
					},
					error : function(html) {
						alert("Errore reperimento dati");
					}
				});

	
	}
	
}

/**
 * SERVE A MOSTRARE L'ESITO CON UN MESSAGGIO A VIDEO DOPO AVER COMPIUTO UN'OPERAZIONE CON UN WIDGET
 * @param nomeWidget 	Se closeWidget=true deve essere specificato il nome del widget chiamante altrimenti (closeWidget=false) si può dare un nome qualsiasi
 * @param esito			e' il messaggio che deve essere mostrato
 * @param closeWidget	TRUE se il widget indicato con nomeWidget deve essere chiuso dopo aver mostrato il messaggio, FALSE se deve rimanere aperto
 * @return
 */
function visualizzaEsito(nomeWidget, esito, closeWidget){
	
	var nome_modal_esito='visEsitoD_' + nomeWidget;
	var html_cont='<div><label>'+esito+'</label></div>';
	html_cont+='<br><br><p align="center"><button title="Chiudi" id="closeButt_ID123" onclick="chiuditi('+"'"+nome_modal_esito+"'"+');">Chiudi</button></p>';
	
	var jDialogInfoEsito = create_widget_modal_dialog(nome_modal_esito,{
		widgetContent: html_cont,
		height: 120,
		width: 305,
		minWidth:285, 
		minHeight: 50,
		title: "Esito",
		resizable: true,
		resize: function(event, ui) {
		
		}
	});

	jDialogInfoEsito.parent().find('.ui-dialog-content').html(html_cont);
	jDialogInfoEsito.dialog("moveToTop");
//	$("div[aria-describedby*='dialog-" + nome_modal_esito+"']").attr('style','z-index: 39999');
//	$("div[aria-describedby*='dialog-" + nome_modal_esito+"']").dialog('option', 'position', 'center');
	 //$("#dialog-" + nome_modal_esito).attr('style','z-index: 99999');
	if (closeWidget == true){
		close_widget(nomeWidget);
	}  
}

function chiuditi(nome_modal_esito){
	var jDialog = $("#dialog-" + nome_modal_esito);
//	if (jDialog.length > 0) {
		jDialog.dialog("close");
		jDialog.remove();
	//}
} 
/**
 * SERVE A MOSTRARE L'ESITO CON UN MESSAGGIO A VIDEO DOPO AVER COMPIUTO UN'OPERAZIONE CON UN WIDGET
 * @param nomeWidget 	Se closeWidget=true deve essere specificato il nome del widget chiamante altrimenti (closeWidget=false) si può dare un nome qualsiasi
 * @param esito			e' il messaggio che deve essere mostrato
 * @param closeWidget	TRUE se il widget indicato con nomeWidget deve essere chiuso dopo aver mostrato il messaggio, FALSE se deve rimanere aperto
 * @return
 */
function visualizzaMessaggio(nomeWidget, messaggio, textForYes, actionForYes, textForNo, actionForNo){
	
	nome_modal_esito='visualizzaEsito' + nomeWidget;
	html_cont='<div><label>'+messaggio+'</label></div>';
	html_cont+='<br><br><p align="center"><button title="Si" id="yesButton">' + textForYes + '</button><button id="noButton">' + textForNo + '</button></p>';
	
	jDialogInfoEsito = create_widget_modal_dialog(nome_modal_esito,{
		widgetContent: html_cont,
		height: 150,
		width: 300,
		minWidth:300, 
		minHeight: 150,
		title: "Messaggio",
		resizable: true,
		resize: function(event, ui) {
		
		}
	});
	
	jDialogInfoEsito.parent().find('.ui-dialog-content').html(html_cont);
	//jDialogInfoEsito.parent().css('z-index', 15000);
	jDialogInfoEsito.parent().dialog("moveToTop");
	
		
    $('#yesButton').click(function () {  
    	if (actionForYes != null)
    		eval(actionForYes);
    	close_widget(nome_modal_esito);
    });
    
    $('#noButton').click(function () {     
    	if (actionForNo != null)
        	eval(actionForNo);
    	close_widget(nome_modal_esito);
    });
    
}

function openWidget(widgetName, description, functionToCall, args, actualWidget, idFascDaAprire, msgInfo)
{
//	alert("openWidget")
	try{
		var jDialog = $("#" + widgetName);
		var widget = {
			descrizione : description,
			codice : widgetName
		};
		handler = function() {
			if (create_widget(widget,idFascDaAprire)) {
				workareasMap[currentWorkareaId].widgets.push(widget);
				if (functionToCall!=null)
					window[functionToCall](args);
			}
		};
		// Already open?
		if (1 == jDialog.length) { // yes
			if (jDialog.dialog("isOpen") == true) {
				jDialog.dialog("moveToTop");
			} else {
				jDialog.remove();
				include_javascript_file("grid." + widgetName + ".js");
				setTimeout(handler, 400);
			}
		} else if (0 == jDialog.length) { // no
			include_javascript_file("js/jqgrid/gai/grids/grid." + widgetName + ".js");
			setTimeout(handler, 400);
		}
		
		if (actualWidget != null)
			close_widget(actualWidget);	
		
	//	alert(msgInfo);
		if(msgInfo !=null && msgInfo !=""){
			visualizzaEsito(widgetName, msgInfo, actualWidget);
		}
	
	}catch (e) {
			alert(e.toString());
	}
}



// INPUT TEXT AUTOCOMPLETE 

function TextAutoComplete(
		name,				// NOME DEL TEXT
		actionToCall, 		// ACTION DA RICHIAMARE PER LA FIGLIA
		parameterNames, 	// NOME DEI PARAMETRI DA PASSARE ALLA ACTTION FIGLIA
		parameters, 		// VALORI DEI PARAMETRI DA PASSARE ALLA ACTTION FIGLIA
		style, 				// EVENTUALE STILE DA APPLICARE
		inputTextToPopulate,// ID DELLA TEXT DA POPOLARE ALLA SELEZIONE
		keyId, 				// KEY DELLA SELEZIONE
		keyLabel, 			// LABEL DA INSERIRE
		father,				// ELEMENTO PADRE PER INSERIRE LA TEXT
		typeToPopulate,		// auto => Autocomplete, combo => ComboBox
		functionToSelect,	// e' la funzione che viene lanciata dopo che e' stata selezionato un valore
		enabled,			// Disabled by default
		functionToClean		// e' la funzione che viene lanciata dopo che e' stato resettato il valore selezionato
	) {
	
	this.elenco = null;
	this.arrayResponse = null;
	this.name = name;
	this.actionToCall = actionToCall;
	this.parameterNames = parameterNames; 	
	this.parameters = parameters; 		
	this.style = style;
	this.inputTextToPopulate = inputTextToPopulate;
	this.keyId = keyId;
	this.keyLabel = keyLabel;
	this.father = father;
	if (typeToPopulate == null)
		this.typeToPopulate = 'auto';
	else
		this.typeToPopulate = typeToPopulate;
	this.functionToSelect = functionToSelect;
	this.functionToClean = functionToClean;
	this.enabled = enabled;
	
	if (style != '')
		$('#'+name).attr('style',style);

	var code = '';
	if (this.enabled != null)
		code = '<input type="text" 	 id="' + name + '" 	style="' + style + '"/>'
		 	 + '<input type="hidden" id="' + name + '-id" name="' + name + '-id"/>';
	else	
		code = '<input type="text" 	 id="' + name + '" 	disabled = "disabled" style="' + style + '"/>'
			 + '<input type="hidden" id="' + name + '-id" name="' + name + '-id"/>';

	if (father != '') {
		$('#' + father).append(code);
	}
	
	function clean(combo)
	{
		$("#" + combo.name)
		.children().eq(0).nextAll()
		.remove();
		
		if (combo.enabled == null)
			$("#" + combo.name).attr("disabled","disabled");
		if (combo.comboToPopulate != null)
			clean(combo.comboToPopulate);
	}

	
	function cleanInputText(inputText)
	{
		$("#" + inputText.name).val("");
		$("#" + inputText.name + "-id").val("");
		if (inputText.enabled == null)
			$("#" + inputText.name).attr("disabled","disabled");
		if (inputText.inputTextToPopulate != null)
			cleanInputText(inputText.inputTextToPopulate);
	}
	
	this.caricaInputText = function caricaInputText(){

		var action = actionToCall;
		var selected = false;
		
		if (parameterNames.length > 0) {
			if(action.indexOf("?") == -1 ) {
				action += '?';
			} else {
				action += '&';
			}

			for ( var i = 0; i < parameterNames.length; i++) {
				parameter = '';
				action += parameterNames[i] + '=';
				var par = '';
				// VALUE DELLA TEXT
				if ((/inp:/).test(parameters[i])) {
					par = parameters[i].substr(4);
					parameter = $('#'+par+"-id").val();
				} 
				else if ((/inpTxt:/).test(parameters[i])) {
						par = parameters[i].substr(7);
						parameter = $('#'+par).val();
				} 
				else
					//parameter = eval(parameters[i]);
					parameter = parameters[i];

				action += parameter;
			
				if (i < parameterNames.length - 1)
					action += '&';
			}
		}
		if (this.typeToPopulate == 'auto')
		//alert(action);
		$.ajax({
					type : "POST",
					url : action,
					async : true,
					success : function(response) {
						cleanInputText(inputTextToPopulate);
						$("#" + inputTextToPopulate.name).removeAttr('disabled');
						inputTextToPopulate.arrayResponse = response;
						elenco = new Array();
						for (i = 0; i < response.length; i++){ 
							elenco.push(response[i][keyLabel]);
						}
						$("#" + inputTextToPopulate.name).autocomplete( {
							source : elenco,
							minLenght : 1,
							select : function(event, ui) {
								$("#" + inputTextToPopulate.name).val(ui.item.label);
								var id = getIDFromLabel(response, ui.item.label, inputTextToPopulate.keyId, inputTextToPopulate.keyLabel);
								$("#" + inputTextToPopulate.name +"-id").val(id);
								if (inputTextToPopulate.actionToCall != '')
									inputTextToPopulate.caricaInputText();
								if(inputTextToPopulate.functionToSelect!=null)
								{
									eval(inputTextToPopulate.functionToSelect);
								}
								selected = true;
							}
						});
						$("#" + inputTextToPopulate.name).keyup(function() {
								var text = $("#"+inputTextToPopulate.name).val();
								if(text==""){
									$("#" + inputTextToPopulate.name +"-id").val("");
									if(inputTextToPopulate.inputTextToPopulate!=null)
										cleanInputText(inputTextToPopulate.inputTextToPopulate);
								}else{
									var id = getIDFromLabel(response, text, inputTextToPopulate.keyId, inputTextToPopulate.keyLabel);
									$("#" + inputTextToPopulate.name +"-id").val(id);
									if(id!=-1 && id!=-2 && inputTextToPopulate.actionToCall != '') {
										inputTextToPopulate.caricaInputText();
										if(inputTextToPopulate.functionToSelect!=null)
											eval(inputTextToPopulate.functionToSelect);
									} else {
										if(inputTextToPopulate.inputTextToPopulate!=null)
											cleanInputText(inputTextToPopulate.inputTextToPopulate);
									}
								}
							}
						);
						
					},
					error : function(html) {
						alert("Errore reperimento dati");
					}
				});

		else if (this.typeToPopulate == 'combo')
		{
			$.ajax({
				type : "POST",

				url : action,
				async : true,
				success : function(response) {
					if (functionToSelect != null){
						eval(functionToSelect);
					}
					clean(inputTextToPopulate);
					$("#" + inputTextToPopulate.name).removeAttr('disabled');
					for ( var i = 0; i < response.length; i++) {
						$("#" + inputTextToPopulate.name)
								.append(
										'<option value= '
												+ response[i][inputTextToPopulate.keyId]
												+ ' >'
												+ response[i][inputTextToPopulate.keyLabel]
												+ '</option>');
					}
				},
				error : function(html) {
					alert("Errore reperimento dati");
				}
			});
			
		}
	};
	

	
	this.reset = function () {
		clean(this);
	};
	
	this.resetAutoCmpl = function () {
		cleanInputText(this);
	};
	
	this.load = function load(obj, action) {
		this.load(obj, action, true);
	};
	
	this.load = function load(obj, action, loadAsync)
	{
		
		var selected = false;
		
		
		$("#" + obj.name).css("background", "url('styles/css/uploader/loading.gif') no-repeat center left");
		
		$.ajax( {
				type : "GET",
				url : action,
				async : loadAsync,
				success : function(response) {
					arrayResponse = response;
					$("#" + name).removeAttr('disabled');
					elenco = new Array();
					for (i = 0; i < response.length; i++){ 
						elenco.push(response[i][keyLabel]);
					}
					$("#" + name).autocomplete( {
						source : elenco,
						minLenght : 1,
						select : function(event, ui) {
							$("#" + name).val(ui.item.label);
							var id = getIDFromLabel(response, ui.item.label, keyId, keyLabel);
							$("#" + name +"-id").val(id);
							if (actionToCall != '')
								obj.caricaInputText();
							if(obj.functionToSelect!=null)
								eval(obj.functionToSelect);
							selected = true;
						}
					});
					$("#" + name).keyup(function() {
							var text = $("#" + name).val();
							if(text==""){
								$("#" + name +"-id").val("");
								if(obj.inputTextToPopulate!=null){
									cleanInputText(obj.inputTextToPopulate);
									if (obj.functionToClean != null)
										eval(obj.functionToClean);
								}
							}else{
								var id = getIDFromLabel(response, text, keyId, keyLabel);
								$("#" + name +"-id").val(id);
								if(id!=-1 && id!=-2 && actionToCall != '') {
									obj.caricaInputText();
									if(obj.functionToSelect!=null)
										eval(obj.functionToSelect);
								} else {
									if(obj.inputTextToPopulate!=null){
										cleanInputText(obj.inputTextToPopulate);
										if (obj.functionToClean != null)
											eval(obj.functionToClean);
									}
								}
							}
						}
					);
				$("#" + obj.name).css("background", "");
				return response;
				
			},
			error : function(response) {
				alert("errore - TextAutoComplete: " + name);
			}
		});
	};
	
	this.value = function value()
	{
		aux = $('#'+name+"-id").val();
		if (aux == null || aux == '-1')
			aux = '';
		return aux;
	};
	
	this.text = function text()
	{
		aux = $('#'+name).val();
		if (aux == null || aux == '-1' || aux == '' )
			aux = '';
		return aux;
	};
	
	function getIDFromLabel(jsonArrayD, label, keyId, keyLabel){
		idSel='-2';
		lab=label.split(' ');
		for (j = 0; j < jsonArrayD.length; j++) {
			parag=jsonArrayD[j][keyLabel].split(' ');
			if(parag.length==lab.length){
				uguali=true;
				for(i=0; i<parag.length; i++){
					if(parag[i].toUpperCase()!=lab[i].toUpperCase()){
						uguali=false;
					}
				}
				if(uguali){
					idSel=jsonArrayD[j][keyId];
					break;
				}
			}
		}
		return idSel;
	}
	
	this.setValue = function setValue(id) {
		for (i = 0; i < arrayResponse.length; i++){ 
			if (id == arrayResponse[i][keyId]){
				$('#' + name).val(arrayResponse[i][keyLabel]);
				return;
			}
		}
	};
	
	
}

// Questo metodo è generalmente utilizzato alla seleziona di una data tramite datepicker
// dateText è il valore (testo) del campo appena modificato
// objDataDa è l'ogetto 'data da'
// objDataA è l'oggetto 'data a'
function controlloData(dateText, objDataDa, objDataA){
	
	dataDa 	= $.datepicker.parseDate("dd/mm/yy", objDataDa.val());
	dataA 	= $.datepicker.parseDate("dd/mm/yy", objDataA.val());
	
	if (dataDa != null && dataA != null) {
		if(dataA.getTime() < dataDa.getTime()) {
			if (dateText == objDataDa.val()) {
				alert("La data iniziale deve essere minore di quella finale");
				objDataDa.val("");
			} else {
				alert("La data finale deve essere maggiore di quella iniziale");
				objDataA.val("");
			}
		}
	}
}

/**
 * Scrive negli appositi campi i valori di:
 * CODICE FISCALE, 
 * NOME UTENTE,
 * COGNOME UTENTE
 * La funzione contiene uno switch che distingue attraverso la variabile "fromWidget" 
 * il widget da cui è stato chiamato e di conseguenza riempi i campi specifici del widget chiamante.
 * 
 * @param idSoo
 * @param fromWidget
 * @return
 */
function cercaUtentiHRWidgetUtils(idSoo, fromWidget)
{	
	var nomeWidget = 'cercaUtentiHRwidgetUtils';
	var html_widget_appo = '';
			
	var html_widget = 
		'<div id="'+nomeWidget+'" class="divReplace" style="padding: 5px; text-align:center;" >' +
		'	<table style="text-align:left;">' +
		'		<tr>' +
		'			<td>' +
		'				<b>Cognome&nbsp;</b>' +
		'			</td>' +
		'			<td>' +
		'				<input type="text" size="50" id="idUtenteHRwidgetUtils">' +
		'			</td>';
		if (idSoo==getIdSoByCodiceMercato('ENT'))
		{
			html_widget_appo = 
		    '			<td>' +
			'				<input name="flagAllUffici" id="flagAllUffici" type="checkbox">Cerca su Tutti gli Uffici</input>' +
			'			</td>' +
			'		</tr>';
			html_widget = html_widget + html_widget_appo;
		}
		html_widget = html_widget +
		'		<tr>' +
		'			<td colspan="2">' +
		'				<input type="button" value="Cerca" id="buttonCercaUtentiHRwidgetUtils">' +
		'			</td>' +
		'		</tr>' +
		'	</table>' +
		'	<div id="p'+nomeWidget+'"></div>' + '<table id="t'+nomeWidget+'"><table >' +
		'' +
		'</div>';
	
		var jDialog = create_widget_modal_dialog(nomeWidget, {
		widgetContent: html_widget,
		title : "Ricerca Utenti HR",
		minWidth : 720,
		minHeight : 300,
		width: 720, 
		heigth: 300,
		resizable: false//,
		/*
		resize: function(event, ui) {
			var widgetContent = $(this);
			var gridElenco = widgetContent.find("#"+nomeWidget);
			gridElenco.setGridWidth(widgetContent.width()-30, true);
			gridElenco.setGridHeight(widgetContent.height()-200, true);
		}*/
	});
		
	$('#buttonCercaUtentiHRwidgetUtils').click(
		function () {
			var idTabella = "#t"+nomeWidget;
			var params = "?idSo=" + idSoo + "&utenteRicerca=" + $("#idUtenteHRwidgetUtils").val()  + "&operation=comboUtenteWsHr&flagAllUffici=" + $('input[name=flagAllUffici]').is(':checked');
			var url =contextRoot + '/loadComboSpostamentoAction.do' + params;

			jQuery(idTabella).jqGrid('GridUnload');
			
			jQuery(idTabella)
			 .jqGrid({
				 gridComplete : function() {
			        if ($(this).attr ('initialized') == undefined) {
			          $(this).attr ('initialized', true);
			          $('#gbox_' + nomeWidget).draggable ({
			           containment: "parent",
			           handle:"div.ui-jqgrid-titlebar",
			           start: function () {
			            $(".ui-jqgrid").removeClass ('ui-jqgrid-active');
			            $(this).addClass ('ui-jqgrid-active');
			           }
			          }).click (function () {
			            $(".ui-jqgrid").removeClass ('ui-jqgrid-active');
			            $(this).addClass ('ui-jqgrid-active');
			          }).css ('position', 'absolute');
			        } 
			        $('#dialog-'+nomeWidget).trigger("dialogresize");
				},
			    url: url,
			    datatype: "json",
			    jsonReader : { root: "rows", page: "page", total: "total", records: "records", repeatitems: false, id: "0"},
			    colNames:['Codice Fiscale', 'Cognome', 'Nome', 'Data Nascita', 'Ufficio/Cdr'],
			    colModel:[
				     {name:'codiceFiscale',index:'codiceFiscale',editable:false, align:'center'},
				     {name:'cognome',index:'cognome',editable:false, align:'center'},
				     {name:'nome',index:'nome',editable:false, align:'center'},
				     {name:'dataNascita',index:'dataNascita',editable:false, align:'center'},
				     {name:'codiceCicsCdr',index:'codiceCicsCdr',editable:false, align:'center'}
			    ],
			    rowNum:20,
			    rowList:[20,30,40],
			    pager: '#p'+nomeWidget,
			    sortorder: "asc",
			    loadonce: true,
			    viewrecords: true,
			    //minWidth : 680,
				//minHeight : 510,
				width: 680, 
				heigth:"auto",
				resizable: false,
				/*
				resize: function(event, ui) {
					var widgetContent = $(this);
					var gridElenco = widgetContent.find("#"+nomeWidgetDettaglioAssetHW);
					gridElenco.setGridWidth(widgetContent.width()-30, true);
					gridElenco.setGridHeight(widgetContent.height()-300, true);
			    },
			    */
				ondblClickRow: function(rowid){
			    	var rowData = new Array();
			    	var denomi= jQuery(this).getRowData(rowid);
			    	
			    	switch (fromWidget) {
					case 'spostamentoassethw':
						$("#inputCFSpostamentoAssetHW").val(denomi['codiceFiscale']);
				    	$("#inputCognomeSpostamentoAssetHW").val(denomi['cognome']);
				    	$("#inputNomeSpostamentoAssetHW").val(denomi['nome']);
						break;
					case 'validaspostamentoassethw':
						$("#inputCFVSAHW").val(denomi['codiceFiscale']);
				    	$("#inputCognomeVSAHW").val(denomi['cognome']);
				    	$("#inputNomeVSAHW").val(denomi['nome']);
						break;
					case 'ricercamodificadatiasset':
				    	$("#CognomeRicDatiAsset").val(denomi['cognome']);
				    	$("#NomeRicDatiAsset").val(denomi['nome']);
				    	break;
					case 'funzioniaccessoriemodificaasset':
						$("#CFModificaDatiAsset").val(denomi['codiceFiscale']);
				    	$("#CognomeModificaDatiAsset").val(denomi['cognome']);
				    	$("#NomeModificaDatiAsset").val(denomi['nome']);
				    	break;
				    	
					default:
						break;
					}
			    	// DA PROVARE IN SOGEI (anomalia 2580)
			    	close_widget(nomeWidget);
			    	
			    }
			    
			 });
		}
	);
}

/**
 * Restituisce il contesto dell'utente loggato
 * @return
 */
function getContestoUtLoggatoWU() {

	$.ajax( {
			type : "GET",
			url : contextRoot + '/viewContestoAction.do',
			async : false,
			success : function(response) {		
				var elenco = new Array();				
				for (i = 0; i < response.length; i++) {
					contesto = response[i].descrizioneContesto;
				}
			},
			error : function(response) {
				alert("errore get contesto");
			}
	});
	return contesto;
}
 /**
  * Restituisce la lista degli uffici competenza dell'utente loggato
  * @return
  */
 function getUffCompetenzaUtLoggatoWU() {

 	$.ajax( {
 			type : "GET",
 			url : contextRoot + '/viewUffCompetenzaAction.do',
 			
 			async : false,
 			success : function(response) {		
 				contesto=response;
 			},
 			error : function(response) {
 				alert("errore get uffici");
 			}
 	});
 	return contesto;
 }

/**
 * Restituisce il JSON del bean UIUtente loggato
 * @return
 */
function getUtenteJsonLoggatoWU() {
	var utente = null;
	$.ajax( {
			type : "GET",
			url : contextRoot + '/getUtenteJsonLoggatoAction.do',
			
			async : false,
			success : function(response) {		
				utente=response;
//				alert("Questo è il json\n"+JSON.stringify(utente));
			},
			error : function(response) {
				alert("errore caricamento dati utente");
			}
	});
	return utente;
}



function notNullEmptyOrAll(val){
	return (val!=null && val!='' && val!='ALL');
}