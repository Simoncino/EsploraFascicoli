<html>
<head>
<style type="text/css">
	.EF_Conteiner{
		height: 560px;
		width: 100%;
		border: 1px solid #aaaaaa;
		font-size: 12px;
	}
	.EF_panelJsTree{
		width: 40%;
		height: 100%;
		float: left;
		overflow: auto;
		background: url(styles/css/img/esplora_fascicoli/sfumaturaSX.png) top right repeat-y;
		font-size: 12px;
	}
	.EF_panelViewCartella{
		width: 60%;
		height: 100%;
		float: left;
		
	}
	.EF_panelViewCartella_btns {
		text-align: right;
		height: 30px;
		border-bottom: 1px solid #aaaaaa;
		padding: 4px;
	}
	.EF_panelViewCartella_items {
		height: 400px;
		overflow: auto;
		overflow-x: hidden;
		border-bottom: 1px solid #aaaaaa;
	}
	.EF_panelViewCartella_meta {
		padding: 10px;
		height: 100px;
		overflow: auto;
		overflow-x: hidden;
	}
	.EF_panelViewFile{
		width: 0;
		height: 100%;
		float: left;
		/*background: url(styles/css/img/esplora_fascicoli/sfumaturaSX.png) top right repeat-y;*/
	}
	
	.EF_clear{
		width: 0.01em;
		height: 0.01em;
		clear: both;
	}
	
	.EF_itemInContenuto{
		width: 120px;
		height: 110px;
		text-align: center;
		font-size: 12px;
		position: relative;
		margin: 1em;
		float: left;
		background-color: #F6F6F6;
	}
	
	.EF_itemInContenuto img{
		margin: 10px;
		border: 0px;
	}

	.EF_itemBackFolder{
		background: url(styles/css/img/esplora_fascicoli/Folder64.png) #F6F6F6 no-repeat;
		background-position:center 10px;
	}
	.EF_itemBackDoc{
		background: url(styles/css/img/esplora_fascicoli/doc64.png) #F6F6F6 no-repeat;
		background-position:center 10px;
	}
	.EF_itemBackXls{
		background: url(styles/css/img/esplora_fascicoli/xls64.png) #F6F6F6 no-repeat;
		background-position:center 10px;
	}
	.EF_itemBackPdf{
		background: url(styles/css/img/esplora_fascicoli/pdf64.png) #F6F6F6 no-repeat;
		background-position:center 10px;
	}
	.EF_itemBackTxt{
		background: url(styles/css/img/esplora_fascicoli/txt64.png) #F6F6F6 no-repeat;
		background-position:center 10px;
	}
	.EF_itemBackP7m{
		background: url(styles/css/img/esplora_fascicoli/p7m64.png) #F6F6F6 no-repeat;
		background-position:center 10px;
	}
	.EF_itemBackGeneric{
		background: url(styles/css/img/esplora_fascicoli/generic64.png) #F6F6F6 no-repeat;
		background-position:center 10px;
	}
	.EF_itemBackProtocollo{
		background: url(styles/css/img/esplora_fascicoli/protocollo64.png) #F6F6F6 no-repeat;
		background-position:center 10px;
	}
	
	.EF_itemInContenuto:HOVER{
		/*background: url(styles/css/img/esplora_fascicoli/Folder64.png) #F6F6F6 no-repeat;*/
		background-color: #e7f4f9;
		background-position:center 10px;
	}
	
	.EF_itemDescription{
		width: 100%;
		text-align: center;
		position: absolute;
	    bottom: 5px;
	}
	.EF_cartellaVuota{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #F6F6F6; /*grigio*/
		padding: 2em;
	}
	
	.EF_azioniBox{
		clear: both;
		width: 100%;
		padding: 0.5em;
		border-bottom: 1px solid #aaaaaa;
	}
	
	.EF_itemSelected{
		background-color: #e7f4f9;
	}
	
/**	GESTIONE PANEL DOCUMENTO/META/ALLEGATI START */
	.EF_tab{
		height: 496px;
		width: 100%;
		padding: 0px;
		margin: 0px;
	}
	
	.EF_panelViewFile_embed{
		height: 100%; 
		width:95%; 
		border: 0px;
	}
	
	.EF_panelViewFile_meta {
	    border-top: 1px solid #575757;
	    border-left: 4px solid #575757;
	    padding: 10px;
	    height: 100px;
	    overflow: auto;
	    overflow-x: hidden;
	}
	
	.EF_metaDato{
		border-left: 1px solid #aaaaaa; 
		border-bottom: 1px solid #aaaaaa; 
		margin: 5px; 
		padding: 5px; 
		float:left;
		width: 90%;
	}
	
	.EF_nomeAllegato{
		border-left: 1px solid #aaaaaa; 
		border-bottom: 1px solid #aaaaaa; 
		margin: 5px; 
		padding: 5px; 
		float:left;
	}
	
	.EF_tab2 embed{
		width: 95%;
		height: 450px
	}

	.EF_tab2 iframe{
		width: 95%;
		height: 450px
	}
	
	.EF_tab3_embed embed{
		width: 95%;
		height: 450px
	}

	.EF_tab3_embed iframe{
		width: 95%;
		height: 450px
	}
	
	.EF_tab3_list{
		height: 45px;
	}
	
/**	GESTIONE PANEL DOCUMENTO/META/ALLEGATI END */
	
</style>
<link href="styles/css/bootstrap/bootstrap-button.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="js/jqgrid/gai/grids/grid.preferiti.js"></script>
</head>
<body>

	<div id="EF_idContainer" class="EF_Conteiner">
		<div id="EF_panelJsTree" class="EF_panelJsTree">
			<div id="EF_idJsTree"></div>
		</div>
		<div id="EF_panelViewCartella" class="EF_panelViewCartella">
			<div id="EF_panelViewCartella_btns" class="EF_panelViewCartella_btns">
				<button id="EF_idBackBtn" type="button" class="btn btn-sm" onclick="EF_back();" title="Torna indietro" style="display: none; float:left;">
					<img src="styles/css/img/esplora_fascicoli/back64.png" width="16" />
				</button>
<!--				<button type="button" class="btn btn-success btn-sm" onclick="EF_reloadFascicolo();" title="Ricarica Selezione">-->
<!--					<img src="styles/css/img/esplora_fascicoli/panel1.png" style="width: 16px;"/>-->
<!--				</button>-->
				<button type="button" class="btn btn-success btn-sm" onclick="EF_apriFascicolo();" title="Apri Dettaglio Fascicolo">
					<img src="styles/css/img/esplora_fascicoli/Folder.png" style="width: 14px;"/>
				</button>
				<button type="button" class="btn btn-success btn-sm" onclick="EF_chiudiFile();" title="Chiudi il file">
					<img src="styles/css/img/esplora_fascicoli/panel2.png" style="width: 16px;"/>
				</button>
			</div>
			<div id="EF_panelViewCartella_items" class="EF_panelViewCartella_items"></div>
			<div id="EF_panelViewCartella_meta" class="EF_panelViewCartella_meta">
<!--				<span style="font-weight: bold; font-size: 14px;">Metadati</span>-->
				<div></div>
			</div>
			<div  class="EF_clear"></div>
		</div>
	
		<div id="EF_panelViewFile"  class="EF_panelViewFile" style="font-size: 12px;">
			<div id="EF_tabs">
				<ul>
					<li><a href="#EF_tab1">Dati</a></li>
					<li><a href="#EF_tab2">Documento</a></li>
					<li><a href="#EF_tab3">Allegati</a></li>
				</ul>
				<div id="EF_tab1" class="EF_tab">
				</div>
				<div id="EF_tab2" class="EF_tab">
				</div>
				<div id="EF_tab3" class="EF_tab">
					<div id="EF_tab3_list" class="EF_tab3_list" ></div>
					<div id="EF_tab3_embed" class="EF_tab3_embed" ></div>
					
				</div>
			</div>
		</div>

	</div>
</body>
</html>
